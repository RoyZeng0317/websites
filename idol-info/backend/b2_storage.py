"""Backblaze B2 資料庫同步"""
import os
import shutil
from pathlib import Path
from b2sdk.v2 import B2Api, InMemoryAccountInfo
from dotenv import load_dotenv

load_dotenv()

_B2_KEY_ID = os.getenv("B2_KEY_ID", "")
_B2_APPLICATION_KEY = os.getenv("B2_APPLICATION_KEY", "")
_B2_BUCKET_NAME = os.getenv("B2_BUCKET_NAME", "idol-info-db")
_B2_FILE_NAME = os.getenv("B2_FILE_NAME", "idol_info.db")
_DB_PATH = Path(__file__).parent / "idol_info.db"

_info = InMemoryAccountInfo()
_api = B2Api(_info)


def _get_bucket():
    try:
        _api.authorize_account("production", _B2_KEY_ID, _B2_APPLICATION_KEY)
        return _api.get_bucket_by_name(_B2_BUCKET_NAME)
    except Exception as e:
        print(f"[B2] 授權失敗: {e}")
        return None


def download_db() -> bool:
    """從 B2 下載資料庫（啟動時呼叫）"""
    if not _B2_KEY_ID or not _B2_APPLICATION_KEY:
        print("[B2] 未設定 API Key，跳過下載")
        return False

    bucket = _get_bucket()
    if not bucket:
        return False

    try:
        downloaded = bucket.download_file_by_name(_B2_FILE_NAME)
        _DB_PATH.write_bytes(downloaded.read())
        print(f"[B2] 資料庫已從 B2 下載 ({_DB_PATH.stat().st_size} bytes)")
        return True
    except Exception as e:
        print(f"[B2] 下載失敗（可能是首次上傳）: {e}")
        return False


def upload_db() -> bool:
    """上傳資料庫到 B2（每次寫入後呼叫）"""
    if not _B2_KEY_ID or not _B2_APPLICATION_KEY:
        return False
    if not _DB_PATH.exists():
        return False

    bucket = _get_bucket()
    if not bucket:
        return False

    try:
        bucket.upload_local_file(
            local_file=str(_DB_PATH),
            file_name=_B2_FILE_NAME,
        )
        print(f"[B2] 資料庫已上傳到 B2 ({_DB_PATH.stat().st_size} bytes)")
        return True
    except Exception as e:
        print(f"[B2] 上傳失敗: {e}")
        return False
