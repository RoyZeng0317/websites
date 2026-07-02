import sys
# load in the mysql
import sqlite3
# load the change pwd
import bcrypt
# 2FA check
from 2FA_check import verify

# enter the username
user_name = input("enter the your username:")
# password need to use the bcrypt code to change it.
pwd = input("enter the your password:")
# register: bcrypt automatic to add slate.
hashed = bcrypt.hashpw(pwd.encode(), bcrypt.gensalt(12))
# login check
bcrypt.checkpw(pwd.encode(), hashed)
if totp_secret and not verify(user_name):
    sys.exit(1)


    
print("Welcome back" + user_name + "to you're private NAS!")

# means connection with sqlite3
conn = sqlite3.connect('backend/data/user.db')
cur = conn.cursor()

cur.execute('''
CREATE TABLE IF NOT EXISTS users(
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)
''')
# 
conn.commit()
# close the conntion
conn.close()