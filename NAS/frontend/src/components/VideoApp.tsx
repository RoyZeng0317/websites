import { useState, useEffect, useCallback } from 'react'
import { apiJson, downloadUrl } from '../lib/api'
import FolderSidebar from './FolderSidebar'
import VideoPlayer from './viewers/VideoPlayer'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: number
}

interface Props { onClose: () => void }

const VIDEO_EXTS = new Set([
  'mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'wmv', 'm4v', 'mpg', 'mpeg', 'ts', '3gp',
])

function isVideo(name: string) {
  return VIDEO_EXTS.has(name.split('.').pop()?.toLowerCase() ?? '')
}

function fmtSize(b?: number) {
  if (!b) return ''
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(0)} KB`
  if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`
  return `${(b / 1024 ** 3).toFixed(2)} GB`
}

export default function VideoApp({ onClose }: Props) {
  const [path, setPath] = useState('')
  const [items, setItems] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [playIdx, setPlayIdx] = useState<number | null>(null)

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
    function onKey(e: KeyboardEvent) { if (playIdx === null && e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, playIdx])

  const folders = items.filter(i => i.type === 'folder')
  const videos = items.filter(i => i.type === 'file' && isVideo(i.name))

  function videoPath(name: string) { return path ? `${path}/${name}` : name }
  function openFolder(name: string) { setPath(p => p ? `${p}/${name}` : name) }
  function goBack() {
    const idx = path.lastIndexOf('/')
    setPath(idx === -1 ? '' : path.slice(0, idx))
  }

  const current = playIdx !== null ? videos[playIdx] : null
  const currentPath = current ? videoPath(current.name) : null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0 bg-black/60">
        <div className="flex items-center gap-3 min-w-0">
          <svg className="w-5 h-5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <h2 className="text-base font-bold text-white">Video</h2>
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 ml-2 min-w-0">
            <button onClick={() => setPath('')} className="hover:text-white shrink-0">All Videos</button>
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
          <span className="text-xs text-gray-500">{videos.length} videos</span>
          {path && (
            <button onClick={goBack}
              className="px-3 h-8 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300">Back</button>
          )}
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl">×</button>
        </div>
      </div>

      {/* Body: left folder explorer + right video list */}
      <div className="flex-1 flex min-h-0">
        <FolderSidebar
          folders={folders}
          onOpenFolder={openFolder}
          canGoUp={!!path}
          onGoUp={goBack}
          accent="text-blue-400"
          label="Folders"
        />
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : videos.length > 0 ? (
            <ul className="divide-y divide-gray-800">
              {videos.map((v, i) => (
                <li key={v.name}>
                  <button
                    onClick={() => setPlayIdx(i)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors text-left"
                  >
                    <span className="w-9 h-9 shrink-0 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" />
                      </svg>
                    </span>
                    <span className="flex-1 min-w-0">
                      <p className="text-sm truncate">{v.name}</p>
                      <p className="text-xs text-gray-600">
                        {v.name.split('.').pop()?.toUpperCase()}{v.size ? ` · ${fmtSize(v.size)}` : ''}
                      </p>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-2">
              <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <p className="text-sm">No videos in this folder</p>
            </div>
          )}
        </div>
      </div>

      {/* Full-screen player overlay */}
      {playIdx !== null && current && currentPath && (
        <VideoPlayer
          src={downloadUrl(currentPath)}
          name={current.name}
          filePath={currentPath}
          onClose={() => setPlayIdx(null)}
        />
      )}
    </div>
  )
}
