import React, { useState, useEffect, useCallback } from 'react'
import { apiJson } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const BUILTIN_APPS: {
  id: string; name: string; desc: string
  color: string; bg: string
  adminOnly?: boolean
  icon: React.ReactNode
}[] = [
  {
    id: 'terminal', name: 'Terminal', desc: 'Shell · CLI · System Admin',
    color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    id: 'video', name: 'Video Player', desc: 'MP4 · MKV · AVI · MOV',
    color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    id: 'audio', name: 'Music Player', desc: 'MP3 · FLAC · AAC · WAV',
    color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
  },
  {
    id: 'image', name: 'Image Viewer', desc: 'JPG · PNG · GIF · WebP',
    color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    id: 'editor', name: 'Text Editor', desc: 'TXT · MD · JS · PY · JSON',
    color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    id: 'pdf', name: 'PDF Reader', desc: 'PDF document viewer & download',
    color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: 'office', name: 'Office Collab', desc: 'Word · Excel · PowerPoint collaboration',
    color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3.75h9m-9 3.75h5.25M4.5 19.5h15A1.5 1.5 0 0021 18V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z" />
      </svg>
    ),
  },
  {
    id: 'photo', name: 'Photos', desc: 'JPG · PNG · GIF · WebP thumbnail browser',
    color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    id: 'music', name: 'Music', desc: 'MP3 · FLAC · AAC · WAV browser & player',
    color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
  },
  {
    id: 'locker', name: 'Private Album', desc: 'sda1 · Fingerprint protected · Photos · Videos',
    color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
      </svg>
    ),
  },
  {
    id: 'reels', name: 'Private Reels', desc: 'sda1 · Fingerprint protected · TikTok style',
    color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/20',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.13 8.13 0 004.77 1.52V6.74a4.85 4.85 0 01-1-.05z"/>
      </svg>
    ),
  },
  {
    id: 'telegram', name: 'Telegram Videos', desc: 'sda1 · Fingerprint protected · Private videos',
    color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/20',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  {
    id: 'extrafile', name: 'Duplicate Finder', desc: 'MD5 comparison · Duplicate files · One-click cleanup',
    color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    id: 'ups', name: 'UPS System', desc: 'Battery status · Voltage monitoring · Runtime estimate',
    color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20',
    adminOnly: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
      </svg>
    ),
  },
  {
    id: 'camera', name: 'Camera System', desc: 'RTSP · MJPEG · Live view · Multi-camera',
    color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
      </svg>
    ),
  },
  {
    id: 'raid', name: 'RAID Array', desc: 'Mirror backup · Rebuild monitoring · Disk management',
    color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20',
    adminOnly: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 018.25-2.25M12 10.5a4.5 4.5 0 018.25-2.25M12 10.5V3m0 7.5a3 3 0 110 6 3 3 0 010-6z" />
      </svg>
    ),
  },
  {
    id: 'todo', name: 'To-Do', desc: 'Add · Complete · Priority · Due date',
    color: 'text-indigo-400', bg: 'bg-indigo-400/10 border-indigo-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'claude', name: 'Claude AI', desc: 'Claude.ai · Claude Code CLI · AI Assistant',
    color: 'text-[#c47c44]', bg: 'bg-[#c47c44]/10 border-[#c47c44]/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    id: 'editvideo', name: 'Video Editor', desc: 'Clip editing · Audio extraction · ffmpeg processing',
    color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'fileconvert', name: 'File Converter', desc: 'Video · Audio · Image format conversion',
    color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
      </svg>
    ),
  },
  {
    id: 'docker', name: 'Docker', desc: 'Container management · Start/Stop · Update images',
    color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20',
    adminOnly: true,
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.186.186 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.186v1.887c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.75c-.007 1.29.199 2.57.606 3.791.462 1.394 1.151 2.42 2.047 3.048.999.695 2.638 1.092 4.502 1.092.875.003 1.748-.086 2.605-.264.847-.174 1.667-.487 2.42-.929a10.26 10.26 0 002.09-1.87 16.81 16.81 0 001.34-2.065h.11c.71 0 2.515-.14 3.815-1.768a5.44 5.44 0 00.857-1.686l.058-.245z"/>
      </svg>
    ),
  },
]

interface Container {
  ID: string
  Names: string
  Image: string
  Status: string
  State: string
  Ports: string
  RunningFor: string
}

