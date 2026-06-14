import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import { useLang } from './context/LangContext'
import Home from './components/home'
import Settings from './components/settings'
import Admin from './components/admin'
import System from './components/system'
import Docker from './components/docker'
import Timeline from './components/timeline'
import Fail2ban from './components/fail2ban'
import SharePage from './components/SharePage'

function TwoFactorPage() {
  const { pendingTwoFactor, completeTwoFactor, cancelTwoFactor } = useAuth()
  const { t } = useLang()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await completeTwoFactor(code.replace(/\s/g, ''))
    } catch (err: unknown) {
      setError((err as { message?: string }).message ?? t.verifyFailed)
      setCode('')
    } finally {
      setLoading(false)
    }
  }

  function handleCodeChange(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 6)
    setCode(digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim())
  }

  return (
    <div className="h-dvh flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">{t.twoFactor}</h1>
          <p className="text-gray-400 text-sm">
            {t.twoFactorDesc}<br />
            <span className="text-orange-400 font-medium">{pendingTwoFactor?.username}</span>{t.twoFactorSuffix}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            placeholder="XX XX XX"
            value={code}
            onChange={e => handleCodeChange(e.target.value)}
            className="w-full px-4 py-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-orange-400 text-center text-2xl font-mono tracking-widest"
            autoComplete="one-time-code"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || code.replace(/\s/g, '').length < 6}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium transition-colors"
          >
            {loading ? t.verifying : t.verifyBtn}
          </button>
          <button
            type="button"
            onClick={cancelTwoFactor}
            className="w-full py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            {t.backToLogin}
          </button>
        </form>
      </div>
    </div>
  )
}

function LoginPage() {
  const { signIn } = useAuth()
  const { t } = useLang()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(username, password)
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? t.verifyFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-dvh flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-orange-400">{t.appName}</h1>
          <p className="text-gray-400 text-sm">{t.loginWith}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder={t.username}
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
            autoComplete="username"
            required
          />
          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium transition-colors"
          >
            {loading ? t.loggingIn : t.loginBtn}
          </button>
        </form>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user, loading, pendingTwoFactor } = useAuth()

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-gray-900">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const authed = !!user
  if (pendingTwoFactor) return <TwoFactorPage />

  return (
    <Routes>
      <Route path="/login" element={authed ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={authed ? <Home /> : <Navigate to="/login" replace />} />
      <Route path="/settings" element={authed ? <Settings /> : <Navigate to="/login" replace />} />
      <Route path="/admin" element={authed ? <Admin /> : <Navigate to="/login" replace />} />
      <Route path="/system" element={authed ? <System /> : <Navigate to="/login" replace />} />
      <Route path="/docker" element={authed ? <Docker /> : <Navigate to="/login" replace />} />
      <Route path="/timeline" element={authed ? <Timeline /> : <Navigate to="/login" replace />} />
      <Route path="/fail2ban" element={authed ? <Fail2ban /> : <Navigate to="/login" replace />} />
      <Route path="/share/:token" element={<SharePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </BrowserRouter>
  )
}
