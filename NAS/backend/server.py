"""
Vaultix NAS — Python sidecar (port 3001, localhost only)
Handles: /api/todos CRUD, /api/system/disks/rename-folder
Proxied from Express after JWT auth; user identity via X-User-* headers.
"""
import os, subprocess, re
from typing import Optional
from datetime import date

from fastapi import FastAPI, HTTPException, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pymysql.cursors
import uvicorn

# ── Config ────────────────────────────────────────────────────────────────────
try:
    from dotenv import load_dotenv
    load_dotenv('/home/roy/casaos-nas/.env')
except ImportError:
    pass

DB_CONFIG = dict(
    host     = os.getenv('DB_HOST', 'localhost'),
    port     = int(os.getenv('DB_PORT', 3306)),
    user     = os.getenv('DB_USER', 'nas_user'),
    password = os.getenv('DB_PASSWORD', ''),
    database = os.getenv('DB_NAME', 'casaos_nas'),
    cursorclass = pymysql.cursors.DictCursor,
    autocommit  = True,
)
FILES_DIR = os.getenv('FILES_DIR', '/DATA')

_BAD = re.compile(r'[/\\:*?"<>|\x00]')

# ── Helpers ───────────────────────────────────────────────────────────────────
def db():
    return pymysql.connect(**DB_CONFIG)

def uid_of(x_user_uid: Optional[str]) -> int:
    if not x_user_uid:
        raise HTTPException(401, '請先登入')
    return int(x_user_uid)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI()

@app.on_event('startup')
def _init_db():
    conn = db()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS todos (
                    id         INT AUTO_INCREMENT PRIMARY KEY,
                    user_id    INT NOT NULL,
                    title      VARCHAR(500) NOT NULL,
                    done       TINYINT(1) NOT NULL DEFAULT 0,
                    priority   ENUM('low','normal','high') NOT NULL DEFAULT 'normal',
                    due_date   DATE DEFAULT NULL,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)
    finally:
        conn.close()

# ── Models ────────────────────────────────────────────────────────────────────
class TodoCreate(BaseModel):
    title: str
    priority: str = 'normal'
    due_date: Optional[date] = None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    done: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[date] = None

class RenameFolderBody(BaseModel):
    oldName: str
    newName: str

# ── /api/todos ─────────────────────────────────────────────────────────────────
@app.get('/api/todos')
def get_todos(x_user_uid: Optional[str] = Header(None)):
    uid = uid_of(x_user_uid)
    conn = db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                'SELECT id, title, done, priority, due_date, created_at FROM todos WHERE user_id = %s ORDER BY created_at DESC',
                (uid,)
            )
            rows = cur.fetchall()
        return [{**r, 'done': bool(r['done'])} for r in rows]
    finally:
        conn.close()

@app.post('/api/todos')
def create_todo(body: TodoCreate, x_user_uid: Optional[str] = Header(None)):
    uid = uid_of(x_user_uid)
    if not body.title.strip():
        raise HTTPException(400, '請輸入任務標題')
    if body.priority not in ('low', 'normal', 'high'):
        raise HTTPException(400, '無效的優先順序')
    conn = db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                'INSERT INTO todos (user_id, title, priority, due_date) VALUES (%s, %s, %s, %s)',
                (uid, body.title.strip(), body.priority, body.due_date)
            )
            new_id = cur.lastrowid
            cur.execute('SELECT id, title, done, priority, due_date, created_at FROM todos WHERE id = %s', (new_id,))
            row = cur.fetchone()
        return {**row, 'done': bool(row['done'])}
    finally:
        conn.close()

