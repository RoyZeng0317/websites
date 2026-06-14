import { useState, useRef, useEffect } from 'react'
import { apiJson, apiFetch } from '../lib/api'
import toast from 'react-hot-toast'

interface SearchResult {
  name: string
  type: 'file' | 'folder'
  path: string
  meta?: { tags: string[]; location: string; category: string }
}

interface SearchBarProps {
  onNavigate: (path: string) => void
}

export default function SearchBar({ onNavigate }: SearchBarProps) {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<SearchResult[]>([])
  const [open, setOpen]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [voiceState, setVoiceState] = useState<'idle' | 'recording' | 'processing'>('idle')
  const [statusText, setStatusText] = useState('')

  const inputRef   = useRef<HTMLInputElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>()
  const recorderRef = useRef<MediaRecorder | null>(null)
  const stopTimer   = useRef<ReturnType<typeof setTimeout>>()

  // ── File + metadata search ──
  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return }
    setLoading(true)
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(async () => {
      try {
        const [fileData, metaData] = await Promise.all([
          apiJson<{ items: SearchResult[] }>(`/api/files/search?q=${encodeURIComponent(query.trim())}`),
          apiJson<{ items: SearchResult[] }>(`/api/media/search?q=${encodeURIComponent(query.trim())}`).catch(() => ({ items: [] })),
        ])
        const seen = new Set<string>()
        const merged: SearchResult[] = []
        for (const item of [...fileData.items, ...metaData.items]) {
          if (!seen.has(item.path)) { seen.add(item.path); merged.push(item) }
        }
        setResults(merged)
        setOpen(merged.length > 0)
      } catch { setResults([]) }
      setLoading(false)
    }, 300)
    return () => clearTimeout(searchTimer.current)
  }, [query])

  // ── Outside click close ──
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(item: SearchResult) {
    setOpen(false); setQuery('')
    onNavigate(item.type === 'file' ? item.path.split('/').slice(0, -1).join('/') : item.path)
  }

  // ── Voice: MediaRecorder → backend STT ──
  async function toggleVoice() {
    if (voiceState === 'recording') {
      clearTimeout(stopTimer.current)
      recorderRef.current?.stop()
      return
    }
    if (voiceState === 'processing') return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg;codecs=opus'

      const chunks: BlobPart[] = []
      const recorder = new MediaRecorder(stream, { mimeType })
      recorderRef.current = recorder

      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        setVoiceState('processing')
        setStatusText('辨識中…')

        const blob = new Blob(chunks, { type: mimeType })
        const form = new FormData()
        form.append('audio', blob, 'speech.webm')

        try {
          const res = await apiFetch('/api/speech/recognize', { method: 'POST', body: form })
          const json = await res.json()
          if (json.transcript) {
            setQuery(json.transcript)
            inputRef.current?.focus()
          } else if (json.error) {
            toast.error(json.error, { duration: 5000 })
          } else {
            toast.error('未辨識到語音，請重試')
          }
        } catch {
          toast.error('語音辨識失敗')
        } finally {
          setVoiceState('idle')
          setStatusText('')
        }
      }

      recorder.start(100)
      setVoiceState('recording')
      setStatusText('聆聽中…')

      // Auto stop after 8 seconds
      stopTimer.current = setTimeout(() => recorder.stop(), 8000)
    } catch {
      setVoiceState('idle')
      toast.error('無法存取麥克風，請確認瀏覽器授權')
    }
  }

  const isRecording   = voiceState === 'recording'
  const isProcessing  = voiceState === 'processing'
  const voiceActive   = isRecording || isProcessing

  return (
    <div className="relative">
      <div className={`flex items-center bg-gray-800 rounded-lg px-3 py-1.5 transition-all duration-200 ${
        isRecording ? 'ring-2 ring-red-500/70' : isProcessing ? 'ring-2 ring-yellow-500/70' : ''
      }`}>
        {/* Search icon */}
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={voiceActive ? statusText : query}
          onChange={e => { if (!voiceActive) setQuery(e.target.value) }}
          placeholder={voiceActive ? '' : '搜尋檔案、標籤、地點…'}
          readOnly={voiceActive}
          className={`ml-2 bg-transparent text-sm focus:outline-none w-36 transition-colors ${
            isRecording  ? 'text-red-300 placeholder-red-400' :
            isProcessing ? 'text-yellow-300' :
            'text-white placeholder-gray-500'
          }`}
        />

        {/* Spinner (file search) */}
        {loading && !voiceActive && (
          <div className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin ml-2 shrink-0"/>
        )}

        {/* Mic button */}
        <button
          onClick={toggleVoice}
          disabled={isProcessing}
          title={isRecording ? '停止錄音' : isProcessing ? '辨識中…' : '語音搜尋'}
          className={`ml-2 shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-all ${
            isRecording   ? 'bg-red-500 text-white animate-pulse' :
            isProcessing  ? 'bg-yellow-500/50 text-yellow-300' :
            'text-gray-500 hover:text-white hover:bg-gray-700'
          }`}
        >
          {isRecording ? (
            /* Stop square */
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1"/>
            </svg>
          ) : isProcessing ? (
            <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"/>
          ) : (
            /* Mic */
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Results dropdown */}
      {open && results.length > 0 && (
        <div ref={panelRef}
          className="absolute top-full right-0 mt-1 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {results.map(item => (
            <button key={item.path} onClick={() => handleSelect(item)}
              className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-gray-700 transition-colors text-left">
              {item.type === 'folder' ? (
                <svg className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{item.name}</p>
                {item.meta && (item.meta.tags?.length > 0 || item.meta.location || item.meta.category) && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.meta.category && (
                      <span className="text-[10px] bg-orange-500/20 text-orange-300 rounded px-1.5 py-0.5">
                        {item.meta.category}
                      </span>
                    )}
                    {item.meta.location && (
                      <span className="text-[10px] text-gray-500">📍 {item.meta.location}</span>
                    )}
                    {item.meta.tags?.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] bg-blue-500/15 text-blue-400 rounded-full px-1.5 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-gray-500 text-xs mt-0.5 truncate">{item.path || '/'}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
