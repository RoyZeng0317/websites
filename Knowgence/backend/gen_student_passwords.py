"""
批量為所有學生生成 8 位英數亂碼密碼並寫入資料庫。
同時輸出 student_passwords.csv 供發送給學生。

用法：python gen_student_passwords.py
"""
import bcrypt
import csv
import os
import random
import string
import pymysql
from dotenv import load_dotenv

load_dotenv()

CHARS = string.ascii_letters + string.digits  # A-Z a-z 0-9，共 62 種字元


def random_password(length: int = 8) -> str:
    return ''.join(random.choices(CHARS, k=length))


def hash_pw(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt(rounds=12)).decode()


conn = pymysql.connect(
    host=os.getenv("DB_HOST", "localhost"),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", ""),
    database=os.getenv("DB_NAME", "knowgence"),
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor,
)

with conn:
    with conn.cursor() as cur:
        cur.execute("SELECT id, account, students_name FROM teacher ORDER BY id")
        students = cur.fetchall()

    records = []
    print(f"\n{'帳號':<30} {'姓名':<10} {'密碼'}")
    print("-" * 60)

    with conn.cursor() as cur:
        for s in students:
            plain = random_password()
            hashed = hash_pw(plain)
            cur.execute(
                "UPDATE teacher SET password_hash = %s WHERE id = %s",
                (hashed, s["id"]),
            )
            name = s["students_name"] or ""
            records.append((s["account"], name, plain))
            print(f"{s['account']:<30} {name:<10} {plain}")

    conn.commit()

# 輸出 CSV（存在 backend/ 目錄下）
csv_path = os.path.join(os.path.dirname(__file__), "student_passwords.csv")
with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
    writer = csv.writer(f)
    writer.writerow(["帳號", "姓名", "初始密碼"])
    writer.writerows(records)

print(f"\n共更新 {len(records)} 位學生密碼。")
print(f"明文對照表已儲存至：{csv_path}")
print("請妥善保管此檔案，發送後建議學生自行更改密碼。")
