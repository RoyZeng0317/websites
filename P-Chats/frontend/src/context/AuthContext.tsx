import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc, deleteDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'
import { EncryptionService } from '../lib/encryption'
import { sessionLock } from '../lib/sessionLock'

export interface UserDoc {
  uid: string
  displayName: string
  photoURL: string
  userHandle: string
  publicKey: string
}

interface AuthContextValue {
  firebaseUser: User | null
  userDoc: UserDoc | null
  loading: boolean
  encryptionService: EncryptionService
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<string | null>
  refreshUserDoc: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

async function initUserDoc(user: User, enc: EncryptionService): Promise<UserDoc> {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  let handle: string = snap.exists() ? ((snap.data()?.userHandle as string) ?? '') : ''
  if (!handle) {
    const raw = user.uid.replace(/[^a-z0-9]/gi, '').toLowerCase()
    handle = `u_${raw.substring(0, 8)}`
  }
  const displayName = user.displayName ?? user.email ?? 'Unknown'
  await setDoc(
    ref,
    {
      displayName,
      photoURL: user.photoURL ?? '',
      publicKey: enc.publicKeyBase64,
      userHandle: handle,
      lastSeen: serverTimestamp(),
    },
    { merge: true },
  )
  return { uid: user.uid, displayName, photoURL: user.photoURL ?? '', userHandle: handle, publicKey: enc.publicKeyBase64 }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const encRef = useRef(new EncryptionService())

  useEffect(() => {
    return auth.onAuthStateChanged(async user => {
      if (user) {
        const enc = new EncryptionService()
        await enc.generateKeyPair()
        encRef.current = enc
        const ud = await initUserDoc(user, enc)
        setFirebaseUser(user)
        setUserDoc(ud)
      } else {
        sessionLock.lockAll()
        setFirebaseUser(null)
        setUserDoc(null)
      }
      setLoading(false)
    })
  }, [])

  async function refreshUserDoc() {
    const user = auth.currentUser
    if (!user) return
    const snap = await getDoc(doc(db, 'users', user.uid))
    if (!snap.exists()) return
    const d = snap.data()
    setUserDoc({
      uid: user.uid,
      displayName: d.displayName ?? '',
      photoURL: d.photoURL ?? '',
      userHandle: d.userHandle ?? '',
      publicKey: d.publicKey ?? '',
    })
  }

  async function signInWithGoogle() {
    await signInWithPopup(auth, googleProvider)
  }

  async function signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function registerWithEmail(email: string, password: string, name: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
    await result.user.reload()
  }

  async function signOut() {
    sessionLock.lockAll()
    await firebaseSignOut(auth)
  }

  async function deleteAccount(): Promise<string | null> {
    try {
      const user = auth.currentUser
      if (!user) return '未登入'
      await deleteDoc(doc(db, 'users', user.uid))
      await deleteUser(user)
      return null
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string }
      if (err.code === 'auth/requires-recent-login') return '請先重新登入後再刪除帳號'
      return err.message ?? '刪除帳號失敗'
    }
  }

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userDoc,
        loading,
        encryptionService: encRef.current,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        signOut,
        deleteAccount,
        refreshUserDoc,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
