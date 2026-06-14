import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiJson, downloadUrl } from '../lib/api'
import MetaPanel from './viewers/MetaPanel'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: number
}

interface Props { onClose: () => void }

const PHOTO_EXTS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'heic', 'heif', 'avif'])

function isPhoto(name: string) {
  return PHOTO_EXTS.has(name.split('.').pop()?.toLowerCase() ?? '')
}

export default function PhotoApp({ onClose }: Props) {
  const navigate = useNavigate()
  const [path, setPath]       = useState('')
  const [items, setItems]     = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewIdx, setViewIdx] = useState<number | null>(null)
  const [showInfo, setShowInfo] = useState(false)

  const load = useCallback(async (dir: string) => {
    setLoading(true)
    try {
      const data = await apiJson<{ items: FileItem[] }>(`/api/files?path=${encodeURIComponent(dir)}`)
      setItems(data.items)
    } catch { setItems([]) }
    setLoading(false)
  }, [])

  useEffect(() => { load(path) }, [path, load])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (viewIdx !== null) {
        if (e.key === 'Escape')      { setViewIdx(null); setShowInfo(false); return }
        if (e.key === 'ArrowRight')  { e.preventDefault(); setViewIdx(i => Math.min((i ?? 0) + 1, photos.length - 1)) }
        if (e.key === 'ArrowLeft')   { e.preventDefault(); setViewIdx(i => Math.max((i ?? 0) - 1, 0)) }
        if (e.key === 'i')           { setShowInfo(v => !v) }
      } else {
        if (e.key === 'Escape') onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, viewIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  function openFolder(name: string) { setPath(p => p ? `${p}/${name}` : name) }
  function goBack() {
    const idx = path.lastIndexOf('/')
    setPath(idx === -1 ? '' : path.slice(0, idx))
  }

  const folders = items.filter(i => i.type === 'folder')
  const photos  = items.filter(i => i.type === 'file' && isPhoto(i.name))

  function photoPath(name: string) { return path ? `${path}/${name}` : name }

  const currentPhoto = viewIdx !== null ? photos[viewIdx] : null
  const currentPath  = currentPhoto ? photoPath(currentPhoto.name) : null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0 bg-black/60">
        <div className="flex items-center gap-3 min-w-0">
          <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <h2 className="text-base font-bold text-white">相簿</h2>
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 ml-2 min-w-0">
            <button onClick={() => setPath('')} className="hover:text-white shrink-0">全部照片</button>
            {path.split('/').filter(Boolean).map((part, i, arr) => (
              <span key={i} className="flex items-center gap-1.5 min-w-0">
                <span className="text-gray-600">/</span>
                <button onClick={() => setPath(arr.slice(0, i + 1).join('/'))}
                  className="hover:text-white truncate">{part}</button>
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{photos.length} 張</span>
          {path && (
            <button onClick={goBack}
              className="px-3 h-8 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">
              上一頁
            </button>
          )}
          <button onClick={() => navigate('/timeline')}
            className="px-3 h-8 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">
            時間軸
          </button>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl">
            ×
          </button>
        </div>
      </div>

      {/* Content grid */}
      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : (
          <>
            {folders.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">資料夾</p>
                <div className="flex flex-wrap gap-2">
                  {folders.map(f => (
                    <button key={f.name} onClick={() => openFolder(f.name)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700">
                      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"/>
                      </svg>
                      <span className="text-sm text-gray-200">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {photos.length > 0 ? (
              <div>
                {folders.length > 0 && (
                  <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">照片</p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {photos.map((p, i) => (
                    <button key={p.name} onClick={() => { setViewIdx(i); setShowInfo(false) }}
                      className="aspect-square rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-green-500/50 transition-all group relative">
                      <img
                        src={downloadUrl(photoPath(p.name))}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <p className="text-xs text-white truncate">{p.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : folders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-2">
                <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                </svg>
                <p className="text-sm">此目錄中沒有照片</p>
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* ── Full-screen viewer ── */}
      {viewIdx !== null && currentPhoto && currentPath && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">

          {/* Viewer header */}
          <div className="flex items-center gap-3 px-4 py-3 shrink-0 bg-black/70">
            <span className="text-sm text-gray-400 truncate flex-1 min-w-0">
              {currentPhoto.name}
              <span className="text-gray-600 ml-2 text-xs">{viewIdx + 1} / {photos.length}</span>
            </span>
            <span className="text-xs text-gray-600 hidden sm:block">← → 切換　I 資訊</span>
            {/* Info toggle */}
            <button onClick={() => setShowInfo(v => !v)} title="資訊 (I)"
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                showInfo ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
              }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
              </svg>
            </button>
            <button onClick={() => { setViewIdx(null); setShowInfo(false) }}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl">
              ×
            </button>
          </div>

          {/* Viewer body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Image area */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden"
              onClick={e => { if (e.target === e.currentTarget) { setViewIdx(null); setShowInfo(false) } }}>

              <img src={downloadUrl(currentPath)}
                className="max-w-full max-h-full object-contain select-none"
                alt={currentPhoto.name}
                draggable={false}
              />

              {/* Prev */}
              {viewIdx > 0 && (
                <button onClick={() => setViewIdx(i => Math.max(0, (i ?? 1) - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5"/>
                  </svg>
                </button>
              )}
              {/* Next */}
              {viewIdx < photos.length - 1 && (
                <button onClick={() => setViewIdx(i => Math.min(photos.length - 1, (i ?? 0) + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Metadata panel */}
            {showInfo && (
              <MetaPanel
                filePath={currentPath}
                onClose={() => setShowInfo(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
