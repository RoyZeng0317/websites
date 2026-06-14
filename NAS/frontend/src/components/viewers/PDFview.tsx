import { useEffect } from 'react'

interface Props {
  src: string
  name: string
  onClose: () => void
}

export default function PDFview({ src, name, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-black/60 border-b border-white/5">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-sm text-gray-300 truncate max-w-md">{name}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={src}
            download={name}
            className="px-3 py-1.5 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            下載
          </a>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-white text-xl transition-colors"
          >×</button>
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 bg-gray-900 overflow-hidden relative">
        <iframe
          src={`${src}#toolbar=0`}
          className="w-full h-full border-none"
          title={name}
        />
        {/* Transparent overlay to catch clicks if needed, though iframe usually handles its own */}
      </div>

      <p className="text-center text-xs text-gray-600 py-2 shrink-0 bg-black/40">
        使用瀏覽器內建 PDF 閱讀器 · ESC 關閉
      </p>
    </div>
  )
}
