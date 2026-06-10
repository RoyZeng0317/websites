import { useState, useEffect, useRef } from 'react'
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  urls: string[]
  initialIndex?: number
  onClose: () => void
  downloadName?: string
}

export default function ImageLightbox({ urls, initialIndex = 0, onClose, downloadName }: Props) {
  const [index, setIndex] = useState(initialIndex)
  const touchStartX = useRef<number | null>(null)
  const MIN_SWIPE = 40

  const hasNav = urls.length > 1

  function prev() { setIndex(i => Math.max(0, i - 1)) }
  function next() { setIndex(i => Math.min(urls.length - 1, i + 1)) }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (delta > MIN_SWIPE) next()
    else if (delta < -MIN_SWIPE) prev()
    touchStartX.current = null
  }

  async function handleDownload() {
    const src = urls[index]
    try {
      const res = await fetch(src)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = downloadName ?? `image-${index + 1}.jpg`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      toast.error('下載失敗')
    }
  }

  const src = urls[index]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm select-none"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top toolbar */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={e => { e.stopPropagation(); handleDownload() }}
          className="bg-white/10 hover:bg-white/25 text-white rounded-full p-2 transition-colors"
          title="下載"
        >
          <Download size={18} />
        </button>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/25 text-white rounded-full p-2 transition-colors"
          title="關閉"
        >
          <X size={18} />
        </button>
      </div>

      {/* Counter */}
      {hasNav && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium pointer-events-none">
          {index + 1} / {urls.length}
        </div>
      )}

      {/* Prev arrow */}
      {hasNav && index > 0 && (
        <button
          onClick={e => { e.stopPropagation(); prev() }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-2.5 transition-colors z-10"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Next arrow */}
      {hasNav && index < urls.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); next() }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-2.5 transition-colors z-10"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Image */}
      <img
        src={src}
        alt="preview"
        className="max-w-[88vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}
        draggable={false}
      />

      {/* Dot indicators */}
      {hasNav && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {urls.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setIndex(i) }}
              className={`rounded-full transition-all duration-200 ${
                i === index ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
