import random
import time
import math

QR_QUOTA = 10
PASSWORD_QUOTA = 5
PREFIX = "SIGNIN:KNOWGENCE"

def build_token(session_id: str, generation: int) -> str:
    return f"{PREFIX}:{session_id}:{generation}"

def generate_password(session_id: str, password_gen: int) -> str:
    random.seed(f"{session_id}:{password_gen}")
    digits = list(range(10))
    random.shuffle(digits)
    return ''.join(str(d) for d in digits[:4])

def get_qr_generation(total_sign_ins: int) -> int:
    return total_sign_ins // QR_QUOTA

def get_password_generation(total_sign_ins: int) -> int:
    return total_sign_ins // PASSWORD_QUOTA

def is_valid_token(token: str, session_id: str, current_generation: int) -> bool:
    """允許當前及前一代 token（防止換碼瞬間學生掃到舊碼被拒）"""
    for gen in (current_generation, current_generation - 1):
        if gen >= 0 and token == build_token(session_id, gen):
            return True
    return False

def is_valid_password(password: str, session_id: str, current_password_gen: int) -> bool:
    """允許當前及前一代密碼"""
    for gen in (current_password_gen, current_password_gen - 1):
        if gen >= 0 and password == generate_password(session_id, gen):
            return True
    return False

def seconds_left(session_end_timestamp: float) -> int:
    return max(0, math.floor(session_end_timestamp - time.time()))
