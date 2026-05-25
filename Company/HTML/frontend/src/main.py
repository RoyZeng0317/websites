# QR Code 簽到
import hashlib
import io
import json
import os
import socket
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

import pymysql
import qrcode

PORT = 8000
TOKEN_INTERVAL = 15


def _get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return 'localhost'


def _load_db_config():
    env_path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend', '.env')
    config = {
        'host': 'localhost',
        'port': 3306,
        'user': 'root',
        'password': '',
        'database': 'Company',
    }
    try:
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, val = line.split('=', 1)
                    key = key.strip().upper()
                    val = val.strip()
                    if key == 'DB_HOST':
                        config['host'] = val
                    elif key == 'DB_PORT':
                        config['port'] = int(val)
                    elif key == 'DB_USER':
                        config['user'] = val
                    elif key == 'DB_PASSWORD':
                        config['password'] = val
                    elif key == 'DB_NAME':
                        config['database'] = val
    except FileNotFoundError:
        pass
    return config


DB_CONFIG = _load_db_config()
HOST_IP = _get_local_ip()


def _get_db():
    return pymysql.connect(
        host=DB_CONFIG['host'],
        port=DB_CONFIG['port'],
        user=DB_CONFIG['user'],
        password=DB_CONFIG['password'],
        database=DB_CONFIG['database'],
        charset='utf8mb4',
    )


class CheckInHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == '/qrcode':
            self._serve_qrcode()
        elif parsed.path == '/checkin':
            self._handle_checkin(parsed)
        elif parsed.path == '/token':
            self._serve_token()
        elif parsed.path == '/api/history':
            self._serve_history()
        elif parsed.path == '/sign_in/history':
            self.path = '/sign_in/history.html'
            super().do_GET()
        elif parsed.path == '/sign_in/home':
            self.path = '/sign_in/home.html'
            super().do_GET()
        elif parsed.path == '/sign_in':
            self.path = '/sign_in/index.html'
            super().do_GET()
        elif parsed.path == '/':
            self.path = '/index.html'
            super().do_GET()
        else:
            super().do_GET()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

    def _send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-cache, no-store')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode())

    def _get_current_token(self):
        interval = int(time.time() / TOKEN_INTERVAL)
        return hashlib.sha256(str(interval).encode()).hexdigest()[:12]

    def _serve_qrcode(self):
        token = self._get_current_token()
        checkin_url = f"http://{HOST_IP}:{PORT}/checkin?token={token}"

        img = qrcode.make(checkin_url, box_size=10)
        buf = io.BytesIO()
        img.save(buf, format='PNG')
        buf.seek(0)

        self.send_response(200)
        self.send_header('Content-Type', 'image/png')
        self.send_header('Cache-Control', 'no-cache, no-store')
        self.end_headers()
        self.wfile.write(buf.read())

    def _serve_token(self):
        token = self._get_current_token()
        self._send_json(200, {'token': token})

    def _serve_history(self):
        try:
            conn = _get_db()
            with conn.cursor() as cursor:
                cursor.execute('''
                    SELECT h.id, u.user_id, u.name, h.token, h.signin_time
                    FROM sign_in_history h
                    JOIN users u ON u.user_id = h.user_id
                    ORDER BY h.signin_time DESC
                ''')
                rows = cursor.fetchall()
            conn.close()
            records = [
                {
                    'id': r[0],
                    'user_id': r[1],
                    'name': r[2],
                    'token': r[3],
                    'signin_time': r[4].strftime('%Y-%m-%d %H:%M:%S') if r[4] else '',
                }
                for r in rows
            ]
            self._send_json(200, {'status': 'ok', 'records': records})
        except pymysql.Error as e:
            self._send_json(500, {'status': 'error', 'message': f'資料庫錯誤：{e}'})

    def _handle_checkin(self, parsed):
        params = parse_qs(parsed.query)
        token = params.get('token', [''])[0]
        user_id = params.get('user_id', [None])[0]

        if not token or token != self._get_current_token():
            self._send_json(400, {'status': 'error', 'message': '無效的 QR Code'})
            return

        if not user_id:
            self._send_json(400, {'status': 'error', 'message': '缺少 user_id'})
            return

        try:
            conn = _get_db()
            with conn.cursor() as cursor:
                cursor.execute(
                    'SELECT id FROM users WHERE user_id = %s', (user_id,)
                )
                if not cursor.fetchone():
                    self._send_json(400, {'status': 'error', 'message': '找不到該使用者'})
                    return

                cursor.execute(
                    'INSERT INTO sign_in_history (user_id, token) VALUES (%s, %s)',
                    (user_id, token),
                )
                conn.commit()
            conn.close()
            self._send_json(200, {'status': 'ok', 'message': '簽到成功！'})
        except pymysql.Error as e:
            self._send_json(500, {'status': 'error', 'message': f'資料庫錯誤：{e}'})


if __name__ == '__main__':
    os.chdir(os.path.join(os.path.dirname(__file__), '..'))
    server = HTTPServer(('', PORT), CheckInHandler)
    print(f'QR Code 簽到伺服器啟動於 http://{HOST_IP}:{PORT}')
    print(f'Token 每 {TOKEN_INTERVAL} 秒更換一次')
    server.serve_forever()
