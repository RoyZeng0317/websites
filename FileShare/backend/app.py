import os
import secrets
import string
import uuid
import json
import tempfile
import logging
from io import BytesIO

import firebase_admin
from firebase_admin import credentials, firestore, storage as fb_storage
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

from config import (
    SECRET_KEY,
    FIREBASE_SERVICE_ACCOUNT_PATH,
    FIREBASE_SERVICE_ACCOUNT_JSON,
    PASSWORD_LENGTH,
    MAX_CONTENT_LENGTH,
    ALLOWED_EXTENSIONS,
)
from models import FirebaseDB

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH
app.config['SECRET_KEY'] = SECRET_KEY

CORS(app, resources={
    r'/api/*': {
        'origins': [
            'http://localhost:5173',
            'http://localhost:4173',
            'https://file-share-platfrom.web.app',
            'https://file-share-platfrom.firebaseapp.com',
        ],
    },
})

db = FirebaseDB()


def generate_password(length=PASSWORD_LENGTH):
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def allowed_file(filename):
    if ALLOWED_EXTENSIONS is None:
        return True
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': '沒有上傳檔案'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': '未選擇檔案'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': '不支援的檔案類型'}), 400

    original_name = file.filename
    ext = original_name.rsplit('.', 1)[1].lower() if '.' in original_name else ''
    stored_name = f"{uuid.uuid4().hex}{'.' + ext if ext else ''}"
    mime_type = file.content_type or 'application/octet-stream'

    try:
        file_data = BytesIO(file.read())
        file_size = len(file_data.getvalue())
        file_data.seek(0)

        file_id = db.insert_file(
            original_name, stored_name, file_size, mime_type, file_data
        )

        password = generate_password()
        password_hash = generate_password_hash(password)
        db.insert_share(file_id, password_hash)

        logger.info(f'File uploaded: {original_name} ({file_size} bytes)')

        return jsonify({
            'message': '上傳成功',
            'password': password,
            'filename': original_name,
            'file_size': file_size,
        }), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 503
    except Exception as e:
        logger.error(f'Upload failed: {str(e)}')
        return jsonify({'error': f'上傳失敗: {str(e)}'}), 500


@app.route('/api/download', methods=['POST'])
def download_file():
    data = request.get_json()

    if not data or 'password' not in data:
        return jsonify({'error': '請提供密碼'}), 400

    password = data['password']

    try:
        shares = db.get_all_unused_shares()
    except ValueError as e:
        return jsonify({'error': str(e)}), 503
    except Exception as e:
        logger.error(f'Failed to query shares: {str(e)}')
        return jsonify({'error': '伺服器錯誤'}), 500

    matched_share = None
    for share in shares:
        if check_password_hash(share['password_hash'], password):
            matched_share = share
            break

    if not matched_share:
        return jsonify({'error': '無效的密碼'}), 401

    try:
        file_record = db.get_file_by_id(matched_share['file_id'])
    except Exception as e:
        logger.error(f'Failed to get file record: {str(e)}')
        return jsonify({'error': '伺服器錯誤'}), 500

    if not file_record:
        return jsonify({'error': '檔案記錄不存在'}), 404

    try:
        file_path = db.get_file_stream(file_record['stored_name'])
    except ValueError as e:
        return jsonify({'error': str(e)}), 503
    except Exception as e:
        logger.error(f'Failed to get file: {str(e)}')
        return jsonify({'error': '檔案擷取失敗'}), 500

    if not file_path:
        return jsonify({'error': '檔案不存在'}), 404

    try:
        db.mark_share_used(matched_share['id'])
    except Exception as e:
        logger.error(f'Failed to mark share used: {str(e)}')

    logger.info(f'File downloaded: {file_record["original_name"]}')

    try:
        return send_file(
            file_path,
            as_attachment=True,
            download_name=file_record['original_name'],
        )
    finally:
        try:
            os.unlink(file_path)
        except Exception:
            pass


@app.route('/api/health', methods=['GET'])
def health_check():
    status = 'ok'
    fb_status = db.check_health()
    if not fb_status:
        status = 'degraded'
    return jsonify({
        'status': status,
        'firebase': fb_status,
        'message': '伺服器運行中',
    }), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
