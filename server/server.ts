// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const bcrypt = require("bcrypt");
// const { Pool } = require("pg");

// const app = express();
// const PORT = 3000;
// const hashedPassword = await bcrypt.hash(plainPassword, 10);


// app.use(cors());
// app.use(express.json());

// //환경 변수를 사용해 데이터베이스 연결 풀 생성
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
// });

// //데이터베이스 연결 테스트 예시
// app.get('/test-db', async (req, res) => {
//     try {
//         const client = await pool.connect();
//         const result = await client.query('SELECT NOW()');
//         client.release();
//         res.send(`DB Connection Success: ${result.rows[0].now}`);
//     } catch (err) {
//         console.error('Database connection error', err);
//         res.status(500).send('DB Connection Error');
//     }  
// }); 

// app.get("/", (req, res) => {
//     res.json({ message: "yes" });
// });

// app.get("/api/users", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM users");
//         res.json(result.rows);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("DB error");
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server running at http:localhost:${PORT}`);
// });

import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { Pool, QueryResult } from 'pg';

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors());
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
    connectionString: process.env.DATABASE_URL,
});

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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

