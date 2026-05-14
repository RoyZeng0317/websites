const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const req = require("express/lib/request");
const res = require("express/lib/response");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
});

const JWT_SECERT = process.env.JWT_SECERT || "replace_me";
const SALT_ROUNDS = 12;

// Register
app.post("/api/auth/register", async(req, res) => {
    try{
        const {email, username, password} = req.body;

        if(!email || !username || !password){
            return res.status(400).json({ message: "缺少必要欄位!"});
        }
        if(password.length < 8){
            return res.status(400).json({ message: "密碼至少 8 位"});
        }

        const [exists] = await pool.query(
            "SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1",
            [email, username]
        );
        if(exists.length >0){
            return res.status(409).json({ message: "Email 或 Username 已存在"});
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await pool.query(
            "INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)",
            [email, username, passwordHash]
        );

        return res.status(201).json({
            message: "註冊成功",
            userId: result.insertId,
        });
    }catch(err){
        console.err(err);
        return res.status(500).json({ message: "伺服器錯誤"});
    }
});

// Login
app.post("/api/auth/login", async(req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "缺少必要欄位"});
        }
        
        const [rows] = await pool.query(
            "SELECT id, email, username, password_hash FROM users WHERE email = ? LIMIT 1",
            [email]
        );
        if(rows.length === 0){
            return res.status(401).json({ message: "帳號或密碼錯誤"});
        }

        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password_hash);
        if(!ok){
            return res.status(401).json({ message: "帳號或密碼錯誤"});
        }

        const token = jwt.sign(
            { sub: user.id, email: user.email, username: user.username},
            JWT_SECERT,
            { expiresIn: "7d" }
        );
        return res.json({
            message: "登入成功",
            token,
            user: {id: user.id, email: user.email, username: user.username},
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({message: "伺服器錯誤"});
    }
});

// 
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});