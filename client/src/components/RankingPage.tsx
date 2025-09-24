import React, { useState, useEffect } from 'react';
import '../styles/RankingPage.module.css'

// 랭킹 데이터의 타입을 정의
interface Ranking {
    username: string;
    high_score: number;
}

const RankingPage = () => {
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:3000/api/scores')
            .then(response => {
                if (!response.ok) {
                    throw new Error('랭킹을 가져오는 데 실패했습니다.');
                }
                return response.json();
            })
            .then(data => {
                setRankings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("랭킹 로드 에러:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>랭킹 로딩 중...</div>;
    }

    if (error) {
        return <div>오류: {error}</div>;
    }

    return (
        <div>
            <h1>ranking</h1>
            <ol>
                {rankings.map((ranking, index) => (
                    <li key={index}>
                        {ranking.username}: {ranking.high_score}点
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default RankingPage;