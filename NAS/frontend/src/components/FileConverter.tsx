import { useState } from 'react'
import toast from 'react-hot-toast'
import { apiJson } from '../lib/api'

interface Props { onClose: () => void }
interface FileItem { name: string; type: 'file' | 'folder' }

const VIDEO_EXTS = new Set(['mp4','mov','avi','mkv','webm','m4v','3gp','flv','wmv'])
const AUDIO_EXTS = new Set(['mp3','aac','wav','flac','m4a','ogg','wma'])
const IMAGE_EXTS = new Set(['jpg','jpeg','png','gif','bmp','webp','tiff','heic'])

const getExt = (n: string) => n.split('.').pop()?.toLowerCase() ?? ''
const getCat = (n: string) => {
  const e = getExt(n)
  if (VIDEO_EXTS.has(e)) return 'video'
  if (AUDIO_EXTS.has(e)) return 'audio'
  if (IMAGE_EXTS.has(e)) return 'image'
  return 'other'
}

const CONVERT_OPTIONS: Record<string, { label: string; targets: { value: string; label: string }[] }> = {
  video: {
    label: '影片',
    targets: [
      { value: 'to-images', label: '→ 圖片 (JPG)' },
      { value: 'mp4',       label: '→ MP4' },
      { value: 'mkv',       label: '→ MKV' },
      { value: 'mov',       label: '→ MOV' },
      { value: 'webm',      label: '→ WebM' },
      { value: 'gif',       label: '→ GIF（動圖）' },
      { value: 'mp3',       label: '→ MP3（萃取音頻）' },
      { value: 'aac',       label: '→ AAC（萃取音頻）' },
    ],
  },
  audio: {
    label: '音訊',
    targets: [
      { value: 'mp3',  label: '→ MP3' },
      { value: 'aac',  label: '→ AAC' },
      { value: 'wav',  label: '→ WAV' },
      { value: 'flac', label: '→ FLAC' },
      { value: 'ogg',  label: '→ OGG' },
    ],
  },
  image: {
    label: '圖片',
    targets: [
      { value: 'jpg',  label: '→ JPG' },
      { value: 'png',  label: '→ PNG' },
      { value: 'webp', label: '→ WebP' },
      { value: 'gif',  label: '→ GIF' },
      { value: 'bmp',  label: '→ BMP' },
    ],
  },
}

