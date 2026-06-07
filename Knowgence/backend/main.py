from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pymysql
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://knowgence-b7a2c.web.app",
        "https://knowgence-b7a2c.firebaseapp.com",
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


def get_conn() -> pymysql.connections.Connection:
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "knowgence"),
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )


def verify_password(plain: str, hashed: str) -> bool:
    if not hashed:
        return False
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False


class LoginRequest(BaseModel):
    account: str
    password: str


@app.post("/api/login")
def login(req: LoginRequest):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            # 先查教師表（表名 teachers）
            cur.execute(
                "SELECT id, teachers_name AS name, password_hash "
                "FROM teachers WHERE account = %s",
                (req.account,),
            )
            row = cur.fetchone()
            if row:
                if not verify_password(req.password, row["password_hash"]):
                    raise HTTPException(status_code=401, detail="密碼錯誤")
                return {
                    "role": "teacher",
                    "name": row["name"] or "",
                    "account": req.account,
                }

            # 再查學生表（表名 teacher，stents.sql 命名有誤）
            cur.execute(
                "SELECT id, students_name AS name, class_name, password_hash "
                "FROM teacher WHERE account = %s",
                (req.account,),
            )
            row = cur.fetchone()
            if row:
                if not verify_password(req.password, row["password_hash"]):
                    raise HTTPException(status_code=401, detail="密碼錯誤")
                return {
                    "role": "student",
                    "name": row["name"] or "",
                    "account": req.account,
                    "class_name": row["class_name"] or "",
                }

            raise HTTPException(status_code=404, detail="帳號不存在")
    finally:
        conn.close()


@app.get("/health")
def health():
    return {"status": "ok"}
