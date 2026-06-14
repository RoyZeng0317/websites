import { useState, useEffect, useRef, useCallback } from 'react'
import { apiJson } from '../lib/api'
import { downloadUrl } from '../lib/api'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: number
  modified?: string
}

interface LyricLine {
  time: number
  text: string
}

interface Props {
  onClose: () => void
}

const AUDIO_EXTS = new Set(['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'opus', 'wma'])

function isAudio(name: string): boolean {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return AUDIO_EXTS.has(ext)
}

function fmtTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function baseName(name: string): string {
  return name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name
}

function lrcName(name: string): string {
  return baseName(name) + '.lrc'
}

function parseLrc(text: string): LyricLine[] {
  const lines: LyricLine[] = []
  const tagRe = /^\[(ti|ar|al|by|offset|re|ve):.*\]$/
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line || tagRe.test(line)) continue
    const matches = line.matchAll(/\[(\d{1,3}):(\d{2})(?:[.:](\d{2,3}))?\]/g)
    const textPart = line.replace(/\[.+?\]/g, '').trim()
    if (!textPart) continue
    for (const m of matches) {
      const min = parseInt(m[1])
      const sec = parseInt(m[2])
      const ms = parseInt(m[3] ?? '0')
      const time = min * 60 + sec + (m[3]?.length === 3 ? ms / 1000 : ms / 100)
      lines.push({ time, text: textPart })
    }
  }
  lines.sort((a, b) => a.time - b.time)
  return lines
}