export default function FileConverter({ onClose }: Props) {
  const [browsePath, setBrowsePath]   = useState('')
  const [browseItems, setBrowseItems] = useState<FileItem[]>([])
  const [browseLoading, setBrowseLoading] = useState(false)
  const [selectedFile, setSelectedFile]   = useState<{ path: string; name: string } | null>(null)
  const [targetFmt, setTargetFmt]     = useState('')
  const [busy, setBusy]               = useState(false)
  const [result, setResult]           = useState<string | null>(null)
  const [loaded, setLoaded]           = useState(false)

  const cat = selectedFile ? getCat(selectedFile.name) : null
  const options = cat && CONVERT_OPTIONS[cat] ? CONVERT_OPTIONS[cat].targets : []

  async function loadBrowse(p: string) {
    setBrowseLoading(true)
    try {
      const d = await apiJson<{ items: FileItem[] }>(`/api/files?path=${encodeURIComponent(p)}`)
      setBrowseItems(d.items ?? [])
      setBrowsePath(p)
      if (!loaded) setLoaded(true)
    } catch { toast.error('載入失敗') }
    setBrowseLoading(false)
  }

  async function handleConvert() {
    if (!selectedFile || !targetFmt) return
    setBusy(true); setResult(null)
    try {
      if (targetFmt === 'to-images') {
        const r = await apiJson<{ ok: boolean; type: string; output?: string; count?: number; duration: number }>(
          '/api/video/to-images',
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: selectedFile.path }) }
        )
        setResult(r.type === 'single'
          ? `已轉換為 ${r.output}（影片長度 ${r.duration.toFixed(2)} 秒 < 1 秒）`
          : `已擷取 ${r.count} 張圖片（每秒一幀）`)
      } else {
        const r = await apiJson<{ ok: boolean; output: string }>(
          '/api/file/convert',
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: selectedFile.path, format: targetFmt }) }
        )
        setResult(`已轉換：${r.output}`)
      }
      toast.success('轉換完成')
    } catch (e) { toast.error((e as Error).message) }
    setBusy(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl mx-4 flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold">檔案轉換</p>
              <p className="text-gray-500 text-xs">影片 / 音訊 / 圖片 格式轉換</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: File browser */}
          <div className="w-56 shrink-0 border-r border-gray-800 flex flex-col">
            <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-800">
              {browsePath && (
                <button onClick={() => loadBrowse(browsePath.split('/').slice(0,-1).join('/'))}
                  className="text-gray-500 hover:text-white">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                </button>
              )}
              <span className="text-[10px] text-gray-500 truncate flex-1">{browsePath || '根目錄'}</span>
              {!loaded && (
                <button onClick={() => loadBrowse('')}
                  className="text-[10px] text-purple-400 hover:text-purple-300 shrink-0">載入</button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
              {!loaded ? (
                <div className="text-center py-8">
                  <button onClick={() => loadBrowse('')}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-700/40 text-purple-400 text-xs hover:bg-purple-600/30">
                    瀏覽檔案
                  </button>
                </div>
              ) : browseLoading ? (
                <div className="text-center py-8 text-gray-600 text-xs">載入中...</div>
              ) : browseItems.map(item => {
                const isDir = item.type === 'folder'
                const c = getCat(item.name)
                const isSupported = isDir || c !== 'other'
                return (
                  <button key={item.name}
                    disabled={!isSupported}
                    onClick={() => {
                      const p = browsePath ? `${browsePath}/${item.name}` : item.name
                      if (isDir) { loadBrowse(p); return }
                      setSelectedFile({ path: p, name: item.name })
                      setTargetFmt('')
                      setResult(null)
                    }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-colors disabled:opacity-30
                      ${selectedFile?.path === (browsePath ? `${browsePath}/${item.name}` : item.name) ? 'bg-purple-900/40 border border-purple-700/60' : ''}
                      ${isDir ? 'text-gray-400 hover:bg-gray-800' :
                        c === 'video' ? 'text-purple-300 hover:bg-purple-900/20' :
                        c === 'audio' ? 'text-blue-300 hover:bg-blue-900/20' :
                        c === 'image' ? 'text-green-300 hover:bg-green-900/20' :
                        'text-gray-600 cursor-not-allowed'}`}>
                    {isDir
                      ? <svg className="w-3.5 h-3.5 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>
                      : c === 'video'
                        ? <svg className="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/></svg>
                        : c === 'audio'
                          ? <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"/></svg>
                          : <svg className="w-3.5 h-3.5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                    }
                    <span className="truncate">{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Conversion options */}
          <div className="flex-1 flex flex-col p-5 gap-4 overflow-y-auto">
            {!selectedFile ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">從左側選擇要轉換的檔案</p>
                <p className="text-gray-700 text-xs">支援影片 / 音訊 / 圖片</p>
              </div>
            ) : (
              <>
                {/* Selected file info */}
                <div className="bg-gray-800/60 rounded-xl p-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    cat === 'video' ? 'bg-purple-900/60' : cat === 'audio' ? 'bg-blue-900/60' : 'bg-green-900/60'}`}>
                    <span className="text-sm">{cat === 'video' ? '🎬' : cat === 'audio' ? '🎵' : '🖼'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 truncate">{selectedFile.path}</p>
                  </div>
                  <button onClick={() => { setSelectedFile(null); setTargetFmt(''); setResult(null) }}
                    className="text-gray-600 hover:text-red-400 text-xs shrink-0">✕</button>
                </div>

                {/* Format selection */}
                <div>
                  <p className="text-xs text-gray-400 mb-2 font-medium">選擇輸出格式</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {options.map(opt => (
                      <button key={opt.value} onClick={() => setTargetFmt(opt.value)}
                        className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left border transition-colors ${
                          targetFmt === opt.value
                            ? 'bg-purple-600 border-purple-500 text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Convert button */}
                <button onClick={handleConvert} disabled={!targetFmt || busy}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                  {busy
                    ? <><span className="animate-spin">◌</span> 轉換中...</>
                    : targetFmt ? `開始轉換 ${selectedFile.name.replace(/\.[^.]+$/,'')} ${options.find(o=>o.value===targetFmt)?.label}` : '請選擇輸出格式'}
                </button>

                {/* Result */}
                {result && (
                  <div className="bg-green-900/20 border border-green-700/40 rounded-xl px-4 py-3">
                    <p className="text-green-400 text-sm font-medium">✓ 轉換成功</p>
                    <p className="text-gray-400 text-xs mt-1">{result}</p>
                    <p className="text-gray-600 text-xs mt-1">檔案已儲存至原始目錄</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
