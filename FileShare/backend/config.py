import os
import logging

logger = logging.getLogger(__name__)

# Firebase Firestore 憑證（仍用於資料庫）
FIREBASE_SERVICE_ACCOUNT_PATH = os.environ.get('FIREBASE_SERVICE_ACCOUNT_PATH')
FIREBASE_SERVICE_ACCOUNT_JSON = os.environ.get('FIREBASE_SERVICE_ACCOUNT_JSON')
FIREBASE_PROJECT_ID = os.environ.get('FIREBASE_PROJECT_ID')

B2_KEY_ID = os.environ.get('B2_KEY_ID')
B2_APPLICATION_KEY = os.environ.get('B2_APPLICATION_KEY')
B2_BUCKET_NAME = os.environ.get('B2_BUCKET_NAME')
B2_ENDPOINT = os.environ.get('B2_ENDPOINT', 'https://s3.us-west-002.backblazeb2.com')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

SECRET_KEY = os.environ.get('SECRET_KEY', 'change-this-to-a-random-secret-key')

PASSWORD_LENGTH = 6
MAX_CONTENT_LENGTH = 500 * 1024 * 1024
ALLOWED_EXTENSIONS = None


def log_config_status():
    logger.info('=== B2 Storage 設定狀態 ===')
    if B2_ENDPOINT:
        logger.info(f'B2_ENDPOINT: {B2_ENDPOINT}')
    else:
        logger.error('B2_ENDPOINT: 未設定')
    if B2_KEY_ID:
        logger.info(f'B2_KEY_ID: {B2_KEY_ID[:8]}...')
    else:
        logger.error('B2_KEY_ID: 未設定')
    if B2_APPLICATION_KEY:
        logger.info(f'B2_APPLICATION_KEY: 已設定 ({len(B2_APPLICATION_KEY)} 字元)')
    else:
        logger.error('B2_APPLICATION_KEY: 未設定')
    if B2_BUCKET_NAME:
        logger.info(f'B2_BUCKET_NAME: {B2_BUCKET_NAME}')
    else:
        logger.error('B2_BUCKET_NAME: 未設定')

    logger.info('=== Firebase Firestore 設定狀態 ===')
    if FIREBASE_SERVICE_ACCOUNT_JSON:
        logger.info(f'FIREBASE_SERVICE_ACCOUNT_JSON: 已設定 ({len(FIREBASE_SERVICE_ACCOUNT_JSON)} 字元)')
        try:
            import json
            parsed = json.loads(FIREBASE_SERVICE_ACCOUNT_JSON)
            logger.info(f'  project_id: {parsed.get("project_id", "MISSING")}')
            logger.info(f'  client_email: {parsed.get("client_email", "MISSING")}')
            has_private_key = bool(parsed.get('private_key', ''))
            logger.info(f'  private_key: {"已設定" if has_private_key else "MISSING"}')
        except json.JSONDecodeError as e:
            logger.error(f'  JSON 解析失敗: {e}')
            logger.error('  => 請確認 FIREBASE_SERVICE_ACCOUNT_JSON 是完整的 JSON')
    elif FIREBASE_SERVICE_ACCOUNT_PATH:
        path = FIREBASE_SERVICE_ACCOUNT_PATH
        if not os.path.isabs(path):
            path = os.path.join(BASE_DIR, path)
        exists = os.path.exists(path)
        logger.info(f'FIREBASE_SERVICE_ACCOUNT_PATH: {path} ({"存在" if exists else "不存在"})')
        if not exists:
            logger.error('  => 金鑰檔案不存在')
    else:
        logger.error('FIREBASE_SERVICE_ACCOUNT_JSON: 未設定')
        logger.error('FIREBASE_SERVICE_ACCOUNT_PATH: 未設定')
        logger.error('=> Firestore 無法使用，請設定其中一個')

    logger.info('========================')
