import json
import os
import tempfile
import logging

import firebase_admin
from firebase_admin import credentials, firestore, storage as fb_storage
from google.cloud.firestore import FieldFilter

from config import (
    FIREBASE_SERVICE_ACCOUNT_PATH,
    FIREBASE_SERVICE_ACCOUNT_JSON,
    FIREBASE_STORAGE_BUCKET,
)

logger = logging.getLogger(__name__)


class FirebaseDB:
    _initialized = False

    def _ensure_initialized(self):
        if self._initialized:
            return True

        if firebase_admin._apps:
            self._initialized = True
            return True

        cred = None
        if FIREBASE_SERVICE_ACCOUNT_JSON:
            cred = credentials.Certificate(
                json.loads(FIREBASE_SERVICE_ACCOUNT_JSON)
            )
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

        options = {}
        if FIREBASE_STORAGE_BUCKET:
            options['storageBucket'] = FIREBASE_STORAGE_BUCKET

        firebase_admin.initialize_app(cred, options)

        if FIREBASE_STORAGE_BUCKET:
            _ = fb_storage.bucket()
            logger.info(f'Firebase Storage 已連接: {FIREBASE_STORAGE_BUCKET}')

        self._initialized = True
        logger.info('Firebase 初始化成功')
        return True

    def _get_db(self):
        self._ensure_initialized()
        return firestore.client()

    def insert_file(self, original_name, stored_name, file_size, mime_type, file_data):
        self._ensure_initialized()
        bucket = fb_storage.bucket()
        blob = bucket.blob(f'files/{stored_name}')
        blob.upload_from_file(file_data, content_type=mime_type)
        logger.info(f'File stored in Firebase Storage: files/{stored_name}')

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

    def insert_share(self, file_id, password_hash):
        db = self._get_db()
        doc_ref = db.collection('shares').document()
        doc_ref.set({
            'file_id': file_id,
            'password_hash': password_hash,
            'is_used': False,
            'created_at': firestore.SERVER_TIMESTAMP,
        })
        return doc_ref.id

    def get_all_unused_shares(self):
        db = self._get_db()
        docs = (
            db.collection('shares')
            .where(filter=FieldFilter('is_used', '==', False))
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
        db.collection('shares').document(share_id).update({
            'is_used': True,
        })

    def get_file_stream(self, stored_name):
        self._ensure_initialized()
        bucket = fb_storage.bucket()
        blob = bucket.blob(f'files/{stored_name}')
        if not blob.exists():
            logger.warning(f'File not found in Storage: files/{stored_name}')
            return None
        temp = tempfile.NamedTemporaryFile(delete=False)
        blob.download_to_filename(temp.name)
        temp.close()
        return temp.name

    def check_health(self):
        try:
            self._ensure_initialized()
            db = self._get_db()
            db.collection('files').limit(1).get()
            return True
        except Exception as e:
            logger.warning(f'Firebase health check failed: {str(e)}')
            return False
