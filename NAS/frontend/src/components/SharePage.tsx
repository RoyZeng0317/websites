import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

const BACKEND = import.meta.env.VITE_BACKEND_URL

interface ShareInfo {
  token: string
  fileName: string
  isFolder: boolean
  permission: 'edit' | 'view' | 'download'
  hasPassword: boolean
  oneTime: boolean
}

interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: number
  modified?: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}

export default function SharePage() {
  const { token } = useParams<{ token: string }>()
  const [info, setInfo] = useState<ShareInfo | null>(null)
  const [status, setStatus] = useState<'loading' | 'need-password' | 'ready' | 'error'>('loading')
  const [errMsg, setErrMsg] = useState('')
  const [shareJwt, setShareJwt] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [verifying, setVerifying] = useState(false)

  // folder browser state
  const [pathSegments, setPathSegments] = useState<string[]>([])
  const [items, setItems] = useState<FileItem[]>([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!token) return
    fetch(`${BACKEND}/api/share/${token}`)
      .then(r => r.json())
      .then((data: ShareInfo & { error?: string }) => {
        if (data.error) { setStatus('error'); setErrMsg(data.error); return }
        setInfo(data)
        if (data.hasPassword) {
          setStatus('need-password')
        } else {
          // Auto-verify (no password)
          verify(token, '')
        }
      })
      .catch(() => { setStatus('error'); setErrMsg('無法連線到伺服器') })
  }, [token])

  async function verify(tok: string, pwd: string) {
    try {
      const r = await fetch(`${BACKEND}/api/share/${tok}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      })
      const data = await r.json()
      if (!r.ok) { setStatus('need-password'); setErrMsg(data.error); return }
      setShareJwt(data.shareJwt)
      setStatus('ready')
    } catch { setStatus('error'); setErrMsg('驗證失敗') }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setVerifying(true)
    setErrMsg('')
    await verify(token, password)
    setVerifying(false)
  }

  // Load folder contents when ready
  useEffect(() => {
    if (status !== 'ready' || !info?.isFolder || !shareJwt || !token) return
    const sub = pathSegments.join('/')
    setLoadingFiles(true)
    fetch(`${BACKEND}/api/share/${token}/files?path=${encodeURIComponent(sub)}`, {
      headers: { Authorization: `Bearer ${shareJwt}` },
    })
      .then(r => r.json())
      .then((d: { items: FileItem[] }) => setItems(d.items ?? []))
      .catch(() => {})
      .finally(() => setLoadingFiles(false))
  }, [status, shareJwt, token, pathSegments, info])

  function downloadUrl(sub?: string) {
    const path = sub ?? ''
    return `${BACKEND}/api/share/${token}/download?path=${encodeURIComponent(path)}&shareJwt=${encodeURIComponent(shareJwt ?? '')}`
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0 || !shareJwt || !token) return
    const form = new FormData()
    for (const f of Array.from(files)) {
      form.append('files', f)
      form.append('filenames', f.name)
    }
    const sub = pathSegments.join('/')
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${BACKEND}/api/share/${token}/upload?path=${encodeURIComponent(sub)}`)
    xhr.setRequestHeader('Authorization', `Bearer ${shareJwt}`)
    xhr.upload.onprogress = ev => { if (ev.lengthComputable) setUploadProgress(Math.round(ev.loaded / ev.total * 100)) }
    xhr.onload = () => {
      setUploadProgress(null)
      e.target.value = ''
      // Reload
      setPathSegments(p => [...p])
    }
    xhr.onerror = () => { setUploadProgress(null); e.target.value = '' }
    xhr.send(form)
  }

  const permLabel = { view: '僅查看', download: '僅下載', edit: '可編輯' }

  if (status === 'loading') return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-900">
      <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (status === 'error') return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="text-center space-y-3">
        <p className="text-4xl">🔗</p>
        <p className="text-gray-300">{errMsg}</p>
      </div>
    </div>
  )

  if (status === 'need-password') return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <p className="text-3xl font-bold text-orange-400">CasaOS NAS</p>
          <p className="text-gray-400 text-sm">此分享連結受密碼保護</p>
          {info && <p className="text-white font-medium">{info.fileName}</p>}
        </div>
        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="輸入存取密碼"
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
          />
          {errMsg && <p className="text-red-400 text-sm text-center">{errMsg}</p>}
          <button
            type="submit"
            disabled={verifying}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium transition-colors"
          >
            {verifying ? '驗證中…' : '進入'}
          </button>
        </form>
      </div>
    </div>
  )

  // Ready state
  return (
    <div className="min-h-dvh flex flex-col bg-gray-900 text-white">
      <header className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <div className="min-w-0">
          <p className="font-bold text-orange-400 text-lg truncate">{info?.fileName}</p>
          <p className="text-xs text-gray-400">{info ? permLabel[info.permission] : ''}{info?.oneTime ? ' · 一次性' : ''}</p>
        </div>
        {info && !info.isFolder && info.permission !== 'view' && (
          <a
            href={downloadUrl()}
            download={info.fileName}
            className="shrink-0 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
          >
            下載
          </a>
        )}
      </header>

      {info?.isFolder && (
        <>
          {/* Breadcrumb */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
            <nav className="flex items-center gap-1 text-sm text-gray-400 flex-wrap min-w-0">
              <button onClick={() => setPathSegments([])} className="hover:text-orange-400 transition-colors shrink-0">根目錄</button>
              {pathSegments.map((seg, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="text-gray-600">/</span>
                  <button onClick={() => setPathSegments(p => p.slice(0, i + 1))} className="hover:text-orange-400 transition-colors truncate max-w-[120px]">{seg}</button>
                </span>
              ))}
            </nav>
            {info.permission === 'edit' && (
              <div className="shrink-0 ml-4">
                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-sm rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors">上傳</button>
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} />
              </div>
            )}
          </div>

          {uploadProgress !== null && (
            <div className="px-6 py-2 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="shrink-0">上傳中 {uploadProgress}%</span>
                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 overflow-y-auto">
            {loadingFiles ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ul className="px-4 py-2">
                {items.map(item => {
                  const sub = pathSegments.length ? `${pathSegments.join('/')}/${item.name}` : item.name
                  return (
                    <li key={item.name} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800 group transition-colors">
                      <div className="shrink-0">
                        {item.type === 'folder'
                          ? <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                          : <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        }
                      </div>
                      <button
                        className="flex-1 text-left text-sm text-white hover:text-orange-400 truncate transition-colors"
                        onClick={() => item.type === 'folder' ? setPathSegments(p => [...p, item.name]) : undefined}
                      >
                        {item.name}
                      </button>
                      {item.size !== undefined && (
                        <span className="text-xs text-gray-600 shrink-0 hidden sm:block">{formatSize(item.size)}</span>
                      )}
                      {item.type === 'file' && info.permission !== 'view' && (
                        <a
                          href={downloadUrl(sub)}
                          download={item.name}
                          className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        >
                          下載
                        </a>
                      )}
                    </li>
                  )
                })}
                {items.length === 0 && !loadingFiles && (
                  <li className="text-center text-gray-600 text-sm py-16">此資料夾是空的</li>
                )}
              </ul>
            )}
          </main>
        </>
      )}

      {/* Single file - view only info */}
      {info && !info.isFolder && info.permission === 'view' && (
        <main className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          此分享僅供查看，無法下載
        </main>
      )}
    </div>
  )
}
