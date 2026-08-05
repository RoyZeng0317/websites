import { useEffect, useRef, useState } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ChevronDown, LogOut } from 'lucide-react'
import { auth } from '../firebase'

export default function AuthControls() {
  const [user, setUser] = useState<User | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser)
    setMenuOpen(false)
    setError('')
  }), [])

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', closeMenu)
    return () => document.removeEventListener('mousedown', closeMenu)
  }, [menuOpen])

  async function handleLogout() {
    setBusy(true)
    setError('')
    try {
      await signOut(auth)
    } catch {
      setError('登出失敗，請稍後再試。')
    } finally {
      setBusy(false)
    }
  }

  const loginPath = `/login.html?returnTo=${encodeURIComponent(
    `${window.location.pathname}${window.location.search}${window.location.hash}`,
  )}`

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <div ref={menuRef} className="relative">
          <button
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-2 py-1.5 transition hover:border-emerald-500/40 hover:bg-slate-700/80"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {user.photoURL ? (
              <img alt="" className="h-7 w-7 rounded-full object-cover" src={user.photoURL} />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-300">
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            )}
            <ChevronDown aria-hidden="true" size={14} className={`text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-[70] mt-2 w-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl" role="menu">
              <div className="border-b border-slate-700 px-4 py-3">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img alt="" className="h-10 w-10 rounded-full object-cover" src={user.photoURL} />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-300">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-100">{user.displayName || '已登入使用者'}</p>
                    <p className="truncate text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <button
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700/50 hover:text-white disabled:opacity-50"
                  disabled={busy}
                  onClick={handleLogout}
                  role="menuitem"
                  type="button"
                >
                  <LogOut aria-hidden="true" size={16} className="text-slate-500" />
                  {busy ? '登出中...' : '登出帳號'}
                </button>
              </div>
              {error && <p className="border-t border-slate-700 px-4 py-2 text-xs text-rose-400">{error}</p>}
            </div>
          )}
        </div>
      ) : (
        <a
          className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-95"
          href={loginPath}
        >
          登入
        </a>
      )}
    </div>
  )
}