export default function MusicApp({ onClose }: Props) {
  const [path, setPath] = useState('')
  const [items, setItems] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const lyricsListRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const [lyricsLoading, setLyricsLoading] = useState(false)
  const [muted, setMuted] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const load = useCallback(async (dir: string) => {
    setLoading(true)
    try {
      const data = await apiJson<{ items: FileItem[] }>(
        `/api/files?path=${encodeURIComponent(dir)}`
      )
      setItems(data.items)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(path) }, [path, load])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === 'Escape') {
        if (showHelp) { setShowHelp(false); return }
        onClose(); return
      }
      if (e.shiftKey && e.key === '?') {
        e.preventDefault(); setShowHelp(v => !v); return
      }
      if (e.key === ' ') {
        e.preventDefault()
        const a = audioRef.current
        if (!a) return
        const { currentIndex: ci, tracks: tr } = liveRef.current
        if (ci === null && tr.length > 0) { setCurrentIndex(0); setPlaying(true); return }
        if (a.paused) { a.play(); setPlaying(true) } else { a.pause(); setPlaying(false) }
        return
      }
      if (e.key === 'm' || e.key === 'M') {
        const a = audioRef.current; if (!a) return
        const next = !a.muted; a.muted = next; setMuted(next); return
      }
      const a = audioRef.current; if (!a) return
      if (e.key === 'ArrowRight') {
        e.preventDefault(); a.currentTime = Math.min(a.duration || 0, a.currentTime + 5)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault(); a.currentTime = Math.max(0, a.currentTime - 5)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const v = Math.min(1, Math.round((a.volume + 0.05) * 100) / 100)
        a.volume = v; setVolume(v)
        if (v > 0 && a.muted) { a.muted = false; setMuted(false) }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const v = Math.max(0, Math.round((a.volume - 0.05) * 100) / 100)
        a.volume = v; setVolume(v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, showHelp])

  const tracks = items.filter(i => i.type === 'file' && isAudio(i.name))
  const folders = items.filter(i => i.type === 'folder')

  // Live ref — placed AFTER tracks/folders to avoid TDZ crash
  const liveRef = useRef({ currentIndex, tracks, playing })
  useEffect(() => { liveRef.current = { currentIndex, tracks, playing } }, [currentIndex, tracks, playing])

  function trackPath(index: number) {
    const name = tracks[index]?.name
    if (!name) return ''
    return path ? `${path}/${name}` : name
  }

  function trackLrcPath(index: number) {
    const name = tracks[index]?.name
    if (!name) return ''
    const lrc = lrcName(name)
    return path ? `${path}/${lrc}` : lrc
  }

  async function loadLyrics(index: number) {
    setLyrics([])
    setLyricsLoading(true)
    try {
      const lrc = trackLrcPath(index)
      if (!lrc) return
      const res = await fetch(downloadUrl(lrc))
      if (!res.ok) return
      const text = await res.text()
      setLyrics(parseLrc(text))
    } catch {
      // no lyrics
    } finally {
      setLyricsLoading(false)
    }
  }

  function playTrack(index: number) {
    if (index < 0 || index >= tracks.length) return
    setCurrentIndex(index)
    setPlaying(true)
    loadLyrics(index)
  }

  function togglePlay() {
    const a = audioRef.current
    if (!a) return
    if (currentIndex === null && tracks.length > 0) {
      playTrack(0)
      return
    }
    if (a.paused) { a.play(); setPlaying(true) }
    else { a.pause(); setPlaying(false) }
  }

  function nextTrack() {
    if (currentIndex === null || currentIndex >= tracks.length - 1) return
    playTrack(currentIndex + 1)
  }

  function prevTrack() {
    if (currentIndex === null || currentIndex <= 0) return
    playTrack(currentIndex - 1)
  }

  function openFolder(name: string) {
    setPath(p => p ? `${p}/${name}` : name)
  }

  function goBack() {
    const idx = path.lastIndexOf('/')
    setPath(idx === -1 ? '' : path.slice(0, idx))
  }

  const currentTrackName = currentIndex !== null ? tracks[currentIndex]?.name : null

  function handleEnded() {
    if (currentIndex !== null && currentIndex < tracks.length - 1) {
      playTrack(currentIndex + 1)
    } else {
      setPlaying(false)
    }
  }

  const currentLyricIdx = (() => {
    let idx = -1
    for (let i = 0; i < lyrics.length; i++) { if (lyrics[i].time <= currentTime) idx = i }
    return idx
  })()

  useEffect(() => {
    if (currentLyricIdx >= 0 && lyricsListRef.current) {
      const el = lyricsListRef.current.children[currentLyricIdx] as HTMLElement | undefined
      if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [currentLyricIdx])

  const SHORTCUTS = [
    ['Space','播放 / 暫停'], ['→','快進 5 秒'], ['←','快退 5 秒'],
    ['↑','音量 +5%'], ['↓','音量 -5%'], ['M','靜音切換'],
    ['Shift+?','快捷鍵說明'], ['Esc','關閉'],
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">

      {/* Help overlay */}
      {showHelp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60" onClick={() => setShowHelp(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-72 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">鍵盤快捷鍵</h3>
              <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-white text-lg leading-none">×</button>
            </div>
            <div className="space-y-2.5">
              {SHORTCUTS.map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <kbd className="px-2 py-0.5 rounded bg-gray-800 border border-gray-600 text-xs font-mono text-gray-200 shrink-0">{key}</kbd>
                  <span className="text-sm text-gray-400 text-right">{desc}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-4 text-center">再按 Shift+? 關閉</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0 bg-black/60">
        <div className="flex items-center gap-3 min-w-0">
          <svg className="w-5 h-5 text-pink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
          </svg>
          <h2 className="text-base font-bold text-white">音樂播放器</h2>
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 ml-2 min-w-0">
            <button
              onClick={() => setPath('')}
              className="hover:text-white shrink-0"
            >全部音樂</button>
            {path.split('/').filter(Boolean).map((part, i, arr) => (
              <span key={i} className="flex items-center gap-1.5 min-w-0">
                <span className="text-gray-600">/</span>
                <button
                  onClick={() => setPath(arr.slice(0, i + 1).join('/'))}
                  className="hover:text-white truncate"
                >{part}</button>
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{tracks.length} 首曲目</span>
          <button onClick={() => setShowHelp(v => !v)} title="快捷鍵說明 (Shift+?)"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-sm font-bold transition-colors">?</button>
          {path && (
            <button
              onClick={goBack}
              className="px-3 h-8 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
            >上一頁</button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl"
          >×</button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Player bar */}
        {currentTrackName && (
          <div className="shrink-0 px-5 py-4 bg-gray-900/80 border-b border-gray-800">
            <div className="flex items-center gap-4 mb-3">
              {/* Album art */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/30 to-orange-500/30 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{baseName(currentTrackName)}</p>
                  {lyricsLoading && (
                    <span className="shrink-0 w-3 h-3 border border-pink-400 border-t-transparent rounded-full animate-spin"/>
                  )}
                  {!lyricsLoading && lyrics.length > 0 && (
                    <span className="shrink-0 text-xs bg-pink-500/20 text-pink-400 border border-pink-500/30 px-1.5 py-0.5 rounded font-mono">LRC</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{currentTrackName.split('.').pop()?.toUpperCase()}</p>
              </div>
              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prevTrack}
                  disabled={currentIndex === null || currentIndex <= 0}
                  className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V7.172c0-1.41-1.555-2.323-2.805-1.628L12 9.53V7.172c0-1.41-1.555-2.323-2.805-1.628l-7.108 4.062c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z" />
                  </svg>
                </button>
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-colors"
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
                  onClick={nextTrack}
                  disabled={currentIndex === null || currentIndex >= tracks.length - 1}
                  className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5.055 7.172c0-1.41 1.555-2.323 2.805-1.628L14.805 9.53V7.172c0-1.41 1.555-2.323 2.805-1.628l7.108 4.062c1.26.72 1.26 2.536 0 3.256l-7.108 4.061c-1.25.714-2.805-.188-2.805-1.628v-2.34l-6.945 3.968c-1.25.714-2.805-.188-2.805-1.628V7.172z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Seek bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-10 text-right shrink-0">{fmtTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={e => {
                  const v = Number(e.target.value)
                  if (audioRef.current) audioRef.current.currentTime = v
                }}
                className="flex-1 accent-pink-400 h-1.5"
              />
              <span className="text-xs text-gray-500 w-10 shrink-0">{fmtTime(duration)}</span>
              <div className="flex items-center gap-1.5 w-32 shrink-0">
                <button title="靜音 (M)" onClick={() => {
                  const a = audioRef.current; if (!a) return
                  const next = !a.muted; a.muted = next; setMuted(next)
                }} className="shrink-0 text-gray-500 hover:text-white transition-colors">
                  {muted || volume === 0 ? (
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z" />
                      <path stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" fill="none" d="M17 7l4 4m0-4l-4 4" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z" />
                      {volume > 0.5 && <path d="M18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />}
                      {volume > 0   && <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />}
                    </svg>
                  )}
                </button>
                <input
                  type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
                  onChange={e => {
                    const v = Number(e.target.value)
                    setVolume(v)
                    if (audioRef.current) {
                      audioRef.current.volume = v
                      if (v > 0 && audioRef.current.muted) { audioRef.current.muted = false; setMuted(false) }
                    }
                  }}
                  className="flex-1 accent-pink-400 h-1.5"
                />
                <span className="text-xs text-gray-600 w-8 shrink-0 font-mono text-right">
                  {muted ? '靜音' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Lyrics area — only when lyrics loaded */}
        {currentTrackName && lyrics.length > 0 && (
          <div className="flex-1 overflow-y-auto py-6 px-8">
            <div className="space-y-5 text-center" ref={lyricsListRef}>
              {lyrics.map((l, i) => {
                const isPast = i < currentLyricIdx
                const isCurrent = i === currentLyricIdx
                return (
                  <p
                    key={i}
                    onClick={() => { if (audioRef.current) audioRef.current.currentTime = l.time }}
                    className={`cursor-pointer transition-all duration-300 ${
                      isCurrent
                        ? 'text-pink-400 text-xl font-bold scale-110'
                        : isPast
                          ? 'text-gray-600 text-sm'
                          : 'text-gray-400 text-base hover:text-gray-200'
                    }`}
                  >
                    {l.text}
                  </p>
                )
              })}
            </div>
          </div>
        )}

        {/* Track list — shown when no track playing, or no lyrics */}
        {(!currentTrackName || lyrics.length === 0) ? (
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="p-3">
                {folders.length > 0 && (
                  <div className="mb-4 px-2">
                    <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">資料夾</p>
                    <div className="flex flex-wrap gap-2">
                      {folders.map(f => (
                        <button
                          key={f.name}
                          onClick={() => openFolder(f.name)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
                        >
                          <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                          </svg>
                          <span className="text-sm text-gray-200">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tracks.length > 0 ? (
                  <ul className="divide-y divide-gray-800">
                    {tracks.map((t, i) => (
                      <li key={t.name}>
                        <button
                          onClick={() => playTrack(i)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                            currentIndex === i
                              ? 'bg-pink-900/30 text-pink-300'
                              : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          <span className="text-xs text-gray-600 w-6 shrink-0 text-right">
                            {currentIndex === i && playing ? (
                              <span className="flex items-center gap-0.5 justify-end">
                                <span className="w-0.5 h-3 bg-pink-400 rounded-full animate-pulse" />
                                <span className="w-0.5 h-4 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                <span className="w-0.5 h-2.5 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                              </span>
                            ) : (
                              String(i + 1)
                            )}
                          </span>
                          <svg className="w-4 h-4 text-pink-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                          </svg>
                          <span className="flex-1 min-w-0">
                            <p className="text-sm truncate">{baseName(t.name)}</p>
                            <p className="text-xs text-gray-600">{t.name.split('.').pop()?.toUpperCase()}{t.size ? ` · ${(t.size / 1024 / 1024).toFixed(1)} MB` : ''}</p>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : folders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-2">
                    <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>
                    <p className="text-sm">此目錄中沒有音樂檔案</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ) : null}

        {/* Mini track list when lyrics shown */}
        {currentTrackName && lyrics.length > 0 && (
          <div className="shrink-0 border-t border-gray-800">
            <details className="group">
              <summary className="px-5 py-2 text-xs text-gray-500 hover:text-gray-300 cursor-pointer flex items-center gap-2 select-none">
                <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
                播放清單 ({tracks.length})
              </summary>
              <div className="max-h-40 overflow-y-auto border-t border-gray-800">
                {tracks.map((t, i) => (
                  <button
                    key={t.name}
                    onClick={() => playTrack(i)}
                    className={`w-full flex items-center gap-2 px-5 py-1.5 text-left transition-colors ${
                      currentIndex === i ? 'bg-pink-900/20 text-pink-300' : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-xs w-5 shrink-0 text-right">{i + 1}</span>
                    <span className="text-xs truncate">{baseName(t.name)}</span>
                  </button>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentIndex !== null ? downloadUrl(trackPath(currentIndex)) : ''}
        autoPlay={playing}
        muted={muted}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={handleEnded}
      />
    </div>
  )
}
