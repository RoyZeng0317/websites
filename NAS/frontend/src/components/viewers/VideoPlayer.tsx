import { useEffect, useRef, useState, useCallback } from 'react'
import { downloadUrl } from '../../lib/api'
import MetaPanel from './MetaPanel'

interface Props {
  src: string
  name: string
  filePath?: string
  onClose: () => void
}

interface Hint { text: string; key: number }

type SubStatus = 'idle' | 'loading' | 'found' | 'notfound'

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3]
const SAVE_INTERVAL_S = 5
const RESUME_THRESHOLD_S = 10

function formatTime(s: number): string {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

function srtToVtt(srt: string): string {
  const text = srt.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const blocks = text.split(/\n{2,}/)
  const vttBlocks = blocks
    .map(block => {
      const lines = block.trim().split('\n')
      if (/^\d+$/.test(lines[0])) lines.shift()
      return lines
        .map(l => l.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2'))
        .join('\n')
    })
    .filter(b => b.includes('-->'))
  return 'WEBVTT\n\n' + vttBlocks.join('\n\n')
}

export default function VideoPlayer({ src, name, filePath, onClose }: Props) {
  const videoRef       = useRef<HTMLVideoElement>(null)
  const trackRef       = useRef<HTMLTrackElement | null>(null)
  const subtitleBlob   = useRef<string | null>(null)
  const subtitleFileRef = useRef<HTMLInputElement | null>(null)
  const hintTimer      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedRef   = useRef(0)
  const speedRef       = useRef(1)
  const subOnRef       = useRef(true)

  const [hint, setHint]         = useState<Hint | null>(null)
  const [resumeAt, setResumeAt] = useState<number | null>(null)
  const [speed, setSpeed]       = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [showInfo, setShowInfo]   = useState(false)

  const [subtitleUrl, setSubtitleUrl]     = useState<string | null>(null)
  const [subtitleOn, setSubtitleOn]       = useState(true)
  const [subtitleStatus, setSubtitleStatus] = useState<SubStatus>('idle')
  const [subtitleName, setSubtitleName]   = useState('')
  const [showSubMenu, setShowSubMenu]     = useState(false)

  const progressKey = filePath ? `nas_vp_${filePath}` : null

  // ── keep refs in sync ───────────────────────────────────────────────────────
  speedRef.current = speed
  subOnRef.current = subtitleOn

  // ── helpers ─────────────────────────────────────────────────────────────────
  function showHint(text: string) {
    if (hintTimer.current) clearTimeout(hintTimer.current)
    setHint({ text, key: Date.now() })
    hintTimer.current = setTimeout(() => setHint(null), 900)
  }

  function applySpeed(s: number) {
    const v = videoRef.current
    if (v) v.playbackRate = s
    speedRef.current = s
    setSpeed(s)
    showHint(`${s}×`)
    setShowSpeedMenu(false)
  }

  function loadSubtitleContent(content: string, label: string) {
    const vttContent = content.includes('WEBVTT') ? content : srtToVtt(content)
    if (subtitleBlob.current) URL.revokeObjectURL(subtitleBlob.current)
    const blob = new Blob([vttContent], { type: 'text/vtt' })
    const url  = URL.createObjectURL(blob)
    subtitleBlob.current = url
    setSubtitleUrl(url)
    setSubtitleName(label)
    setSubtitleStatus('found')
    setSubtitleOn(true)
  }

  // ── auto-detect subtitle ────────────────────────────────────────────────────
  useEffect(() => {
    if (!filePath) return
    const base = filePath.replace(/\.[^/.]+$/, '')
    let cancelled = false

    async function detect() {
      setSubtitleStatus('loading')
      for (const ext of ['.vtt', '.srt']) {
        if (cancelled) return
        try {
          const res = await fetch(downloadUrl(base + ext))
          if (!res.ok) continue
          const text = await res.text()
          if (cancelled) return
          loadSubtitleContent(text, base.split('/').pop() + ext)
          return
        } catch { /* not found, try next */ }
      }
      if (!cancelled) setSubtitleStatus('notfound')
    }

    detect()
    return () => {
      cancelled = true
      if (subtitleBlob.current) { URL.revokeObjectURL(subtitleBlob.current); subtitleBlob.current = null }
    }
  }, [filePath]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── apply subtitle track mode when on/off changes ──────────────────────────
  useEffect(() => {
    const t = trackRef.current?.track
    if (!t) return
    t.mode = subtitleOn ? 'showing' : 'hidden'
  }, [subtitleOn, subtitleUrl])

  // ── close menus on outside click ────────────────────────────────────────────
  useEffect(() => {
    function close() { setShowSpeedMenu(false); setShowSubMenu(false) }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  // ── progress tracking ───────────────────────────────────────────────────────
  function saveProgress() {
    if (!progressKey) return
    const v = videoRef.current
    if (!v || v.readyState < 1 || v.currentTime < 1) return
    localStorage.setItem(progressKey, JSON.stringify({ t: v.currentTime }))
  }

  const handleLoadedMetadata = useCallback(() => {
    if (!progressKey) return
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey) ?? 'null')
      if (saved?.t && saved.t > RESUME_THRESHOLD_S) setResumeAt(saved.t)
    } catch { /* ignore */ }
  }, [progressKey])

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current
    if (!v || !progressKey) return
    if (Math.abs(v.currentTime - lastSavedRef.current) >= SAVE_INTERVAL_S) {
      lastSavedRef.current = v.currentTime
      localStorage.setItem(progressKey, JSON.stringify({ t: v.currentTime }))
    }
  }, [progressKey])

  const handleEnded = useCallback(() => {
    if (progressKey) localStorage.removeItem(progressKey)
  }, [progressKey])

  // ── keyboard ─────────────────────────────────────────────────────────────────
  const handleKey = useCallback((e: KeyboardEvent) => {
    const v = videoRef.current
    if (!v) return

    switch (e.key) {
      case 'Escape': onClose(); break
      case 'ArrowRight':
        e.preventDefault()
        v.currentTime = Math.min(v.duration || 0, v.currentTime + 5)
        showHint('▶▶ +5 秒')
        break
      case 'ArrowLeft':
        e.preventDefault()
        v.currentTime = Math.max(0, v.currentTime - 5)
        showHint('◀◀ -5 秒')
        break
      case 'ArrowUp':
        e.preventDefault()
        v.volume = Math.min(1, Math.round((v.volume + 0.05) * 100) / 100)
        showHint(`🔊 ${Math.round(v.volume * 100)}%`)
        break
      case 'ArrowDown':
        e.preventDefault()
        v.volume = Math.max(0, Math.round((v.volume - 0.05) * 100) / 100)
        showHint(`🔉 ${Math.round(v.volume * 100)}%`)
        break
      case 'm': case 'M':
        v.muted = !v.muted
        showHint(v.muted ? '🔇 靜音' : '🔊 取消靜音')
        break
      case ' ':
        e.preventDefault()
        if (v.paused) { v.play(); showHint('▶ 播放') }
        else { v.pause(); showHint('⏸ 暫停') }
        break
      case ']': {
        e.preventDefault()
        const idx = SPEEDS.indexOf(speedRef.current)
        const next = SPEEDS[Math.min(idx + 1, SPEEDS.length - 1)]
        applySpeed(next)
        break
      }
      case '[': {
        e.preventDefault()
        const idx = SPEEDS.indexOf(speedRef.current)
        const prev = SPEEDS[Math.max(idx - 1, 0)]
        applySpeed(prev)
        break
      }
      case 'c': case 'C':
        if (subtitleUrl) {
          const next = !subOnRef.current
          setSubtitleOn(next)
          showHint(next ? '字幕 開' : '字幕 關')
        }
        break
    }
  }, [onClose, subtitleUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      if (hintTimer.current) clearTimeout(hintTimer.current)
      saveProgress()
    }
  }, [handleKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" onKeyDown={e => { if (e.key === 'i') setShowInfo(v => !v) }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0 bg-black/60">
        {/* Filename */}
        <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <p className="text-sm text-gray-300 truncate flex-1 min-w-0">{name}</p>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">

          {/* ── Info / Metadata button ── */}
          {filePath && (
            <button
              onClick={e => { e.stopPropagation(); setShowInfo(v => !v); setShowSpeedMenu(false); setShowSubMenu(false) }}
              title="媒體資訊 (I)"
              className={`flex items-center gap-1 h-7 px-2.5 rounded text-xs font-medium transition-colors ${
                showInfo ? 'bg-purple-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
              </svg>
              <span className="hidden sm:inline">資訊</span>
            </button>
          )}

          {/* ── Subtitle button ── */}
          <div className="relative">
            <button
              onClick={e => { e.stopPropagation(); setShowSubMenu(v => !v); setShowSpeedMenu(false) }}
              title="字幕 (C)"
              className={`flex items-center gap-1 h-7 px-2.5 rounded text-xs font-medium transition-colors ${
                subtitleUrl && subtitleOn
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.5 48.172 48.172 0 003.423-.38c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <span className="hidden sm:inline">字幕</span>
              {subtitleStatus === 'loading' && (
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              )}
              {subtitleUrl && subtitleOn && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>

            {showSubMenu && (
              <div
                onClick={e => e.stopPropagation()}
                className="absolute top-full right-0 mt-1 w-64 bg-gray-900 border border-gray-700 rounded-xl p-3 space-y-2.5 shadow-2xl z-20"
              >
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">字幕設定</p>

                {/* Status */}
                <div className="text-xs text-gray-500 bg-gray-800 rounded-lg px-3 py-2">
                  {subtitleStatus === 'loading' && '搜尋字幕中…'}
                  {subtitleStatus === 'found'   && <span className="text-green-400">✓ {subtitleName}</span>}
                  {subtitleStatus === 'notfound' && '未找到同名字幕檔'}
                  {subtitleStatus === 'idle'     && '等待中'}
                </div>

                {/* Toggle */}
                {subtitleUrl && (
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm text-gray-300">顯示字幕</span>
                    <button
                      onClick={() => setSubtitleOn(v => !v)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${subtitleOn ? 'bg-blue-500' : 'bg-gray-600'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${subtitleOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                )}

                {/* Local file load */}
                <button
                  onClick={() => subtitleFileRef.current?.click()}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  載入本地字幕 (.srt / .vtt)
                </button>
                <input
                  ref={subtitleFileRef}
                  type="file"
                  accept=".srt,.vtt"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    f.text().then(text => loadSubtitleContent(text, f.name))
                    e.target.value = ''
                  }}
                />

                <p className="text-[10px] text-gray-700 leading-relaxed">
                  支援 SubRip (.srt) 及 WebVTT (.vtt)。<br />
                  自動偵測同名字幕檔，或按 C 鍵快速切換。
                </p>
              </div>
            )}
          </div>

          {/* ── Speed button ── */}
          <div className="relative">
            <button
              onClick={e => { e.stopPropagation(); setShowSpeedMenu(v => !v); setShowSubMenu(false) }}
              title="播放速度 ([ / ])"
              className={`flex items-center gap-1 h-7 px-2.5 rounded text-xs font-medium transition-colors ${
                speed !== 1
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
              </svg>
              <span className="font-mono">{speed}×</span>
            </button>

            {showSpeedMenu && (
              <div
                onClick={e => e.stopPropagation()}
                className="absolute top-full right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl z-20"
              >
                <p className="text-[10px] text-gray-600 uppercase tracking-wide px-3 pt-2.5 pb-1">播放速度</p>
                {SPEEDS.map(s => (
                  <button
                    key={s}
                    onClick={() => applySpeed(s)}
                    className={`w-full text-left px-4 py-2 text-sm font-mono transition-colors ${
                      speed === s
                        ? 'bg-orange-500 text-white font-semibold'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {s === 1 ? '1× 正常' : `${s}×`}
                  </button>
                ))}
                <p className="text-[10px] text-gray-700 px-3 py-2">[ 減速 · ] 加速</p>
              </div>
            )}
          </div>

          {/* Key hints (desktop only) */}
          <span className="hidden lg:block text-xs text-gray-700">← → ±5s · ↑↓ 音量 · M 靜音 · 空格 播放</span>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-white text-lg"
          >×</button>
        </div>
      </div>

      {/* Video + optional MetaPanel side-by-side */}
      <div className="flex flex-1 overflow-hidden">
      <div
        className="flex-1 flex items-center justify-center p-4 relative"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay
          className="max-w-full max-h-full rounded-lg shadow-2xl outline-none"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        >
          {subtitleUrl && (
            <track
              ref={trackRef}
              key={subtitleUrl}
              src={subtitleUrl}
              kind="subtitles"
              label="字幕"
              default
              onLoad={() => {
                const t = trackRef.current?.track
                if (t) t.mode = subOnRef.current ? 'showing' : 'hidden'
              }}
            />
          )}
        </video>

        {/* Key-press hint */}
        {hint && (
          <div key={hint.key} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 text-white text-lg font-semibold px-5 py-2.5 rounded-xl backdrop-blur-sm animate-[fadeOut_0.9s_ease-in-out_forwards]">
              {hint.text}
            </div>
          </div>
        )}

        {/* Resume prompt */}
        {resumeAt !== null && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 flex items-center gap-4 shadow-2xl z-10">
            <span className="text-sm text-gray-300">
              上次播到 <span className="text-white font-semibold">{formatTime(resumeAt)}</span>
            </span>
            <button
              onClick={() => {
                const v = videoRef.current
                if (v) { v.currentTime = resumeAt; v.play().catch(() => {}) }
                setResumeAt(null)
              }}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium px-3 py-1 rounded bg-blue-400/10 hover:bg-blue-400/20 transition-colors"
            >繼續</button>
            <button
              onClick={() => setResumeAt(null)}
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >從頭</button>
          </div>
        )}
      </div>

      {/* Metadata side panel */}
      {showInfo && filePath && (
        <MetaPanel filePath={filePath} onClose={() => setShowInfo(false)} />
      )}
      </div>
    </div>
  )
}