@app.put('/api/todos/{todo_id}')
def update_todo(todo_id: int, body: TodoUpdate, x_user_uid: Optional[str] = Header(None)):
    uid = uid_of(x_user_uid)
    sets, vals = [], []
    if body.title    is not None: sets.append('title = %s');    vals.append(body.title.strip())
    if body.done     is not None: sets.append('done = %s');     vals.append(1 if body.done else 0)
    if body.priority is not None: sets.append('priority = %s'); vals.append(body.priority)
    if body.due_date is not None: sets.append('due_date = %s'); vals.append(body.due_date)
    if not sets:
        raise HTTPException(400, '沒有可更新的欄位')
    vals += [todo_id, uid]
    conn = db()
    try:
        with conn.cursor() as cur:
            cur.execute(f"UPDATE todos SET {', '.join(sets)} WHERE id = %s AND user_id = %s", vals)
            cur.execute('SELECT id, title, done, priority, due_date, created_at FROM todos WHERE id = %s', (todo_id,))
            row = cur.fetchone()
        if not row:
            raise HTTPException(404, '找不到任務')
        return {**row, 'done': bool(row['done'])}
    finally:
        conn.close()

@app.delete('/api/todos/{todo_id}')
def delete_todo(todo_id: int, x_user_uid: Optional[str] = Header(None)):
    uid = uid_of(x_user_uid)
    conn = db()
    try:
        with conn.cursor() as cur:
            cur.execute('DELETE FROM todos WHERE id = %s AND user_id = %s', (todo_id, uid))
            if cur.rowcount == 0:
                raise HTTPException(404, '找不到任務')
        return {'ok': True}
    finally:
        conn.close()

# ── /api/system/disks/rename-folder ──────────────────────────────────────────
@app.post('/api/system/disks/rename-folder')
def rename_folder(
    body: RenameFolderBody,
    x_user_uid:      Optional[str] = Header(None),
    x_user_username: Optional[str] = Header(None),
    x_user_role:     Optional[str] = Header(None),
):
    if not x_user_uid:
        raise HTTPException(401, '請先登入')
    if x_user_role != 'admin':
        raise HTTPException(403, 'Forbidden')
    if not body.oldName or not body.newName or _BAD.search(body.oldName) or _BAD.search(body.newName):
        raise HTTPException(400, '無效的名稱')

    user_root = os.path.realpath(os.path.join(FILES_DIR, x_user_username or ''))
    old_path  = os.path.realpath(os.path.join(user_root, body.oldName))
    new_path  = os.path.realpath(os.path.join(user_root, body.newName))
    if not old_path.startswith(user_root + os.sep) or not new_path.startswith(user_root + os.sep):
        raise HTTPException(400, '非法路徑')

    try:
        mounts = subprocess.run(['cat', '/proc/mounts'], capture_output=True, text=True).stdout
        device = fstype = None
        for line in mounts.splitlines():
            parts = line.split()
            if len(parts) >= 3 and parts[1] == old_path:
                device, fstype = parts[0], parts[2]
                break

        if device:
            subprocess.run(['sudo', 'umount', old_path], timeout=15, check=True)
        os.rename(old_path, new_path)
        if device:
            os.makedirs(new_path, exist_ok=True)
            subprocess.run(['sudo', 'mount', '-t', fstype, device, new_path], timeout=15, check=True)
        return {'ok': True}
    except subprocess.CalledProcessError as e:
        raise HTTPException(500, str(e))
    except OSError as e:
        raise HTTPException(500, str(e))

# ── /api/system/fail2ban ───────────────────────────────────────────────────────
FAIL2BAN_CLIENT = '/usr/bin/fail2ban-client'
FAIL2BAN_LOG    = '/var/log/fail2ban.log'

def _admin_of(
    x_user_uid:      Optional[str],
    x_user_username: Optional[str],
    x_user_role:     Optional[str],
):
    if not x_user_uid:
        raise HTTPException(401, '請先登入')
    if x_user_role != 'admin':
        raise HTTPException(403, '僅管理員可操作 fail2ban')

def _run(*args: str, timeout: int = 15) -> str:
    try:
        r = subprocess.run(['sudo', '-n', *args], capture_output=True, text=True, timeout=timeout)
        if r.returncode != 0:
            raise HTTPException(500, r.stderr.strip() or r.stdout.strip())
        return r.stdout
    except FileNotFoundError:
        raise HTTPException(500, 'fail2ban-client 未安裝')

