import pdfplumber
import re
import requests
import io
import sqlite3
import mysql.connector

conn = sqlite3.connect('questions.db')
conn.execute('''CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY,
    question_id INTEGER,
    question_text TEXT,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT
)''')

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="question_bank"
)
cursor = db.cursor()
cursor.execute('''CREATE TABLE IF NOT EXISTS questions (
    question_id INT,
    question_text TEXT,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT
)''')

def parse_questions(text):
    pattern = r"(\d+)\.\s*(.*?)\nA\.\s*(.*?)\nB\.\s*(.*?)\nC\.\s*(.*?)\nD\.\s*(.*?)(?=\n\d+\.|\Z)"
    matches = re.findall(pattern, text, re.S)
    questions = []
    for m in matches:
        q = {
            "id": m[0],
            "question": m[1].strip(),
            "options": {
                "A": m[2].strip(),
                "B": m[3].strip(),
                "C": m[4].strip(),
                "D": m[5].strip(),
            }
        }
        questions.append(q)
    return questions

def insert_mysql(q):
    sql = """
    INSERT INTO questions (question_id, question_text, option_a, option_b, option_c, option_d)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        q["id"], q["question"],
        q["options"]["A"], q["options"]["B"],
        q["options"]["C"], q["options"]["D"]
    ))
    db.commit()

def insert_sqlite(q):
    conn.execute('''INSERT INTO questions (question_id, question_text, option_a, option_b, option_c, option_d)
        VALUES (?, ?, ?, ?, ?, ?)''',
        (q["id"], q["question"],
         q["options"]["A"], q["options"]["B"],
         q["options"]["C"], q["options"]["D"]))
    conn.commit()

url = "https://onlinetest.tw/btest/collection/17300/173003A17.pdf"
response = requests.get(url)

with pdfplumber.open(io.BytesIO(response.content)) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        questions = parse_questions(text)
        for q in questions:
            insert_mysql(q)
            insert_sqlite(q)

print("Finished to import the questions.")