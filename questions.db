import sqlite3

conn = sqlite3.connect("question_bank.db")
cursor = conn.cursor()

# 建表
cursor.execute("""
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    answer TEXT,
    topic TEXT
)
""")

# 測試資料
questions = [
    {
        "question": "2 + 2 = ?",
        "A": "1",
        "B": "2",
        "C": "4",
        "D": "5",
        "answer": "C",
        "topic": "math"
    }
]

# 插入資料
for q in questions:
    cursor.execute("""
    INSERT INTO questions
    (question, option_a, option_b, option_c, option_d, answer, topic)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        q["question"],
        q["A"],
        q["B"],
        q["C"],
        q["D"],
        q["answer"],
        q["topic"]
    ))

conn.commit()

print("完成")