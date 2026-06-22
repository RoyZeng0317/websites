from __future__ import annotations

import json
import os
import re
import tempfile
import time
from datetime import datetime
from pathlib import Path
from typing import Any

import anthropic
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

load_dotenv(Path(__file__).parent / "data" / ".env")

# ── Google TTS credentials (Render: JSON string → temp file) ──────────────
_gcp_json = os.getenv("GOOGLE_CREDENTIALS_JSON")
if _gcp_json and not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
    _gcp_tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False)
    _gcp_tmp.write(_gcp_json)
    _gcp_tmp.flush()
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = _gcp_tmp.name

# ── YouTube Music auth (Render: JSON string → temp file) ──────────────────
_ytm_headers_json = os.getenv("YTMUSIC_HEADERS_JSON")
_ytmusic: Any = None

if _ytm_headers_json:
    try:
        from ytmusicapi import YTMusic  # type: ignore
        _ytm_tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False)
        _ytm_tmp.write(_ytm_headers_json)
        _ytm_tmp.flush()
        _ytmusic = YTMusic(_ytm_tmp.name)
        print("[YTMusic] Authenticated OK")
    except Exception as e:
        print(f"[YTMusic] Auth failed: {e}")

# ── Stream URL cache: videoId → (url, expiry) ─────────────────────────────
_stream_cache: dict[str, tuple[str, float]] = {}

# ── App ───────────────────────────────────────────────────────────────────
app = FastAPI(title="Claudio AI Radio")

_raw_origins = os.getenv("ALLOWED_ORIGINS", "")
_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()] or ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_origin_regex=r"https://.*\.(web\.app|firebaseapp\.com)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MUSIC_DIR = Path(__file__).parent / "music"
TTS_DIR = Path(__file__).parent / "tts_cache"
MUSIC_DIR.mkdir(exist_ok=True)
TTS_DIR.mkdir(exist_ok=True)

app.mount("/music", StaticFiles(directory=str(MUSIC_DIR)), name="music")
app.mount("/tts", StaticFiles(directory=str(TTS_DIR)), name="tts")

_claude = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

DJ_SYSTEM = """你是 Claudio，一位充滿個人魅力的 AI 電台 DJ。風格特點：
- 語氣輕鬆活潑，幽默不失溫度
- 熱愛音樂，對各種曲風如數家珍
- 中英文自然切換，偶爾夾帶英文詞彙
- 每次回應不超過 60 字，簡潔有力
- 稱呼聽眾為「朋友們」或「親愛的聽眾」
- 充滿能量，像在真實直播一樣"""


# ── WebSocket manager ─────────────────────────────────────────────────────
class ConnectionManager:
    def __init__(self) -> None:
        self._connections: list[WebSocket] = []

    async def connect(self, ws: WebSocket) -> None:
        await ws.accept()
        self._connections.append(ws)

    def disconnect(self, ws: WebSocket) -> None:
        self._connections = [c for c in self._connections if c is not ws]

    async def broadcast(self, data: dict) -> None:
        dead: list[WebSocket] = []
        for ws in self._connections:
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)


manager = ConnectionManager()


# ── Helpers ───────────────────────────────────────────────────────────────
async def _tts(text: str) -> str | None:
    try:
        from google.cloud import texttospeech  # type: ignore

        client = texttospeech.TextToSpeechClient()
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code="cmn-TW",
            name="cmn-TW-Wavenet-A",
            ssml_gender=texttospeech.SsmlVoiceGender.MALE,
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=1.05,
            pitch=1.5,
            effects_profile_id=["headphone-class-device"],
        )
        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )
        fname = f"dj_{abs(hash(text)) % 999999:06d}.mp3"
        (TTS_DIR / fname).write_bytes(response.audio_content)
        return f"/tts/{fname}"
    except Exception as exc:
        print(f"[TTS] {exc}")
        return None


def _dj_say(prompt: str) -> str:
    resp = _claude.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=200,
        system=DJ_SYSTEM,
        messages=[{"role": "user", "content": prompt}],
    )
    return resp.content[0].text  # type: ignore[index]


def _parse_yt_track(t: dict) -> dict | None:
    video_id = t.get("videoId")
    if not video_id:
        return None
    thumbnails = t.get("thumbnails") or []
    art = thumbnails[-1]["url"] if thumbnails else None
    artists = t.get("artists") or []
    artist = ", ".join(a.get("name", "") for a in artists)
    return {
        "name": t.get("title", "Unknown"),
        "filename": video_id,
        "url": "",          # resolved on demand via /api/ytmusic/stream
        "artist": artist,
        "albumArt": art,
        "videoId": video_id,
    }


# ── Models ────────────────────────────────────────────────────────────────
class IntroRequest(BaseModel):
    song: str
    artist: str = ""


class ChatRequest(BaseModel):
    message: str


# ── Routes ────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {
        "status": "on-air",
        "dj": "Claudio",
        "ytmusic": _ytmusic is not None,
        "time": datetime.now().isoformat(),
    }


