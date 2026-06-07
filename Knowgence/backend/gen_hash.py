"""
用法：python gen_hash.py
輸入任意密碼，印出可以直接貼進 SQL 的 bcrypt hash。
"""
import bcrypt

password = input("請輸入要雜湊的密碼: ").strip()
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))
print("\n產生的 bcrypt hash（貼進 password_hash 欄位）:")
print(hashed.decode())
