import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { BUILTIN_APPS } from '../lib/builtinApps'

export const BG_PRESETS = [
  { label: 'Default',    value: null,                                                                         color: '#111827' },
  { label: 'Nebula',     value: 'linear-gradient(135deg,#0d0d1f 0%,#1a1a4e 50%,#0a0a2e 100%)',               color: '#1a1a4e' },
  { label: 'Ocean',      value: 'linear-gradient(135deg,#0a1628 0%,#0f3460 50%,#0a2040 100%)',               color: '#0f3460' },
  { label: 'Forest',     value: 'linear-gradient(135deg,#0a1a0a 0%,#1a3d1a 50%,#0d2810 100%)',               color: '#1a3d1a' },
  { label: 'Ember',      value: 'linear-gradient(135deg,#1a0a00 0%,#3d1800 50%,#2a1000 100%)',               color: '#3d1800' },
  { label: 'Amethyst',   value: 'linear-gradient(135deg,#150d2a 0%,#2d1a50 50%,#1a0d3a 100%)',               color: '#2d1a50' },
]

interface Props {
  onClose: () => void
  onLaunchBuiltin: (id: string) => void
  onOpenAppStore: () => void
  hasBg: boolean
  currentBg: string | null
  onUploadBg: () => void
  onRemoveBg: () => void
  onSetGradient: (css: string | null) => void
}

export default function VaultixMenu({
  onClose, onLaunchBuiltin, onOpenAppStore,
  hasBg, currentBg, onUploadBg, onRemoveBg, onSetGradient,
}: Props) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const panelRef = useRef<HTMLDivElement>(null)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string
  const avatarSrc = user?.avatarExt ? `${BACKEND_URL}/api/avatars/${user.username}` : null

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onMouseDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const visibleApps = BUILTIN_APPS.filter(a => !a.adminOnly || isAdmin)

  return (
    <div
      ref={panelRef}
      className="absolute top-full left-0 mt-2 w-[22rem] vaultix-menu-panel z-50 overflow-hidden select-none"
    >
      {/* User row */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        {avatarSrc
          ? <img src={avatarSrc} alt={user?.username} className="w-10 h-10 rounded-full object-cover border border-gray-700 shrink-0" />
          : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-inner">
              {(user?.displayName || user?.username || '?').charAt(0).toUpperCase()}
            </div>
          )
        }
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">{user?.displayName || user?.username}</div>
          <div className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'Standard User'}</div>
        </div>
      </div>

      {/* App grid */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Applications</span>
          <button
            onClick={() => { onOpenAppStore(); onClose() }}
            className="text-[10px] text-orange-400 hover:text-orange-300 transition-colors"
          >
            More →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-0.5 max-h-52 overflow-y-auto pr-0.5 vaultix-scrollbar">
          {visibleApps.map(app => (
            <button
              key={app.id}
              onClick={() => { onLaunchBuiltin(app.id); onClose() }}
              title={app.name}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors group"
            >
              <div className={`w-11 h-11 rounded-xl border ${app.bg} flex items-center justify-center ${app.color} transition-transform group-hover:scale-105`}>
                <span className="[&>svg]:w-5 [&>svg]:h-5">{app.icon}</span>
              </div>
              <span className="text-[9px] font-medium text-gray-500 group-hover:text-gray-300 text-center leading-tight truncate w-full transition-colors">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Wallpaper section */}
      <div className="px-4 pt-2.5 pb-4 border-t border-white/5 mt-1">
        <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Wallpaper</span>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {BG_PRESETS.map(p => {
            const isActive = p.value === currentBg || (p.value === null && !currentBg)
            return (
              <button
                key={p.label}
                onClick={() => onSetGradient(p.value)}
                title={p.label}
                className={`relative w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 ${
                  isActive ? 'border-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]' : 'border-gray-700/50 hover:border-gray-500'
                }`}
                style={p.value ? { background: p.value } : { backgroundColor: p.color }}
              >
                {isActive && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-3 h-3 text-orange-400 drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => { onUploadBg(); onClose() }}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5 hover:border-white/10"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Upload Photo
          </button>
          {hasBg && (
            <button
              onClick={() => { onRemoveBg(); onClose() }}
              className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-400 transition-colors border border-red-900/30"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
