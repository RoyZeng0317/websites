import { useState, useEffect, useRef, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  startAuthentication,
  startRegistration,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser'
import { apiJson, apiFetch, downloadUrl } from '../lib/api'
import { loadPrefs, savePrefs } from '../lib/prefs'

interface Props { onClose: () => void }

interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: number
}

interface DlJob {
  id: string
  status: 'pending' | 'running' | 'done' | 'error'
  progress: number
  title: string
  filename: string
  error: string
}

const DEFAULT_PATH = 'sda1/Telegram'
const AUTO_LOCK_MS = 10 * 60 * 1000
const VIDEO_EXTS = new Set(['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v', '3gp', 'ts'])
const MP4_QUALITIES = [
  { label: 'Best Quality', value: 'best' },
  { label: '1080p',    value: '1080' },
  { label: '720p',     value: '720'  },
  { label: '480p',     value: '480'  },
]

function isVideo(name: string) {
  return VIDEO_EXTS.has(name.split('.').pop()?.toLowerCase() ?? '')
}
function videoTitle(name: string) {
  return name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
}

type Screen = 'init' | 'locked' | 'unlocked'
type AuthMode = 'fingerprint' | 'totp'

// ── Telegram icon (paper plane) ─────────────────────────────
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

export default function TelegramReels({ onClose }: Props) {
  // ── Auth state ──
  const [screen, setScreen] = useState<Screen>('init')
  const [authMode, setAuthMode] = useState<AuthMode>('fingerprint')
  const [totpCode, setTotpCode] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState('')
  const [hasCredential, setHasCred] = useState(false)

  // ── Player state ──
  const [telegramPath, setTelegramPath] = useState(DEFAULT_PATH)
  const [videos, setVideos] = useState<FileItem[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [liked, setLiked] = useState<Set<string>>(() => new Set())
  const [showLikeAnim, setShowLikeAnim] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const [slideDir, setSlideDir] = useState<'up' | 'down'>('up')
  const [progress, setProgress] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [pathDraft, setPathDraft] = useState(telegramPath)
  const [uploading, setUploading] = useState(false)
  const [collected, setCollected] = useState<Set<string>>(() => new Set())
  const [volHint, setVolHint] = useState<number | null>(null)

  // ── Download state ──
  const [showDownload, setShowDownload] = useState(false)
  const [dlUrl, setDlUrl] = useState('')
  const [dlQuality, setDlQuality] = useState('best')
  const [dlJobs, setDlJobs] = useState<DlJob[]>([])
  const dlPollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartY = useRef(0)
  const touchMoved = useRef(false)
  const lastTapTime = useRef(0)
  const currentRef = useRef(current)
  const videosLenRef = useRef(videos.length)
  const telegramPathRef = useRef(telegramPath)
  const videosRef = useRef<FileItem[]>(videos)
  const volumeRef = useRef(1)
  const volHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  currentRef.current = current
  videosLenRef.current = videos.length
  telegramPathRef.current = telegramPath
  videosRef.current = videos

  // ── Inject keyframes ──
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'tgreels-keyframes'
    style.textContent = `
      @keyframes tg-slide-up   { from { transform:translateY(60px);  opacity:0 } to { transform:translateY(0); opacity:1 } }
      @keyframes tg-slide-down { from { transform:translateY(-60px); opacity:0 } to { transform:translateY(0); opacity:1 } }
      @keyframes tg-heart-pop  { 0%{transform:scale(0) rotate(-20deg);opacity:0} 40%{transform:scale(1.5) rotate(8deg);opacity:1} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
    `
    document.head.appendChild(style)
    return () => document.getElementById('tgreels-keyframes')?.remove()
  }, [])

  // ── Init: check WebAuthn status ──
  useEffect(() => {
    apiJson<{ registered: boolean }>('/api/locker/webauthn/status')
      .then(d => setHasCred(d.registered))
      .catch(() => {})
      .finally(() => setScreen('locked'))
    return () => stopMobilePoll()
  }, [])

  // ── Mobile signal polling when locked ──
  useEffect(() => {
    if (screen === 'locked') startMobilePoll()
    else stopMobilePoll()
  }, [screen])

  // ── Load prefs on unlock ──
  useEffect(() => {
    if (screen !== 'unlocked') return
    loadPrefs().then(prefs => {
      const p = prefs.telegram_path ?? DEFAULT_PATH
      setTelegramPath(p); setPathDraft(p)
      if (prefs.telegram_liked) setLiked(new Set(prefs.telegram_liked))
      if (prefs.telegram_collected) setCollected(new Set(prefs.telegram_collected))
    })
  }, [screen])

  // ── Load videos when unlocked ──
  useEffect(() => {
    if (screen === 'unlocked') loadVideos()
  }, [screen, telegramPath])

  // ── Sync volume when video element remounts ──
  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volumeRef.current
  }, [animKey])

  // ── Video event listeners ──
  const goTo = useCallback((idx: number, dir: 'up' | 'down') => {
    if (idx < 0 || idx >= videosLenRef.current) return
    setSlideDir(dir); setAnimKey(k => k + 1); setCurrent(idx); setProgress(0)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    function onTime() { if (video!.duration) setProgress(video!.currentTime / video!.duration) }
    function onEnd() { goTo(currentRef.current + 1, 'up') }
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('ended', onEnd)
    return () => { video.removeEventListener('timeupdate', onTime); video.removeEventListener('ended', onEnd) }
  }, [animKey, goTo])

  // ── Auto-lock ──
  const resetLockTimer = useCallback(() => {
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
    lockTimerRef.current = setTimeout(() => setScreen('locked'), AUTO_LOCK_MS)
  }, [])

  useEffect(() => {
    if (screen !== 'unlocked') return
    resetLockTimer()
    window.addEventListener('pointermove', resetLockTimer)
    window.addEventListener('keydown', resetLockTimer)
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
      window.removeEventListener('pointermove', resetLockTimer)
      window.removeEventListener('keydown', resetLockTimer)
    }
  }, [screen, resetLockTimer])

  // ── Keyboard navigation ──
  useEffect(() => {
    if (screen !== 'unlocked') return
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      const v = videoRef.current
      if (e.key === 'Escape' && !showSettings && !showDownload) onClose()
      if (e.key === 'ArrowDown' || e.key === 's') { e.preventDefault(); goTo(currentRef.current + 1, 'up') }
      if (e.key === 'ArrowUp'   || e.key === 'w') { e.preventDefault(); goTo(currentRef.current - 1, 'down') }
      if (e.key === ' ')                           { e.preventDefault(); togglePlay() }
      if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); if (v) v.currentTime = Math.max(0, v.currentTime - 5) }
      if (e.key === 'ArrowRight'|| e.key === 'd') { e.preventDefault(); if (v) v.currentTime = Math.min(v.duration || 0, v.currentTime + 5) }
      if (e.key === '+' || e.key === '_') {
        e.preventDefault()
        const delta = e.key === '+' ? 0.1 : -0.1
        const next = Math.min(1, Math.max(0, Math.round((volumeRef.current + delta) * 10) / 10))
        volumeRef.current = next
        if (v) v.volume = next
        if (volHintTimer.current) clearTimeout(volHintTimer.current)
        setVolHint(next)
        volHintTimer.current = setTimeout(() => setVolHint(null), 1200)
      }
      if (e.key === 'm') setMuted(m => !m)
      if (e.key === 'l') toggleLike()
      if (e.key === 'c') toggleCollect()
      if (e.key === 'f') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [screen, showSettings, showDownload, goTo, onClose])

  // ── Download job polling ──
  useEffect(() => {
    if (!showDownload) { if (dlPollRef.current) { clearInterval(dlPollRef.current); dlPollRef.current = null } return }
    function poll() {
      apiJson<DlJob[]>('/api/ytdl/jobs').then(jobs => {
        const myJobs = jobs.filter(j => (j as any).destPath === telegramPathRef.current)
        setDlJobs(myJobs.slice(0, 10))
        if (myJobs.some(j => j.status === 'done')) loadVideos()
      }).catch(() => {})
    }
    poll()
    dlPollRef.current = setInterval(poll, 2000)
    return () => { if (dlPollRef.current) { clearInterval(dlPollRef.current); dlPollRef.current = null } }
  }, [showDownload])

  // ── Mobile signal polling ──
  function stopMobilePoll() {
    if (pollTimerRef.current) { clearInterval(pollTimerRef.current); pollTimerRef.current = null }
  }
  function startMobilePoll() {
    stopMobilePoll()
    pollTimerRef.current = setInterval(async () => {
      try {
        const r = await apiJson<{ ready: boolean }>('/api/telegram/mobile-signal')
        if (r.ready) { stopMobilePoll(); setScreen('unlocked') }
      } catch { /* keep polling */ }
    }, 2000)
  }

  async function ensureFolder(folderPath: string) {
    const parts = folderPath.split('/'); const name = parts.pop()!; const parent = parts.join('/')
    await apiJson('/api/files/mkdir', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: parent, name }),
    })
  }

  async function loadVideos() {
    setLoading(true)
    await ensureFolder(telegramPath).catch((e: Error) => {
      if (!e.message.includes('exist') && !e.message.includes('EACCES') && !e.message.includes('permission denied'))
        toast.error(`Failed to create folder: ${e.message}`)
    })
    try {
      const data = await apiJson<{ items: FileItem[] }>(`/api/files?path=${encodeURIComponent(telegramPath)}`)
      setVideos(data.items.filter(f => f.type === 'file' && isVideo(f.name)))
      setCurrent(0); setProgress(0)
    } catch (e) { toast.error((e as Error).message) }
    setLoading(false)
  }

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) } else { v.pause(); setPlaying(false) }
  }

  function handleDoubleTap() {
    const vid = videos[currentRef.current]; if (!vid) return
    const key = `${telegramPath}/${vid.name}`
    setLiked(prev => { const next = new Set(prev); next.add(key); savePrefs({ telegram_liked: [...next] }); return next })
    setShowLikeAnim(true); setTimeout(() => setShowLikeAnim(false), 900)
  }

  function toggleLike() {
    const vid = videosRef.current[currentRef.current]; if (!vid) return
    const key = `${telegramPathRef.current}/${vid.name}`
    setLiked(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else { setShowLikeAnim(true); setTimeout(() => setShowLikeAnim(false), 900); next.add(key) }
      savePrefs({ telegram_liked: [...next] }); return next
    })
  }

  function toggleCollect() {
    const vid = videosRef.current[currentRef.current]; if (!vid) return
    const key = `${telegramPathRef.current}/${vid.name}`
    setCollected(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      savePrefs({ telegram_collected: [...next] }); return next
    })
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen().catch(() => {})
    else document.exitFullscreen().catch(() => {})
  }

  // ── Touch handlers ──
  function onTouchStart(e: React.TouchEvent) { touchStartY.current = e.touches[0].clientY; touchMoved.current = false }
  function onTouchMove(e: React.TouchEvent) { if (Math.abs(e.touches[0].clientY - touchStartY.current) > 8) touchMoved.current = true }
  function onTouchEnd(e: React.TouchEvent) {
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dy) > 70) {
      if (dy < 0) goTo(current + 1, 'up'); else goTo(current - 1, 'down')
    } else if (!touchMoved.current) {
      const now = Date.now()
      if (now - lastTapTime.current < 350) { handleDoubleTap(); lastTapTime.current = 0 }
      else { const t = now; lastTapTime.current = t; setTimeout(() => { if (lastTapTime.current === t) { togglePlay(); lastTapTime.current = 0 } }, 300) }
    }
  }
  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    if (e.deltaY > 40) goTo(current + 1, 'up'); else if (e.deltaY < -40) goTo(current - 1, 'down')
  }

  // ── Auth helpers ──
  async function handleRegister() {
    if (!browserSupportsWebAuthn()) { setAuthError('Browser does not support biometrics'); return }
    setAuthBusy(true); setAuthError('')
    try {
      const options = await apiJson<Parameters<typeof startRegistration>[0]['optionsJSON']>(
        `/api/locker/webauthn/register-options?origin=${encodeURIComponent(window.location.origin)}`
      )
      const response = await startRegistration({ optionsJSON: options })
      await apiJson('/api/locker/webauthn/register-verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response, deviceName: navigator.userAgentData?.platform ?? 'Unknown' }),
      })
      setHasCred(true); setScreen('unlocked'); toast.success('Fingerprint set up')
    } catch (e) { setAuthError((e as Error).message) }
    setAuthBusy(false)
  }

  async function handleAuth() {
    if (!browserSupportsWebAuthn()) { setAuthError('Browser does not support biometrics'); return }
    setAuthBusy(true); setAuthError('')
    try {
      const options = await apiJson<Parameters<typeof startAuthentication>[0]['optionsJSON']>(
        `/api/locker/webauthn/auth-options?origin=${encodeURIComponent(window.location.origin)}`
      )
      const response = await startAuthentication({ optionsJSON: options })
      await apiJson('/api/locker/webauthn/auth-verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response }),
      })
      setScreen('unlocked')
    } catch (e) {
      const msg = (e as Error).message ?? ''
      setAuthError(msg === 'no_credential' ? 'No fingerprint set up. Please set one first.' : msg)
    }
    setAuthBusy(false)
  }

  async function handleTotpUnlock() {
    const code = totpCode.replace(/\s/g, '')
    if (code.length !== 6) { setAuthError('Enter 6 digits'); return }
    setAuthBusy(true); setAuthError('')
    try {
      await apiJson('/api/locker/unlock', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      setTotpCode(''); setScreen('unlocked')
    } catch (e) { setAuthError((e as Error).message) }
    setAuthBusy(false)
  }

  async function handleUpload(files: FileList) {
    setUploading(true)
    let ok = 0, fail = 0
    for (const file of Array.from(files)) {
      try {
        const form = new FormData()
        form.append('files', file); form.append('path', telegramPath)
        const res = await apiFetch('/api/files/upload', { method: 'POST', body: form })
        if (res.ok) ok++; else fail++
      } catch { fail++ }
    }
    setUploading(false)
    if (ok)   toast.success(`${ok} videos uploaded`)
    if (fail) toast.error(`${fail} failed`)
    loadVideos()
  }

  async function handleDownloadUrl() {
    const url = dlUrl.trim()
    if (!url) return
    if (!url.startsWith('http')) { toast.error('Please enter a full https:// URL'); return }
    try {
      await apiJson('/api/ytdl/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, format: 'mp4', quality: dlQuality, destPath: telegramPath }),
      })
      setDlUrl('')
      toast.success('Added to download queue')
    } catch (e) { toast.error((e as Error).message) }
  }

  function applyPath() {
    const p = pathDraft.trim().replace(/^\/+|\/+$/g, '')
    if (!p) return
    savePrefs({ telegram_path: p }); setTelegramPath(p); setShowSettings(false)
    toast.success('Path updated')
  }

  const currentVideo = videos[current]
  const likeKey = currentVideo ? `${telegramPath}/${currentVideo.name}` : ''
  const isLiked = liked.has(likeKey)
  const isCollected = collected.has(likeKey)

  // ── Render: init ──
  if (screen === 'init') return null

  // ── Render: lock screen ──
  if (screen === 'locked') return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-900/50">
          <TelegramIcon className="w-10 h-10 text-white" />
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-lg">Private Telegram Videos</p>
          <p className="text-gray-500 text-sm mt-0.5">
            {authMode === 'fingerprint' ? 'Fingerprint / Face ID' : 'Enter code to unlock'}
          </p>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1">
        {(['fingerprint', 'totp'] as const).map(mode => (
          <button key={mode}
            onClick={() => { setAuthMode(mode); setAuthError('') }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              authMode === mode
                ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {mode === 'fingerprint' ? (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" /></svg>Fingerprint</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3"/></svg>Code</>
            )}
          </button>
        ))}
      </div>

      {/* Auth actions */}
      <div className="w-64 flex flex-col items-center gap-4">
        {authMode === 'fingerprint' ? (
          hasCredential ? (
            <button onClick={handleAuth} disabled={authBusy}
              className="w-full py-4 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-60 text-white font-semibold text-base shadow-xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center gap-3">
              {authBusy
                ? <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/><span>Verifying…</span></>
                : <><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"/></svg><span>Unlock with Fingerprint</span></>
              }
            </button>
          ) : (
            <button onClick={handleRegister} disabled={authBusy}
              className="w-full py-4 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-60 text-white font-semibold text-base shadow-xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center gap-3">
              {authBusy ? <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/><span>Setting up…</span></> : <span>Set Up Fingerprint</span>}
            </button>
          )
        ) : (
          <div className="w-full space-y-3">
            <p className="text-xs text-gray-500 text-center">Enter the code from NAS Auth App</p>
            <input
              type="text" inputMode="numeric" maxLength={7} placeholder="000 000"
              value={totpCode} autoFocus
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 6)
                setTotpCode(raw.length > 3 ? `${raw.slice(0,3)} ${raw.slice(3)}` : raw)
                setAuthError('')
              }}
              onKeyDown={e => e.key === 'Enter' && handleTotpUnlock()}
              className="w-full bg-gray-900 border border-gray-700 focus:border-sky-500 rounded-2xl px-4 py-4 text-white text-3xl font-bold tracking-[0.3em] text-center focus:outline-none transition-colors font-mono"
            />
            <button onClick={handleTotpUnlock}
              disabled={authBusy || totpCode.replace(/\s/g,'').length !== 6}
              className="w-full py-4 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-40 text-white font-semibold text-base shadow-xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center">
              {authBusy ? 'Verifying…' : 'Confirm'}
            </button>
          </div>
        )}
        {authError && <p className="text-sm text-red-400 text-center whitespace-pre-line">{authError}</p>}
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-xs text-gray-600">Or unlock automatically with NAS App fingerprint</p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"/>
          <span className="text-[11px] text-gray-600">Waiting for mobile authorization…</span>
        </div>
      </div>

      <button onClick={onClose} className="absolute bottom-8 text-sm text-gray-700 hover:text-gray-500 transition-colors">
        Cancel
      </button>
    </div>
  )

  // ── Render: unlocked player ──
  return (
    <>
      <div ref={containerRef} className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2">
            <TelegramIcon className="w-5 h-5 text-sky-400" />
            <p className="text-white font-bold text-base pointer-events-none">Telegram Videos</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleFullscreen} title="Fullscreen (F)"
              className="w-9 h-9 hidden lg:flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>
            </button>
            {/* Download from URL */}
            <button onClick={() => setShowDownload(true)} title="Download Video"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-sky-400 hover:bg-black/60 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
            </button>
            {/* Upload */}
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} title="Upload Video"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
              {uploading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
              }
            </button>
            <button onClick={() => setScreen('locked')} title="Lock"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
            </button>
            <button onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"/>
            <p className="text-gray-500 text-sm">Loading videos…</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center gap-5 text-center px-8">
            <div className="w-24 h-24 rounded-3xl bg-gray-900 border border-gray-800 flex items-center justify-center">
              <TelegramIcon className="w-12 h-12 text-gray-700" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">No videos yet</p>
              <p className="text-gray-500 text-sm mt-1">Download or upload to <span className="text-sky-400 font-mono text-xs">{telegramPath}</span></p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDownload(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white font-medium text-sm transition-all hover:opacity-90 active:scale-95">
                Download Video
              </button>
              <button onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-200 text-sm hover:bg-gray-700 transition-colors">
                Upload Video
              </button>
            </div>
          </div>
        ) : (
          <div
            className="relative w-full h-full max-w-[480px] mx-auto overflow-hidden"
            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onWheel={onWheel}
          >
            {/* Video */}
            <video
              key={animKey} ref={videoRef}
              src={downloadUrl(`${telegramPath}/${currentVideo!.name}`)}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ animation: `tg-slide-${slideDir} 0.28s ease` }}
              autoPlay loop={false} playsInline muted={muted}
              onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
            />

            {/* Pause indicator */}
            {!playing && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            )}

            {/* Volume hint */}
            {volHint !== null && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2.5">
                  <span className="text-white text-sm">{volHint === 0 ? '🔇' : volHint < 0.5 ? '🔉' : '🔊'}</span>
                  <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full transition-all" style={{ width: `${volHint * 100}%` }} />
                  </div>
                  <span className="text-white text-xs font-mono w-8 text-right">{Math.round(volHint * 100)}%</span>
                </div>
              </div>
            )}

            {/* Double-tap heart */}
            {showLikeAnim && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <svg className="w-28 h-28 text-sky-400 drop-shadow-2xl"
                  style={{ animation: 'tg-heart-pop 0.85s ease forwards' }}
                  fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            )}

            {/* Right sidebar */}
            <div className="absolute right-3 bottom-24 z-10 flex flex-col items-center gap-5">
              {/* Like */}
              <button onClick={toggleLike} className="flex flex-col items-center gap-1">
                <div className={`w-11 h-11 flex items-center justify-center rounded-full transition-all ${isLiked ? 'scale-110' : 'bg-black/20'}`}>
                  <svg className={`w-7 h-7 drop-shadow-lg transition-all duration-200 ${isLiked ? 'text-sky-400 scale-110' : 'text-white'}`}
                    fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                  </svg>
                </div>
                <span className="text-white text-[11px] font-medium drop-shadow">{isLiked ? 'Liked' : 'Like'}</span>
              </button>

              {/* Collect */}
              <button onClick={toggleCollect} className="flex flex-col items-center gap-1">
                <div className={`w-11 h-11 flex items-center justify-center rounded-full transition-all ${isCollected ? 'scale-110' : 'bg-black/20'}`}>
                  <svg className={`w-7 h-7 drop-shadow-lg transition-all duration-200 ${isCollected ? 'text-yellow-400 scale-110' : 'text-white'}`}
                    fill={isCollected ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
                  </svg>
                </div>
                <span className="text-white text-[11px] drop-shadow">{isCollected ? 'Saved' : 'Save'}</span>
              </button>

              {/* Mute */}
              <button onClick={() => setMuted(m => !m)} className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 flex items-center justify-center rounded-full bg-black/30">
                  {muted
                    ? <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"/></svg>
                    : <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"/></svg>
                  }
                </div>
                <span className="text-white text-[11px] drop-shadow">{muted ? 'Muted' : 'Sound'}</span>
              </button>

              {/* Settings */}
              <button onClick={() => { setPathDraft(telegramPath); setShowSettings(true) }} className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 flex items-center justify-center rounded-full bg-black/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a7.723 7.723 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <span className="text-white text-[11px] drop-shadow">Settings</span>
              </button>
            </div>

            {/* Bottom info + progress */}
            <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pt-12 pb-5">
              <p className="text-white font-semibold text-sm mb-0.5 drop-shadow truncate">{videoTitle(currentVideo!.name)}</p>
              <p className="text-gray-400 text-xs mb-3">{current + 1} / {videos.length}</p>
              <div className="w-full h-0.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/90 rounded-full transition-all duration-100" style={{ width: `${progress * 100}%` }}/>
              </div>
            </div>

            {/* Desktop nav buttons */}
            <button onClick={() => goTo(current - 1, 'down')} disabled={current === 0}
              className="absolute left-1/2 -translate-x-1/2 top-14 z-10 w-9 h-9 rounded-full bg-black/30 text-white hidden lg:flex items-center justify-center disabled:opacity-0 hover:bg-black/50 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 15.75l7.5-7.5 7.5 7.5" transform="rotate(180 12 12)"/></svg>
            </button>
            <button onClick={() => goTo(current + 1, 'up')} disabled={current >= videos.length - 1}
              className="absolute left-1/2 -translate-x-1/2 bottom-24 z-10 w-9 h-9 rounded-full bg-black/30 text-white hidden lg:flex items-center justify-center disabled:opacity-0 hover:bg-black/50 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* Settings sheet */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={() => setShowSettings(false)}>
          <div className="w-full max-w-sm bg-gray-900 border-t border-gray-800 rounded-t-3xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-white font-semibold text-lg">Video Folder Settings</h2>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Video Path</label>
              <div className="flex gap-2">
                <input value={pathDraft} onChange={e => setPathDraft(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && applyPath()}
                  placeholder="sda1/Telegram"
                  className="flex-1 bg-gray-800 border border-gray-700 focus:border-sky-500 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none transition-colors"/>
                <button onClick={applyPath} className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors">Apply</button>
              </div>
              <p className="text-xs text-gray-600">Current: <span className="text-gray-400 font-mono">{telegramPath}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Download sheet */}
      {showDownload && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={() => setShowDownload(false)}>
          <div className="w-full max-w-sm bg-gray-900 border-t border-gray-800 rounded-t-3xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg">Download Telegram Video</h2>
              <button onClick={() => setShowDownload(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* URL input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Telegram Link</label>
              <input value={dlUrl} onChange={e => setDlUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDownloadUrl()}
                placeholder="https://t.me/channel/123"
                className="w-full bg-gray-800 border border-gray-700 focus:border-sky-500 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none transition-colors"/>
              <p className="text-xs text-gray-600">Supports public channel video links, downloaded via yt-dlp</p>
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Quality</label>
              <div className="flex gap-2 flex-wrap">
                {MP4_QUALITIES.map(q => (
                  <button key={q.value} onClick={() => setDlQuality(q.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      dlQuality === q.value
                        ? 'bg-sky-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}>{q.label}</button>
                ))}
              </div>
            </div>

            <button onClick={handleDownloadUrl} disabled={!dlUrl.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-40 text-white font-semibold text-sm transition-all active:scale-95">
              Start Download
            </button>

            {/* Recent jobs */}
            {dlJobs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <p className="text-xs text-gray-500">Download History</p>
                {dlJobs.map(j => (
                  <div key={j.id} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      j.status === 'done' ? 'bg-green-400' :
                      j.status === 'error' ? 'bg-red-400' :
                      j.status === 'running' ? 'bg-sky-400 animate-pulse' :
                      'bg-gray-500'
                    }`}/>
                    <p className="text-xs text-gray-400 truncate flex-1">
                      {j.title || j.filename || j.url.slice(0, 40)}
                    </p>
                    {j.status === 'running' && (
                      <span className="text-xs text-sky-400 shrink-0">{j.progress}%</span>
                    )}
                    {j.status === 'error' && (
                      <span className="text-xs text-red-400 shrink-0" title={j.error}>Failed</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* File input */}
      <input ref={fileInputRef} type="file" multiple accept="video/*" className="hidden"
        onChange={e => { if (e.target.files) handleUpload(e.target.files); e.target.value = '' }}/>
    </>
  )
}
