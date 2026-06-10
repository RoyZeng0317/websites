import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  urls: string[]
  onPreview: (urls: string[], index: number) => void
}

function isVideoUrl(url: string) {
  return url.includes('/video/upload/') || /\.(mp4|mov|webm)(\?|$)/i.test(url)
}

export default function MediaCarousel({ urls, onPreview }: Props) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const MIN_SWIPE = 40

  function prev() { setIndex(i => Math.max(0, i - 1)) }
  function next() { setIndex(i => Math.min(urls.length - 1, i + 1)) }

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

  const url = urls[index]
  const hasNav = urls.length > 1

  return (
    <div
      className="relative mt-3 rounded-xl overflow-hidden border border-dark-border select-none group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Current media */}
      {isVideoUrl(url) ? (
        <video
          src={url}
          controls
          className="w-full bg-black"
          style={{ maxHeight: 360 }}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <img
          src={url}
          alt=""
          className="w-full max-h-96 object-cover cursor-zoom-in"
          draggable={false}
          onClick={e => { e.stopPropagation(); onPreview(urls, index) }}
        />
      )}

      {/* Prev arrow */}
      {hasNav && index > 0 && (
        <button
          onClick={e => { e.stopPropagation(); prev() }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {/* Next arrow */}
      {hasNav && index < urls.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); next() }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Counter badge */}
      {hasNav && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full pointer-events-none">
          {index + 1} / {urls.length}
        </div>
      )}

      {/* Dot indicators */}
      {hasNav && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
          {urls.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setIndex(i) }}
              className={`rounded-full transition-all duration-200 ${
                i === index ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
