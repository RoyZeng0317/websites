import { useEffect, useRef, useState } from 'react'

// ── Inline ID3v2 parser (shared pattern with music.tsx) ──────────────────────

function readSyncsafe(view: DataView, offset: number): number {
  return ((view.getUint8(offset) & 0x7f) << 21)
    | ((view.getUint8(offset + 1) & 0x7f) << 14)
    | ((view.getUint8(offset + 2) & 0x7f) << 7)
    |  (view.getUint8(offset + 3) & 0x7f)
}

function id3DecodeText(data: Uint8Array): string {
  if (!data.length) return ''
  const enc = data[0], raw = data.slice(1)
  try {
    if (enc === 0) return new TextDecoder('iso-8859-1').decode(raw).replace(/\0/g, '').trim()
    if (enc === 1) return new TextDecoder('utf-16').decode(raw).replace(/\0/g, '').trim()
    if (enc === 2) return new TextDecoder('utf-16be').decode(raw).replace(/\0/g, '').trim()
    return new TextDecoder('utf-8').decode(raw).replace(/\0/g, '').trim()
  } catch { return '' }
}

function id3NullEnd(buf: Uint8Array, from: number, wide: boolean): number {
  for (let i = from; i < buf.length - (wide ? 1 : 0); i += wide ? 2 : 1)
    if (buf[i] === 0 && (!wide || buf[i + 1] === 0)) return i
  return buf.length
}

interface ParsedID3 {
  title?: string; artist?: string; album?: string
  year?: string; genre?: string; trackNo?: string
  cover?: { data: Uint8Array; mime: string }
}

function parseID3v2(buf: Uint8Array): ParsedID3 {
  const r: ParsedID3 = {}
  if (buf[0] !== 0x49 || buf[1] !== 0x44 || buf[2] !== 0x33) return r
  const ver = buf[3]
  if (ver < 2 || ver > 4) return r
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
  let off = 10
  if (buf[5] & 0x40) off += (ver === 4 ? readSyncsafe(view, off) : view.getUint32(off))
  const end = Math.min(10 + readSyncsafe(view, 6), buf.length)

  while (off + (ver === 2 ? 6 : 10) <= end) {
    let id: string, sz: number
    if (ver === 2) {
      id = String.fromCharCode(buf[off], buf[off + 1], buf[off + 2])
      sz = (buf[off + 3] << 16) | (buf[off + 4] << 8) | buf[off + 5]
      off += 6
    } else {
      id = String.fromCharCode(buf[off], buf[off + 1], buf[off + 2], buf[off + 3])
      sz = ver === 4 ? readSyncsafe(view, off + 4) : view.getUint32(off + 4)
      off += 10
    }
    if (id[0] === '\0' || sz <= 0) break
    const dEnd = Math.min(off + sz, end)
    const d = buf.slice(off, dEnd)
    off += sz

    if (id === 'TIT2' || id === 'TT2') r.title  = id3DecodeText(d)
    else if (id === 'TPE1' || id === 'TP1') r.artist = id3DecodeText(d)
    else if (id === 'TALB' || id === 'TAL') r.album  = id3DecodeText(d)
    else if (['TYER','TYE','TDRC','TDA'].includes(id)) r.year = id3DecodeText(d).slice(0, 4)
    else if (id === 'TRCK' || id === 'TRK') r.trackNo = id3DecodeText(d).split('/')[0]
    else if ((id === 'APIC' || id === 'PIC') && !r.cover && dEnd > off - sz + 4) {
      const enc = d[0]; const wide = enc === 1 || enc === 2
      let mime: string, afterMime: number
      if (id === 'APIC') {
        const me = d.indexOf(0, 1)
        mime = new TextDecoder().decode(d.slice(1, me < 0 ? d.length : me))
        afterMime = (me < 0 ? d.length : me) + 2
      } else {
        mime = `image/${String.fromCharCode(d[1], d[2], d[3]).toLowerCase().replace('jpg', 'jpeg')}`
        afterMime = 5
      }
      const descEnd = id3NullEnd(d, afterMime, wide)
      const imgStart = descEnd + (wide ? 2 : 1)
      if (imgStart < d.length)
        r.cover = { data: d.slice(imgStart), mime: mime.includes('/') ? mime : `image/${mime}` }
    }
  }
  return r
}

