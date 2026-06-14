import { useState, useEffect, useRef, useCallback } from 'react'
import { apiJson, getToken } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const BACKEND = (import.meta.env.VITE_BACKEND_URL as string) || ''

interface Camera { id: string; name: string; url: string; notes?: string }
type GridCols = 1 | 2 | 3

function streamUrl(id: string) {
  return `${BACKEND}/api/cameras/${encodeURIComponent(id)}/stream?token=${getToken()}`
}

// ── Single camera feed ────────────────────────────────────
interface FeedProps { camera: Camera; onClick?: () => void; fullscreen?: boolean }

function CameraFeed({ camera, onClick, fullscreen }: FeedProps) {
  const [status, setStatus] = useState<'connecting' | 'online' | 'offline'>('connecting')
  const [key, setKey] = useState(0)
  const retryRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => { clearTimeout(retryRef.current) }, [])

  function handleLoad() { setStatus('online') }
  function handleError() {
    setStatus('offline')
    clearTimeout(retryRef.current)
    retryRef.current = setTimeout(() => { setKey(k => k + 1); setStatus('connecting') }, 5000)
  }

  return (
    <div
      className={`relative bg-gray-950 overflow-hidden ${fullscreen ? 'w-full h-full' : 'rounded-xl'} group cursor-pointer`}
      style={{ aspectRatio: fullscreen ? undefined : '16/9' }}
      onClick={onClick}
    >
      {/* MJPEG stream via img tag */}
      <img
        key={key}
        src={streamUrl(camera.id)}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-contain block ${status !== 'online' ? 'invisible absolute' : ''}`}
        alt={camera.name}
      />

      {/* Placeholder when not online */}
      {status !== 'online' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
          <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"/>
          </svg>
          {status === 'connecting'
            ? <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"/>
            : <p className="text-xs">離線 · 5秒後重試</p>
          }
        </div>
      )}

      {/* Bottom bar */}
      <div className="absolute bottom-0 inset-x-0 px-2.5 py-1.5 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            status === 'online'     ? 'bg-green-400' :
            status === 'offline'    ? 'bg-red-500' :
                                      'bg-yellow-400 animate-pulse'
          }`} />
          <span className="text-white text-xs font-medium truncate">{camera.name}</span>
          {onClick && status === 'online' && (
            <svg className="w-3.5 h-3.5 text-gray-400 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Add/Edit dialog ──────────────────────────────────────
interface FormVals { name: string; url: string; notes: string }
const EMPTY: FormVals = { name: '', url: '', notes: '' }

interface DialogProps {
  initial?: Camera
  onSave: (v: FormVals) => Promise<void>
  onClose: () => void
}

function CameraDialog({ initial, onSave, onClose }: DialogProps) {
  const [form, setForm] = useState<FormVals>(
    initial ? { name: initial.name, url: initial.url, notes: initial.notes ?? '' } : EMPTY
  )
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try { await onSave(form) } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h3 className="text-base font-bold text-white">{initial ? '編輯攝影機' : '新增攝影機'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">攝影機名稱</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="大門口、客廳、車庫…" required autoFocus
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500"/>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">串流網址</label>
            <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="rtsp://192.168.1.x:554/stream 或 http://…/mjpeg" required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 font-mono"/>
            <p className="text-[11px] text-gray-600 mt-1.5">支援 RTSP 與 HTTP MJPEG，後端以 ffmpeg 代理轉碼</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">備註（可選）</label>
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="位置說明、IP 等…"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500"/>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 transition-colors">
              取消
            </button>
            <button type="submit" disabled={saving || !form.name.trim() || !form.url.trim()}
              className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-40 text-sm text-white font-medium transition-colors">
              {saving ? '儲存中…' : '儲存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main CameraApp ────────────────────────────────────────
interface Props { onClose: () => void }

export default function CameraApp({ onClose }: Props) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [tab, setTab]                 = useState<'live' | 'manage'>('live')
  const [cameras, setCameras]         = useState<Camera[]>([])
  const [loading, setLoading]         = useState(true)
  const [gridCols, setGridCols]       = useState<GridCols>(2)
  const [fullscreenId, setFullscreenId] = useState<string | null>(null)
  const [dialog, setDialog]           = useState<Camera | 'new' | null>(null)
  const [deleting, setDeleting]       = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { setCameras(await apiJson<Camera[]>('/api/cameras')) } catch { setCameras([]) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (fullscreenId) { setFullscreenId(null); return }
      onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, fullscreenId])

  async function handleSave(vals: FormVals) {
    try {
      if (dialog === 'new') {
        await apiJson('/api/cameras', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vals),
        })
        toast.success('攝影機已新增')
      } else if (dialog && typeof dialog === 'object') {
        await apiJson(`/api/cameras/${dialog.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vals),
        })
        toast.success('已更新')
      }
      setDialog(null)
      await load()
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? '操作失敗')
      throw err
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`確定要刪除「${name}」？`)) return
    setDeleting(id)
    try {
      await apiJson(`/api/cameras/${id}`, { method: 'DELETE' })
      toast.success('已刪除')
      await load()
    } catch { toast.error('刪除失敗') } finally { setDeleting(null) }
  }

  const fullscreenCam = fullscreenId ? cameras.find(c => c.id === fullscreenId) ?? null : null

  const cols: GridCols = cameras.length <= 1 ? 1 : cameras.length <= 4 ? Math.min(gridCols, 2) as GridCols : gridCols

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
          </svg>
          <h1 className="text-base font-bold text-white">監視器系統</h1>
          {tab === 'live' && cameras.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-red-400 font-semibold">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/>
              LIVE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="flex bg-gray-800 rounded-lg p-0.5">
            {(['live', 'manage'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  tab === t ? 'bg-gray-600 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}>
                {t === 'live' ? '即時畫面' : '攝影機管理'}
              </button>
            ))}
          </div>

          {/* Grid layout selector (live tab, multiple cameras) */}
          {tab === 'live' && cameras.length > 1 && (
            <div className="flex bg-gray-800 rounded-lg p-0.5 gap-0.5">
              {([1, 2, 3] as GridCols[]).map(n => (
                <button key={n} onClick={() => setGridCols(n)}
                  title={n === 1 ? '1×1' : n === 2 ? '2×2' : '3×3'}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-mono transition-colors ${
                    gridCols === n ? 'bg-gray-600 text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}>
                  {/* Mini grid icon */}
                  {n === 1 ? (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 12 12">
                      <rect x="1" y="1" width="10" height="10" rx="1"/>
                    </svg>
                  ) : n === 2 ? (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 12 12">
                      <rect x="1" y="1" width="4.5" height="4.5" rx="0.5"/>
                      <rect x="6.5" y="1" width="4.5" height="4.5" rx="0.5"/>
                      <rect x="1" y="6.5" width="4.5" height="4.5" rx="0.5"/>
                      <rect x="6.5" y="6.5" width="4.5" height="4.5" rx="0.5"/>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 12 12">
                      <rect x="0.5" y="0.5" width="3" height="3" rx="0.4"/>
                      <rect x="4.5" y="0.5" width="3" height="3" rx="0.4"/>
                      <rect x="8.5" y="0.5" width="3" height="3" rx="0.4"/>
                      <rect x="0.5" y="4.5" width="3" height="3" rx="0.4"/>
                      <rect x="4.5" y="4.5" width="3" height="3" rx="0.4"/>
                      <rect x="8.5" y="4.5" width="3" height="3" rx="0.4"/>
                      <rect x="0.5" y="8.5" width="3" height="3" rx="0.4"/>
                      <rect x="4.5" y="8.5" width="3" height="3" rx="0.4"/>
                      <rect x="8.5" y="8.5" width="3" height="3" rx="0.4"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl transition-colors">
            ×
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin"/>
          </div>

        ) : cameras.length === 0 && tab === 'live' ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
            </svg>
            <p className="text-sm">尚未新增任何攝影機</p>
            {isAdmin && (
              <button onClick={() => setTab('manage')}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors">
                前往管理
              </button>
            )}
          </div>

        ) : tab === 'live' ? (
          /* ── Live grid ── */
          <div className={`p-2 grid gap-2 auto-rows-fr ${
            cols === 1 ? 'grid-cols-1' :
            cols === 2 ? 'grid-cols-2' :
                         'grid-cols-3'
          }`} style={{ minHeight: '100%' }}>
            {cameras.map(cam => (
              <CameraFeed
                key={cam.id}
                camera={cam}
                onClick={() => setFullscreenId(cam.id)}
              />
            ))}
          </div>

        ) : (
          /* ── Manage tab ── */
          <div className="p-5 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-300">
                攝影機清單
                <span className="ml-2 text-gray-600 font-normal">({cameras.length} 台)</span>
              </h2>
              {isAdmin && (
                <button onClick={() => setDialog('new')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15"/>
                  </svg>
                  新增攝影機
                </button>
              )}
            </div>

            {cameras.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-gray-600 gap-3">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
                </svg>
                <p className="text-sm">尚未設定任何攝影機</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {cameras.map(cam => (
                  <li key={cam.id}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{cam.name}</p>
                      <p className="text-gray-500 text-xs font-mono truncate">{cam.url}</p>
                      {cam.notes && <p className="text-gray-600 text-xs mt-0.5">{cam.notes}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => { setTab('live'); setFullscreenId(cam.id) }}
                        className="text-xs px-2.5 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
                        查看
                      </button>
                      {isAdmin && (
                        <>
                          <button onClick={() => setDialog(cam)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
                            編輯
                          </button>
                          <button onClick={() => handleDelete(cam.id, cam.name)}
                            disabled={deleting === cam.id}
                            className="text-xs px-2.5 py-1 rounded-lg bg-gray-700 hover:bg-red-600 disabled:opacity-40 text-gray-400 hover:text-white transition-colors">
                            {deleting === cam.id ? '…' : '刪除'}
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Setup instructions */}
            <div className="mt-8 p-4 bg-gray-900/60 rounded-xl border border-gray-800 text-xs text-gray-500 space-y-1.5">
              <p className="text-gray-400 font-medium mb-2">📡 支援的串流格式</p>
              <p><span className="text-red-400 font-mono">rtsp://</span>　IP 攝影機 RTSP 串流（需 ffmpeg）</p>
              <p><span className="text-orange-400 font-mono">http://</span>　HTTP MJPEG 串流（e.g. /mjpeg, /video.cgi）</p>
              <p className="text-gray-600 mt-2">後端透過 ffmpeg 代理，需在樹莓派安裝：<code className="bg-gray-800 px-1 rounded">sudo apt install ffmpeg</code></p>
            </div>
          </div>
        )}
      </div>

      {/* ── Fullscreen single camera ── */}
      {fullscreenCam && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 shrink-0 bg-black/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>
              <span className="text-white text-sm font-medium">{fullscreenCam.name}</span>
              <span className="text-xs text-gray-500 ml-1">LIVE</span>
            </div>
            <button onClick={() => setFullscreenId(null)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl transition-colors">
              ×
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <CameraFeed camera={fullscreenCam} fullscreen />
          </div>
        </div>
      )}

      {/* ── Add/Edit dialog ── */}
      {dialog !== null && (
        <CameraDialog
          initial={dialog !== 'new' ? dialog : undefined}
          onSave={handleSave}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  )
}
