import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import '../styles/PhaserGameContainer.module.css'


// 전역 변수
let score : integer = 0;
let playerHealth : integer = 3;
let gameOver : boolean = false;
let scoreText: Phaser.GameObjects.Text;
let healthText: Phaser.GameObjects.Text;

// 플레이어 클래스
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(0.2);
        this.body?.setSize(this.width*0.4, this.height*0.8);
        this.setCollideWorldBounds(true);
    }
}

// 총알 클래스
class Bullet extends Phaser.Physics.Arcade.Sprite {
    private speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setActive(false);
        this.setVisible(false);
        this.speed = 400;
    }

    fire(x: number, y: number) {
        if (this.body) {
            this.body.reset(x, y);
            this.setActive(true);
            this.setVisible(true);
            this.setVelocityY(-this.speed);
        }
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        if (this.y <= -32) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

// 총알 그룹
class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene, {
            classType: Bullet,
            runChildUpdate: true
        });
    }

    fireBullet(x: number, y: number) {
        const bullet = this.getFirstDead(false);
        if (bullet) {
            bullet.fire(x, y);
        }
    }
}

// 메인 게임 씬
class GameScene extends Phaser.Scene {
    player!: Player;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    bullets!: Bullets;
    enemies!: Phaser.Physics.Arcade.Group;
    lastFired : integer = 0;
    fireRate : integer = 200;

    saveScore(finalScore: number) {
    // 실제 userId는 로그인 상태에서 가져와야 합니다.
    // 여기서는 테스트를 위해 임시로 1이라고 가정합니다.
    const userId : integer = 1;

    fetch('http://localhost:3000/api/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, score: finalScore }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('점수 저장 성공:', data.message);
    })
    .catch(error => {
        console.error('점수 저장 실패:', error);
    });
}

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('sky', 'assets/bg.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('enemy', 'assets/meteor.png');
    }

    create() {
        score = 0;
        playerHealth = 3;
        gameOver = false;

        this.add.image(400, 300, 'sky');

        this.player = new Player(this, 400, 550);
        this.bullets = new Bullets(this);
        this.enemies = this.physics.add.group();

        // 적 생성 이벤트
        this.time.addEvent({
            delay: 1500, // 적 생성 간격 1.5초
            callback: () => {
                if (gameOver) return;
                const x = Phaser.Math.Between(50, 750);
                const enemy = this.enemies.create(x, -50, 'enemy');
                enemy.setScale(0.07)
                enemy.body.setSize(enemy.width*0.7, enemy.height*0.6);
                enemy.setVelocityY(Phaser.Math.Between(50, 150));
            },
            callbackScope: this,
            loop: true
        });

        

        // 점수와 체력 텍스트 표시
        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#FFF' });
        healthText = this.add.text(16, 50, 'Health: 3', { fontSize: '32px', color: '#FFF' });

        // 충돌 처리: 총알과 적
        this.physics.add.overlap(this.bullets, this.enemies, (bulletObject, enemyObject) => {
            const bullet = bulletObject as Bullet;
            const enemy = enemyObject as Phaser.Physics.Arcade.Sprite;

            bullet.setActive(false).setVisible(false);
            enemy.destroy();

            score += 10;
            scoreText.setText('Score: ' + score);
        });

        // 충돌 처리: 플레이어와 적
        this.physics.add.overlap(this.player, this.enemies, (playerObject, enemyObject) => {
            const enemy = enemyObject as Phaser.Physics.Arcade.Sprite;
            
            playerHealth -= 1;
            healthText.setText('Health: ' + playerHealth);
            enemy.destroy();

            if (playerHealth <= 0) {
                this.physics.pause();
                gameOver = true;
                this.add.text(250, 300, 'Game Over', { fontSize: '64px', color: '#FF0000' });
                const retryButton = this.add.text(400, 400, 'RETRY', { fontSize: '32px', color: '#FFF' })
                    .setOrigin(0.5)
                    .setInteractive(); // 클릭 가능하게 설정

                // '랭킹으로 가기' 버튼
                const rankingButton = this.add.text(400, 450, 'RANKING', { fontSize: '32px', color: '#FFF' })
                    .setOrigin(0.5)
                    .setInteractive(); // 클릭 가능하게 설정
                    // 버튼 클릭 이벤트 리스너
                retryButton.on('pointerdown', () => {
                    this.scene.restart(); // 현재 씬을 다시 시작
                });

                rankingButton.on('pointerdown', () => {
                    // Phaser 씬에서 React 라우팅을 호출하기 위한 함수 (아래에서 추가)
                    (this as any).goToRankingPage();
                });

                    this.saveScore(score);
            }

            

            
            
        });
        
        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    update(time: number, delta: number) {
        if (gameOver) return;

        // 플레이어 이동
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }

        // 총알 발사
        if (this.cursors.space.isDown && time > this.lastFired) {
            this.bullets.fireBullet(this.player.x, this.player.y - 30);
            this.lastFired = time + this.fireRate;
        }

        // 적이 화면 아래로 나가면 파괴
        this.enemies.children.entries.forEach(enemy => {
            const enemySprite = enemy as Phaser.Physics.Arcade.Sprite;
            if (enemySprite.y > this.sys.game.canvas.height + 50) {
                enemySprite.destroy();
                score += 1;
                scoreText.setText('Score: ' + score);
            }
            
        });
    }
}



// 리액트 컴포넌트
const PhaserGameContainer: React.FC = () => {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);
    const navigate = useNavigate();
    

    // Phaser 씬에서 React 라우팅을 호출하기 위한 함수
    (GameScene.prototype as any).goToRankingPage = () => {
        navigate('/ranking');
    };

    useEffect(() => {
        if (!gameContainerRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameContainerRef.current,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x:0, y: 0 },
                    debug: false
                }
            },
            scene: GameScene
        };

        gameRef.current = new Phaser.Game(config);

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return <div ref={gameContainerRef} style={{ width: '800px', height: '600px', margin: 'auto' }} />;
};

export default PhaserGameContainer;