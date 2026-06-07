import { useState } from 'react'
import './App.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export type AuthUser = {
  role: 'teacher' | 'student'
  name: string
  account: string
  class_name?: string
}

export function getStoredUser(): AuthUser | null {
  try {
    return JSON.parse(localStorage.getItem('authUser') ?? 'null')
  } catch {
    return null
  }
}

export function clearStoredUser() {
  localStorage.removeItem('authUser')
}

export default function Login({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: account.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail ?? '登入失敗')
        return
      }
      const user: AuthUser = data
      localStorage.setItem('authUser', JSON.stringify(user))
      onLogin(user)
    } catch {
      setError('無法連線至伺服器，請確認後端服務是否啟動')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-card">

        <div className="login-form">
          <span className="login-brand">Knowgence</span>
          <p className="login-subtitle">數位教學平台</p>
        </div>

        <div className="login-field">
          <label>帳號</label>
          <input
            type="text"
            required
            autoComplete="username"
            placeholder="學號 或 教師帳號"
            value={account}
            onChange={e => setAccount(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="login-field">
          <label>密碼</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-input"
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={loading} className="submit">
          {loading ? '登入中...' : '登入'}
        </button>

      </form>
    </div>
  )
}
