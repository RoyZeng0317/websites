"""
資料庫一次性初始化腳本。
執行順序：python setup_db.py → python init_passwords.py

功能：
  1. 建立 knowgence 資料庫（若不存在）
  2. 建立 teachers 表、teacher（學生）表
  3. 匯入所有學生與教師資料
"""
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "knowgence")

# ── 第一步：不指定資料庫，先建立 DB ────────────────────────────────
print(f"連線到 MySQL ({DB_HOST})...")
conn = pymysql.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor,
)

with conn:
    with conn.cursor() as cur:
        cur.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print(f"資料庫 `{DB_NAME}` 已就緒。")

# ── 第二步：進入 DB，建表並匯入資料 ────────────────────────────────
conn = pymysql.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME,
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor,
)

STUDENTS = [
    ('二子一甲', '21414101@nfu.edu.tw', ''),
    ('二子一甲', '21414102@nfu.edu.tw', ''),
    ('二子一甲', '21414103@nfu.edu.tw', ''),
    ('二子一甲', '21414104@nfu.edu.tw', ''),
    ('二子一甲', '21414105@nfu.edu.tw', ''),
    ('二子一甲', '21414106@nfu.edu.tw', ''),
    ('二子一甲', '21414107@nfu.edu.tw', ''),
    ('二子一甲', '21414108@nfu.edu.tw', ''),
    ('二子一甲', '21414109@nfu.edu.tw', ''),
    ('二子一甲', '21414110@nfu.edu.tw', ''),
    ('二子一甲', '21414111@nfu.edu.tw', '邱致綸'),
    ('二子一甲', '21414112@nfu.edu.tw', ''),
    ('二子一甲', '21414113@nfu.edu.tw', ''),
    ('二子一甲', '21414114@nfu.edu.tw', ''),
    ('二子一甲', '21414115@nfu.edu.tw', ''),
    ('二子一甲', '21414116@nfu.edu.tw', ''),
    ('二子一甲', '21414117@nfu.edu.tw', ''),
    ('二子一甲', '21414118@nfu.edu.tw', ''),
    ('二子一甲', '21414119@nfu.edu.tw', ''),
    ('二子一甲', '21414120@nfu.edu.tw', ''),
    ('二子一甲', '21414121@nfu.edu.tw', ''),
    ('二子一甲', '21414122@nfu.edu.tw', ''),
    ('二子一甲', '21414123@nfu.edu.tw', ''),
    ('二子一甲', '21414124@nfu.edu.tw', ''),
    ('二子一甲', '21414125@nfu.edu.tw', ''),
    ('二子一甲', '21414126@nfu.edu.tw', ''),
    ('二子一甲', '21414127@nfu.edu.tw', ''),
    ('二子一甲', '21414128@nfu.edu.tw', ''),
    ('二子一甲', '21414129@nfu.edu.tw', ''),
    ('二子一甲', '21414131@nfu.edu.tw', ''),
    ('二子一甲', '21414132@nfu.edu.tw', ''),
    ('二子一甲', '21414133@nfu.edu.tw', ''),
    ('二子一甲', '21414134@nfu.edu.tw', ''),
    ('二子一甲', '21414135@nfu.edu.tw', ''),
    ('二子一甲', '21414136@nfu.edu.tw', ''),
    ('二子一甲', '21414137@nfu.edu.tw', ''),
    ('二子一甲', '21414138@nfu.edu.tw', ''),
    ('二子一甲', '21414139@nfu.edu.tw', ''),
]

TEACHERS = [
    ('郭永明', '', ''),
]

with conn:
    with conn.cursor() as cur:

        # 學生表
        cur.execute("""
            CREATE TABLE IF NOT EXISTS teacher (
                id            INT PRIMARY KEY AUTO_INCREMENT,
                students_name VARCHAR(100),
                account       VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL DEFAULT '',
                class_name    VARCHAR(100)
            )
        """)

        # 若舊表欄位名是 steudents_name（typo），自動重新命名
        cur.execute("SHOW COLUMNS FROM teacher LIKE 'steudents_name'")
        if cur.fetchone():
            cur.execute("ALTER TABLE teacher CHANGE steudents_name students_name VARCHAR(100)")
            print("欄位 steudents_name → students_name 已修正。")

        # 教師表
        cur.execute("""
            CREATE TABLE IF NOT EXISTS teachers (
                id            INT PRIMARY KEY AUTO_INCREMENT,
                teachers_name VARCHAR(100),
                account       VARCHAR(255) NOT NULL UNIQUE DEFAULT '',
                password_hash VARCHAR(255) NOT NULL DEFAULT ''
            )
        """)

        # 匯入學生（IGNORE 避免重複插入）
        cur.executemany("""
            INSERT IGNORE INTO teacher (class_name, account, students_name, password_hash)
            VALUES (%s, %s, %s, '')
        """, STUDENTS)
        print(f"學生資料：{cur.rowcount} 筆新增。")

        # 匯入教師
        cur.executemany("""
            INSERT IGNORE INTO teachers (teachers_name, account, password_hash)
            VALUES (%s, %s, %s)
        """, TEACHERS)
        print(f"教師資料：{cur.rowcount} 筆新增。")

    conn.commit()

print("\n資料庫初始化完成！接著請執行：python init_passwords.py")
