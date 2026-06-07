"""
一次性批次初始化密碼腳本。執行一次即可，之後不需再跑。

學生預設密碼 = 學號（帳號 @ 前的數字，例如 21414101）
教師密碼     = 執行時手動輸入

用法：
  python init_passwords.py
"""
import bcrypt
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

conn = pymysql.connect(
    host=os.getenv("DB_HOST", "localhost"),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", ""),
    database=os.getenv("DB_NAME", "knowgence"),
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor,
)


def hash_pw(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt(rounds=12)).decode()


with conn:
    with conn.cursor() as cur:

        # ── 學生：預設密碼 = 學號（@ 前的部分）──────────────────────────
        cur.execute("SELECT id, account FROM teacher WHERE password_hash = '' OR password_hash IS NULL")
        students = cur.fetchall()

        if students:
            print(f"找到 {len(students)} 位學生需要設定密碼...")
            for s in students:
                student_id = s["account"].split("@")[0]   # 例：21414101
                hashed = hash_pw(student_id)
                cur.execute(
                    "UPDATE teacher SET password_hash = %s WHERE id = %s",
                    (hashed, s["id"]),
                )
            conn.commit()
            print("學生密碼初始化完成。預設密碼 = 各自學號。")
        else:
            print("學生密碼已全部設定，略過。")

        # ── 教師：手動輸入密碼 ──────────────────────────────────────────
        cur.execute("SELECT id, teachers_name, account FROM teachers WHERE password_hash = '' OR password_hash IS NULL")
        teachers = cur.fetchall()

        if teachers:
            print(f"\n找到 {len(teachers)} 位教師需要設定密碼：")
            for t in teachers:
                name = t["teachers_name"] or "（未命名）"
                account = t["account"] or "（無帳號）"
                print(f"  教師：{name}  帳號：{account}")

                # 若帳號為空，先補上
                if not t["account"]:
                    new_account = input(f"  請輸入 {name} 的帳號（email）: ").strip()
                    cur.execute(
                        "UPDATE teachers SET account = %s WHERE id = %s",
                        (new_account, t["id"]),
                    )

                pw = input(f"  請輸入 {name} 的密碼: ").strip()
                hashed = hash_pw(pw)
                cur.execute(
                    "UPDATE teachers SET password_hash = %s WHERE id = %s",
                    (hashed, t["id"]),
                )
            conn.commit()
            print("教師密碼設定完成。")
        else:
            print("\n教師密碼已全部設定，略過。")

print("\n全部完成！")
