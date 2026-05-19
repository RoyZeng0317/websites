const mysql = require('mysql2/promise');
require('dotenv').config();

let dbReady = false;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'exam_bank_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'exam_bank_manager'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.end();

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firebase_uid VARCHAR(128) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        firestore_doc_id VARCHAR(255),
        filename VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(100),
        grade VARCHAR(50),
        file_type ENUM('choice', 'fill', 'essay', 'mixed') DEFAULT 'mixed',
        total_questions INT DEFAULT 0,
        status ENUM('draft', 'published') DEFAULT 'draft',
        tags JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_subject (subject),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    try {
      await pool.execute(`ALTER TABLE files ADD COLUMN _questions LONGTEXT NULL AFTER file_type`);
    } catch (e) {
      if (!e.message.includes('Duplicate column')) {
        console.warn('新增 _questions 欄位時發生錯誤:', e.message);
      }
    }

    dbReady = true;
    console.log('MySQL 資料庫初始化完成');
  } catch (error) {
    console.warn('MySQL 連線失敗（API 將受限）:', error.message);
    dbReady = false;
  }
};

const isDbReady = () => dbReady;

module.exports = { pool, initDatabase, isDbReady };
