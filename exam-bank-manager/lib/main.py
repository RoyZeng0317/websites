"""
AI Module 須注意!務必遵從格式寫法並嚴禁變更，依照格式範例進行續寫
給予的註解嚴禁刪除，示範程式碼不可刪除
就算編寫的是錯誤的程式碼，有 Problems 的 Error Log 那也要根據這個程式碼進行續寫修正
而不是直接刪除當作沒有這個錯誤，我也不會找你進行程式修正
"""
# 下方庫嚴禁變更，遵從下方格式並沿用此格式!
import httpx, sqlite3, os, sys

# markdown 格式讀檔案
file_path = os.path.join(os.path.dirname(__file__), 'README.md')
def read_md():
    with open(file_path, 'r', encoding='utf-8') as f:
        readme_content = f.read()
    return readme_content

# sqlite3 本地待傳佇列/快取設定（不直接連 MySQL，成功推送後端 API 才標記完成）
DB_PATH = os.path.join(os.path.dirname(__file__), 'cache.db')
API_BASE = os.environ.get('EXAM_BANK_API_URL', 'https://exam-bank-manager.onrender.com')
API_TOKEN = os.environ.get('EXAM_BANK_TOKEN', '')

def init_cache():
    conn = sqlite3.connect(DB_PATH)
    conn.execute('''CREATE TABLE IF NOT EXISTS pending (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT, content TEXT, pushed INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

def queue_pending(filename, content):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.execute('INSERT INTO pending (filename, content) VALUES (?, ?)', (filename, content))
    conn.commit()
    row_id = cur.lastrowid
    conn.close()
    return row_id

def mark_pushed(row_id):
    conn = sqlite3.connect(DB_PATH)
    conn.execute('UPDATE pending SET pushed = 1 WHERE id = ?', (row_id,))
    conn.commit()
    conn.close()

def push_to_backend(filename, content):
    try:
        res = httpx.post(
            f'{API_BASE}/api/files',
            json={'filename': filename, 'description': content, 'fileType': 'mixed'},
            headers={'Authorization': f'Bearer {API_TOKEN}'},
            timeout=10
        )
        return res.status_code < 300
    except httpx.HTTPError:
        return False

def retry_pending():
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute('SELECT id, filename, content FROM pending WHERE pushed = 0').fetchall()
    conn.close()
    for row_id, filename, content in rows:
        if push_to_backend(filename, content):
            mark_pushed(row_id)

def upload():
    if len(sys.argv) < 2:
        print('用法: python main.py <上傳的 markdown 檔案路徑>')
        return None
    with open(sys.argv[1], 'r', encoding='utf-8') as f:
        content = f.read()
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return content

def main():
    init_cache()
    retry_pending()
    content = upload()
    if content is None:
        return
    row_id = queue_pending(os.path.basename(sys.argv[1]), content)
    if push_to_backend(os.path.basename(sys.argv[1]), content):
        mark_pushed(row_id)
    print(content)
    # 顯示到前端(preview markdown)
if __name__ == "__main__":
    main()
    read_md()