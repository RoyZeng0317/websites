import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../firebase'

const PREMIUM_KEY = 'stockinfo_premium_unlocked'
const FREE_EMAILS = ['boyud9.5']

interface PremiumCtx {
  isPremium: boolean
  unlock: () => void
  lock: () => void
}

const Ctx = createContext<PremiumCtx>({ isPremium: false, unlock: () => {}, lock: () => {} })

function isFreeEmail(user: User | null): boolean {
  if (!user?.email) return false
  const email = user.email.toLowerCase()
  return FREE_EMAILS.some(e => email.includes(e))
}

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isPaid, setIsPaid] = useState(() => {
    try { return localStorage.getItem(PREMIUM_KEY) === '1' } catch { return false }
  })

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u))
  }, [])

  const isPremium = isFreeEmail(user) || isPaid

  const unlock = useCallback(() => {
    try { localStorage.setItem(PREMIUM_KEY, '1') } catch {}
    setIsPaid(true)
  }, [])

  const lock = useCallback(() => {
    try { localStorage.removeItem(PREMIUM_KEY) } catch {}
    setIsPaid(false)
  }, [])

  return <Ctx.Provider value={{ isPremium, unlock, lock }}>{children}</Ctx.Provider>
}

export const usePremium = () => useContext(Ctx)
