import json
import os
import tempfile
import logging

import boto3
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore import FieldFilter

from config import (
    B2_ENDPOINT,
    B2_KEY_ID,
    B2_APPLICATION_KEY,
    B2_BUCKET_NAME,
    FIREBASE_SERVICE_ACCOUNT_PATH,
    FIREBASE_SERVICE_ACCOUNT_JSON,
    log_config_status,
)

logger = logging.getLogger(__name__)


class FirebaseDB:
    _initialized = False
    _s3 = None

    def _ensure_s3(self):
        if self._s3:
            return self._s3

        if not all([B2_ENDPOINT, B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME]):
            missing = [k for k, v in [
                ('B2_ENDPOINT', B2_ENDPOINT),
                ('B2_KEY_ID', B2_KEY_ID),
                ('B2_APPLICATION_KEY', B2_APPLICATION_KEY),
                ('B2_BUCKET_NAME', B2_BUCKET_NAME),
            ] if not v]
            raise ValueError(
                f'B2 儲存設定不完整，缺少: {", ".join(missing)}。'
                '請在 Render 上設定對應的環境變數'
            )

        try:
            self._s3 = boto3.client(
                's3',
                endpoint_url=B2_ENDPOINT,
                aws_access_key_id=B2_KEY_ID,
                aws_secret_access_key=B2_APPLICATION_KEY,
            )
            logger.info(f'B2 S3 已連接: {B2_ENDPOINT}')
        except Exception as e:
            raise ValueError(f'B2 S3 連線失敗: {e}') from e

        return self._s3

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

        self._initialized = True
        logger.info('Firebase Firestore 初始化成功')
        return True

    def _get_db(self):
        self._ensure_initialized()
        return firestore.client()

    def insert_file(self, original_name, stored_name, file_size, mime_type, file_data):
        self._ensure_initialized()
        s3 = self._ensure_s3()

        key = f'files/{stored_name}'
        try:
            s3.upload_fileobj(
                file_data,
                B2_BUCKET_NAME,
                key,
                ExtraArgs={'ContentType': mime_type or 'application/octet-stream'},
            )
        except Exception as e:
            error_msg = str(e)
            logger.error(f'B2 upload failed: {error_msg}')
            if 'InvalidAccessKeyId' in error_msg:
                raise ValueError(
                    'B2 認證失敗（InvalidAccessKeyId），'
                    '請檢查 B2_KEY_ID 是否正確'
                ) from e
            if 'SignatureDoesNotMatch' in error_msg:
                raise ValueError(
                    'B2 認證失敗（SignatureDoesNotMatch），'
                    '請檢查 B2_APPLICATION_KEY 是否正確'
                ) from e
            if 'NoSuchBucket' in error_msg:
                raise ValueError(
                    f'B2 Bucket 不存在: {B2_BUCKET_NAME}，'
                    '請確認 B2_BUCKET_NAME 是否正確'
                ) from e
            raise ValueError(f'B2 上傳失敗: {error_msg}') from e

        logger.info(f'File stored in B2: {key}')

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
        s3 = self._ensure_s3()

        key = f'files/{stored_name}'
        try:
            s3.head_object(Bucket=B2_BUCKET_NAME, Key=key)
        except s3.exceptions.ClientError as e:
            if e.response['Error']['Code'] == '404':
                logger.warning(f'File not found in B2: {key}')
                return None
            logger.error(f'B2 check failed: {e}')
            return None

        temp = tempfile.NamedTemporaryFile(delete=False)
        s3.download_fileobj(B2_BUCKET_NAME, key, temp)
        temp.close()
        return temp.name

    def check_health(self):
        try:
            self._ensure_initialized()
            self._ensure_s3()
            s3 = self._s3
            s3.head_bucket(Bucket=B2_BUCKET_NAME)
            db = self._get_db()
            db.collection('files').limit(1).get()
            return True
        except Exception as e:
            logger.warning(f'Health check failed: {str(e)}')
            return False
