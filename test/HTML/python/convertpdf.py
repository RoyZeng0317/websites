import pdfplumber
import re
import requests
import io
import sqlite3

conn = sqlite3.connect('questions.db')
# writing the MySQL
import mysql.connector

url = "https://onlinetest.tw/btest/collection/17300/173003A17.pdf"

response = requests.get(url)

with pdfplumber.open(io.BytesIO(response.content)) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        print(text)

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

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="question_bank"
)

cursor = db.cursor()

def insert(q):
    sql = """
    INSERT INTO questions (question_id, question_text, option_a, option_b, option_c, option_d)
    VALUES (%s, %s, %s, %s, %s, %s
    """

    cursor.execute(sql, (
        q["id"],
        q["question"],
        q["options"]["A"],
        q["options"]["B"],
        q["options"]["C"],
        q["options"]["D"]
    ))

    db.commit()

print("Finished to import the questions.")