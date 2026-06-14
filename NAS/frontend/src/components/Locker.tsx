import { useState, useEffect, useRef, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser'
import { apiJson, apiFetch, downloadUrl } from '../lib/api'
import { loadPrefs, savePrefs } from '../lib/prefs'

interface Props {
  onClose: () => void
}

interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: number
  modified?: string
}

interface Device {
  id: number
  device_name: string | null
  created_at: string
}

const LOCKER_PATH_KEY  = 'locker_path'
const DEFAULT_PATH     = 'sda1/Private'
const AUTO_LOCK_MS     = 5 * 60 * 1000

const IMAGE_EXTS = new Set(['jpg','jpeg','png','gif','webp','heic','bmp','tiff','avif'])
const VIDEO_EXTS = new Set(['mp4','mov','avi','mkv','webm','m4v','3gp'])

function extOf(name: string) { return name.split('.').pop()?.toLowerCase() ?? '' }
function isMedia(name: string) { return IMAGE_EXTS.has(extOf(name)) || VIDEO_EXTS.has(extOf(name)) }
function isVideo(name: string) { return VIDEO_EXTS.has(extOf(name)) }

// ── Fingerprint icon SVG ─────────────────────────────────────────────

function FingerprintIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
    </svg>
  )
}

// ── Lightbox ─────────────────────────────────────────────────────────

