import 'dotenv/config';
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { Pool, QueryResult } from 'pg';


const app = express();
const PORT = process.env.PORT || 3000;

// 유효성 검사 미들웨어
const validateRegistration = [
    body('username').isLength({ min: 3}).withMessage('ユーザネームは２文字以上必要です'),
    body('password').isLength({ min: 6}).withMessage('パスワードは６文字以上必要です')
];

app.use(express.json());
app.use(cors());

interface User {
    id: number;
    username: string;
}

// 환경 변수 체크
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable in not set');
}

const pool = new Pool({
    //connectionString: process.env.DATABASE_URL,

    user: "yyh",
    host: "localhost",
    database: "postgres",
    password: "5246",
    port: 5432,

    // user: "testuser",
    // host: "localhost",
    // database: "testdb",
    // password: "testpass",
    // port: 5432,
});

// export default pool;

app.get('/test-db', async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        const result: QueryResult = await client.query('SELECT NOW()');
        client.release();
        res.status(200).send(`DB Connection Success: ${result.rows[0].now}`);
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).send('DB connection error');
    }
});

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({message: 'yes'});
});

app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const result: QueryResult<User> = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('DB error:', err);
        res.status(500).send('DB error');
    }
});

//회원가입
app.post('/api/register', validateRegistration, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, password } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username])
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'ユーザネームは既に存在しています' });
        }

        //비밀번호 해싱
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        //db에 사용자 정보 저장
        await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
            [username, passwordHash]
        );

        res.status(201).json({ message: 'ユーザ登録成功' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).send('Registration error');
    }
});


//login
app.post('/api/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 일치 여부 확인
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 로그인 성공
    res.status(200).json({ message: 'Login complete', user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('서버 오류');
  }

  
});

app.get('/api/scores', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.username,             -- users 테이블에서 사용자 이름 가져오기
                MAX(s.score) AS high_score  -- scores 테이블에서 최고 점수 가져오기
            FROM scores s
            JOIN users u ON s.user_id = u.id -- users 테이블과 scores 테이블을 user_id를 기준으로 연결
            GROUP BY u.username
            ORDER BY high_score DESC
            LIMIT 10;
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Ranking fetch error:', err);
        res.status(500).send('서버 오류');
    }
});

app.post('/api/scores', async (req: Request, res: Response) => {
    const { userId, score } = req.body;

    if (!userId || score === undefined) {
        return res.status(400).json({ message: '사용자 ID와 점수가 필요합니다.' });
    }

    try {
        await pool.query(
            'INSERT INTO scores (user_id, score) VALUES ($1, $2)',
            [userId, score]
        );
        res.status(201).json({ message: '점수가 성공적으로 저장되었습니다.' });
    } catch (err) {
        console.error('Score save error:', err);
        res.status(500).send('서버 오류');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