// ─────────────────────────────────────────────────────────────────────────────

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
  const [meta, setMeta] = useState<ParsedID3 | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const coverObjRef = useRef<string | null>(null)

  const baseName = name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(src)
        if (!res.ok || !res.body) return
        const reader = res.body.getReader()
        const LIMIT = 1024 * 1024
        const chunks: Uint8Array[] = []
        let total = 0
        while (total < LIMIT) {
          const { done, value } = await reader.read()
          if (done || !value) break
          chunks.push(value); total += value.length
        }
        reader.cancel().catch(() => {})
        if (cancelled) return
        const buf = new Uint8Array(Math.min(total, LIMIT))
        let boff = 0
        for (const chunk of chunks) {
          const take = Math.min(chunk.length, LIMIT - boff)
          buf.set(chunk.slice(0, take), boff); boff += take
          if (boff >= LIMIT) break
        }
        const parsed = parseID3v2(buf)
        setMeta(parsed)
        if (parsed.cover) {
          const imgBlob = new Blob([parsed.cover.data], { type: parsed.cover.mime })
          const url = URL.createObjectURL(imgBlob)
          coverObjRef.current = url
          setCoverUrl(url)
        }
      } catch { /* no tags */ }
    })()
    return () => {
      cancelled = true
      if (coverObjRef.current) { URL.revokeObjectURL(coverObjRef.current); coverObjRef.current = null }
    }
  }, [src])

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

  function fmt(sec: number): string {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const displayTitle = meta?.title || baseName
  const displayArtist = meta?.artist || ''

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-800">

        {/* Cover art */}
        <div className="w-40 h-40 mx-auto mb-5 rounded-2xl overflow-hidden shadow-lg">
          {coverUrl ? (
            <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-500/30 to-orange-500/30 flex items-center justify-center">
              <svg className="w-16 h-16 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
              </svg>
            </div>
          )}
        </div>

        <p className="text-white font-semibold text-center truncate mb-0.5 text-base">{displayTitle}</p>
        {displayArtist && <p className="text-pink-400 text-sm text-center truncate mb-0.5">{displayArtist}</p>}
        {meta?.album && (
          <p className="text-gray-500 text-xs text-center truncate mb-0.5">
            {meta.album}{meta.year ? ` · ${meta.year}` : ''}
          </p>
        )}

        <button
          onClick={() => setShowDetail(v => !v)}
          className="mx-auto block text-xs text-gray-600 hover:text-gray-400 transition-colors mt-1 mb-4"
        >
          {showDetail ? '▲ 收起詳細資訊' : '▼ 詳細資訊'}
        </button>

        {showDetail && (
          <div className="bg-gray-800/60 rounded-xl px-4 py-3 mb-4 space-y-1.5 text-xs">
            <Row label="檔名" value={name} />
            {meta?.title  && <Row label="標題" value={meta.title} />}
            {meta?.artist && <Row label="歌手" value={meta.artist} />}
            {meta?.album  && <Row label="專輯" value={meta.album} />}
            {meta?.year   && <Row label="年份" value={meta.year} />}
            {meta?.genre  && <Row label="曲風" value={meta.genre} />}
            {meta?.trackNo && <Row label="音軌" value={`#${meta.trackNo}`} />}
            <Row label="格式" value={name.split('.').pop()?.toUpperCase() ?? ''} />
            <Row label="時長" value={fmt(duration)} />
          </div>
        )}

        <div className="space-y-1 mb-5">
          <input
            type="range" min={0} max={duration || 100} value={currentTime}
            onChange={e => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value) }}
            className="w-full accent-pink-400 h-1.5"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-5">
          <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, currentTime - 10) }}
            className="text-gray-400 hover:text-white transition-colors" title="後退 10 秒">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4z" />
              <path d="M4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>
          <button onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-colors shadow-lg">
            {playing
              ? <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>
              : <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
            }
          </button>
          <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(duration, currentTime + 10) }}
            className="text-gray-400 hover:text-white transition-colors" title="前進 10 秒">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5.334 6.4A1 1 0 004 7.2v8a1 1 0 001.6.8L11 12l-5.333-4A1 1 0 004.733 6.4z" />
              <path d="M12.334 6.4A1 1 0 0011 7.2v8a1 1 0 001.6.8L18 12l-5.333-4a1 1 0 00-.333-.6z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z" />
            {volume > 0.5 && <path d="M18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />}
            {volume > 0 && <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />}
          </svg>
          <input type="range" min={0} max={1} step={0.05} value={volume}
            onChange={e => { const v = Number(e.target.value); setVolume(v); if (audioRef.current) audioRef.current.volume = v }}
            className="flex-1 accent-pink-400 h-1.5" />
        </div>

        <button onClick={onClose}
          className="mt-5 w-full py-2 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors">
          關閉
        </button>

        <audio ref={audioRef} src={src} autoPlay
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

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="flex gap-2">
      <span className="text-gray-600 w-12 shrink-0">{label}</span>
      <span className="text-gray-300 truncate">{value}</span>
    </div>
  )
}
