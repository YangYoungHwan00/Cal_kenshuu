require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//환경 변수를 사용해 데이터베이스 연결 풀 생성
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

//데이터베이스 연결 테스트 예시
app.get('/test-db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        res.send(`DB Connection Success: ${result.rows[0].now}`);
    } catch (err) {
        console.error('Database connection error', err);
        res.status(500).send('DB Connection Error');
    }  
}); 

app.get("/", (req, res) => {
    res.json({ message: "yes" });
});

app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("DB error");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http:localhost:${PORT}`);
});
