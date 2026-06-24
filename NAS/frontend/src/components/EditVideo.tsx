import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { apiJson, downloadUrl } from '../lib/api'

interface Props { filePath?: string | null; onClose: () => void; onDone?: () => void }
interface FileItem { name: string; type: 'file' | 'folder' }
interface VideoInfo { duration: number; width?: number; height?: number }
interface Clip { path: string; name: string; inPt: number; outPt: number; duration: number }
interface AudioTrack { path: string; name: string; volume: number }

const VIDEO_EXTS = new Set(['mp4','mov','avi','mkv','webm','m4v','3gp','flv','wmv'])
const AUDIO_EXTS = new Set(['mp3','aac','wav','flac','m4a','ogg'])
const isVid = (n: string) => VIDEO_EXTS.has(n.split('.').pop()?.toLowerCase() ?? '')
const isAud = (n: string) => AUDIO_EXTS.has(n.split('.').pop()?.toLowerCase() ?? '')

function fmtTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = (s % 60).toFixed(1)
  return `${String(m).padStart(2,'0')}:${sec.padStart(4,'0')}`
}

export default function EditVideo({ filePath: initPath, onClose, onDone }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const timelineRef  = useRef<HTMLDivElement>(null)
  const rafRef       = useRef<number>(0)
  const seekRef      = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [selectedPath, setSelectedPath] = useState<string | null>(initPath ?? null)
  const [browsePath, setBrowsePath]     = useState('')
  const [browseItems, setBrowseItems]   = useState<FileItem[]>([])
  const [browseLoading, setBrowseLoading] = useState(false)
  const [fileTab, setFileTab]           = useState<'video' | 'audio'>('video')
  const [clips, setClips]               = useState<Clip[]>([])
  const [audioTracks, setAudioTracks]   = useState<AudioTrack[]>([])
  const [activeClip, setActiveClip]     = useState(0)
  const [currentTime, setCurrentTime]   = useState(0)
  const [scrubTime, setScrubTime]       = useState<number | null>(null)
  const [playing, setPlaying]           = useState(false)
  const [previewMode, setPreviewMode]   = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [speed, setSpeed]               = useState(1)
  const [activePanel, setActivePanel]   = useState<'text' | 'audio' | 'speed' | null>(null)
  const [textOverlay, setTextOverlay]   = useState({ text: '', size: 48, color: 'white', position: 'bottom' })
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportName, setExportName]     = useState('output')
  const [exportVideoFmt, setExportVideoFmt] = useState<'mp4' | 'mkv' | 'mov'>('mp4')
  const [exportAudioFmt, setExportAudioFmt] = useState<'aac' | 'mp3' | 'copy'>('aac')
  const [exportQuality, setExportQuality]   = useState<'fast' | 'medium' | 'slow'>('fast')
  const [exportResolution, setExportResolution] = useState<'720p' | '1080p' | '2k' | '4k' | '8k' | 'source'>('1080p')
  const [destPath, setDestPath]               = useState('')
  const [showDestPicker, setShowDestPicker]   = useState(false)
  const [destPickerPath, setDestPickerPath]   = useState('')
  const [destPickerItems, setDestPickerItems] = useState<FileItem[]>([])
  const [destPickerLoading, setDestPickerLoading] = useState(false)
  const [busy, setBusy]                 = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportLog, setExportLog]       = useState('')
  const [timelineZoom, setTimelineZoom] = useState(1)  // 1 = 100%, 2 = 200%, etc.

  const clip = clips[activeClip] ?? null
  const clipDurations = clips.map(c => c.outPt - c.inPt)
  const totalDuration = clipDurations.reduce((s, d) => s + d, 0)
  const clipOffsets = clipDurations.reduce<number[]>((acc, d, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + clipDurations[i - 1]); return acc
  }, [])
  const displayTime = scrubTime ?? currentTime
  const curPct = clip && clip.duration > 0 ? (displayTime / clip.duration) * 100 : 0

  useEffect(() => { loadBrowse('') }, [])
  useEffect(() => {
    if (initPath) addVideoClip(initPath, initPath.split('/').pop() ?? '')
  }, [])
  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = speed }, [speed])
  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas) { rafRef.current = requestAnimationFrame(draw); return }
      const ctx = canvas.getContext('2d')
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (textOverlay.text) {
        const fs = Math.round(canvas.height * (textOverlay.size / 720))
        ctx.font = `bold ${fs}px sans-serif`
        ctx.textAlign = 'center'
        ctx.shadowColor = 'black'; ctx.shadowBlur = 6
        ctx.fillStyle = textOverlay.color
        const y = textOverlay.position === 'top' ? fs + 20
          : textOverlay.position === 'center' ? canvas.height / 2
          : canvas.height - 40
        ctx.fillText(textOverlay.text, canvas.width / 2, y)
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [textOverlay])
  useEffect(() => {
    const v = videoRef.current
    if (!v || !clip) return
    const onTime = () => {
      setCurrentTime(v.currentTime)
      if (previewMode && v.currentTime >= clip.outPt - 0.05) {
        if (activeClip < clips.length - 1) {
          const next = activeClip + 1
          setActiveClip(next)
          setTimeout(() => {
            const vv = videoRef.current
            if (vv) {
              vv.pause(); vv.currentTime = clips[next].inPt; vv.playbackRate = speed
              const onS = () => { vv.removeEventListener('seeked', onS); vv.play().catch(() => {}) }
              vv.addEventListener('seeked', onS)
            }
          }, 50)
        } else { v.pause(); setPlaying(false); setPreviewMode(false) }
      }
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    return () => { v.removeEventListener('timeupdate', onTime); v.removeEventListener('play', onPlay); v.removeEventListener('pause', onPause) }
  }, [clip?.path, clip?.outPt, previewMode, activeClip, clips, speed])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault()
        if (!clip) return
        const t = videoRef.current?.currentTime ?? currentTime
        if (t <= clip.inPt || t >= clip.outPt) { toast.error('剪切點必須在片段範圍內'); return }
        const a: Clip = { ...clip, outPt: t }
        const b: Clip = { ...clip, inPt: t }
        setClips(prev => { const n = [...prev]; n.splice(activeClip, 1, a, b); return n })
        toast.success('已剪切片段')
      }
      if (e.ctrlKey && (e.key === '=' || e.key === '+')) {
        e.preventDefault()
        setTimelineZoom(z => Math.min(z * 1.5, 20))
      }
      if (e.ctrlKey && e.key === '-') {
        e.preventDefault()
        setTimelineZoom(z => Math.max(z / 1.5, 0.2))
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        if (clips.length > 0) {
          setClips(p => p.filter((_,i) => i !== activeClip))
          setActiveClip(c => Math.max(0, c - 1))
          toast.success('已刪除片段')
        }
      }
      const inInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement
      if (e.key === 'Escape') { if (!inInput) onClose() }
      if (!inInput && (e.key === 'f' || e.key === 'F') && !e.ctrlKey) toggleFullscreen()
      if (!inInput && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); videoRef.current?.paused ? videoRef.current.play().catch(() => {}) : videoRef.current?.pause() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [clip, currentTime, activeClip])
  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])

  // Ctrl+滾輪 → 阻止瀏覽器縮放，改為影片前後跳轉
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()   // 阻止瀏覽器縮放（必須在 document 層非 passive）
      const v = videoRef.current
      if (!v) return
      const step = e.deltaY > 0 ? 3 : -3   // 每格滾動 3 秒
      v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + step))
    }
    // 必須掛在 document 且 passive: false 才能 preventDefault 成功
    document.addEventListener('wheel', onWheel, { passive: false })
    return () => document.removeEventListener('wheel', onWheel)
  }, [])

  async function loadBrowse(p: string) {
    setBrowseLoading(true)
    try {
      const d = await apiJson<{ items: FileItem[] }>(`/api/files?path=${encodeURIComponent(p)}`)
      setBrowseItems(d.items ?? []); setBrowsePath(p)
    } catch { toast.error('載入失敗') }
    setBrowseLoading(false)
  }

  async function addVideoClip(path: string, name: string) {
    try {
      const info = await apiJson<VideoInfo>(`/api/video/info?path=${encodeURIComponent(path)}`)
      const c: Clip = { path, name, inPt: 0, outPt: info.duration, duration: info.duration }
      setClips(prev => {
        setActiveClip(prev.length)
        return [...prev, c]
      })
      setExportName(`${name.replace(/\.[^.]+$/, '')}_edited`)
      setSelectedPath(path)  // 進入編輯器（只有第一次有效）
    } catch { toast.error('無法讀取影片資訊') }
  }

  function addAudioTrack(path: string, name: string) {
    setAudioTracks(prev => [...prev, { path, name, volume: 1 }])
    toast.success('已加入音軌：' + name)
  }

  function startPreview() {
    if (!clips.length) { toast.error('請先加入影片'); return }
    setActiveClip(0); setPreviewMode(true)
    setTimeout(() => {
      const v = videoRef.current
      if (v) {
        v.pause(); v.currentTime = clips[0].inPt; v.playbackRate = speed
        const onS = () => { v.removeEventListener('seeked', onS); v.play().catch(() => {}) }
        v.addEventListener('seeked', onS)
      }
    }, 50)
  }

  function stopPreview() { setPreviewMode(false); videoRef.current?.pause() }

  function toggleFullscreen() {
    if (!document.fullscreenElement) { containerRef.current?.requestFullscreen(); setIsFullscreen(true) }
    else { document.exitFullscreen(); setIsFullscreen(false) }
  }

  function setInPoint() {
    if (!clip) return
    const t = videoRef.current?.currentTime ?? 0
    setClips(p => p.map((c, i) => i === activeClip ? { ...c, inPt: Math.min(t, c.outPt - 0.1) } : c))
  }

  function setOutPoint() {
    if (!clip) return
    const t = videoRef.current?.currentTime ?? 0
    setClips(p => p.map((c, i) => i === activeClip ? { ...c, outPt: Math.max(t, c.inPt + 0.1) } : c))
  }

  async function handleExport() {
    if (!clips.length) { toast.error('請先加入影片'); return }
    // 影片處理可能需要幾分鐘，設定 10 分鐘 timeout
    const fetchWithTimeout = (url: string, opts: RequestInit) => {
      const controller = new AbortController()
      const tid = setTimeout(() => controller.abort(), 10 * 60 * 1000)
      return fetch(url, { ...opts, signal: controller.signal }).finally(() => clearTimeout(tid))
    }
    stopPreview(); videoRef.current?.pause()
    const outputName = `${exportName.trim() || 'output'}.${exportVideoFmt}`
    const txtOpts = textOverlay.text.trim() ? { ...textOverlay } : undefined
    setShowExportDialog(false); setBusy(true)
    try {
      const BACKEND = import.meta.env.VITE_BACKEND_URL as string
      const token = localStorage.getItem('nas_jwt') ?? ''
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

      setExportProgress(0); setExportLog('')

      // 解析度對應
      const resMap: Record<string, string> = {
        '720p': '1280:720', '1080p': '1920:1080',
        '2k': '2560:1440', '4k': '3840:2160', '8k': '7680:4320', 'source': ''
      }
      const resolution = resMap[exportResolution] || ''

      // 啟動非同步匯出，取得 jobId
      const body = clips.length === 1
        ? JSON.stringify({ path: clips[0].path, outputName, destPath: destPath || undefined,
            operations: { start: clips[0].inPt, end: clips[0].outPt, speed, preset: exportQuality,
              resolution, textOverlay: txtOpts,
              ...(audioTracks[0] ? { audioOverlay: { path: audioTracks[0].path, volume: audioTracks[0].volume } } : {}) } })
        : JSON.stringify({ clips: clips.map(c => ({ path: c.path, inPt: c.inPt, outPt: c.outPt })),
            outputName, destPath: destPath || undefined, resolution, textOverlay: txtOpts,
            ...(audioTracks[0] ? { audioOverlay: { path: audioTracks[0].path, volume: audioTracks[0].volume } } : {}) })

      const startR = await fetch(`${BACKEND}/api/video/export`, { method: 'POST', headers, body })
      if (!startR.ok) { const d = await startR.json().catch(() => ({})); throw new Error((d as {error?:string}).error ?? `HTTP ${startR.status}`) }
      const { jobId } = await startR.json() as { jobId: string }

      // 輪詢進度
      await new Promise<void>((resolve, reject) => {
        const poll = setInterval(async () => {
          try {
            const r = await fetch(`${BACKEND}/api/video/export/${jobId}`, { headers: { Authorization: `Bearer ${token}` } })
            const job = await r.json() as { status: string; progress: number; error: string | null; log: string }
            setExportProgress(job.progress)
            if (job.log) setExportLog(job.log.split('\n').filter(Boolean).pop() ?? '')
            if (job.status === 'done') { clearInterval(poll); resolve() }
            if (job.status === 'error') { clearInterval(poll); reject(new Error(job.error ?? '匯出失敗')) }
          } catch (e) { clearInterval(poll); reject(e) }
        }, 1000)
      })
      toast.success('已儲存：' + outputName)
      onDone?.(); onClose()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  // File browser
  if (!selectedPath) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-800 shrink-0">
            {browsePath && (
              <button onClick={() => loadBrowse(browsePath.split('/').slice(0,-1).join('/'))}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              </button>
            )}
            <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="text-white font-semibold text-sm flex-1">選擇影片</span>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {browseLoading ? <div className="text-center py-10 text-gray-500 text-sm">載入中...</div> : (
              <>
                {browseItems.filter(i => i.type === 'folder').map(f => (
                  <button key={f.name} onClick={() => loadBrowse(browsePath ? `${browsePath}/${f.name}` : f.name)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-left">
                    <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>
                    <span className="text-gray-300 text-sm">{f.name}</span>
                  </button>
                ))}
                {browseItems.filter(i => i.type === 'file' && isVid(i.name)).map(f => (
                  <button key={f.name} onClick={() => addVideoClip(browsePath ? `${browsePath}/${f.name}` : f.name, f.name)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-900/30 border border-transparent hover:border-purple-700/40 text-left">
                    <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/></svg>
                    <span className="text-gray-200 text-sm">{f.name}</span>
                  </button>
                ))}
                {!browseLoading && browseItems.filter(i => isVid(i.name) || i.type === 'folder').length === 0 && (
                  <div className="text-center py-10 text-gray-600 text-sm">此資料夾沒有影片</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Main editor
  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-gray-950 flex flex-col text-white">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800 shrink-0">
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <span className="text-sm font-semibold">影片剪輯</span>
        <span className="text-xs text-gray-500 truncate max-w-48">{clip?.name}</span>
        <div className="flex-1"/>
        <span className="text-xs text-gray-600 hidden md:block">Ctrl+B 剪切 · K 播放/暫停 · Del 刪除片段 · F 全螢幕</span>
        <button onClick={toggleFullscreen} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
          {isFullscreen
            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 15v4.5M9 15H4.5M15 9h4.5M15 9V4.5M15 15h4.5M15 15v4.5"/></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>
          }
        </button>
        <button onClick={previewMode ? stopPreview : startPreview} disabled={!clips.length}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${previewMode ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
          {previewMode ? '⏹ 停止' : '▶ 預覽'}
        </button>
        <button
          onClick={() => {
            if (!clips.length) { toast.error('請先從左側加入影片'); return }
            setBusy(false)  // 強制重置，防止上次卡住
            stopPreview()
            videoRef.current?.pause()
            setShowExportDialog(true)
          }}
          className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-semibold">
          {busy ? `匯出中 ${exportProgress}%` : '💾 匯出'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Left panel */}
        <div className="w-48 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
          <div className="flex border-b border-gray-800">
            <button onClick={() => setFileTab('video')} className={`flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${fileTab === 'video' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'}`}>
              🎬 影片{clips.length > 0 && <span className="bg-purple-600 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center">{clips.length}</span>}
            </button>
            <button onClick={() => setFileTab('audio')} className={`flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${fileTab === 'audio' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
              🎵 音訊{audioTracks.length > 0 && <span className="bg-blue-600 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center">{audioTracks.length}</span>}
            </button>
          </div>
          <div className="px-2 py-1 border-b border-gray-800 flex items-center gap-1 min-h-0">
            <button onClick={() => loadBrowse('')} className="text-[10px] text-gray-600 hover:text-gray-400 shrink-0">根目錄</button>
            {browsePath && <span className="text-[10px] text-gray-500 truncate">/{browsePath.split('/').pop()}</span>}
            {browsePath && <button onClick={() => loadBrowse(browsePath.split('/').slice(0,-1).join('/'))} className="ml-auto text-gray-600 hover:text-gray-400 shrink-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>}
          </div>
          <div className="px-2 py-1 bg-gray-800/40 border-b border-gray-800">
            <p className="text-[9px] text-gray-600">
              {fileTab === 'video' ? '點擊影片加入時間軸' : '點擊音訊加入音軌'}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-1 space-y-0.5">
            {browseLoading ? <div className="text-center py-6 text-gray-600 text-xs">載入中...</div> : browseItems.map(item => {
              const isDir = item.type === 'folder'
              if (!isDir && fileTab === 'video' && !isVid(item.name)) return null
              if (!isDir && fileTab === 'audio' && !isAud(item.name)) return null
              return (
                <button key={item.name}
                  onClick={() => {
                    if (isDir) { loadBrowse(browsePath ? `${browsePath}/${item.name}` : item.name); return }
                    const p = browsePath ? `${browsePath}/${item.name}` : item.name
                    if (isVid(item.name)) addVideoClip(p, item.name)
                    if (isAud(item.name)) addAudioTrack(p, item.name)
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${isDir ? 'text-gray-400 hover:bg-gray-800' : isVid(item.name) ? 'text-purple-300 hover:bg-purple-900/30' : 'text-blue-300 hover:bg-blue-900/30'}`}>
                  {isDir
                    ? <svg className="w-3.5 h-3.5 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>
                    : isVid(item.name)
                      ? <svg className="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/></svg>
                      : <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"/></svg>
                  }
                  <span className="truncate">{item.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{minHeight:0}}>

          {/* Preview */}
          <div className="flex-1 bg-black flex items-center justify-center relative min-h-0">
            {clip ? (
              <>
                <video ref={videoRef} src={downloadUrl(clip.path)}
                  className="max-w-full max-h-full object-contain cursor-pointer"
                  onClick={() => videoRef.current?.paused ? videoRef.current.play().catch(() => {}) : videoRef.current?.pause()}/>
                <canvas ref={canvasRef} width={1280} height={720}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"/>
                {previewMode && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>
                    <span className="text-xs text-white font-medium">前端預覽中</span>
                    <button onClick={stopPreview} className="text-gray-400 hover:text-white text-xs ml-1">停止</button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-700">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/></svg>
                <p className="text-sm">從左側加入影片片段</p>
              </div>
            )}
          </div>

          {/* Playback controls */}
          {clip && (
            <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 shrink-0 space-y-2">
              <div className="flex items-center gap-3">
                <button onClick={() => videoRef.current?.paused ? videoRef.current.play().catch(() => {}) : videoRef.current?.pause()}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0">
                  {playing
                    ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                </button>
                <span className="text-xs text-gray-400 font-mono w-14 shrink-0">{fmtTime(displayTime)}</span>
                <div className="flex-1"/>
                <span className="text-xs text-gray-500 font-mono">IN {fmtTime(clip.inPt)} → OUT {fmtTime(clip.outPt)} ({fmtTime(clip.outPt - clip.inPt)})</span>
                <span className="text-xs text-gray-400 font-mono w-14 text-right shrink-0">{fmtTime(clip.duration)}</span>
              </div>
              <div ref={timelineRef} className="relative h-10 bg-gray-800 rounded-lg cursor-pointer select-none"
                onMouseDown={e => {
                  const rect = timelineRef.current!.getBoundingClientRect()
                  const getT = (x: number) => Math.max(0, Math.min(1, (x - rect.left) / rect.width)) * clip.duration
                  const clickPx = e.clientX - rect.left
                  const inPx = (clip.inPt / clip.duration) * rect.width
                  const outPx = (clip.outPt / clip.duration) * rect.width
                  let mode: 'in' | 'out' | 'seek' = 'seek'
                  if (Math.abs(clickPx - inPx) < 10) mode = 'in'
                  else if (Math.abs(clickPx - outPx) < 10) mode = 'out'
                  else if (videoRef.current) videoRef.current.currentTime = getT(e.clientX)
                  const onMove = (me: MouseEvent) => {
                    const t = getT(me.clientX)
                    if (mode === 'in') { setClips(p => p.map((c,i) => i === activeClip ? {...c, inPt: Math.min(t, c.outPt-0.1)} : c)); return }
                    if (mode === 'out') { setClips(p => p.map((c,i) => i === activeClip ? {...c, outPt: Math.max(t, c.inPt+0.1)} : c)); return }
                    setScrubTime(t)
                    if (seekRef.current) clearTimeout(seekRef.current)
                    seekRef.current = setTimeout(() => { if (videoRef.current) videoRef.current.currentTime = t; seekRef.current = null }, 80)
                  }
                  const onUp = (me: MouseEvent) => {
                    if (mode === 'seek') {
                      if (seekRef.current) { clearTimeout(seekRef.current); seekRef.current = null }
                      if (videoRef.current) videoRef.current.currentTime = getT(me.clientX)
                      setScrubTime(null)
                    }
                    window.removeEventListener('mousemove', onMove)
                    window.removeEventListener('mouseup', onUp)
                  }
                  window.addEventListener('mousemove', onMove)
                  window.addEventListener('mouseup', onUp)
                }}>
                <div className="absolute top-0 bottom-0 bg-purple-600/25 rounded"
                  style={{left: `${(clip.inPt/clip.duration)*100}%`, width: `${((clip.outPt-clip.inPt)/clip.duration)*100}%`}}/>
                <div className="absolute top-0 bottom-0 w-1.5 bg-green-400 rounded cursor-ew-resize z-10"
                  style={{left: `calc(${(clip.inPt/clip.duration)*100}% - 3px)`}}/>
                <div className="absolute top-0 bottom-0 w-1.5 bg-red-400 rounded cursor-ew-resize z-10"
                  style={{left: `calc(${(clip.outPt/clip.duration)*100}% - 3px)`}}/>
                <div className="absolute top-0 bottom-0 w-0.5 bg-white z-20" style={{left: `${curPct}%`}}>
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full"/>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={setInPoint} className="px-2.5 py-1 rounded text-xs bg-green-900/40 text-green-400 border border-green-800/50 hover:bg-green-900">設 IN</button>
                <button onClick={setOutPoint} className="px-2.5 py-1 rounded text-xs bg-red-900/40 text-red-400 border border-red-800/50 hover:bg-red-900">設 OUT</button>
                <span className="text-gray-600 text-xs flex items-center ml-auto">拖拉 🟢IN 🔴OUT ⬜播放頭</span>
              </div>
            </div>
          )}

          {/* Duration + Zoom — above tools */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border-t border-gray-800 shrink-0">
            <span className="text-[10px] text-gray-400 shrink-0">總時長 <span className="text-white font-medium tabular-nums">{fmtTime(totalDuration)}</span></span>
            <div className="flex-1"/>
            <span className="text-[9px] text-gray-600">縮放</span>
            <button onClick={() => setTimelineZoom(z => Math.max(z / 1.5, 0.2))} className="w-6 h-6 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-sm">−</button>
            <span className="text-[10px] text-gray-500 w-10 text-center tabular-nums">{Math.round(timelineZoom * 100)}%</span>
            <button onClick={() => setTimelineZoom(z => Math.min(z * 1.5, 20))} className="w-6 h-6 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-sm">+</button>
            <button onClick={() => setTimelineZoom(1)} className="text-[10px] text-gray-600 hover:text-gray-400 px-1">重置</button>
          </div>

          {/* Tools */}
          <div className="bg-gray-900 border-t border-gray-800 shrink-0">
            <div className="flex border-b border-gray-800">
              {(['text','audio','speed'] as const).map(t => (
                <button key={t} onClick={() => setActivePanel(activePanel === t ? null : t)}
                  className={`px-4 py-2 text-xs font-medium transition-colors ${activePanel === t ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'}`}>
                  {t === 'text' ? '📝 文字' : t === 'audio' ? '🎵 音訊' : '⚡ 速度'}
                </button>
              ))}
            </div>
            {activePanel === 'text' && (
              <div className="px-4 py-3 flex gap-3 items-end flex-wrap">
                <div className="flex-1 min-w-32">
                  <label className="text-xs text-gray-500 mb-1 block">文字</label>
                  <input value={textOverlay.text} onChange={e => setTextOverlay(p => ({...p, text: e.target.value}))} placeholder="輸入文字..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">大小</label>
                  <input type="number" value={textOverlay.size} onChange={e => setTextOverlay(p => ({...p, size: Number(e.target.value)}))} min={20} max={120}
                    className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">顏色</label>
                  <select value={textOverlay.color} onChange={e => setTextOverlay(p => ({...p, color: e.target.value}))}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500">
                    {['white','yellow','red','black','cyan'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">位置</label>
                  <select value={textOverlay.position} onChange={e => setTextOverlay(p => ({...p, position: e.target.value}))}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500">
                    {[['bottom','下方'],['center','中間'],['top','上方']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
            )}
            {activePanel === 'audio' && (
              <div className="px-4 py-3 space-y-2">
                {audioTracks.length === 0
                  ? <p className="text-xs text-gray-600">從左側「音訊」tab 選擇音訊檔</p>
                  : audioTracks.map((at, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2">
                      <span className="text-xs text-blue-300 flex-1 truncate">{at.name}</span>
                      <input type="range" min={0} max={2} step={0.1} value={at.volume}
                        onChange={e => setAudioTracks(p => p.map((a,j) => j === i ? {...a, volume: Number(e.target.value)} : a))}
                        className="w-20 accent-blue-500"/>
                      <span className="text-xs text-gray-400 w-8">{Math.round(at.volume*100)}%</span>
                      <button onClick={() => setAudioTracks(p => p.filter((_,j) => j !== i))} className="text-gray-600 hover:text-red-400 text-xs">✕</button>
                    </div>
                  ))
                }
              </div>
            )}
            {activePanel === 'speed' && (
              <div className="px-4 py-3 flex items-center gap-3">
                <span className="text-xs text-gray-400 shrink-0">速度 {speed}x</span>
                <div className="flex gap-1.5">
                  {[0.25,0.5,0.75,1,1.25,1.5,2].map(s => (
                    <button key={s} onClick={() => setSpeed(s)}
                      className={`px-2.5 py-1 rounded text-xs font-medium ${speed === s ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                      {s}x
                    </button>
                  ))}
                </div>
                <input type="range" min={0.25} max={2} step={0.05} value={speed} onChange={e => setSpeed(Number(e.target.value))}
                  className="flex-1 accent-purple-500"/>
              </div>
            )}
          </div>

          {/* CapCut-style Timeline */}
          <div className="bg-gray-950 border-t border-gray-800 flex flex-col" style={{height:'180px', flexShrink:0, overflow:'hidden'}}>

            {/* Timeline body */}
            <div className="flex flex-1 overflow-hidden">

              {/* Fixed left: labels + audio controls */}
              <div className="shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col" style={{width:'140px'}}>
                {/* Ruler spacer */}
                <div style={{height:'20px'}} className="border-b border-gray-800"/>
                {/* V1 label */}
                <div style={{height:'42px'}} className="flex items-center justify-end pr-2">
                  <span className="text-[10px] text-gray-500 font-medium">V1</span>
                </div>
                {/* Audio track controls */}
                {audioTracks.map((at,i) => (
                  <div key={i} style={{height:'32px', marginTop:'4px'}} className="flex items-center gap-1 px-1.5">
                    <span className="text-[10px] text-blue-400 shrink-0">A{i+1}</span>
                    <span className="text-[9px] text-blue-300 flex-1 truncate">{at.name.replace(/\.[^.]+$/,'')}</span>
                    <input type="range" min={0} max={2} step={0.1} value={at.volume}
                      onChange={e => setAudioTracks(p => p.map((a,j) => j===i?{...a,volume:Number(e.target.value)}:a))}
                      className="w-12 accent-blue-400"/>
                    <button onClick={() => setAudioTracks(p => p.filter((_,j) => j !== i))}
                      className="text-gray-600 hover:text-red-400 text-xs shrink-0">✕</button>
                  </div>
                ))}
              </div>

              {/* Scrollable track area */}
              <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden" style={{overscrollBehaviorX:'contain'}}>
                {(() => {
                  const pxPerSec = 60 * timelineZoom
                  const trackW = Math.max(600, totalDuration * pxPerSec + 120)
                  const cols = [
                    'bg-purple-800/80 border-purple-500 hover:bg-purple-700/80',
                    'bg-blue-800/80 border-blue-500 hover:bg-blue-700/80',
                    'bg-teal-800/80 border-teal-500 hover:bg-teal-700/80',
                    'bg-indigo-800/80 border-indigo-500 hover:bg-indigo-700/80',
                  ]
                  return (
                    <div style={{width: trackW + 'px'}} className="relative h-full">
                      {/* Time ruler */}
                      <div style={{height:'20px'}} className="relative bg-gray-900 border-b border-gray-800 sticky top-0">
                        {Array.from({length: Math.ceil(totalDuration / Math.max(1, Math.floor(1/timelineZoom))) + 2}, (_,idx) => {
                          const step = Math.max(1, Math.floor(5 / timelineZoom))
                          const t = idx * step
                          return t <= totalDuration + step ? (
                            <div key={idx} className="absolute top-0 bottom-0 border-l border-gray-700/60"
                              style={{left: t * pxPerSec + 'px'}}>
                              <span className="text-[9px] text-gray-500 pl-0.5 leading-5 select-none">{fmtTime(t)}</span>
                            </div>
                          ) : null
                        })}
                        {/* Playhead triangle on ruler */}
                        <div className="absolute top-0 bottom-0 w-px bg-orange-400 z-10 pointer-events-none"
                          style={{left: displayTime * pxPerSec + 'px'}}>
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
                            style={{borderLeft:'4px solid transparent', borderRight:'4px solid transparent', borderTop:'6px solid #fb923c'}}/>
                        </div>
                      </div>

                      {/* Video track */}
                      <div className="relative bg-black/20" style={{height:'42px'}}>
                        {clips.length === 0 && (
                          <div className="absolute inset-0 flex items-center px-4 text-xs text-gray-700 select-none">從左側加入影片 →</div>
                        )}
                        {clips.map((c,i) => {
                          const dur = c.outPt - c.inPt
                          const wPx = Math.max(dur * pxPerSec, 6)
                          const lPx = clipOffsets[i] * pxPerSec
                          return (
                            <div key={i} onClick={() => setActiveClip(i)}
                              className={`absolute top-1 bottom-1 rounded border cursor-pointer group overflow-hidden transition-colors ${cols[i%cols.length]} ${activeClip===i?'ring-2 ring-white/70':'opacity-90'}`}
                              style={{left: lPx + 'px', width: wPx + 'px'}}>
                              <div className="h-full flex flex-col justify-between px-1.5 py-1 pointer-events-none select-none">
                                <span className="text-[10px] text-white font-medium leading-none truncate">{c.name}</span>
                                <div className="flex justify-between gap-1">
                                  <span className="text-[9px] text-green-300 leading-none shrink-0">{fmtTime(c.inPt)}</span>
                                  {wPx > 80 && <span className="text-[9px] text-yellow-200 leading-none">{fmtTime(dur)}</span>}
                                  <span className="text-[9px] text-red-300 leading-none shrink-0">{fmtTime(c.outPt)}</span>
                                </div>
                              </div>
                              <button onClick={e => { e.stopPropagation(); setClips(p => p.filter((_,j) => j !== i)); setActiveClip(Math.max(0,i-1)) }}
                                className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-bl">✕</button>
                            </div>
                          )
                        })}
                        <div className="absolute top-0 bottom-0 w-px bg-orange-400 z-10 pointer-events-none"
                          style={{left: displayTime * pxPerSec + 'px'}}/>
                      </div>

                      {/* Audio track bars */}
                      {audioTracks.map((at,i) => (
                        <div key={i} className="relative bg-black/10" style={{height:'32px', marginTop:'4px'}}>
                          <div className="absolute inset-y-1 left-0 bg-blue-700/50 border border-blue-500/60 rounded"
                            style={{width: totalDuration * pxPerSec + 'px', minWidth:'20px'}}>
                            <div className="h-full flex items-center px-2 gap-1">
                              <svg className="w-2.5 h-2.5 text-blue-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"/></svg>
                              <span className="text-[9px] text-blue-200 truncate">{at.name}</span>
                            </div>
                          </div>
                          <div className="absolute top-0 bottom-0 w-px bg-orange-400 z-10 pointer-events-none"
                            style={{left: displayTime * pxPerSec + 'px'}}/>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Destination folder picker */}
      {showDestPicker && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowDestPicker(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm mx-4 flex flex-col max-h-[70vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 shrink-0">
              {destPickerPath && (
                <button onClick={() => {
                  const parent = destPickerPath.split('/').slice(0,-1).join('/')
                  setDestPickerPath(parent); setDestPickerLoading(true)
                  apiJson<{items:FileItem[]}>(`/api/files?path=${encodeURIComponent(parent)}`).then(d=>{setDestPickerItems(d.items??[]);setDestPickerLoading(false)}).catch(()=>setDestPickerLoading(false))
                }} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                </button>
              )}
              <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>
              <span className="text-sm text-white font-medium flex-1 truncate">{destPickerPath || '根目錄'}</span>
              <button onClick={() => setShowDestPicker(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {destPickerLoading ? <div className="text-center py-8 text-gray-600 text-sm">載入中...</div>
                : destPickerItems.filter(i => i.type === 'folder').map(f => {
                    const p = destPickerPath ? `${destPickerPath}/${f.name}` : f.name
                    return (
                      <button key={f.name} onClick={() => { setDestPickerPath(p); setDestPickerLoading(true); apiJson<{items:FileItem[]}>(`/api/files?path=${encodeURIComponent(p)}`).then(d=>{setDestPickerItems(d.items??[]);setDestPickerLoading(false)}).catch(()=>setDestPickerLoading(false)) }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-left">
                        <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>
                        <span className="text-gray-300 text-sm truncate">{f.name}</span>
                      </button>
                    )
                  })}
              {!destPickerLoading && destPickerItems.filter(i=>i.type==='folder').length === 0 && (
                <div className="text-center py-6 text-gray-600 text-xs">此資料夾沒有子資料夾</div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-gray-800 shrink-0 flex gap-2">
              <button onClick={() => { setDestPath(destPickerPath); setShowDestPicker(false) }}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium">
                選擇「{destPickerPath || '根目錄'}」
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowExportDialog(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <p className="text-white font-semibold">匯出設定</p>
              <button onClick={() => setShowExportDialog(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Destination folder */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">儲存位置</label>
                <button onClick={() => { setDestPickerPath(''); setShowDestPicker(true); setDestPickerLoading(true);
                    apiJson<{items:FileItem[]}>('/api/files?path=').then(d=>{setDestPickerItems(d.items??[]);setDestPickerLoading(false)}).catch(()=>setDestPickerLoading(false)) }}
                  className="w-full flex items-center gap-2 bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-lg px-3 py-2 text-sm text-left transition-colors group">
                  <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></svg>
                  <span className={`flex-1 font-mono text-xs truncate ${destPath ? 'text-white' : 'text-gray-500'}`}>
                    {destPath || '與原始影片相同資料夾'}
                  </span>
                  {destPath && <button onClick={e => { e.stopPropagation(); setDestPath('') }} className="text-gray-500 hover:text-red-400 text-xs shrink-0">✕</button>}
                </button>
              </div>

              {/* Filename */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">檔案名稱</label>
                <div className="flex items-center gap-2">
                  <input value={exportName} onChange={e => setExportName(e.target.value)} placeholder="output"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"/>
                  <span className="text-gray-500 text-sm shrink-0">.{exportVideoFmt}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">影片格式</label>
                <div className="flex rounded-xl border border-gray-700 overflow-hidden text-sm font-medium">
                  {(['mp4','mkv','mov'] as const).map(f => (
                    <button key={f} onClick={() => setExportVideoFmt(f)}
                      className={`flex-1 py-2.5 transition-colors ${exportVideoFmt===f?'bg-purple-600 text-white':'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">音訊格式</label>
                <div className="flex rounded-xl border border-gray-700 overflow-hidden text-sm font-medium">
                  {([['aac','AAC'],['mp3','MP3'],['copy','原始']] as const).map(([f,l]) => (
                    <button key={f} onClick={() => setExportAudioFmt(f)}
                      className={`flex-1 py-2.5 transition-colors ${exportAudioFmt===f?'bg-blue-600 text-white':'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">品質</label>
                <div className="flex rounded-xl border border-gray-700 overflow-hidden text-sm font-medium">
                  {([['fast','快速'],['medium','均衡'],['slow','高品質']] as const).map(([v,l]) => (
                    <button key={v} onClick={() => setExportQuality(v)}
                      className={`flex-1 py-2.5 transition-colors ${exportQuality===v?'bg-green-700 text-white':'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {/* Resolution */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">解析度</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {([['720p','720p HD'],['1080p','1080p FHD'],['2k','2K QHD'],['4k','4K UHD'],['8k','8K'],['source','原始']] as const).map(([v,l]) => (
                    <button key={v} onClick={() => setExportResolution(v)}
                      className={`py-2 rounded-lg text-xs font-medium transition-colors border ${exportResolution===v?'bg-indigo-600 border-indigo-500 text-white':'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'}`}>
                      {l}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-600 mt-1">
                  {exportResolution === 'source' ? '保留原始解析度' :
                   exportResolution === '8k' ? '⚠️ 8K 處理時間很長' :
                   exportResolution === '4k' ? '建議有足夠儲存空間' : ''}
                </p>
              </div>

              <div className="bg-gray-800/60 rounded-xl p-3 text-xs text-gray-400 space-y-1">
                <div className="flex justify-between"><span>片段數</span><span className="text-white">{clips.length}</span></div>
                <div className="flex justify-between"><span>總時長</span><span className="text-white">{fmtTime(totalDuration)}</span></div>
                <div className="flex justify-between"><span>解析度</span><span className="text-white">{exportResolution.toUpperCase()}</span></div>
                <div className="flex justify-between"><span>輸出</span><span className="text-white font-mono">{exportName||'output'}.{exportVideoFmt}</span></div>
              </div>
              {busy && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>匯出進度</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
                      style={{width: `${exportProgress}%`}}/>
                  </div>
                  {exportLog && <p className="text-[10px] text-gray-600 font-mono truncate">{exportLog}</p>}
                </div>
              )}
              <button onClick={handleExport} disabled={busy || !exportName.trim()}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2">
                {busy ? <><span className="animate-spin">◌</span>處理中 {exportProgress}%</> : `💾 開始匯出 → ${exportName||'output'}.${exportVideoFmt}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
