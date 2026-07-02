"""
pwd_2FA_check.py — Unified two-factor authentication for Vaultix NAS (Python frontend).
Module name `pwd_2FA_check` is a valid identifier → `from pwd_2FA_check import TwoFactor`.

FOUR verification methods, all in this one module:
    1. TOTP code         — authenticator-app code (Google Authenticator, Authy, …)
    2. QR code           — enrollment: renders the otpauth:// URI as a scannable QR
    3. Phone fingerprint ┐  both are WebAuthn *platform* authenticators — the SAME
    4. Windows Hello     ┘  server code path; the browser performs the biometric.

Design notes
------------
- Web-oriented: NO input(). Import the `TwoFactor` class into the FastAPI frontend
  (frontend-py/app.py) and wire each method to a route. The browser does the biometric
  for methods 3/4 via `navigator.credentials`; this module only issues challenges and
  verifies responses.
- Self-contained: TOTP secrets + WebAuthn credentials live in a local SQLite DB.
- Keyed by `username` (the caller passes the logged-in user).
- Enrollment QR / secret expires after `provision_ttl` seconds (default 180 = 3 min):
  a provisioned-but-not-yet-enabled secret can't be confirmed after it lapses.
- This is a SEPARATE 2FA store from the Node backend's own 2FA (by design, per the
  "Python owns 2FA" request). Existing Node enrollments do not carry over.

Dependencies:  pip install pyotp "qrcode[pil]" webauthn
"""
from __future__ import annotations

import base64
import io
import json
import os
import sqlite3
import time

import pyotp
import qrcode
from cryptography.fernet import Fernet

from webauthn import (
    generate_registration_options,
    verify_registration_response,
    generate_authentication_options,
    verify_authentication_response,
    options_to_json,
)
from webauthn.helpers import bytes_to_base64url, base64url_to_bytes
from webauthn.helpers.structs import (
    AuthenticatorSelectionCriteria,
    AuthenticatorAttachment,
    ResidentKeyRequirement,
    UserVerificationRequirement,
    PublicKeyCredentialDescriptor,
)


