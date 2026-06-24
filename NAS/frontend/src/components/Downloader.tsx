import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { apiJson } from '../lib/api'

interface Props {
  onClose: () => void
  initialPath?: string
}

interface Job {
  id: string
  status: 'pending' | 'running' | 'done' | 'error'
  progress: number
  title: string
  filename: string
  error: string
  format: 'mp3' | 'mp4' | 'image'
  quality: string
  url: string
  destPath: string
  createdAt: string
}

interface FileItem {
  name: string
  type: 'folder' | 'file'
}

const MP3_QUALITIES = [
  { label: '最佳品質 (VBR)', value: 'best' },
  { label: '320 Kbps',       value: '320'  },
  { label: '192 Kbps',       value: '192'  },
  { label: '128 Kbps',       value: '128'  },
]
const MP4_QUALITIES = [
  { label: '最佳畫質', value: 'best' },
  { label: '1080p',   value: '1080' },
  { label: '720p',    value: '720'  },
  { label: '480p',    value: '480'  },
  { label: '360p',    value: '360'  },
]

function fmtTime(iso: string) {
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getMonth()+1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function urlHost(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return url.slice(0, 40) }
}

// ── Folder Picker Modal ───────────────────────────────────

function FolderPicker({ current, onSelect, onClose }: {
  current: string
  onSelect: (path: string) => void
  onClose: () => void
}) {
  const [browsePath, setBrowsePath] = useState(current || '')
  const [items, setItems] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)

  async function loadDir(path: string) {
    setLoading(true)
    try {
      const data = await apiJson<FileItem[]>(`/api/files?path=${encodeURIComponent(path)}`)
      setItems((data ?? []).filter(i => i.type === 'folder'))
    } catch { setItems([]) }
    setLoading(false)
  }

  useEffect(() => { loadDir(browsePath) }, [browsePath])

  const segments = browsePath ? browsePath.split('/').filter(Boolean) : []

  function navigateTo(idx: number) {
    setBrowsePath(segments.slice(0, idx + 1).join('/'))
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 shrink-0">
          <span className="text-white font-medium text-sm">選擇儲存資料夾</span>
          <button onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white rounded transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-800 text-xs overflow-x-auto shrink-0">
          <button
            onClick={() => setBrowsePath('')}
            className="text-orange-400 hover:text-orange-300 whitespace-nowrap transition-colors font-mono">
            根目錄
          </button>
          {segments.map((seg, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="text-gray-600">/</span>
              <button
                onClick={() => navigateTo(i)}
                className="text-orange-400 hover:text-orange-300 whitespace-nowrap transition-colors font-mono">
                {seg}
              </button>
            </span>
          ))}
        </div>

        {/* Folder list */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="text-center py-8 text-gray-600 text-sm">載入中...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-700 text-sm">無子資料夾</div>
          ) : (
            <div className="space-y-0.5">
              {items.map(item => (
                <button key={item.name}
                  onClick={() => setBrowsePath(browsePath ? `${browsePath}/${item.name}` : item.name)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left group">
                  <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                  <span className="flex-1 text-sm text-gray-200 font-mono truncate">{item.name}</span>
                  <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Select button */}
        <div className="px-4 py-3 border-t border-gray-700 shrink-0">
          <button
            onClick={() => { onSelect(browsePath); onClose() }}
            className="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-colors">
            選擇此位置：<span className="font-mono font-normal">/{browsePath || '根目錄'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Job row ───────────────────────────────────────────────

function JobRow({ job, onCancel }: { job: Job; onCancel: (id: string) => void }) {
  const [showLog, setShowLog] = useState(false)

  const statusMeta = {
    pending: { label: '等待中',  color: 'text-gray-400'  },
    running: { label: `${job.progress}%`, color: 'text-orange-400' },
    done:    { label: '完成',    color: 'text-green-400' },
    error:   { label: '失敗',    color: 'text-red-400'   },
  }[job.status]

  const title = job.title || job.filename || urlHost(job.url)

  return (
    <div className={`bg-gray-800 border rounded-xl p-3 space-y-2 transition-colors ${
      job.status === 'error' ? 'border-red-800/50' : 'border-gray-700'
    }`}>
      <div className="flex items-start gap-2">
        <span className={`shrink-0 mt-0.5 text-xs px-1.5 py-0.5 rounded font-mono font-medium ${
          job.format === 'mp3' ? 'bg-pink-900/40 text-pink-400' : 'bg-blue-900/40 text-blue-400'
        }`}>
          {job.format.toUpperCase()}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-white truncate">{title}</p>
          {job.filename && job.status === 'done' && (
            <p className="text-xs text-green-400/70 truncate mt-0.5 font-mono">{job.filename}</p>
          )}
          <p className="text-xs text-gray-600 truncate mt-0.5">
            {urlHost(job.url)} · {fmtTime(job.createdAt)}
            {job.destPath && ` · → ${job.destPath}`}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-xs font-medium ${statusMeta.color}`}>{statusMeta.label}</span>
          {(job.status === 'running' || job.status === 'pending') && (
            <button
              onClick={() => onCancel(job.id)}
              className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors"
              title="取消"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {job.status === 'running' && (
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${job.progress}%` }}
          />
        </div>
      )}

      {/* Error log */}
      {job.status === 'error' && job.error && (
        <div className="text-xs">
          <button
            onClick={() => setShowLog(v => !v)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            {showLog ? '▲ 收起' : '▼ 展開錯誤訊息'}
          </button>
          {showLog && (
            <pre className="mt-1.5 bg-red-950/40 border border-red-800/40 rounded-lg p-2.5 text-red-300/80 font-mono text-xs overflow-x-auto whitespace-pre-wrap break-words max-h-36 overflow-y-auto">
              {job.error}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────

export default function DownloaderPanel({ onClose, initialPath = '' }: Props) {
  const [url, setUrl]           = useState('')
  const [format, setFormat]     = useState<'mp3' | 'mp4' | 'image'>('mp4')
  const [quality, setQuality]   = useState('best')
  const [destPath, setDestPath] = useState(initialPath)
  const [submitting, setSubmitting] = useState(false)
  const [jobs, setJobs]         = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [showFolderPicker, setShowFolderPicker] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Twitter Cookie ──────────────────────────────────
  const [cookieExists, setCookieExists] = useState(false)
  const [authToken, setAuthToken] = useState('')
  const [ct0, setCt0]             = useState('')
  const [cookieBusy, setCookieBusy] = useState(false)

  async function loadJobs(silent = false) {
    if (!silent) setLoadingJobs(true)
    try {
      const data = await apiJson<Job[]>('/api/ytdl/jobs')
      setJobs(data)
    } catch {}
    setLoadingJobs(false)
  }

  useEffect(() => { loadJobs(); loadCookieStatus() }, [])

  async function loadCookieStatus() {
    try {
      const { exists } = await apiJson<{ exists: boolean }>('/api/ytdl/cookies')
      setCookieExists(exists)
    } catch {}
  }

  async function saveTwitterCookie() {
    if (!authToken.trim() || !ct0.trim()) { toast.error('請同時填入 auth_token 與 ct0'); return }
    setCookieBusy(true)
    try {
      await apiJson('/api/ytdl/cookies/twitter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth_token: authToken.trim(), ct0: ct0.trim() }),
      })
      setAuthToken(''); setCt0('')
      toast.success('Cookie 已儲存')
      loadCookieStatus()
    } catch (err) { toast.error((err as Error).message) }
    finally { setCookieBusy(false) }
  }

  async function deleteCookie() {
    setCookieBusy(true)
    try {
      await apiJson('/api/ytdl/cookies', { method: 'DELETE' })
      toast.success('Cookie 已移除')
      loadCookieStatus()
    } catch (err) { toast.error((err as Error).message) }
    finally { setCookieBusy(false) }
  }

  // Auto-poll while active jobs exist
  useEffect(() => {
    const hasActive = jobs.some(j => j.status === 'running' || j.status === 'pending')
    if (hasActive && !pollRef.current) {
      pollRef.current = setInterval(() => loadJobs(true), 2000)
    } else if (!hasActive && pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    return () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null } }
  }, [jobs])

  const qualities = format === 'mp3' ? MP3_QUALITIES : MP4_QUALITIES

  async function handleSubmit() {
    if (!url.trim()) return toast.error('請輸入 URL')
    setSubmitting(true)
    try {
      await apiJson('/api/ytdl/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), format, quality, destPath }),
      })
      toast.success('已加入下載佇列')
      setUrl('')
      await loadJobs(true)
    } catch (err) { toast.error((err as Error).message) }
    finally { setSubmitting(false) }
  }

  async function cancelJob(id: string) {
    try {
      await apiJson(`/api/ytdl/jobs/${id}`, { method: 'DELETE' })
      setJobs(prev => prev.filter(j => j.id !== id))
    } catch (err) { toast.error((err as Error).message) }
  }

  function clearFinished() {
    const done = jobs.filter(j => j.status === 'done' || j.status === 'error')
    Promise.all(done.map(j => apiJson(`/api/ytdl/jobs/${j.id}`, { method: 'DELETE' }).catch(() => {})))
    setJobs(prev => prev.filter(j => j.status === 'running' || j.status === 'pending'))
  }

  const activeCount  = jobs.filter(j => j.status === 'running' || j.status === 'pending').length
  const finishCount  = jobs.filter(j => j.status === 'done' || j.status === 'error').length

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col"
          style={{ maxHeight: '90vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <h2 className="text-white font-semibold">媒體下載器</h2>
              <span className="text-xs text-gray-500 bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded font-mono">
                yt-dlp
              </span>
              {activeCount > 0 && (
                <span className="text-xs bg-orange-900/50 text-orange-400 border border-orange-800 rounded px-1.5 py-0.5">
                  {activeCount} 個進行中
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* ── New download form ── */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-4">
              {/* URL */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">影片 / 音樂網址</label>
                <input
                  type="search"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck={false}
                  data-form-type="other"
                  readOnly
                  onFocus={e => e.target.removeAttribute('readonly')}
                  onPaste={e => {
                    const text = e.clipboardData.getData('text')
                    const match = text.match(/https?:\/\/[^\s　]+/)
                    if (match && text !== match[0]) {
                      e.preventDefault()
                      setUrl(match[0].replace(/[,，。.!！?？]+$/, ''))
                    }
                  }}
                  placeholder="貼上網址或抖音 / TikTok 分享文字，自動擷取連結"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Format + Quality */}
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">格式</label>
                  <div className="flex rounded-lg border border-gray-600 overflow-hidden text-sm font-medium h-9">
                    {([['mp4','🎬 影片'],['mp3','🎵 音訊'],['image','🖼 圖片']] as const).map(([f, label]) => (
                      <button
                        key={f}
                        onClick={() => { setFormat(f); setQuality('best') }}
                        className={`flex-1 transition-colors ${
                          format === f
                            ? 'bg-orange-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {format !== 'image' && (
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">品質</label>
                    <select
                      value={quality}
                      onChange={e => setQuality(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 h-9"
                    >
                      {qualities.map(q => (
                        <option key={q.value} value={q.value}>{q.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Destination — folder picker */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">儲存資料夾</label>
                <button
                  type="button"
                  onClick={() => setShowFolderPicker(true)}
                  className="w-full flex items-center gap-2.5 bg-gray-900 border border-gray-700 hover:border-orange-500 rounded-lg px-3 py-2 text-sm text-left transition-colors group"
                >
                  <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                  <span className={`flex-1 font-mono truncate ${destPath ? 'text-white' : 'text-gray-600'}`}>
                    {destPath || '根目錄（點擊選擇資料夾）'}
                  </span>
                  <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-orange-400 transition-colors shrink-0"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {destPath && (
                  <button
                    onClick={() => setDestPath('')}
                    className="mt-1 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    清除（存至根目錄）
                  </button>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {submitting
                  ? <><span className="animate-spin leading-none">◌</span> 加入中...</>
                  : <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      開始下載
                    </>
                }
              </button>
            </div>

            {/* ── Twitter Cookie ── */}
            <div className="space-y-2 pt-1 border-t border-gray-700/60">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Twitter / X Cookie</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${cookieExists ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-xs text-gray-500">{cookieExists ? '已設定' : '未設定'}</span>
                </div>
              </div>
              <input type="password" value={authToken} onChange={e => setAuthToken(e.target.value)}
                placeholder="auth_token"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 font-mono" />
              <input type="password" value={ct0} onChange={e => setCt0(e.target.value)}
                placeholder="ct0"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 font-mono" />
              <div className="flex gap-2">
                <button onClick={saveTwitterCookie} disabled={cookieBusy}
                  className="flex-1 py-2 rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-medium transition-colors">
                  {cookieBusy ? '儲存中...' : '儲存'}
                </button>
                <button onClick={deleteCookie} disabled={cookieBusy}
                  className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium transition-colors">
                  移除
                </button>
              </div>
              <details className="text-xs text-gray-600">
                <summary className="cursor-pointer hover:text-gray-400">如何取得 Cookie？</summary>
                <ol className="pt-2 pl-4 space-y-1 leading-relaxed">
                  <li>在電腦瀏覽器登入 X.com</li>
                  <li>按 F12 → Application → Cookies → x.com</li>
                  <li>複製 <code className="text-gray-400">auth_token</code> 與 <code className="text-gray-400">ct0</code> 的值</li>
                </ol>
              </details>
            </div>

            {/* ── Job list ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300">下載記錄</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadJobs(true)}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    重新整理
                  </button>
                  {finishCount > 0 && (
                    <button
                      onClick={clearFinished}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      清除已完成
                    </button>
                  )}
                </div>
              </div>

              {loadingJobs ? (
                <div className="text-center py-10 text-gray-600 text-sm">載入中...</div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-10 text-gray-700 text-sm">尚無下載記錄</div>
              ) : (
                <div className="space-y-2">
                  {jobs.map(job => (
                    <JobRow key={job.id} job={job} onCancel={cancelJob} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showFolderPicker && (
        <FolderPicker
          current={destPath}
          onSelect={p => setDestPath(p)}
          onClose={() => setShowFolderPicker(false)}
        />
      )}
    </>
  )
}
