# QR Code 簽到
import hashlib
import io
import json
import socket
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

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


HOST_IP = _get_local_ip()


class CheckInHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == '/qrcode':
            self._serve_qrcode()
        elif parsed.path == '/checkin':
            self._handle_checkin(parsed)
        elif parsed.path == '/token':
            self._serve_token()
        elif parsed.path == '/':
            self.path = '/index.html'
            super().do_GET()
        else:
            super().do_GET()

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

        img = qrcode.make(checkin_url)
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

    def _handle_checkin(self, parsed):
        params = parse_qs(parsed.query)
        token = params.get('token', [''])[0]

        if token and token == self._get_current_token():
            self._send_json(200, {'status': 'ok', 'message': '簽到成功！'})
        else:
            self._send_json(400, {'status': 'error', 'message': '無效的 QR Code'})


if __name__ == '__main__':
    import os
    os.chdir(os.path.join(os.path.dirname(__file__), '..'))
    server = HTTPServer(('', PORT), CheckInHandler)
    print(f'QR Code 簽到伺服器啟動於 http://{HOST_IP}:{PORT}')
    print(f'Token 每 {TOKEN_INTERVAL} 秒更換一次')
    server.serve_forever()
