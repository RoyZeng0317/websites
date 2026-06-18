import pymysql

conn = pymysql.connect(host='localhost', port=3306, user='root', password='', charset='utf8mb4')
cursor = conn.cursor()

cursor.execute('CREATE DATABASE IF NOT EXISTS Company DEFAULT CHARACTER SET utf8mb4;')
print('Database Company created/confirmed')

conn.select_db('Company')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
''')
print('Table users created/confirmed')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS sign_in_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(12) NOT NULL,
        signin_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
''')
print('Table sign_in_history created/confirmed')

cursor.execute('SELECT COUNT(*) FROM users')
count = cursor.fetchone()[0]
if count == 0:
    cursor.execute("INSERT INTO users (user_id, name) VALUES (1001, '王小明'), (1002, '陳小花'), (1003, '李大華')")
    conn.commit()
    print('Inserted 3 test users')
else:
    print(f'{count} users already exist')

conn.close()
print('Done!')
