/**
 * 執行一次：在 MySQL 建立資料庫、資料表，並匯入初始使用者（密碼以 bcrypt 雜湊）
 * 完成後可刪除此檔案
 * 用法：node setup.js
 */
import 'dotenv/config'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

const DB_HOST = process.env.DB_HOST ?? 'localhost'
const DB_PORT = Number(process.env.DB_PORT ?? 3306)
const DB_USER = process.env.DB_USER ?? 'root'
const DB_PASSWORD = process.env.DB_PASSWORD ?? ''
const DB_NAME = process.env.DB_NAME ?? 'casaos_nas'

const seeds = [
  { username: 'boyud9.5',   password: 'A1qaz9ol.',    role: 'admin' },
  { username: 'judy4359',   password: 'On0912362107',  role: 'user'  },
  { username: 'zengziting', password: 'On0966695592',  role: 'user'  },
  { username: 'boiudy75',   password: 'A1qaz7ujm',    role: 'user'  },
]

const conn = await mysql.createConnection({ host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASSWORD })

await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
await conn.query(`USE \`${DB_NAME}\``)

await conn.query(`
  CREATE TABLE IF NOT EXISTS users (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role     ENUM('admin','user') NOT NULL DEFAULT 'user',
    disabled TINYINT(1) NOT NULL DEFAULT 0
  )
`)

for (const seed of seeds) {
  const hash = await bcrypt.hash(seed.password, 12)
  const [result] = await conn.query(
    'INSERT IGNORE INTO users (username, password, role) VALUES (?, ?, ?)',
    [seed.username, hash, seed.role]
  )
  if (result.affectedRows > 0) {
    console.log(`✓ 已建立使用者：${seed.username}（${seed.role}）`)
  } else {
    console.log(`  跳過（已存在）：${seed.username}`)
  }
}

await conn.end()
console.log('\n✓ MySQL 初始化完成')
console.log('  建議完成後刪除 setup.js 以移除明文密碼')