def _parse_jail_status(text: str) -> dict:
    """Parse `fail2ban-client status <jail>` output into a dict."""
    status = {'banned': 0, 'totalBanned': 0, 'failed': 0, 'totalFailed': 0, 'bannedIps': []}
    for line in text.splitlines():
        line = line.strip()
        if line.startswith('|-') or line.startswith('`-'): continue
        if ':' not in line: continue
        key, _, val = line.partition(':')
        key = key.strip().lower().replace(' ', '')
        val = val.strip()
        if key == 'currentlybanned':
            status['banned'] = int(val)
        elif key == 'totalbanned':
            status['totalBanned'] = int(val)
        elif key == 'currentlyfailed':
            status['failed'] = int(val)
        elif key == 'totalfailed':
            status['totalFailed'] = int(val)
        elif key == 'bannedip':
            status['bannedIps'] = [ip.strip() for ip in val.split() if ip.strip()]
    return status

@app.get('/api/system/fail2ban')
def get_fail2ban(
    x_user_uid:      Optional[str] = Header(None),
    x_user_username: Optional[str] = Header(None),
    x_user_role:     Optional[str] = Header(None),
):
    _admin_of(x_user_uid, x_user_username, x_user_role)

    try:
        raw = _run(FAIL2BAN_CLIENT, 'status')
    except HTTPException as e:
        if '未安裝' in str(e.detail) or 'No such file' in str(e.detail):
            return {'jails': [], 'unavailable': True, 'reason': 'not_installed'}
        raise

    jails = []
    for line in raw.splitlines():
        line = line.strip()
        if 'Jail list' in line and ':' in line:
            names = line.split(':', 1)[1].strip().split(',')
            for name in names:
                name = name.strip()
                if not name:
                    continue
                try:
                    detail = _run(FAIL2BAN_CLIENT, 'status', name)
                    status = _parse_jail_status(detail)
                except HTTPException:
                    status = _parse_jail_status('')
                jails.append({'name': name, **status})
            break

    return {'jails': jails, 'unavailable': False}


class UnbanBody(BaseModel):
    jail: str
    ip: str


@app.post('/api/system/fail2ban/unban')
def unban(
    body:            UnbanBody,
    x_user_uid:      Optional[str] = Header(None),
    x_user_username: Optional[str] = Header(None),
    x_user_role:     Optional[str] = Header(None),
):
    _admin_of(x_user_uid, x_user_username, x_user_role)
    if not body.jail.strip() or not body.ip.strip():
        raise HTTPException(400, '請提供 jail 和 IP')
    _run(FAIL2BAN_CLIENT, 'set', body.jail.strip(), 'unbanip', body.ip.strip())
    return {'ok': True}


@app.get('/api/system/fail2ban/log')
def get_log(
    lines:           int = 300,
    x_user_uid:      Optional[str] = Header(None),
    x_user_username: Optional[str] = Header(None),
    x_user_role:     Optional[str] = Header(None),
):
    _admin_of(x_user_uid, x_user_username, x_user_role)
    try:
        r = subprocess.run(['sudo', '-n', 'tail', '-n', str(lines), FAIL2BAN_LOG],
                           capture_output=True, text=True, timeout=10)
        if r.returncode == 0:
            return {'lines': r.stdout.splitlines()}
    except FileNotFoundError:
        pass

    try:
        r = subprocess.run(['tail', '-n', str(lines), FAIL2BAN_LOG],
                           capture_output=True, text=True, timeout=10)
        if r.returncode == 0:
            return {'lines': r.stdout.splitlines()}
    except FileNotFoundError:
        pass

    try:
        r = subprocess.run(
            ['sudo', '-n', 'journalctl', '-u', 'fail2ban', '-n', str(lines), '--no-pager', '--output=short'],
            capture_output=True, text=True, timeout=10,
        )
        if r.returncode == 0:
            return {'lines': r.stdout.splitlines()}
    except FileNotFoundError:
        pass

    raise HTTPException(500, '無法讀取 fail2ban log')

# ── Entry ─────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=3001, log_level='info')
