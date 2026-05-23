import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

function formatErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        return '登入視窗已關閉，尚未完成登入。'
      case 'auth/popup-blocked':
        return '瀏覽器封鎖了登入視窗，請允許彈出視窗後再試一次。'
      case 'auth/cancelled-popup-request':
        return '登入請求已取消。'
      default:
        return '登入失敗，請稍後再試。'
    }
  }

  return '登入失敗，請稍後再試。'
}

export default function AuthControls() {
  const [user, setUser] = useState<User | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setDialogOpen(false)
      setError('')
    })
  }, [])

  async function handleGoogleLogin() {
    setBusy(true)
    setError('')

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (loginError) {
      setError(formatErrorMessage(loginError))
    } finally {
      setBusy(false)
    }
  }

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

  return (
    <>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="hidden sm:flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5">
              {user.photoURL ? (
                <img
                  alt={user.displayName || 'user avatar'}
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.photoURL}
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-300">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="leading-tight">
                <div className="text-sm font-medium text-slate-100">
                  {user.displayName || '已登入使用者'}
                </div>
                <div className="text-xs text-slate-400">{user.email}</div>
              </div>
            </div>
            <button
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
              onClick={handleLogout}
              type="button"
            >
              {busy ? '登出中...' : '登出'}
            </button>
          </>
        ) : (
          <button
            className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            onClick={() => setDialogOpen(true)}
            type="button"
          >
            登入
          </button>
        )}
      </div>

      {dialogOpen && !user && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.24),_transparent_55%)] px-6 py-6">
              <div className="mb-2 inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                StockInfo 會員登入
              </div>
              <h2 className="text-2xl font-semibold text-white">用 Google 快速登入</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                登入後可保留你的使用狀態，後續也能接上自選股、提醒與個人化功能。
              </p>
            </div>

            <div className="space-y-4 px-6 py-6">
              <button
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-white px-4 py-3 font-medium text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={busy}
                onClick={handleGoogleLogin}
                type="button"
              >
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {busy ? '登入中...' : '使用 Google 登入'}
              </button>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
                目前登入只啟用 Google Provider。若未來要補 Email / Password，我可以直接接著擴充。
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  className="rounded-full px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                  onClick={() => {
                    if (!busy) {
                      setDialogOpen(false)
                      setError('')
                    }
                  }}
                  type="button"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