function Lightbox({ items, index, lockerPath, onClose, onGo }: {
  items: FileItem[]
  index: number
  lockerPath: string
  onClose: () => void
  onGo: (i: number) => void
}) {
  const item = items[index]
  const url  = downloadUrl(`${lockerPath}/${item.name}`)
  const vid  = isVideo(item.name)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')                                     onClose()
      else if (e.key === 'ArrowLeft'  && index > 0)              onGo(index - 1)
      else if (e.key === 'ArrowRight' && index < items.length-1) onGo(index + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, items.length, onClose, onGo])

  return (
    <div className="fixed inset-0 z-[200] bg-black/96 flex items-center justify-center" onClick={onClose}>
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
        <span className="text-sm text-gray-300 truncate max-w-xs">{item.name}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{index + 1} / {items.length}</span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-white hover:bg-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      {index > 0 && (
        <button onClick={e => { e.stopPropagation(); onGo(index-1) }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-xl bg-black/50 hover:bg-black/70 text-white flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </button>
      )}
      {index < items.length-1 && (
        <button onClick={e => { e.stopPropagation(); onGo(index+1) }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-xl bg-black/50 hover:bg-black/70 text-white flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>
      )}
      <div className="max-w-[92vw] max-h-[88vh] flex items-center" onClick={e => e.stopPropagation()}>
        {vid
          ? <video src={url} controls autoPlay className="max-w-full max-h-[88vh] rounded-lg"/>
          : <img src={url} alt={item.name} className="max-w-full max-h-[88vh] object-contain rounded-lg select-none"/>
        }
      </div>
      {items.length > 1 && (
        <div className="absolute bottom-0 inset-x-0 flex justify-center pb-4 pt-8 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex gap-1.5 overflow-x-auto max-w-[90vw] px-2" onClick={e => e.stopPropagation()}>
            {items.map((it, i) => (
              <button key={it.name} onClick={() => onGo(i)}
                className={`shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                  i === index ? 'border-orange-400 scale-105' : 'border-transparent opacity-60 hover:opacity-90'
                }`}>
                {isVideo(it.name)
                  ? <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  : <img src={downloadUrl(`${lockerPath}/${it.name}`)} alt="" className="w-full h-full object-cover" loading="lazy"/>
                }
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Media tile ────────────────────────────────────────────────────────

function MediaTile({ item, lockerPath, onClick, onDelete }: {
  item: FileItem; lockerPath: string; onClick: () => void; onDelete: () => void
}) {
  const [menu, setMenu] = useState(false)
  const url = downloadUrl(`${lockerPath}/${item.name}`)
  const vid = isVideo(item.name)

  return (
    <div className="relative group aspect-square rounded-xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all cursor-pointer">
      {vid
        ? <video src={url} className="w-full h-full object-cover pointer-events-none" preload="metadata"/>
        : <img src={url} alt={item.name} className="w-full h-full object-cover" loading="lazy"/>
      }
      {vid && (
        <div className="absolute top-1.5 left-1.5 pointer-events-none bg-black/60 rounded px-1.5 py-0.5 flex items-center gap-1">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      )}
      <div className="absolute inset-0 group-hover:bg-black/10 transition-colors" onClick={onClick}/>
      <button onClick={e => { e.stopPropagation(); setMenu(v => !v) }}
        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/80">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
        </svg>
      </button>
      {menu && (
        <div className="absolute top-9 right-1.5 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-10 py-1 min-w-[100px]" onClick={e => e.stopPropagation()}>
          <button onClick={() => { setMenu(false); onClick() }} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            查看
          </button>
          <button onClick={() => { setMenu(false); onDelete() }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            移至垃圾桶
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Locker ───────────────────────────────────────────────────────

type Screen = 'init' | 'locked' | 'unlocked' | 'settings'
type LockMode = 'fingerprint' | 'totp' | 'mobile'

export default function Locker({ onClose }: Props) {
  const [screen, setScreen]         = useState<Screen>('init')
  const [lockMode, setLockMode]     = useState<LockMode>('fingerprint')
  const [totpCode, setTotpCode]     = useState('')
  const [authBusy, setAuthBusy]     = useState(false)
  const [authError, setAuthError]   = useState('')
  const [hasCredential, setHasCred] = useState(false)
  const [devices, setDevices]       = useState<Device[]>([])
  const [lockerPath, setLockerPath] = useState(DEFAULT_PATH)
  const [pathDraft, setPathDraft]   = useState(DEFAULT_PATH)
  const [items, setItems]           = useState<FileItem[]>([])
  const [loading, setLoading]       = useState(false)
  const [lightbox, setLightbox]     = useState<number | null>(null)
  const [uploading, setUploading]   = useState(false)
  const [mobileCountdown, setMobileCountdown] = useState(0)
  const fileInputRef  = useRef<HTMLInputElement>(null)
  const lockTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null)
  const cdTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  function stopMobilePoll() {
    if (pollTimerRef.current) { clearInterval(pollTimerRef.current); pollTimerRef.current = null }
    if (cdTimerRef.current)   { clearInterval(cdTimerRef.current);   cdTimerRef.current = null }
  }

  function startMobilePoll() {
    stopMobilePoll()
    setMobileCountdown(60)
    cdTimerRef.current = setInterval(() => {
      setMobileCountdown(n => {
        if (n <= 1) { stopMobilePoll(); setAuthError('等待逾時，請重試'); return 0 }
        return n - 1
      })
    }, 1000)
    pollTimerRef.current = setInterval(async () => {
      try {
        const r = await apiJson<{ ready: boolean }>('/api/locker/mobile-signal')
        if (r.ready) { stopMobilePoll(); setScreen('unlocked') }
      } catch { /* keep polling */ }
    }, 2000)
  }

  useEffect(() => () => stopMobilePoll(), [])

  // Check credential status on mount
  useEffect(() => {
    apiJson<{ registered: boolean; devices: Device[] }>('/api/locker/webauthn/status')
      .then(d => { setHasCred(d.registered); setDevices(d.devices) })
      .catch(() => {})
      .finally(() => setScreen('locked'))
  }, [])

  // Auto-lock timer
  const resetLockTimer = useCallback(() => {
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
    lockTimerRef.current = setTimeout(() => setScreen('locked'), AUTO_LOCK_MS)
  }, [])

  useEffect(() => {
    if (screen !== 'unlocked') return
    resetLockTimer()
    window.addEventListener('mousemove', resetLockTimer)
    window.addEventListener('keydown',   resetLockTimer)
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
      window.removeEventListener('mousemove', resetLockTimer)
      window.removeEventListener('keydown',   resetLockTimer)
    }
  }, [screen, resetLockTimer])

  useEffect(() => {
    if (screen !== 'unlocked') return
    // Load path from server prefs (sda1) on first unlock
    loadPrefs().then(prefs => {
      const p = prefs.locker_path ?? DEFAULT_PATH
      setLockerPath(p)
      setPathDraft(p)
    })
  }, [screen])

  useEffect(() => {
    if (screen === 'unlocked') loadFiles()
  }, [screen, lockerPath])

  async function ensureFolder(folderPath: string) {
    const parts = folderPath.split('/')
    const name = parts.pop()!
    const parent = parts.join('/')
    await apiJson('/api/files/mkdir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: parent, name }),
    })
  }

  async function loadFiles() {
    setLoading(true)
    try {
      await ensureFolder(lockerPath).catch(() => {})
      const data = await apiJson<{ items: FileItem[] }>(`/api/files?path=${encodeURIComponent(lockerPath)}`)
      setItems(data.items.filter(f => f.type === 'file' && isMedia(f.name)))
    } catch (e) { toast.error((e as Error).message) }
    setLoading(false)
  }

  // ── WebAuthn helpers ──

  function checkWebAuthnReady(): boolean {
    if (!window.isSecureContext) {
      setAuthError('指紋識別需要 HTTPS 環境\n請透過 https://casaos-nas.web.app 訪問')
      return false
    }
    if (!browserSupportsWebAuthn()) {
      setAuthError('此瀏覽器不支援生物特徵辨識，請改用 Chrome / Safari / Edge')
      return false
    }
    return true
  }

  function parseWebAuthnError(e: unknown): string {
    const err = e as Error
    const msg = err.message ?? ''
    if (err.name === 'NotAllowedError' || msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('abort')) {
      return '已取消'
    }
    if (
      msg.toLowerCase().includes('https') ||
      msg.toLowerCase().includes('secure') ||
      msg.toLowerCase().includes('insecure') ||
      msg.toLowerCase().includes('relying party') ||
      msg.toLowerCase().includes('rpid') ||
      msg.toLowerCase().includes('registrable domain')
    ) {
      return `指紋識別錯誤：網址不符\n請透過 https://casaos-nas.web.app 訪問\n(${msg})`
    }
    return msg
  }

  // ── WebAuthn: Register ──

  async function handleRegister() {
    if (!checkWebAuthnReady()) return
    setAuthBusy(true); setAuthError('')
    try {
      const originParam = `?origin=${encodeURIComponent(window.location.origin)}`
      const options = await apiJson<Parameters<typeof startRegistration>[0]['optionsJSON']>(
        `/api/locker/webauthn/register-options${originParam}`
      )
      const response = await startRegistration({ optionsJSON: options })
      const deviceName = navigator.userAgentData?.platform
        || (navigator.platform ?? 'Unknown Device')
      await apiJson('/api/locker/webauthn/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response, deviceName }),
      })
      setHasCred(true)
      toast.success('指紋設定完成，已自動解鎖')
      setScreen('unlocked')
      apiJson<{ registered: boolean; devices: Device[] }>('/api/locker/webauthn/status')
        .then(d => setDevices(d.devices)).catch(() => {})
    } catch (e) {
      setAuthError(parseWebAuthnError(e))
    }
    setAuthBusy(false)
  }

  // ── WebAuthn: Authenticate ──

  async function handleAuth() {
    if (!checkWebAuthnReady()) return
    setAuthBusy(true); setAuthError('')
    try {
      const originParam = `?origin=${encodeURIComponent(window.location.origin)}`
      const options = await apiJson<Parameters<typeof startAuthentication>[0]['optionsJSON']>(
        `/api/locker/webauthn/auth-options${originParam}`
      )
      const response = await startAuthentication({ optionsJSON: options })
      await apiJson('/api/locker/webauthn/auth-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response }),
      })
      setScreen('unlocked')
    } catch (e) {
      const msg = (e as Error).message ?? ''
      if (msg === 'no_credential') {
        setHasCred(false)
        setAuthError('尚未設定指紋，請先設定')
      } else {
        setAuthError(parseWebAuthnError(e))
      }
    }
    setAuthBusy(false)
  }

  // ── TOTP unlock ──

  async function handleTotpUnlock() {
    const clean = totpCode.replace(/\s/g, '')
    if (clean.length !== 6) { setAuthError('請輸入 6 位數驗證碼'); return }
    setAuthBusy(true); setAuthError('')
    try {
      await apiJson('/api/locker/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean }),
      })
      setTotpCode('')
      setScreen('unlocked')
    } catch (e) {
      setAuthError((e as Error).message)
    }
    setAuthBusy(false)
  }

  async function handleDeleteDevice(credId: number) {
    if (!confirm('確定移除此設備的指紋認證？')) return
    try {
      await apiFetch(`/api/locker/webauthn/${credId}`, { method: 'DELETE' })
      const d = await apiJson<{ registered: boolean; devices: Device[] }>('/api/locker/webauthn/status')
      setDevices(d.devices); setHasCred(d.registered)
      toast.success('已移除')
    } catch (e) { toast.error((e as Error).message) }
  }

  async function handleUpload(files: FileList) {
    setUploading(true)
    let ok = 0, fail = 0
    for (const file of Array.from(files)) {
      try {
        const form = new FormData()
        form.append('files', file)
        form.append('path', lockerPath)
        const res = await apiFetch('/api/files/upload', { method: 'POST', body: form })
        if (res.ok) ok++; else fail++
      } catch { fail++ }
    }
    setUploading(false)
    if (ok)   toast.success(`已上傳 ${ok} 個檔案`)
    if (fail) toast.error(`${fail} 個失敗`)
    loadFiles()
  }

  async function handleDelete(name: string) {
    if (!confirm(`確定將「${name}」移至垃圾桶？`)) return
    try {
      const res = await apiFetch(`/api/files?path=${encodeURIComponent(`${lockerPath}/${name}`)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`)
      setItems(prev => prev.filter(f => f.name !== name))
      if (lightbox !== null) setLightbox(null)
      toast.success('已移至垃圾桶')
    } catch (e) { toast.error((e as Error).message) }
  }

  function applyPath() {
    const p = pathDraft.trim().replace(/^\/+|\/+$/g, '')
    if (!p) { toast.error('路徑不可空白'); return }
    setLockerPath(p)
    savePrefs({ locker_path: p }) // save to sda1
    toast.success('已套用'); setScreen('unlocked')
  }

  // ── Render: init ──

  if (screen === 'init') return null

  // ── Render: lock screen ──

  if (screen === 'locked') {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center gap-8">
        {/* Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-orange-900/50">
            {lockMode === 'fingerprint'
              ? <FingerprintIcon className="w-10 h-10 text-white"/>
              : <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-6 3h.008v.008H9v-.008z"/>
                </svg>
            }
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">私人相冊</p>
            <p className="text-gray-600 text-sm mt-0.5">
              {lockMode === 'fingerprint' ? '指紋 / 臉部識別 解鎖' : '輸入手機 App 驗證碼'}
            </p>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => { stopMobilePoll(); setLockMode('fingerprint'); setAuthError(''); setTotpCode('') }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              lockMode === 'fingerprint'
                ? 'bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <FingerprintIcon className="w-4 h-4"/>
            指紋
          </button>
          <button
            onClick={() => { stopMobilePoll(); setLockMode('totp'); setAuthError(''); setTotpCode('') }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              lockMode === 'totp'
                ? 'bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3"/>
            </svg>
            驗證碼
          </button>
          <button
            onClick={() => { setLockMode('mobile'); setAuthError(''); setTotpCode(''); startMobilePoll() }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              lockMode === 'mobile'
                ? 'bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"/>
            </svg>
            手機解鎖
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 w-64">
          {lockMode === 'fingerprint' ? (
            <>
              {hasCredential ? (
                <button
                  onClick={handleAuth}
                  disabled={authBusy}
                  className="w-full py-4 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 disabled:opacity-60 text-white font-semibold text-base shadow-xl shadow-orange-900/40 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {authBusy
                    ? <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/><span>驗證中…</span></>
                    : <><FingerprintIcon className="w-6 h-6"/><span>使用指紋解鎖</span></>
                  }
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={authBusy}
                  className="w-full py-4 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 disabled:opacity-60 text-white font-semibold text-base shadow-xl shadow-orange-900/40 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {authBusy
                    ? <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/><span>設定中…</span></>
                    : <><FingerprintIcon className="w-6 h-6"/><span>設定指紋解鎖</span></>
                  }
                </button>
              )}
              {hasCredential && (
                <button onClick={handleRegister} disabled={authBusy}
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                  使用其他設備 / 重新設定指紋
                </button>
              )}
            </>
          ) : (
            <>
              <div className="w-full space-y-3">
                <p className="text-xs text-gray-500 text-center">開啟手機 NAS Auth App，複製私人相冊驗證碼</p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={7}
                  placeholder="000 000"
                  value={totpCode}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setTotpCode(raw.length > 3 ? `${raw.slice(0,3)} ${raw.slice(3)}` : raw)
                    setAuthError('')
                    if (raw.length === 6) {
                      // auto-submit
                      setTimeout(() => {
                        setTotpCode(raw.length > 3 ? `${raw.slice(0,3)} ${raw.slice(3)}` : raw)
                      }, 0)
                    }
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleTotpUnlock()}
                  autoFocus
                  className="w-full bg-gray-900 border border-gray-700 focus:border-orange-500 rounded-2xl px-4 py-4 text-white text-3xl font-bold tracking-[0.3em] text-center focus:outline-none transition-colors font-mono"
                />
                <button
                  onClick={handleTotpUnlock}
                  disabled={authBusy || totpCode.replace(/\s/g,'').length !== 6}
                  className="w-full py-4 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 disabled:opacity-40 text-white font-semibold text-base shadow-xl shadow-orange-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {authBusy
                    ? <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/><span>驗證中…</span></>
                    : <span>確認解鎖</span>
                  }
                </button>
              </div>
            </>
          )}

          {lockMode === 'mobile' && (
            <div className="w-full space-y-4 text-center">
              {mobileCountdown > 0 ? (
                <>
                  {/* Pulse ring */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-20 h-20">
                      <span className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping"/>
                      <div className="relative w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                        <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-medium">等待手機生物識別</p>
                    <p className="text-gray-500 text-sm mt-1">
                      開啟手機 <span className="text-orange-400 font-medium">NAS Auth App</span>，點擊「解鎖私人相冊」
                    </p>
                  </div>
                  <p className="text-gray-700 text-xs tabular-nums">等待中… {mobileCountdown}s</p>
                  <button
                    onClick={() => { stopMobilePoll(); setLockMode('fingerprint'); setAuthError('') }}
                    className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    取消等待
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setAuthError(''); startMobilePoll() }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-semibold text-base shadow-xl shadow-orange-900/40 transition-all active:scale-95"
                >
                  重新等待
                </button>
              )}
            </div>
          )}

          {authError && (
            <p className="text-sm text-red-400 text-center max-w-[260px] whitespace-pre-line">{authError}</p>
          )}
        </div>

        <button onClick={onClose} className="absolute bottom-8 text-sm text-gray-700 hover:text-gray-500 transition-colors">
          取消
        </button>
      </div>
    )
  }

  // ── Render: settings ──

  if (screen === 'settings') {
    return (
      <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
          <button onClick={() => setScreen('unlocked')} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-white font-semibold">私人相冊設定</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5 max-w-lg mx-auto w-full">

          {/* Folder path */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
            <h2 className="text-sm font-medium text-gray-300">私人資料夾路徑</h2>
            <div className="flex gap-2">
              <input value={pathDraft} onChange={e => setPathDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyPath()}
                placeholder="Private"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-orange-500"/>
              <button onClick={applyPath} className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors">套用</button>
            </div>
            <p className="text-xs text-gray-600">目前：<span className="text-gray-400 font-mono">{lockerPath}</span></p>
          </section>

          {/* Registered devices */}
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-300">已登錄的指紋設備</h2>
              <button onClick={handleRegister} disabled={authBusy}
                className="text-xs text-orange-400 hover:text-orange-300 disabled:opacity-50 transition-colors">
                + 新增設備
              </button>
            </div>
            {devices.length === 0 ? (
              <p className="text-xs text-gray-600">尚未設定任何設備</p>
            ) : (
              <div className="space-y-2">
                {devices.map(d => (
                  <div key={d.id} className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <FingerprintIcon className="w-5 h-5 text-orange-400 shrink-0"/>
                      <div>
                        <p className="text-sm text-white">{d.device_name || '未知設備'}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(d.created_at).toLocaleDateString('zh-TW')}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteDevice(d.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {authError && <p className="text-xs text-red-400">{authError}</p>}
          </section>

          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h2 className="text-sm font-medium text-gray-300 mb-1">自動上鎖</h2>
            <p className="text-xs text-gray-600">閒置 5 分鐘後自動上鎖</p>
          </section>
        </div>
      </div>
    )
  }

  // ── Render: unlocked ──

  return (
    <>
      <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center shrink-0">
              <FingerprintIcon className="w-4 h-4 text-white"/>
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">私人相冊</p>
              <p className="text-xs text-gray-600 font-mono leading-tight">{lockerPath}</p>
            </div>
            {!loading && (
              <span className="text-xs text-gray-600 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-full">
                {items.length} 個媒體
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
              </svg>
              {uploading ? '上傳中…' : '上傳'}
            </button>
            <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden"
              onChange={e => { if (e.target.files) handleUpload(e.target.files); e.target.value = '' }}/>
            <button onClick={loadFiles} title="重新整理"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
              </svg>
            </button>
            <button onClick={() => { setPathDraft(lockerPath); setAuthError(''); setScreen('settings') }} title="設定"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a7.723 7.723 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </button>
            <button onClick={() => setScreen('locked')} title="上鎖"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-orange-400 hover:bg-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
              </svg>
            </button>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"/>
              <p className="text-gray-600 text-sm">載入中…</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <div className="w-24 h-24 rounded-3xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-gray-400 font-medium">私人相冊目前為空</p>
                <p className="text-gray-600 text-sm mt-1">上傳照片或影片，只有你看得到</p>
              </div>
              <button onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors">
                上傳媒體
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {items.map((item, idx) => (
                <MediaTile
                  key={item.name}
                  item={item}
                  lockerPath={lockerPath}
                  onClick={() => setLightbox(idx)}
                  onDelete={() => handleDelete(item.name)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox items={items} index={lightbox} lockerPath={lockerPath}
          onClose={() => setLightbox(null)} onGo={setLightbox}/>
      )}
    </>
  )
}
