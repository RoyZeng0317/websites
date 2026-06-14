import { useEffect, useRef, useState } from 'react'

interface Props {
  src: string
  name: string
  onClose: () => void
}

export default function AudioPlayer({ src, name, onClose }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === ' ') { e.preventDefault(); togglePlay() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function togglePlay() {
    const a = audioRef.current
    if (!a) return
    if (a.paused) { a.play(); setPlaying(true) }
    else { a.pause(); setPlaying(false) }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const a = audioRef.current
    if (!a) return
    a.currentTime = Number(e.target.value)
  }

  function fmt(sec: number): string {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const baseName = name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-800">
        {/* Album art placeholder */}
        <div className="w-32 h-32 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-pink-500/30 to-orange-500/30 flex items-center justify-center">
          <svg className="w-14 h-14 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
          </svg>
        </div>

        {/* Track info */}
        <p className="text-white font-semibold text-center truncate mb-1">{baseName}</p>
        <p className="text-gray-500 text-xs text-center mb-5">{name.split('.').pop()?.toUpperCase() ?? ''}</p>

        {/* Seek bar */}
        <div className="space-y-1 mb-5">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={seek}
            className="w-full accent-pink-400 h-1.5"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-5">
          <button
            onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, currentTime - 10) }}
            className="text-gray-400 hover:text-white transition-colors"
            title="後退 10 秒"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4z" />
              <path d="M4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-colors shadow-lg"
          >
            {playing ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button
            onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(duration, currentTime + 10) }}
            className="text-gray-400 hover:text-white transition-colors"
            title="前進 10 秒"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5.334 6.4A1 1 0 004 7.2v8a1 1 0 001.6.8L11 12l-5.333-4A1 1 0 004.733 6.4z" />
              <path d="M12.334 6.4A1 1 0 0011 7.2v8a1 1 0 001.6.8L18 12l-5.333-4a1 1 0 00-.333-.6z" />
            </svg>
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z" />
            {volume > 0.5 && <path d="M18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />}
            {volume > 0 && <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />}
          </svg>
          <input
            type="range" min={0} max={1} step={0.05} value={volume}
            onChange={e => {
              const v = Number(e.target.value)
              setVolume(v)
              if (audioRef.current) audioRef.current.volume = v
            }}
            className="flex-1 accent-pink-400 h-1.5"
          />
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
        >
          關閉
        </button>

        <audio
          ref={audioRef}
          src={src}
          autoPlay
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
          onEnded={() => setPlaying(false)}
        />
      </div>
    </div>
  )
}