type Tab = 'list' | 'store'

function StatusDot({ state }: { state: string }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${
      state === 'running' ? 'bg-green-400 shadow-[0_0_4px_#4ade80]' : 'bg-gray-600'
    }`} />
  )
}

// Parse "0.0.0.0:8080->80/tcp" → first host port number, or null
function firstHostPort(ports: string): number | null {
  const m = ports?.match(/(?:0\.0\.0\.0|::):(\d+)->/)
  return m ? parseInt(m[1]) : null
}

// Pi hostname extracted from backend URL
const PI_HOST = (() => {
  try { return new URL(import.meta.env.VITE_BACKEND_URL as string).hostname }
  catch { return '192.168.199.108' }
})()

interface Props {
  onClose: () => void
  onLaunchBuiltin?: (id: string) => void
}

export default function AppLauncher({ onClose, onLaunchBuiltin }: Props) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [tab, setTab] = useState<Tab>('list')
  const [apps, setApps] = useState<Container[]>([])
  const [unavailable, setUnavailable] = useState(false)
  const [unavailReason, setUnavailReason] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [pullId, setPullId] = useState<string | null>(null)
  const [pullResults, setPullResults] = useState<Record<string, boolean | 'error'>>({})
  const [updatingAll, setUpdatingAll] = useState(false)

  const loadApps = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiJson<{ apps: Container[]; unavailable?: boolean; reason?: string }>('/api/apps')
      setApps(data.apps)
      setUnavailable(!!data.unavailable)
      setUnavailReason(data.reason ?? '')
    } catch {
      setUnavailable(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadApps() }, [loadApps])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function doAction(id: string, action: string) {
    setActionId(id)
    try {
      await apiJson(`/api/apps/${encodeURIComponent(id)}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      toast.success({ start: 'Started', stop: 'Stopped', restart: 'Restarted' }[action] ?? 'Done')
      await loadApps()
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? 'Operation failed')
    } finally {
      setActionId(null)
    }
  }

  async function doPull(id: string): Promise<boolean> {
    setPullId(id)
    try {
      const data = await apiJson<{ ok: boolean; updated: boolean; image: string }>(
        `/api/apps/${encodeURIComponent(id)}/pull`, { method: 'POST' }
      )
      setPullResults(r => ({ ...r, [id]: data.updated }))
      if (data.updated) { toast.success(`${data.image} updated`); await loadApps() }
      return data.updated
    } catch (err: unknown) {
      setPullResults(r => ({ ...r, [id]: 'error' }))
      toast.error((err as { message?: string }).message ?? 'Update failed')
      return false
    } finally {
      setPullId(null)
    }
  }

  async function doUpdateAll() {
    const dockerApps = apps.filter(a => !a.ID.startsWith('pm2_'))
    if (!dockerApps.length) return
    setUpdatingAll(true)
    setPullResults({})
    let updated = 0
    for (const app of dockerApps) {
      const wasUpdated = await doPull(app.ID)
      if (wasUpdated) updated++
    }
    toast.success(updated > 0 ? `${updated} containers updated` : 'All containers up to date')
    setUpdatingAll(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 flex items-start justify-center pt-12 px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-2xl flex flex-col shadow-2xl max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <h2 className="text-base font-bold text-white">Apps</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xl transition-colors"
          >×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 shrink-0 px-5">
          {(['list', 'store'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 px-1 mr-5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t ? 'border-orange-400 text-orange-400' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'list' ? 'App List' : 'Store / Update'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Built-in apps */}
          {tab === 'list' && (
            <div className="px-5 pt-4 pb-3">
              <p className="text-xs text-gray-600 mb-3 uppercase tracking-wider">Built-in Tools</p>
              <div className="grid grid-cols-2 gap-2">
                {BUILTIN_APPS.filter(app => !app.adminOnly || isAdmin).map(app => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onLaunchBuiltin?.(app.id)
                      onClose()
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${app.bg} hover:brightness-110 transition-all text-left w-full`}
                  >
                    <div className={app.color}>{app.icon}</div>
                    <div className="min-w-0">
                      <div className={`text-sm font-medium ${app.color}`}>{app.name}</div>
                      <div className="text-xs text-gray-600 truncate mt-0.5">{app.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* System apps (Docker + pm2) */}
          {tab === 'list' && (apps.length > 0 || !unavailable) && (
            <p className="text-xs text-gray-600 uppercase tracking-wider px-5 pb-2 pt-1 border-t border-gray-800 mt-1">
              System Services
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : unavailable ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 gap-2">
              <p className="text-sm">
                {unavailReason === 'permission'
                  ? 'Insufficient Docker permissions — run: sudo usermod -aG docker roy'
                  : unavailReason === 'not_installed'
                    ? 'Docker not installed'
                    : 'Docker service not running or backend not updated'}
              </p>
            </div>
          ) : apps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-2">
              <p className="text-sm">No system services found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {apps.map(app => {
                const busy = actionId === app.ID || pullId === app.ID
                const pullResult = pullResults[app.ID]
                const hostPort = firstHostPort(app.Ports)
                const webUrl = hostPort ? `http://${PI_HOST}:${hostPort}` : null
                const isDocker = !app.ID.startsWith('pm2_')
                return (
                  <li key={app.ID} className="px-5 py-3.5 flex items-center gap-3">
                    <StatusDot state={app.State} />

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{app.Names}</div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">{app.Image}</div>
                      {app.Ports && (
                        <div className="text-xs text-gray-600 truncate mt-0.5 font-mono">{app.Ports}</div>
                      )}
                      <div className="text-xs text-gray-600 mt-0.5">{app.Status}</div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Open web UI */}
                      {webUrl && app.State === 'running' && (
                        <a
                          href={webUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2.5 py-1 rounded bg-green-700 hover:bg-green-600 text-white transition-colors"
                        >
                          Open
                        </a>
                      )}

                      {/* List tab: start/stop/restart */}
                      {tab === 'list' && isAdmin && (
                        app.State === 'running' ? (
                          <>
                            <button
                              onClick={() => doAction(app.ID, 'restart')}
                              disabled={busy}
                              className="text-xs px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors"
                            >
                              {busy ? '…' : 'Restart'}
                            </button>
                            <button
                              onClick={() => doAction(app.ID, 'stop')}
                              disabled={busy}
                              className="text-xs px-2.5 py-1 rounded bg-gray-700 hover:bg-red-600 disabled:opacity-40 text-gray-300 hover:text-white transition-colors"
                            >
                              Stop
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => doAction(app.ID, 'start')}
                            disabled={busy}
                            className="text-xs px-2.5 py-1 rounded bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white transition-colors"
                          >
                            {busy ? '…' : 'Start'}
                          </button>
                        )
                      )}
                      {tab === 'list' && !isAdmin && (
                        <span className={`text-xs ${app.State === 'running' ? 'text-green-400' : 'text-gray-500'}`}>
                          {app.State === 'running' ? 'Running' : 'Stopped'}
                        </span>
                      )}

                      {/* Store tab: check/update */}
                      {tab === 'store' && isDocker && (
                        pullResult === true ? (
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                            Updated
                          </span>
                        ) : pullResult === false ? (
                          <span className="text-xs text-gray-500">Up to date</span>
                        ) : pullResult === 'error' ? (
                          <span className="text-xs text-red-400">Failed</span>
                        ) : isAdmin ? (
                          <button
                            onClick={() => doPull(app.ID)}
                            disabled={pullId !== null || updatingAll}
                            className="text-xs px-2.5 py-1 rounded bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-colors"
                          >
                            {pullId === app.ID ? 'Updating…' : 'Check Update'}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-600">Admin required</span>
                        )
                      )}
                      {tab === 'store' && !isDocker && (
                        <span className="text-xs text-gray-600">PM2 Process</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-800 shrink-0 flex items-center justify-between">
          <span className="text-xs text-gray-600">
            {apps.filter(a => a.State === 'running').length} / {apps.length} running
          </span>
          <div className="flex items-center gap-3">
            {/* Update all — store tab, admin only */}
            {tab === 'store' && isAdmin && apps.some(a => !a.ID.startsWith('pm2_')) && (
              <button
                onClick={doUpdateAll}
                disabled={updatingAll || pullId !== null}
                className="text-xs px-3 py-1.5 rounded bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white transition-colors flex items-center gap-1.5"
              >
                {updatingAll ? (
                  <>
                    <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating…
                  </>
                ) : 'Update All'}
              </button>
            )}
            <button
              onClick={loadApps}
              disabled={loading}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
            >
              <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
