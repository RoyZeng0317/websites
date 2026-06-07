"""
讀取 student_passwords.csv，將密碼轉成 bcrypt hash，
產生可直接匯入 MySQL 的 stents_hashed.sql。

用法：python csv_to_sql.py
"""
import bcrypt
import csv
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), "student_passwords.csv")
SQL_PATH = os.path.join(os.path.dirname(__file__), "data", "stents_hashed.sql")


def hash_pw(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt(rounds=12)).decode()


# 讀取 CSV
rows = []
with open(CSV_PATH, newline="", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    for row in reader:
        rows.append({
            "account":  row["帳號"].strip(),
            "name":     row["姓名"].strip(),
            "password": row["初始密碼"].strip(),
        })

print(f"讀取 {len(rows)} 筆資料，開始雜湊（需要一點時間）...")

# 產生 SQL
lines = [
    "-- 自動產生，含 bcrypt hash。執行前請確認資料庫已存在。",
    "USE knowgence;",
    "",
    "CREATE TABLE IF NOT EXISTS teacher (",
    "    id            INT PRIMARY KEY AUTO_INCREMENT,",
    "    students_name VARCHAR(100),",
    "    account       VARCHAR(255) NOT NULL UNIQUE,",
    "    password_hash VARCHAR(255) NOT NULL DEFAULT '',",
    "    class_name    VARCHAR(100)",
    ");",
    "",
]

for i, row in enumerate(rows, 1):
    hashed = hash_pw(row["password"])
    name_escaped   = row["name"].replace("'", "\\'")
    account_escaped = row["account"].replace("'", "\\'")
    hash_escaped   = hashed.replace("'", "\\'")
    lines.append(
        f"INSERT IGNORE INTO teacher (class_name, account, students_name, password_hash) "
        f"VALUES ('二子一甲', '{account_escaped}', '{name_escaped}', '{hash_escaped}');"
    )
    print(f"  [{i:02d}/{len(rows)}] {row['account']}")

with open(SQL_PATH, "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")

print(f"\n完成！SQL 檔已儲存至：{SQL_PATH}")
print("匯入指令：mysql -u root -p knowgence < data/stents_hashed.sql")
