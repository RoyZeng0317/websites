import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../lib/firebase'
import type { UserModel } from '../types'
import { subscribeUser } from '../services/userService'

interface AuthContextValue {
  firebaseUser: User | null
  userDoc: UserModel | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  userDoc: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [userDoc, setUserDoc] = useState<UserModel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, user => {
      setFirebaseUser(user)
      if (!user) {
        setUserDoc(null)
        setLoading(false)
      }
    })
    return unsubAuth
  }, [])

  useEffect(() => {
    if (!firebaseUser) return
    const unsub = subscribeUser(firebaseUser.uid, doc => {
      setUserDoc(doc)
      setLoading(false)
    })
    return unsub
  }, [firebaseUser])

  return (
    <AuthContext.Provider value={{ firebaseUser, userDoc, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
