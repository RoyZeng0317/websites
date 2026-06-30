import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthControls from './components/AuthControls'
import Login, { getStoredUser } from './components/Login'
import type { AuthUser } from './components/Login'
import HomePage from './pages/HomePage'
import StudentPage from './pages/StudentPage'

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser)

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-bold text-emerald-400 transition-colors hover:text-emerald-300">
              Knowgence
            </a>
            <span className="hidden text-xs text-slate-500 sm:inline">數位教學平台</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-400 sm:inline">
              {user.name || user.account}
              <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                user.role === 'teacher'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-sky-500/10 text-sky-400'
              }`}>
                {user.role === 'teacher' ? '教師' : '學生'}
              </span>
            </span>
            {user.role === 'teacher' && (
              <a
                href="/"
                className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-slate-800 hover:text-emerald-300"
              >
                課堂簽到
              </a>
            )}
            <AuthControls onLogout={() => setUser(null)} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          <Route
            path="/"
            element={
              user.role === 'teacher'
                ? <HomePage />
                : <StudentPage user={user} />
            }
          />
        </Routes>
      </main>
    </div>
  )
}
