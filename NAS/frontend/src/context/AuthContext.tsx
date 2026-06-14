import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { setToken, clearToken, getToken } from '../lib/api'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export interface AuthUser {
  uid: number
  username: string
  role: 'admin' | 'user'
  displayName: string | null
  avatarExt: string | null
}

interface JwtPayload {
  uid: number
  username: string
  role: 'admin' | 'user'
  exp: number
}

function decodeToken(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split('.')[1])) as JwtPayload
  } catch {
    return null
  }
}

export interface PendingTwoFactor {
  tempToken: string
  username: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  pendingTwoFactor: PendingTwoFactor | null
  signIn: (username: string, password: string) => Promise<void>
  completeTwoFactor: (code: string) => Promise<void>
  cancelTwoFactor: () => void
  signOut: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

async function fetchProfile(token: string): Promise<{ displayName: string | null; avatarExt: string | null }> {
  try {
    const res = await fetch(`${BACKEND}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return { displayName: null, avatarExt: null }
    const data = await res.json()
    return { displayName: data.displayName ?? null, avatarExt: data.avatarExt ?? null }
  } catch {
    return { displayName: null, avatarExt: null }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingTwoFactor, setPendingTwoFactor] = useState<PendingTwoFactor | null>(null)

  useEffect(() => {
    const token = getToken()
    if (token) {
      const payload = decodeToken(token)
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser({ uid: payload.uid, username: payload.username, role: payload.role, displayName: null, avatarExt: null })
        fetchProfile(token).then(profile => {
          setUser(u => u ? { ...u, ...profile } : u)
        })
      } else {
        clearToken()
      }
    }
    setLoading(false)
  }, [])

  async function signIn(username: string, password: string) {
    const res = await fetch(`${BACKEND}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? '登入失敗')

    if (data.requiresTwoFactor) {
      setPendingTwoFactor({ tempToken: data.tempToken, username: data.username ?? username })
      return
    }

    setToken(data.token)
    const payload = decodeToken(data.token)!
    const profile = await fetchProfile(data.token)
    setUser({ uid: payload.uid, username: payload.username, role: payload.role, ...profile })
  }

  async function completeTwoFactor(code: string) {
    if (!pendingTwoFactor) throw new Error('無待驗證請求')
    const res = await fetch(`${BACKEND}/api/2fa/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempToken: pendingTwoFactor.tempToken, code }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? '驗證失敗')
    setPendingTwoFactor(null)
    setToken(data.token)
    const payload = decodeToken(data.token)!
    const profile = await fetchProfile(data.token)
    setUser({ uid: payload.uid, username: payload.username, role: payload.role, ...profile })
  }

  function cancelTwoFactor() { setPendingTwoFactor(null) }

  function signOut() { clearToken(); setUser(null) }

  const refreshProfile = useCallback(async () => {
    const token = getToken()
    if (!token) return
    const profile = await fetchProfile(token)
    setUser(u => u ? { ...u, ...profile } : u)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, pendingTwoFactor, signIn, completeTwoFactor, cancelTwoFactor, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
