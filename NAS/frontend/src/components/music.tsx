import { useState, useEffect, useRef, useCallback } from 'react'
import { apiJson, apiFetch } from '../lib/api'
import { downloadUrl } from '../lib/api'

// ── Lightweight inline ID3v2 parser (no external deps) ──────────────────────

const ID3_GENRES = [
  'Blues','Classic Rock','Country','Dance','Disco','Funk','Grunge','Hip-Hop','Jazz',
  'Metal','New Age','Oldies','Other','Pop','R&B','Rap','Reggae','Rock','Techno',
  'Industrial','Alternative','Ska','Death Metal','Pranks','Soundtrack','Euro-Techno',
  'Ambient','Trip-Hop','Vocal','Jazz+Funk','Fusion','Trance','Classical','Instrumental',
  'Acid','House','Game','Sound Clip','Gospel','Noise','AlternRock','Bass','Soul','Punk',
  'Space','Meditative','Instrumental Pop','Instrumental Rock','Ethnic','Gothic','Darkwave',
  'Techno-Industrial','Electronic','Pop-Folk','Eurodance','Dream','Southern Rock',
  'Comedy','Cult','Gangsta','Top 40','Christian Rap','Pop/Funk','Jungle','Native US',
  'Cabaret','New Wave','Psychadelic','Rave','Showtunes','Trailer','Lo-Fi','Tribal',
  'Acid Punk','Acid Jazz','Polka','Retro','Musical','Rock & Roll','Hard Rock',
]

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
  year?: string; genre?: string
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
    else if (['TYER','TYE','TDRC','TDA'].includes(id))
      r.year = id3DecodeText(d).slice(0, 4)
    else if (id === 'TCON' || id === 'TCO') {
      let g = id3DecodeText(d)
      g = g.replace(/^\((\d+)\).*/, (_, n) => ID3_GENRES[+n] ?? g)
      r.genre = g
    }
    else if ((id === 'APIC' || id === 'PIC') && !r.cover && dEnd > off - sz + 4) {
      const enc = d[0]; const wide = enc === 1 || enc === 2
      let mime: string, afterMime: number
      if (id === 'APIC') {
        const me = d.indexOf(0, 1)
        mime = new TextDecoder().decode(d.slice(1, me < 0 ? d.length : me))
        afterMime = (me < 0 ? d.length : me) + 2  // skip null + pictype
      } else {
        mime = `image/${String.fromCharCode(d[1], d[2], d[3]).toLowerCase().replace('jpg', 'jpeg')}`
        afterMime = 5  // 1 enc + 3 format + 1 pictype
      }
      const descEnd = id3NullEnd(d, afterMime, wide)
      const imgStart = descEnd + (wide ? 2 : 1)
      if (imgStart < d.length)
        r.cover = { data: d.slice(imgStart), mime: mime.includes('/') ? mime : `image/${mime}` }
    }
  }
  return r
}

// ────────────────────────────────────────────────────────────────────────────

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

interface SongMeta {
  title: string | null
  artist: string | null
  album: string | null
  year: number | null
  genre: string | null
}

interface Props {
  onClose: () => void
  initialFile?: { dir: string; name: string }
}

