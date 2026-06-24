import json
import os
import io
import tempfile
import logging
from datetime import datetime, timedelta, timezone

import boto3
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore import FieldFilter
from botocore.config import Config as BotoConfig

from config import (
    B2_ENDPOINT,
    B2_KEY_ID,
    B2_APPLICATION_KEY,
    B2_BUCKET_NAME,
    FIREBASE_SERVICE_ACCOUNT_PATH,
    FIREBASE_SERVICE_ACCOUNT_JSON,
    UPLOAD_FOLDER,
    log_config_status,
)

logger = logging.getLogger(__name__)


class FirebaseDB:
    _initialized = False
    _b2_client = None

    def _ensure_initialized(self):
        if self._initialized:
            return True

        if firebase_admin._apps:
            self._initialized = True
            return True

        log_config_status()

        cred = None
        if FIREBASE_SERVICE_ACCOUNT_JSON:
            try:
                cred = credentials.Certificate(
                    json.loads(FIREBASE_SERVICE_ACCOUNT_JSON)
                )
            except json.JSONDecodeError as e:
                raise ValueError(
                    'Firebase 憑證 JSON 格式錯誤，請檢查 '
                    'FIREBASE_SERVICE_ACCOUNT_JSON 是否為完整的 JSON 字串'
                ) from e
            except ValueError as e:
                if 'Invalid' in str(e) or 'private_key' in str(e):
                    raise ValueError(
                        'Firebase 憑證無效，請確認 '
                        'FIREBASE_SERVICE_ACCOUNT_JSON 包含完整的 private_key'
                    ) from e
                raise
        elif FIREBASE_SERVICE_ACCOUNT_PATH:
            path = FIREBASE_SERVICE_ACCOUNT_PATH
            if not os.path.isabs(path):
                path = os.path.join(
                    os.path.dirname(os.path.abspath(__file__)), path
                )
            if not os.path.exists(path):
                raise ValueError(
                    f'Firebase 服務帳戶金鑰檔案不存在: {path}。'
                    '請設定 FIREBASE_SERVICE_ACCOUNT_JSON 或 FIREBASE_SERVICE_ACCOUNT_PATH'
                )
            cred = credentials.Certificate(path)

        if not cred:
            raise ValueError(
                '未設定 Firebase 憑證。請設定環境變數 '
                'FIREBASE_SERVICE_ACCOUNT_JSON 或 FIREBASE_SERVICE_ACCOUNT_PATH'
            )

        firebase_admin.initialize_app(cred)

        if B2_KEY_ID and B2_APPLICATION_KEY and B2_BUCKET_NAME:
            logger.info(f'B2 connecting - endpoint: {B2_ENDPOINT}, key_id: {B2_KEY_ID[:10]}..., bucket: {B2_BUCKET_NAME}')
            self._b2_client = boto3.client(
                's3',
                endpoint_url=B2_ENDPOINT,
                aws_access_key_id=B2_KEY_ID,
                aws_secret_access_key=B2_APPLICATION_KEY,
                config=BotoConfig(signature_version='s3v4'),
            )
            logger.info(f'Backblaze B2 已連接: {B2_BUCKET_NAME}')

        self._initialized = True
        logger.info('Firebase Firestore 初始化成功')
        return True

    def _get_db(self):
        self._ensure_initialized()
        return firestore.client()

    def insert_file(self, original_name, stored_name, file_size, mime_type, file_data):
        self._ensure_initialized()
        file_data.seek(0)

        if self._b2_client:
            self._b2_client.put_object(
                Bucket=B2_BUCKET_NAME,
                Key=f'files/{stored_name}',
                Body=file_data,
                ContentType=mime_type,
            )
            logger.info(f'File stored in B2: files/{stored_name}')
        else:
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            file_path = os.path.join(UPLOAD_FOLDER, stored_name)
            with open(file_path, 'wb') as f:
                f.write(file_data.getvalue())
            logger.info(f'File stored locally: {file_path}')

        db = self._get_db()
        doc_ref = db.collection('files').document()
        doc_ref.set({
            'original_name': original_name,
            'stored_name': stored_name,
            'file_size': file_size,
            'mime_type': mime_type,
            'created_at': firestore.SERVER_TIMESTAMP,
        })
        return doc_ref.id

    def get_file_by_id(self, file_id):
        db = self._get_db()
        doc = db.collection('files').document(file_id).get()
        if not doc.exists:
            return None
        data = doc.to_dict()
        data['id'] = doc.id
        return data

    def insert_share(self, file_id, password_hash, expires_at, max_downloads=1):
        db = self._get_db()
        doc_ref = db.collection('shares').document()
        doc_ref.set({
            'file_id': file_id,
            'password_hash': password_hash,
            'is_used': False,
            'max_downloads': max_downloads,
            'download_count': 0,
            'created_at': firestore.SERVER_TIMESTAMP,
            'expires_at': expires_at,
        })
        return doc_ref.id

    def get_all_unused_shares(self):
        db = self._get_db()
        docs = (
            db.collection('shares')
            .where(filter=FieldFilter('is_used', '==', False))
            .where(filter=FieldFilter('expires_at', '>', datetime.now(timezone.utc)))
            .stream()
        )
        results = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            results.append(data)
        return results

    def mark_share_used(self, share_id):
        db = self._get_db()
        db.collection('shares').document(share_id).update({'is_used': True})

    def increment_download_count(self, share_id):
        db = self._get_db()
        db.collection('shares').document(share_id).update({
            'download_count': firestore.Increment(1),
        })

    def get_file_count(self):
        db = self._get_db()
        return len(list(db.collection('files').limit(101).stream()))

    def cleanup_expired(self):
        db = self._get_db()
        now = datetime.now(timezone.utc)
        expired = list(
            db.collection('shares')
            .where(filter=FieldFilter('is_used', '==', False))
            .where(filter=FieldFilter('expires_at', '<=', now))
            .stream()
        )
        count = 0
        for share_doc in expired:
            share_data = share_doc.to_dict()
            file_id = share_data.get('file_id')
            share_doc.reference.delete()
            if file_id:
                file_ref = db.collection('files').document(file_id)
                file_snap = file_ref.get()
                if file_snap.exists:
                    stored_name = file_snap.to_dict().get('stored_name')
                    file_ref.delete()
                    if stored_name:
                        self.delete_file(stored_name)
            count += 1
        if count:
            logger.info(f'[Cleanup] 已刪除 {count} 個過期分享及其檔案')
        return count

    def increment_pageview(self):
        db = self._get_db()
        db.collection('stats').document('global').set(
            {'pageviews': firestore.Increment(1)},
            merge=True,
        )

    def get_admin_stats(self):
        db = self._get_db()
        now = datetime.now(timezone.utc)

        files = list(db.collection('files').stream())
        file_count = len(files)
        total_size = sum(f.to_dict().get('file_size', 0) for f in files)

        active_shares = list(
            db.collection('shares')
            .where(filter=FieldFilter('is_used', '==', False))
            .where(filter=FieldFilter('expires_at', '>', now))
            .stream()
        )

        members = list(db.collection('members').stream())

        return {
            'file_count': file_count,
            'total_size': total_size,
            'active_share_count': len(active_shares),
            'member_count': len(members),
        }

    def get_recent_files(self, limit=50):
        from google.cloud.firestore import Query as FSQuery
        db = self._get_db()
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
            if data.get('created_at'):
                data['created_at'] = data['created_at'].isoformat()
            results.append(data)
        return results

    def get_members(self):
        db = self._get_db()
        docs = list(db.collection('members').stream())
        results = []
        for doc in docs:
            data = doc.to_dict()
            data['uid'] = doc.id
            if data.get('since'):
                data['since'] = data['since'].isoformat()
            results.append(data)
        return results

    def get_file_stream(self, stored_name):
        self._ensure_initialized()
        if self._b2_client:
            try:
                obj = self._b2_client.get_object(
                    Bucket=B2_BUCKET_NAME,
                    Key=f'files/{stored_name}',
                )
                data = obj['Body'].read()
                temp = tempfile.NamedTemporaryFile(delete=False)
                temp.write(data)
                temp.close()
                return temp.name
            except Exception as e:
                logger.warning(f'B2 download failed: {str(e)}')
                return None
        else:
            file_path = os.path.join(UPLOAD_FOLDER, stored_name)
            if not os.path.exists(file_path):
                logger.warning(f'File not found: {file_path}')
                return None
            return file_path

    def check_health(self):
        try:
            self._ensure_initialized()
            if self._b2_client:
                self._b2_client.head_bucket(Bucket=B2_BUCKET_NAME)
            db = self._get_db()
            db.collection('files').limit(1).get()
            return True
        except Exception as e:
            logger.warning(f'Health check failed: {str(e)}')
            return False

    def delete_share(self, share_id):
        db = self._get_db()
        share_ref = db.collection('shares').document(share_id)
        share_snap = share_ref.get()
        if not share_snap.exists:
            return False
        file_id = share_snap.to_dict().get('file_id')
        share_ref.delete()
        if file_id:
            file_ref = db.collection('files').document(file_id)
            file_snap = file_ref.get()
            if file_snap.exists:
                stored_name = file_snap.to_dict().get('stored_name')
                file_ref.delete()
                if stored_name:
                    self.delete_file(stored_name)
        return True

    def delete_file(self, stored_name):
        self._ensure_initialized()
        if self._b2_client:
            try:
                self._b2_client.delete_object(
                    Bucket=B2_BUCKET_NAME,
                    Key=f'files/{stored_name}',
                )
                logger.info(f'Deleted from B2: files/{stored_name}')
            except Exception as e:
                logger.warning(f'B2 delete failed: {str(e)}')
        else:
            file_path = os.path.join(UPLOAD_FOLDER, stored_name)
            if os.path.exists(file_path):
                os.unlink(file_path)