class TwoFactor:
    # NOTE: the user asked for 4-digit TOTP, but standard authenticator apps only
    # display 6 digits. Change to 4 ONLY if your app supports non-standard digits.
    TOTP_DIGITS = 6

    def __init__(
        self,
        db_path: str = "2fa.db",
        rp_id: str = "localhost",
        rp_name: str = "Vaultix NAS",
        origin: str = "http://localhost:8001",
        challenge_ttl: int = 300,
        provision_ttl: int = 180,   # enrollment QR/secret valid for 3 minutes
        secret_key: str | bytes | None = None,
    ):
        """
        rp_id      : the site's domain WITHOUT scheme/port, e.g. "raspberrypi.tail8767da.ts.net"
        origin     : full origin the browser sees, e.g. "https://raspberrypi.tail8767da.ts.net:8444"
        secret_key : Fernet key for encrypting TOTP secrets at rest (see _load_key).
        """
        self.db_path = db_path
        self.rp_id = rp_id
        self.rp_name = rp_name
        self.origin = origin
        self.challenge_ttl = challenge_ttl
        self.provision_ttl = provision_ttl
        self._fernet = Fernet(self._load_key(secret_key))
        self._challenges: dict[str, tuple[bytes, float]] = {}  # username -> (challenge, expiry)
        self._init_db()

    # ── at-rest encryption for TOTP secrets ──────────────
    def _load_key(self, secret_key) -> bytes:
        """Fernet key priority: explicit arg → env TFA_KEY → a key file beside the DB
        (auto-created, chmod 600). In-memory DBs get an ephemeral per-process key."""
        if secret_key:
            return secret_key.encode() if isinstance(secret_key, str) else secret_key
        env = os.environ.get("TFA_KEY")
        if env:
            return env.encode()
        key_path = None if self.db_path == ":memory:" else self.db_path + ".key"
        if key_path and os.path.exists(key_path):
            return open(key_path, "rb").read()
        key = Fernet.generate_key()
        if key_path:
            with open(key_path, "wb") as f:
                f.write(key)
            try:
                os.chmod(key_path, 0o600)
            except OSError:
                pass
        return key

    def _enc(self, secret: str) -> str:
        return self._fernet.encrypt(secret.encode()).decode()

    def _dec(self, token: str) -> str:
        return self._fernet.decrypt(token.encode()).decode()

    # ── storage ──────────────────────────────────────────
    def _db(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self) -> None:
        with self._db() as db:
            db.execute("""
                CREATE TABLE IF NOT EXISTS totp (
                    username      TEXT PRIMARY KEY,
                    secret        TEXT NOT NULL,
                    enabled       INTEGER NOT NULL DEFAULT 0,
                    provisioned_at REAL NOT NULL DEFAULT 0
                )
            """)
            db.execute("""
                CREATE TABLE IF NOT EXISTS webauthn_creds (
                    id            INTEGER PRIMARY KEY AUTOINCREMENT,
                    username      TEXT NOT NULL,
                    credential_id TEXT NOT NULL UNIQUE,   -- base64url
                    public_key    TEXT NOT NULL,          -- base64url
                    sign_count    INTEGER NOT NULL DEFAULT 0,
                    label         TEXT,
                    created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
            """)

    # ── challenge cache (options → verify) ───────────────
    def _put_challenge(self, username: str, challenge: bytes) -> None:
        self._challenges[username] = (challenge, time.time() + self.challenge_ttl)

    def _pop_challenge(self, username: str) -> bytes:
        item = self._challenges.pop(username, None)
        if not item or item[1] < time.time():
            raise ValueError("challenge expired or missing — restart the flow")
        return item[0]

    # ══════════════════════════════════════════════════════
    #  Method 1 & 2 — TOTP  (+ QR code for enrollment)
    # ══════════════════════════════════════════════════════
    def totp_provision(self, username: str) -> dict:
        """Create/replace a TOTP secret (disabled until confirmed) and return the
        otpauth URI + a scannable QR code (PNG data-URI). Method 2 = the QR.
        The QR/secret must be confirmed within `provision_ttl` seconds."""
        secret = pyotp.random_base32()
        with self._db() as db:
            db.execute(
                "INSERT INTO totp (username, secret, enabled, provisioned_at) VALUES (?, ?, 0, ?) "
                "ON CONFLICT(username) DO UPDATE SET secret = excluded.secret, "
                "enabled = 0, provisioned_at = excluded.provisioned_at",
                (username, self._enc(secret), time.time()),
            )
        uri = pyotp.TOTP(secret, digits=self.TOTP_DIGITS).provisioning_uri(
            name=username, issuer_name=self.rp_name
        )
        return {"secret": secret, "uri": uri, "qr": self._qr_data_uri(uri),
                "expires_in": self.provision_ttl}

    def totp_enable(self, username: str, code: str) -> bool:
        """Confirm enrollment: verify the first code within the QR validity window,
        then mark enabled."""
        with self._db() as db:
            row = db.execute(
                "SELECT secret, provisioned_at FROM totp WHERE username = ?", (username,)
            ).fetchone()
        if not row:
            return False
        if time.time() - row["provisioned_at"] > self.provision_ttl:
            return False  # QR expired — call totp_provision again
        if not pyotp.TOTP(self._dec(row["secret"]), digits=self.TOTP_DIGITS).verify(
            str(code).replace(" ", ""), valid_window=1
        ):
            return False
        with self._db() as db:
            db.execute("UPDATE totp SET enabled = 1 WHERE username = ?", (username,))
        return True

    def totp_verify(self, username: str, code: str) -> bool:
        """Method 1 — verify a TOTP code at login (must be enabled)."""
        with self._db() as db:
            row = db.execute(
                "SELECT secret, enabled FROM totp WHERE username = ?", (username,)
            ).fetchone()
        if not row or not row["enabled"]:
            return False
        return pyotp.TOTP(self._dec(row["secret"]), digits=self.TOTP_DIGITS).verify(
            str(code).replace(" ", ""), valid_window=1
        )

    def totp_disable(self, username: str) -> None:
        with self._db() as db:
            db.execute("DELETE FROM totp WHERE username = ?", (username,))

    def totp_status(self, username: str) -> bool:
        with self._db() as db:
            row = db.execute(
                "SELECT enabled FROM totp WHERE username = ?", (username,)
            ).fetchone()
        return bool(row and row["enabled"])

    @staticmethod
    def _qr_data_uri(data: str) -> str:
        img = qrcode.make(data)
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        b64 = base64.b64encode(buf.getvalue()).decode()
        return f"data:image/png;base64,{b64}"

    # ══════════════════════════════════════════════════════
    #  Method 3 & 4 — WebAuthn  (phone fingerprint / Windows Hello)
    #  Same code path; both are *platform* authenticators. `label` lets the
    #  caller name the device (e.g. "iPhone", "Windows Hello").
    # ══════════════════════════════════════════════════════
    def webauthn_register_options(self, username: str) -> str:
        """Return registration options (JSON string) for the browser to pass to
        navigator.credentials.create(). Platform authenticator = built-in biometric."""
        existing = self._get_creds(username)
        opts = generate_registration_options(
            rp_id=self.rp_id,
            rp_name=self.rp_name,
            user_name=username,
            user_id=username.encode(),
            exclude_credentials=[
                PublicKeyCredentialDescriptor(id=base64url_to_bytes(c["credential_id"]))
                for c in existing
            ],
            authenticator_selection=AuthenticatorSelectionCriteria(
                authenticator_attachment=AuthenticatorAttachment.PLATFORM,
                resident_key=ResidentKeyRequirement.PREFERRED,
                user_verification=UserVerificationRequirement.REQUIRED,
            ),
        )
        self._put_challenge(username, opts.challenge)
        return options_to_json(opts)

    def webauthn_register_verify(self, username: str, credential, label: str | None = None) -> bool:
        """Verify navigator.credentials.create() result and store the credential.
        `credential` = the JSON (str or dict) the browser returned."""
        challenge = self._pop_challenge(username)
        verification = verify_registration_response(
            credential=credential,
            expected_challenge=challenge,
            expected_rp_id=self.rp_id,
            expected_origin=self.origin,
            require_user_verification=True,
        )
        with self._db() as db:
            db.execute(
                "INSERT OR REPLACE INTO webauthn_creds "
                "(username, credential_id, public_key, sign_count, label) VALUES (?, ?, ?, ?, ?)",
                (
                    username,
                    bytes_to_base64url(verification.credential_id),
                    bytes_to_base64url(verification.credential_public_key),
                    verification.sign_count,
                    label,
                ),
            )
        return True

    def webauthn_auth_options(self, username: str) -> str:
        """Return authentication options (JSON string) for navigator.credentials.get()."""
        creds = self._get_creds(username)
        if not creds:
            raise ValueError("no registered authenticator for this user")
        opts = generate_authentication_options(
            rp_id=self.rp_id,
            allow_credentials=[
                PublicKeyCredentialDescriptor(id=base64url_to_bytes(c["credential_id"]))
                for c in creds
            ],
            user_verification=UserVerificationRequirement.REQUIRED,
        )
        self._put_challenge(username, opts.challenge)
        return options_to_json(opts)

    def webauthn_auth_verify(self, username: str, credential) -> bool:
        """Verify navigator.credentials.get() result at login; bump the sign counter."""
        challenge = self._pop_challenge(username)
        cred_dict = credential if isinstance(credential, dict) else json.loads(credential)
        row = self._get_cred_by_id(cred_dict["id"])
        if not row or row["username"] != username:
            return False
        verification = verify_authentication_response(
            credential=credential,
            expected_challenge=challenge,
            expected_rp_id=self.rp_id,
            expected_origin=self.origin,
            credential_public_key=base64url_to_bytes(row["public_key"]),
            credential_current_sign_count=row["sign_count"],
            require_user_verification=True,
        )
        with self._db() as db:
            db.execute(
                "UPDATE webauthn_creds SET sign_count = ? WHERE credential_id = ?",
                (verification.new_sign_count, row["credential_id"]),
            )
        return True

    def webauthn_status(self, username: str) -> dict:
        creds = self._get_creds(username)
        return {
            "registered": len(creds) > 0,
            "devices": [{"label": c["label"], "created_at": c["created_at"]} for c in creds],
        }

    def _get_creds(self, username: str) -> list[dict]:
        with self._db() as db:
            return [dict(r) for r in db.execute(
                "SELECT * FROM webauthn_creds WHERE username = ?", (username,)
            ).fetchall()]

    def _get_cred_by_id(self, credential_id: str) -> dict | None:
        with self._db() as db:
            row = db.execute(
                "SELECT * FROM webauthn_creds WHERE credential_id = ?", (credential_id,)
            ).fetchone()
        return dict(row) if row else None


if __name__ == "__main__":
    # Quick offline self-test for the TOTP path (no browser needed).
    tf = TwoFactor(db_path=":memory:")
    info = tf.totp_provision("demo")
    print("otpauth URI:", info["uri"])
    code_now = pyotp.TOTP(info["secret"], digits=TwoFactor.TOTP_DIGITS).now()
    print("enable:", tf.totp_enable("demo", code_now))
    print("verify:", tf.totp_verify("demo", pyotp.TOTP(info["secret"], digits=TwoFactor.TOTP_DIGITS).now()))
    print("status:", tf.totp_status("demo"))