# Local music fallback
@app.get("/api/music")
def list_music():
    files = []
    for ext in ("*.mp3", "*.m4a", "*.ogg", "*.flac", "*.wav"):
        for f in sorted(MUSIC_DIR.glob(ext)):
            files.append({"name": f.stem, "filename": f.name, "url": f"/music/{f.name}"})
    return {"files": files}


# YouTube Music playlist
@app.get("/api/ytmusic/songs")
def get_ytmusic_songs(source: str = "history", limit: int = 50):
    if not _ytmusic:
        raise HTTPException(503, "YouTube Music not configured — set YTMUSIC_HEADERS_JSON")

    try:
        if source == "liked":
            data = _ytmusic.get_liked_songs(limit=limit)
            raw_tracks = data.get("tracks", [])
        elif source == "history":
            raw_tracks = _ytmusic.get_history()[:limit]
        else:
            raise HTTPException(400, "source must be 'liked' or 'history'")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"YTMusic error: {e}")

    tracks = [t for t in (_parse_yt_track(r) for r in raw_tracks) if t]
    return {"files": tracks, "source": source}


# Get audio stream URL for a YouTube video (cached 5 h)
@app.get("/api/ytmusic/stream/{video_id}")
def get_stream_url(video_id: str):
    cached_url, expiry = _stream_cache.get(video_id, ("", 0.0))
    if cached_url and time.time() < expiry:
        return {"url": cached_url}

    try:
        import yt_dlp  # type: ignore

        ydl_opts = {
            "format": "bestaudio[ext=m4a]/bestaudio[acodec=opus]/bestaudio/best",
            "quiet": True,
            "no_warnings": True,
            "extractor_args": {"youtube": {"skip": ["dash", "hls"]}},
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(
                f"https://www.youtube.com/watch?v={video_id}",
                download=False,
            )
        url = info["url"]
        # YouTube URLs typically expire in 6 h; cache for 5 h
        _stream_cache[video_id] = (url, time.time() + 5 * 3600)
        return {"url": url}
    except Exception as e:
        raise HTTPException(500, f"yt-dlp error: {e}")


@app.post("/api/dj/intro")
async def dj_intro(req: IntroRequest):
    artist_part = f"由 {req.artist} 演唱" if req.artist else ""
    script = _dj_say(f"為接下來播放的歌曲《{req.song}》{artist_part}寫一段 DJ 介紹詞，約 30-50 字。")
    audio_url = await _tts(script)
    return {"script": script, "audio_url": audio_url}


@app.post("/api/dj/chat")
async def dj_chat(req: ChatRequest):
    script = _dj_say(f"聽眾說：{req.message}")
    audio_url = await _tts(script)
    payload = {
        "type": "chat_reply",
        "text": script,
        "audio_url": audio_url,
        "timestamp": datetime.now().isoformat(),
    }
    await manager.broadcast(payload)
    return payload


@app.post("/api/program/generate")
async def generate_program():
    h = datetime.now().hour
    period = "早晨" if 5 <= h < 12 else "下午" if 12 <= h < 18 else "傍晚" if 18 <= h < 22 else "深夜"
    raw = _dj_say(
        f"現在是{period}，用繁體中文生成接下來 3 個節目段落，"
        '以 JSON 回應：{"program":[{"name":"...","theme":"...","description":"...","duration":"30分鐘"}]}'
    )
    m = re.search(r"\{[\s\S]*\}", raw)
    if m:
        try:
            return json.loads(m.group())
        except json.JSONDecodeError:
            pass
    return {
        "program": [
            {"name": "Claudio 精選", "theme": "流行", "description": "最新流行音樂精選", "duration": "30分鐘"},
            {"name": "午夜迴廊", "theme": "爵士", "description": "深夜爵士慢搖", "duration": "30分鐘"},
            {"name": "晨間活力", "theme": "電子", "description": "早晨電子音樂提神", "duration": "30分鐘"},
        ]
    }


@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await manager.connect(ws)
    try:
        await ws.send_json({
            "type": "welcome",
            "message": "歡迎收聽 Claudio AI 電台！",
            "timestamp": datetime.now().isoformat(),
        })
        while True:
            data = await ws.receive_json()
            t = data.get("type")
            if t == "song_ended":
                next_song = data.get("next_song", {})
                if next_song:
                    intro = await dj_intro(
                        IntroRequest(
                            song=next_song.get("name", ""),
                            artist=next_song.get("artist", ""),
                        )
                    )
                    await manager.broadcast({
                        "type": "dj_intro",
                        "script": intro["script"],
                        "audio_url": intro["audio_url"],
                        "next_song": next_song,
                    })
            elif t == "now_playing":
                await manager.broadcast({
                    "type": "now_playing",
                    "song": data.get("song"),
                    "timestamp": datetime.now().isoformat(),
                })
    except WebSocketDisconnect:
        manager.disconnect(ws)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
