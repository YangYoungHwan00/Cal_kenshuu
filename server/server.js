const express = require("express");
const cors = require("cors");
// //pos1
// const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
// //pos2
// const pool = new Pool({
//     user: "testuser",
//     host: "localhost",
//     database: "postgres",
//     password: "testpass",
//     port: 5432
// });

app.get("/api/hello", (req, res) => {
    res.json({ message: "yes" });
});
// //pos3
// app.get("/api/users", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT * FROM users");
//         res.json(result.rows);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("DB error");
//     }
// });

app.listen(PORT, () => {
    console.log(`Server running at http:localhost:${PORT}`);
});
