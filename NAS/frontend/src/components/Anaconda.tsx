import { useState, useRef, useEffect } from 'react'

interface Props {
  onClose: () => void
}

const STORAGE_KEY = 'jupyter_url'
const DEFAULT_URL = (import.meta.env.VITE_JUPYTER_URL as string | undefined ?? 'https://raspberrypi.tail8767da.ts.net/jupyter').replace(/\/+$/, '')

export default function Anaconda({ onClose }: Props) {
  const [url, setUrl] = useState(() => (localStorage.getItem(STORAGE_KEY) ?? DEFAULT_URL).replace(/\/+$/, ''))
  const [draft, setDraft] = useState(url)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !showSettings) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, showSettings])

  function applyUrl() {
    const trimmed = draft.trim().replace(/\/+$/, '')
    if (!trimmed) return
    localStorage.setItem(STORAGE_KEY, trimmed)
    setUrl(trimmed)
    setShowSettings(false)
    setLoading(true)
    setLoadError(false)
  }

  function reload() {
    setLoading(true)
    setLoadError(false)
    if (iframeRef.current) iframeRef.current.src = url
  }

  const isHttps = url.startsWith('https://')

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a2e] border-b border-gray-800 shrink-0 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Anaconda snake-circle icon */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#43B049" strokeWidth="1.5"/>
            <path d="M8 9c0-1.1.9-2 2-2h4a2 2 0 010 4h-4a2 2 0 000 4h4a2 2 0 010 4H10a2 2 0 01-2-2"
              stroke="#43B049" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-white font-semibold text-sm truncate">Anaconda / Jupyter</span>
          <span className="text-gray-600 text-xs font-mono truncate hidden sm:block max-w-[240px]">{url}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer"
            title="Open in new tab"
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
          <button onClick={reload} title="Reload"
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <button
            onClick={() => { setShowSettings(v => !v); setDraft(url) }}
            title="Configure Jupyter URL"
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
              showSettings ? 'text-green-400 bg-green-400/10' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a7.723 7.723 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button onClick={onClose} title="Close"
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0 space-y-2">
          <p className="text-xs text-gray-400 font-medium">Jupyter Server URL</p>
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyUrl()}
              placeholder="https://raspberrypi.tail8767da.ts.net:10000"
              autoFocus
              className="flex-1 bg-gray-800 border border-gray-700 focus:border-green-500 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none"
            />
            <button onClick={applyUrl}
              className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-medium transition-colors">
              Apply
            </button>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Install Miniconda on Pi:</p>
            <code className="block bg-gray-800 px-2 py-1 rounded text-gray-400 select-all">
              wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh && bash Miniconda3-latest-Linux-aarch64.sh
            </code>
            <p className="pt-1">Start Jupyter (allow all origins):</p>
            <code className="block bg-gray-800 px-2 py-1 rounded text-gray-400 select-all">
              jupyter notebook --ip=0.0.0.0 --no-browser --NotebookApp.allow_origin='*' --NotebookApp.disable_check_xsrf=True
            </code>
          </div>
        </div>
      )}

      {/* Mixed content warning */}
      {!isHttps && !showSettings && (
        <div className="px-4 py-2 bg-yellow-900/30 border-b border-yellow-800/40 shrink-0 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-yellow-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-xs text-yellow-300">
            HTTP URLs may be blocked on HTTPS pages. Use Tailscale HTTPS or "Open in new tab".
          </p>
        </div>
      )}

      {/* iframe area */}
      <div className="flex-1 relative">
        {loading && !loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-10 gap-4">
            <div className="w-8 h-8 border-2 border-[#43B049] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Connecting to Jupyter…</p>
          </div>
        )}
        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-10 gap-5 px-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#43B049" strokeWidth="1.5" opacity="0.4"/>
                <path d="M8 9c0-1.1.9-2 2-2h4a2 2 0 010 4h-4a2 2 0 000 4h4a2 2 0 010 4H10a2 2 0 01-2-2"
                  stroke="#43B049" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-medium mb-1">Cannot connect to Jupyter Server</p>
              <p className="text-gray-500 text-sm mb-1">Please ensure Jupyter Notebook / Lab is running on the Pi</p>
              <p className="text-gray-600 text-xs font-mono">{url}</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <button onClick={reload}
                className="px-4 py-2 rounded-lg bg-[#43B049] hover:bg-[#389e3e] text-white text-sm font-medium transition-colors">
                Retry
              </button>
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors">
                Open in new tab
              </a>
              <button onClick={() => { setShowSettings(true); setDraft(url) }}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors">
                Change URL
              </button>
            </div>
            <div className="text-left bg-gray-900 border border-gray-800 rounded-xl p-4 w-full max-w-md text-xs text-gray-500 space-y-2">
              <p className="text-gray-400 font-medium">Quick Start (run on Pi)</p>
              <code className="block bg-gray-800 px-2 py-1.5 rounded text-gray-400 select-all leading-relaxed">
                jupyter notebook --ip=0.0.0.0 --no-browser --NotebookApp.allow_origin='*'
              </code>
              <p>Or use JupyterLab:</p>
              <code className="block bg-gray-800 px-2 py-1.5 rounded text-gray-400 select-all">
                jupyter lab --ip=0.0.0.0 --no-browser --ServerApp.allow_origin='*'
              </code>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-0"
          title="Anaconda / Jupyter"
          allow="clipboard-read; clipboard-write"
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setLoadError(true) }}
        />
      </div>
    </div>
  )
}