const AUDIO_EXTS = new Set(['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'opus', 'wma'])

function isAudio(name: string): boolean {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return AUDIO_EXTS.has(ext)
}

function isLrc(name: string): boolean {
  return name.toLowerCase().endsWith('.lrc')
}

function fmtTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function fmtTimePrecise(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '00:00.000'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  const sInt = Math.floor(s)
  const ms = Math.round((s - sInt) * 1000)
  return `${String(m).padStart(2,'0')}:${String(sInt).padStart(2,'0')}.${String(ms).padStart(3,'0')}`
}

function parseTimestamp(str: string): number | null {
  const m = str.trim().match(/^(\d{1,3}):(\d{2})\.(\d{1,3})$/)
  if (!m) return null
  const min = parseInt(m[1])
  const sec = parseInt(m[2])
  if (sec >= 60) return null
  const ms = parseInt(m[3].padEnd(3, '0').slice(0, 3))
  return min * 60 + sec + ms / 1000
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

export default function MusicApp({ onClose, initialFile }: Props) {
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
  const [pairMode, setPairMode] = useState(false)
  const [pairInput, setPairInput] = useState('')
  const [pairLines, setPairLines] = useState<string[]>([])
  const [pairTimes, setPairTimes] = useState<Record<number, number>>({})
  const [pairIdx, setPairIdx] = useState(0)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editingVal, setEditingVal] = useState('')
  const pairListRef = useRef<HTMLDivElement>(null)
  const [lrcEditor, setLrcEditor] = useState<{ path: string, lines: { time: number | null, text: string }[] } | null>(null)
  const [lrcEditCell, setLrcEditCell] = useState<{ idx: number, field: 'time' | 'text' } | null>(null)
  const [lrcEditVal, setLrcEditVal] = useState('')
  const [lrcSaving, setLrcSaving] = useState(false)
  const [songMeta, setSongMeta] = useState<SongMeta | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [metaLoading, setMetaLoading] = useState(false)
  const [pendingPlay, setPendingPlay] = useState<string | null>(null)

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

  useEffect(() => () => { setCoverUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null }) }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === 'Escape') {
        if (showHelp) { setShowHelp(false); return }
        if (pairRef.current.pairMode) {
          setPairMode(false); setPairInput(''); setPairLines([]); setPairTimes({}); setPairIdx(0); return
        }
        onClose(); return
      }
      if (e.shiftKey && e.key === '?') {
        e.preventDefault(); setShowHelp(v => !v); return
      }
      if (e.key === ' ') {
        e.preventDefault()
        const { pairMode: pm, pairIdx: pi, pairLinesLen: pl } = pairRef.current
        if (pm && pl > 0 && pi < pl) {
          const a = audioRef.current; if (!a) return
          setPairTimes(prev => ({ ...prev, [pi]: a.currentTime }))
          setPairIdx(pi + 1)
          if (a.paused) { a.play(); setPlaying(true) }
          return
        }
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
      if (e.key === 'Backspace') {
        const { pairMode: pm, pairIdx: pi } = pairRef.current
        if (pm && pi > 0) {
          e.preventDefault()
          const newIdx = pi - 1
          setPairIdx(newIdx)
          setPairTimes(prev => { const n = { ...prev }; delete n[newIdx]; return n })
          return
        }
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
  const lrcs = items.filter(i => i.type === 'file' && isLrc(i.name))

  // Live ref — placed AFTER tracks/folders to avoid TDZ crash
  const liveRef = useRef({ currentIndex, tracks, playing })
  useEffect(() => { liveRef.current = { currentIndex, tracks, playing } }, [currentIndex, tracks, playing])

  const pairRef = useRef({ pairMode: false, pairIdx: 0, pairLinesLen: 0 })
  useEffect(() => { pairRef.current = { pairMode, pairIdx, pairLinesLen: pairLines.length } }, [pairMode, pairIdx, pairLines.length])

  // Auto-play when opened by clicking an audio file
  useEffect(() => {
    if (initialFile) {
      setPath(initialFile.dir)
      setPendingPlay(initialFile.name)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!pendingPlay || loading) return
    const idx = tracks.findIndex(t => t.name === pendingPlay)
    if (idx >= 0) { playTrack(idx); setPendingPlay(null) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, pendingPlay, loading])

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

  async function loadMeta(index: number) {
    setSongMeta(null)
    setCoverUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null })
    setMetaLoading(true)
    const tp = trackPath(index)
    if (!tp) { setMetaLoading(false); return }
    try {
      // Plain GET — no custom headers so no CORS preflight
      const res = await fetch(downloadUrl(tp))
      if (!res.ok || !res.body) return

      // Stream-read only the first 1 MB then cancel the download
      const reader = res.body.getReader()
      const LIMIT = 1024 * 1024
      const chunks: Uint8Array[] = []
      let total = 0
      while (total < LIMIT) {
        const { done, value } = await reader.read()
        if (done || !value) break
        chunks.push(value)
        total += value.length
      }
      reader.cancel().catch(() => {})

      const buf = new Uint8Array(Math.min(total, LIMIT))
      let off = 0
      for (const chunk of chunks) {
        const take = Math.min(chunk.length, LIMIT - off)
        buf.set(chunk.slice(0, take), off)
        off += take
        if (off >= LIMIT) break
      }

      const parsed = parseID3v2(buf)
      setSongMeta({
        title:  parsed.title  || null,
        artist: parsed.artist || null,
        album:  parsed.album  || null,
        year:   parsed.year ? parseInt(parsed.year) || null : null,
        genre:  parsed.genre  || null,
      })
      if (parsed.cover) {
        const imgBlob = new Blob([parsed.cover.data], { type: parsed.cover.mime })
        setCoverUrl(URL.createObjectURL(imgBlob))
      }
    } catch { /* no tags */ }
    finally { setMetaLoading(false) }
  }

  function playTrack(index: number) {
    if (index < 0 || index >= tracks.length) return
    setCurrentIndex(index)
    setPlaying(true)
    loadLyrics(index)
    loadMeta(index)
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

  useEffect(() => {
    if (pairMode && pairLines.length > 0 && pairListRef.current) {
      const el = pairListRef.current.children[Math.min(pairIdx, pairLines.length - 1)] as HTMLElement | undefined
      if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [pairIdx, pairMode, pairLines.length])

  function startPairing() {
    const lines = pairInput.split('\n').map(l => l.trim()).filter(Boolean)
    if (!lines.length) return
    setPairLines(lines)
    setPairTimes({})
    setPairIdx(0)
    const a = audioRef.current
    if (a && a.paused) { a.play(); setPlaying(true) }
  }

  function exitPair() {
    setPairMode(false)
    setPairInput('')
    setPairLines([])
    setPairTimes({})
    setPairIdx(0)
  }

  async function openLrcEditor(name: string) {
    const filePath = path ? `${path}/${name}` : name
    setLrcEditor({ path: filePath, lines: [] })
    setLrcEditCell(null)
    try {
      const res = await fetch(downloadUrl(filePath))
      if (!res.ok) return
      const text = await res.text()
      const parsed = parseLrc(text)
      setLrcEditor({ path: filePath, lines: parsed.map(l => ({ time: l.time, text: l.text })) })
    } catch { /* empty file */ }
  }

  async function saveLrc() {
    if (!lrcEditor) return
    setLrcSaving(true)
    try {
      const content = [...lrcEditor.lines]
        .filter(l => l.text.trim())
        .sort((a, b) => (a.time ?? Infinity) - (b.time ?? Infinity))
        .map(l => {
          if (l.time === null) return l.text
          const min = Math.floor(l.time / 60)
          const sec = l.time % 60
          const sInt = Math.floor(sec)
          const ms = Math.round((sec - sInt) * 1000)
          return `[${String(min).padStart(2,'0')}:${String(sInt).padStart(2,'0')}.${String(ms).padStart(3,'0')}]${l.text}`
        }).join('\n')
      await apiFetch(`/api/files/content?path=${encodeURIComponent(lrcEditor.path)}`, {
        method: 'PUT',
        body: content,
      })
      setLrcEditor(null)
      setLrcEditCell(null)
      if (currentIndex !== null) loadLyrics(currentIndex)
    } catch { /* ignore */ } finally {
      setLrcSaving(false)
    }
  }

  function downloadLrc() {
    const lrcContent = pairLines.map((text, i) => {
      const t = pairTimes[i]
      if (t === undefined) return `[00:00.000]${text}`
      const min = Math.floor(t / 60)
      const sec = t % 60
      const secInt = Math.floor(sec)
      const ms = Math.round((sec - secInt) * 1000)
      return `[${String(min).padStart(2,'0')}:${String(secInt).padStart(2,'0')}.${String(ms).padStart(3,'0')}]${text}`
    }).join('\n')
    const fname = currentTrackName ? baseName(currentTrackName) + '.lrc' : 'lyrics.lrc'
    const blob = new Blob([lrcContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url; anchor.download = fname; anchor.click()
    URL.revokeObjectURL(url)
  }

  const SHORTCUTS = pairMode && pairLines.length > 0
    ? [['Space','Stamp timestamp'], ['Backspace','Undo last stamp'], ['Esc','Exit pair mode']]
    : [
        ['Space','Play / Pause'], ['→','Forward 5s'], ['←','Rewind 5s'],
        ['↑','Volume +5%'], ['↓','Volume -5%'], ['M','Toggle Mute'],
        ['Shift+?','Keyboard Shortcuts'], ['Esc','Close'],
      ]

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">

      {/* Help overlay */}
      {showHelp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60" onClick={() => setShowHelp(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-72 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm">Keyboard Shortcuts</h3>
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
            <p className="text-xs text-gray-600 mt-4 text-center">Press Shift+? again to close</p>
          </div>
        </div>
      )}

      {/* LRC editor overlay */}
      {lrcEditor && (
        <div className="fixed inset-0 z-[60] bg-gray-950 flex flex-col">
          <div className="shrink-0 flex items-center justify-between px-5 py-3 bg-black/60 border-b border-gray-800">
            <div className="flex items-center gap-3 min-w-0">
              <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
              <span className="text-sm font-medium text-white truncate">{lrcEditor.path.split('/').pop()}</span>
              <span className="text-xs text-gray-500">{lrcEditor.lines.length} 行</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setLrcEditor(prev => prev ? { ...prev, lines: [...prev.lines].sort((a, b) => (a.time ?? Infinity) - (b.time ?? Infinity)) } : prev)}
                className="text-xs text-gray-300 hover:text-white px-2 py-1.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors">↕ 排序</button>
              <button
                onClick={() => setLrcEditor(prev => prev ? { ...prev, lines: [...prev.lines, { time: null, text: '' }] } : prev)}
                className="text-xs text-gray-300 hover:text-white px-2 py-1.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors">+ 新增行</button>
              <button onClick={saveLrc} disabled={lrcSaving}
                className="text-xs text-white px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors">
                {lrcSaving ? '儲存中...' : '儲存'}
              </button>
              <button onClick={() => { setLrcEditor(null); setLrcEditCell(null) }}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl">×</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {lrcEditor.lines.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-2 text-sm">
                <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
                無歌詞行，點擊「+ 新增行」開始編輯
              </div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-900/95 border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs text-gray-600 font-normal w-10">#</th>
                    <th className="px-2 py-2 text-left text-xs text-gray-600 font-normal w-36">時間</th>
                    <th className="px-2 py-2 text-left text-xs text-gray-600 font-normal">歌詞</th>
                    <th className="w-8"/>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40">
                  {lrcEditor.lines.map((line, i) => (
                    <tr key={i} className="hover:bg-gray-800/30 group">
                      <td className="px-4 py-1 text-xs text-gray-600 text-right tabular-nums">{i + 1}</td>
                      <td className="px-2 py-1">
                        {lrcEditCell?.idx === i && lrcEditCell.field === 'time' ? (
                          <input
                            autoFocus
                            type="text"
                            value={lrcEditVal}
                            onChange={e => setLrcEditVal(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                const parsed = parseTimestamp(lrcEditVal)
                                setLrcEditor(prev => {
                                  if (!prev) return prev
                                  const lines = [...prev.lines]
                                  lines[i] = { ...lines[i], time: parsed }
                                  return { ...prev, lines }
                                })
                                setLrcEditCell(null)
                              } else if (e.key === 'Escape') {
                                setLrcEditCell(null)
                              }
                            }}
                            onBlur={() => {
                              const parsed = parseTimestamp(lrcEditVal)
                              setLrcEditor(prev => {
                                if (!prev) return prev
                                const lines = [...prev.lines]
                                lines[i] = { ...lines[i], time: parsed }
                                return { ...prev, lines }
                              })
                              setLrcEditCell(null)
                            }}
                            className="w-32 bg-gray-900 border border-blue-500 rounded px-2 py-0.5 text-xs font-mono text-blue-200 outline-none text-center"
                            placeholder="00:00.000"
                          />
                        ) : (
                          <button
                            onClick={() => { setLrcEditCell({ idx: i, field: 'time' }); setLrcEditVal(line.time !== null ? fmtTimePrecise(line.time) : '') }}
                            className={`w-32 text-xs font-mono px-2 py-0.5 rounded text-left hover:bg-gray-800 transition-colors ${line.time !== null ? 'text-green-400 hover:text-green-200' : 'text-gray-600 hover:text-gray-400'}`}
                            title="點擊編輯時間（mm:ss.000）"
                          >{line.time !== null ? fmtTimePrecise(line.time) : '--:--.---'}</button>
                        )}
                      </td>
                      <td className="px-2 py-1">
                        {lrcEditCell?.idx === i && lrcEditCell.field === 'text' ? (
                          <input
                            autoFocus
                            type="text"
                            value={lrcEditVal}
                            onChange={e => setLrcEditVal(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                setLrcEditor(prev => {
                                  if (!prev) return prev
                                  const lines = [...prev.lines]
                                  lines[i] = { ...lines[i], text: lrcEditVal }
                                  return { ...prev, lines }
                                })
                                setLrcEditCell(null)
                              } else if (e.key === 'Escape') {
                                setLrcEditCell(null)
                              }
                            }}
                            onBlur={() => {
                              setLrcEditor(prev => {
                                if (!prev) return prev
                                const lines = [...prev.lines]
                                lines[i] = { ...lines[i], text: lrcEditVal }
                                return { ...prev, lines }
                              })
                              setLrcEditCell(null)
                            }}
                            className="w-full bg-gray-900 border border-blue-500 rounded px-2 py-0.5 text-sm text-gray-200 outline-none"
                          />
                        ) : (
                          <button
                            onClick={() => { setLrcEditCell({ idx: i, field: 'text' }); setLrcEditVal(line.text) }}
                            className="w-full text-sm text-left px-2 py-0.5 rounded hover:bg-gray-800/50 transition-colors"
                          >
                            {line.text
                              ? <span className="text-gray-200">{line.text}</span>
                              : <span className="text-gray-600 italic text-xs">點擊輸入歌詞...</span>
                            }
                          </button>
                        )}
                      </td>
                      <td className="px-2 py-1">
                        <button
                          onClick={() => setLrcEditor(prev => prev ? { ...prev, lines: prev.lines.filter((_, j) => j !== i) } : prev)}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all w-6 h-6 flex items-center justify-center rounded"
                          title="刪除此行"
                        >✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0 bg-black/60">
        <div className="flex items-center gap-3 min-w-0">
          <svg className="w-5 h-5 text-pink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
          </svg>
          <h2 className="text-base font-bold text-white">Music Player</h2>
          <nav className="flex items-center gap-1.5 text-sm text-gray-400 ml-2 min-w-0">
            <button
              onClick={() => setPath('')}
              className="hover:text-white shrink-0"
            >All Music</button>
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
          <span className="text-xs text-gray-500">{tracks.length} tracks</span>
          <button onClick={() => setShowHelp(v => !v)} title="Keyboard shortcuts (Shift+?)"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-sm font-bold transition-colors">?</button>
          {path && (
            <button
              onClick={goBack}
              className="px-3 h-8 text-xs rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
            >Back</button>
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
              <div className="w-14 h-14 rounded-xl shrink-0 overflow-hidden bg-gradient-to-br from-pink-500/30 to-orange-500/30 flex items-center justify-center">
                {coverUrl ? (
                  <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {songMeta?.title || baseName(currentTrackName)}
                  </p>
                  {metaLoading && (
                    <span className="shrink-0 w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"/>
                  )}
                  {!metaLoading && lyricsLoading && (
                    <span className="shrink-0 w-3 h-3 border border-pink-400 border-t-transparent rounded-full animate-spin"/>
                  )}
                  {!lyricsLoading && lyrics.length > 0 && (
                    <span className="shrink-0 text-xs bg-pink-500/20 text-pink-400 border border-pink-500/30 px-1.5 py-0.5 rounded font-mono">LRC</span>
                  )}
                  {!pairMode && (
                    <button
                      onClick={() => setPairMode(true)}
                      className="shrink-0 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded hover:bg-blue-500/30 transition-colors"
                      title="歌詞配對 — 播放音樂後按空白鍵標記每句歌詞的時間點"
                    >配對</button>
                  )}
                  {pairMode && (
                    <span className="shrink-0 text-xs bg-blue-500/30 text-blue-300 border border-blue-500/50 px-1.5 py-0.5 rounded font-mono animate-pulse">配對中</span>
                  )}
                </div>
                {songMeta?.artist && (
                  <p className="text-xs text-gray-300 truncate">{songMeta.artist}</p>
                )}
                <p className="text-xs text-gray-500 truncate">
                  {songMeta?.album
                    ? `${songMeta.album}${songMeta.year ? ` · ${songMeta.year}` : ''}`
                    : currentTrackName.split('.').pop()?.toUpperCase()
                  }
                </p>
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
                <button title="Mute (M)" onClick={() => {
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
                  {muted ? 'Muted' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Lyrics pair mode UI */}
        {pairMode && currentTrackName && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="shrink-0 flex items-center justify-between px-5 py-2 bg-blue-900/20 border-b border-blue-800/30">
              <div className="flex items-center gap-2 text-xs text-blue-300 min-w-0 flex-wrap">
                {pairLines.length > 0 && pairIdx < pairLines.length ? (
                  <>
                    <span>按</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-gray-200">Space</kbd>
                    <span>標記時間點</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 font-mono text-gray-200">Backspace</kbd>
                    <span>復原上一行</span>
                    <span className="text-gray-500 ml-2">{pairIdx} / {pairLines.length} 句</span>
                  </>
                ) : pairLines.length > 0 ? (
                  <span className="text-green-400">✓ 所有歌詞已配對完成，請點擊「匯出 LRC」</span>
                ) : (
                  <span>貼上歌詞文字，播放音樂後按空白鍵標記每句的時間點</span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                {pairLines.length > 0 && (
                  <>
                    <button onClick={() => { setPairLines([]); setPairTimes({}); setPairIdx(0) }}
                      className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors">重新開始</button>
                    <button onClick={downloadLrc}
                      className="text-xs text-green-300 px-2 py-1 rounded bg-green-900/30 hover:bg-green-900/50 border border-green-700/30 transition-colors">匯出 LRC</button>
                  </>
                )}
                <button onClick={exitPair}
                  className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors">退出</button>
              </div>
            </div>

            {pairLines.length === 0 ? (
              <div className="flex-1 flex flex-col p-5 gap-3">
                <textarea
                  value={pairInput}
                  onChange={e => setPairInput(e.target.value)}
                  placeholder={"在此貼上歌詞（每行一句）...\n例如：\n滄海一聲笑\n滔滔兩岸潮\n豪情還勝了一江水"}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500"
                />
                <button onClick={startPairing} disabled={!pairInput.trim()}
                  className="shrink-0 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors">
                  開始配對
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto py-4 px-5" ref={pairListRef}>
                <div className="space-y-1">
                  {pairLines.map((line, i) => {
                    const t = pairTimes[i]
                    const isDone = t !== undefined
                    const isCurrent = i === pairIdx
                    return (
                      <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        isCurrent ? 'bg-blue-900/40 border border-blue-700/50' : isDone ? 'opacity-55' : 'opacity-35'
                      }`}>
                        <span className="shrink-0 font-mono text-xs w-24 text-right">
                          {isDone ? (
                            editingIdx === i ? (
                              <input
                                autoFocus
                                type="text"
                                value={editingVal}
                                onChange={e => setEditingVal(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    const parsed = parseTimestamp(editingVal)
                                    if (parsed !== null) setPairTimes(prev => ({ ...prev, [i]: parsed }))
                                    setEditingIdx(null)
                                  } else if (e.key === 'Escape') {
                                    setEditingIdx(null)
                                  }
                                }}
                                onBlur={() => {
                                  const parsed = parseTimestamp(editingVal)
                                  if (parsed !== null) setPairTimes(prev => ({ ...prev, [i]: parsed }))
                                  setEditingIdx(null)
                                }}
                                className="w-24 bg-gray-900 border border-blue-500 rounded px-1 py-0.5 text-blue-200 text-xs font-mono outline-none text-center"
                                placeholder="00:00.000"
                              />
                            ) : (
                              <button
                                onClick={() => { setEditingIdx(i); setEditingVal(fmtTimePrecise(t)) }}
                                className="text-green-400 hover:text-green-200 underline decoration-dotted underline-offset-2 transition-colors"
                                title="點擊編輯時間（格式 mm:ss.ms）"
                              >{fmtTimePrecise(t)}</button>
                            )
                          ) : isCurrent ? (
                            <span className="text-blue-400 animate-pulse">▶ 等待</span>
                          ) : (
                            <span className="text-gray-600">--:--.---</span>
                          )}
                        </span>
                        <span className={`text-sm ${isCurrent ? 'text-white font-medium' : isDone ? 'text-gray-400' : 'text-gray-500'}`}>
                          {line}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lyrics area — only when lyrics loaded */}
        {!pairMode && currentTrackName && lyrics.length > 0 && (
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
        {!pairMode && (!currentTrackName || lyrics.length === 0) ? (
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="p-3">
                {folders.length > 0 && (
                  <div className="mb-4 px-2">
                    <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Folders</p>
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
                ) : folders.length === 0 && lrcs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-2">
                    <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>
                    <p className="text-sm">No music files in this folder</p>
                  </div>
                ) : null}

                {lrcs.length > 0 && (
                  <div className="mt-4 px-2">
                    <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">LRC Lyrics</p>
                    <ul className="space-y-0.5">
                      {lrcs.map(f => (
                        <li key={f.name}>
                          <button
                            onClick={() => openLrcEditor(f.name)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors text-left"
                          >
                            <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                            </svg>
                            <span className="flex-1 text-sm truncate">{f.name}</span>
                            <span className="text-xs text-blue-400 shrink-0">編輯</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* Mini track list when lyrics shown */}
        {!pairMode && currentTrackName && lyrics.length > 0 && (
          <div className="shrink-0 border-t border-gray-800">
            <details className="group">
              <summary className="px-5 py-2 text-xs text-gray-500 hover:text-gray-300 cursor-pointer flex items-center gap-2 select-none">
                <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
                Playlist ({tracks.length})
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
