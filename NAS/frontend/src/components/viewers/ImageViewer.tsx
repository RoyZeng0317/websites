import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '../../lib/api'

interface Props {
  src: string
  name: string
  filePath?: string
  onClose: () => void
}

type OcrLang = 'chi_tra+eng' | 'chi_sim+eng' | 'eng' | 'jpn+eng'

const LANG_LABELS: Record<OcrLang, string> = {
  'chi_tra+eng': '繁中+英',
  'chi_sim+eng': '簡中+英',
  'eng': '英文',
  'jpn+eng': '日文+英',
}

export default function ImageViewer({ src, name, filePath, onClose }: Props) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // OCR state
  const [ocrOpen, setOcrOpen] = useState(false)
  const [ocrLang, setOcrLang] = useState<OcrLang>('chi_tra+eng')
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrText, setOcrText] = useState<string | null>(null)
  const [ocrError, setOcrError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const reset = useCallback(() => { setScale(1); setOffset({ x: 0, y: 0 }) }, [])

  async function runOcr() {
    if (!filePath) return
    setOcrLoading(true)
    setOcrError(null)
    setOcrText(null)
    try {
      const res = await apiFetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath, lang: ocrLang }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`)
      setOcrText((data as { text?: string }).text || '（未識別到任何文字）')
    } catch (e: unknown) {
      setOcrError((e as Error).message ?? '辨識失敗')
    } finally {
      setOcrLoading(false)
    }
  }

  async function copyText() {
    if (!ocrText) return
    await navigator.clipboard.writeText(ocrText)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') setScale(s => Math.min(s + 0.25, 5))
      if (e.key === '-') setScale(s => Math.max(s - 0.25, 0.25))
      if (e.key === '0') reset()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, reset])

  function onWheel(e: React.WheelEvent) {
    e.preventDefault()
    setScale(s => Math.max(0.25, Math.min(5, s - e.deltaY * 0.001)))
  }

  function onMouseDown(e: React.MouseEvent) {
    if (scale <= 1) return
    setDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragging) return
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  function onMouseUp() { setDragging(false) }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" onWheel={onWheel}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-black/60">
        <p className="text-sm text-gray-300 truncate max-w-xs">{name}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(s => Math.min(s + 0.25, 5))}
            className="w-8 h-8 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-white text-lg"
            title="放大 (+)"
          >+</button>
          <span className="text-xs text-gray-400 w-12 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(s => Math.max(s - 0.25, 0.25))}
            className="w-8 h-8 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-white text-lg"
            title="縮小 (-)"
          >−</button>
          <button
            onClick={reset}
            className="px-2 h-8 text-xs rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
            title="重置 (0)"
          >1:1</button>

          {/* OCR toggle button — only shown when filePath is available */}
          {filePath && (
            <button
              onClick={() => setOcrOpen(o => !o)}
              className={`px-2.5 h-8 text-xs rounded font-medium transition-colors ${
                ocrOpen
                  ? 'bg-violet-600 hover:bg-violet-500 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
              title="OCR 文字識別"
            >OCR</button>
          )}

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-white text-xl"
          >×</button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex-1 min-h-0 overflow-hidden flex items-center justify-center"
        style={{ cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <img
          src={src}
          alt={name}
          draggable={false}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: dragging ? 'none' : 'transform 0.1s ease',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            userSelect: 'none',
          }}
        />
      </div>

      {/* OCR panel */}
      {ocrOpen && (
        <div className="shrink-0 border-t border-gray-800 bg-gray-950 flex flex-col" style={{ maxHeight: '42%' }}>
          {/* OCR controls */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 shrink-0">
            <svg className="w-3.5 h-3.5 text-violet-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
            <span className="text-xs text-gray-400 font-medium">文字識別</span>

            <select
              value={ocrLang}
              onChange={e => setOcrLang(e.target.value as OcrLang)}
              className="ml-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 px-2 py-1 outline-none focus:border-violet-500"
            >
              {(Object.entries(LANG_LABELS) as [OcrLang, string][]).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>

            <button
              onClick={runOcr}
              disabled={ocrLoading}
              className="px-3 py-1 rounded text-xs font-medium bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
            >
              {ocrLoading ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  識別中…
                </span>
              ) : '識別文字'}
            </button>

            {ocrText && (
              <button
                onClick={copyText}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {copied ? '已複製' : '複製'}
              </button>
            )}

            <button
              onClick={() => setOcrOpen(false)}
              className="ml-auto w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 text-gray-500 hover:text-gray-300 text-lg leading-none"
            >×</button>
          </div>

          {/* OCR result */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {!ocrLoading && !ocrError && !ocrText && (
              <p className="text-xs text-gray-600">選擇語言後點擊「識別文字」開始 OCR 辨識</p>
            )}
            {ocrError && (
              <p className="text-xs text-red-400 whitespace-pre-wrap">{ocrError}</p>
            )}
            {ocrText && (
              <pre className="text-sm text-gray-200 whitespace-pre-wrap break-words font-sans leading-relaxed">{ocrText}</pre>
            )}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-700 py-2 shrink-0">
        滾輪縮放 · 拖曳移動 · ESC 關閉
      </p>
    </div>
  )
}
