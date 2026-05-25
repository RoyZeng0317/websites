import os

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

PASSWORD_LENGTH = 12
MAX_CONTENT_LENGTH = 500 * 1024 * 1024
ALLOWED_EXTENSIONS = None
