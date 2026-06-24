"""
FileShare 管理後台 — 本地端執行
使用方式: python run.py
開啟瀏覽器: http://localhost:8080
"""
import os
import sys

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, '..', 'backend')
CRED_PATH  = os.path.join(BACKEND_DIR, 'serviceAccountKey.json')

# 載入後端 .env（取得 B2 憑證）
from dotenv import load_dotenv
load_dotenv(os.path.join(BACKEND_DIR, '.env'))

from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore import FieldFilter, Query as FSQuery
from datetime import datetime, timezone
import boto3
from botocore.config import Config as BotoConfig

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')
CORS(app)

# ── Firebase ────────────────────────────────────────────
if not firebase_admin._apps:
    cred = credentials.Certificate(CRED_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ── B2 Storage（可選，無憑證則用本地路徑）──────────────────
B2_KEY_ID         = os.getenv('B2_KEY_ID')
B2_APPLICATION_KEY = os.getenv('B2_APPLICATION_KEY')
B2_BUCKET_NAME    = os.getenv('B2_BUCKET_NAME')
B2_ENDPOINT       = os.getenv('B2_ENDPOINT', 'https://s3.us-west-002.backblazeb2.com')

b2 = None
if B2_KEY_ID and B2_APPLICATION_KEY and B2_BUCKET_NAME:
    b2 = boto3.client(
        's3',
        endpoint_url=B2_ENDPOINT,
        aws_access_key_id=B2_KEY_ID,
        aws_secret_access_key=B2_APPLICATION_KEY,
        config=BotoConfig(signature_version='s3v4'),
    )


def _delete_storage_file(stored_name: str):
    """從 B2 或本地刪除實體檔案。"""
    if b2:
        try:
            b2.delete_object(Bucket=B2_BUCKET_NAME, Key=f'files/{stored_name}')
        except Exception as e:
            print(f'[B2] 刪除失敗: {e}')
    else:
        local = os.path.join(BACKEND_DIR, 'uploads', stored_name)
        if os.path.exists(local):
            os.unlink(local)


def fmt_time(ts):
    if ts is None:
        return '-'
    if hasattr(ts, 'isoformat'):
        return ts.isoformat()
    return str(ts)


# ── Routes ─────────────────────────────────────────────

@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/stats')
def stats():
    files = list(db.collection('files').stream())
    file_count = len(files)
    total_size = sum(f.to_dict().get('file_size', 0) for f in files)

    now = datetime.now(timezone.utc)
    active_shares = list(
        db.collection('shares')
        .where(filter=FieldFilter('is_used', '==', False))
        .where(filter=FieldFilter('expires_at', '>', now))
        .stream()
    )

    members = list(db.collection('members').stream())

    stats_doc = db.collection('stats').document('global').get()
    pageviews = stats_doc.to_dict().get('pageviews', 0) if stats_doc.exists else 0

    return jsonify({
        'file_count':        file_count,
        'total_size':        total_size,
        'active_share_count': len(active_shares),
        'member_count':      len(members),
        'pageviews':         pageviews,
    })


@app.route('/api/files')
def files():
    limit = request.args.get('limit', 50, type=int)

    # 建立 file_id → download_count 對照表
    shares_lookup: dict[str, int] = {}
    for share in db.collection('shares').stream():
        d = share.to_dict()
        fid = d.get('file_id')
        if fid:
            shares_lookup[fid] = shares_lookup.get(fid, 0) + d.get('download_count', 0)

    docs = (
        db.collection('files')
        .order_by('created_at', direction=FSQuery.DESCENDING)
        .limit(limit)
        .stream()
    )
    results = []
    for doc in docs:
        data = doc.to_dict()
        data['id'] = doc.id
        data['created_at'] = fmt_time(data.get('created_at'))
        data['download_count'] = shares_lookup.get(doc.id, 0)
        data.pop('stored_name', None)
        results.append(data)
    return jsonify({'files': results})


@app.route('/api/files/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    """手動刪除指定檔案（含 Firestore 記錄、關聯分享、實體檔案）。"""
    file_ref  = db.collection('files').document(file_id)
    file_snap = file_ref.get()

    if not file_snap.exists:
        return jsonify({'error': '檔案不存在'}), 404

    file_data   = file_snap.to_dict()
    stored_name = file_data.get('stored_name')
    filename    = file_data.get('original_name', file_id)

    # 1. 刪除所有關聯分享（shares）
    shares = list(
        db.collection('shares')
        .where(filter=FieldFilter('file_id', '==', file_id))
        .stream()
    )
    for share in shares:
        share.reference.delete()

    # 2. 刪除 Firestore 檔案記錄
    file_ref.delete()

    # 3. 刪除實體檔案（B2 或本地）
    if stored_name:
        _delete_storage_file(stored_name)

    print(f'[Admin] 手動刪除: {filename} (id={file_id}, shares={len(shares)})')
    return jsonify({
        'ok':      True,
        'filename': filename,
        'shares_deleted': len(shares),
    })


@app.route('/api/members')
def members():
    docs = list(db.collection('members').stream())
    results = []
    for doc in docs:
        data = doc.to_dict()
        data['uid']   = doc.id
        data['since'] = fmt_time(data.get('since'))
        results.append(data)
    return jsonify({'members': results, 'count': len(results)})


if __name__ == '__main__':
    if not os.path.exists(CRED_PATH):
        print(f'[錯誤] 找不到 Firebase 憑證: {CRED_PATH}')
        sys.exit(1)
    print('FileShare 管理後台啟動中...')
    print('開啟瀏覽器: http://localhost:8080')
    app.run(host='127.0.0.1', port=8080, debug=False)
