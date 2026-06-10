import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  signOut,
  updateProfile,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, deleteDoc, query, collection, where, getDocs } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'
import type { UserModel } from '../types'

export async function signUp(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })

  const base = displayName.toLowerCase().replace(/\s+/g, '_')
  const username = `${base}_${credential.user.uid.slice(0, 5)}`

  const userDoc: Omit<UserModel, 'uid'> = {
    username,
    displayName,
    photoUrl: '',
    bio: '',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    isPrivate: false,
    socialLinks: [],
    createdAt: serverTimestamp() as unknown as number,
  }
  await setDoc(doc(db, 'users', credential.user.uid), userDoc)
  return credential.user
}

export interface SavedAccount {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  provider: 'google' | 'email'
}

export function getSavedAccounts(): SavedAccount[] {
  try { return JSON.parse(localStorage.getItem('velix_accounts') ?? '[]') } catch { return [] }
}

function saveAccountToHistory(
  user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null },
  provider: 'google' | 'email'
) {
  const accounts = getSavedAccounts()
  const entry: SavedAccount = {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName || user.email || '用戶',
    photoURL: user.photoURL,
    provider,
  }
  const idx = accounts.findIndex(a => a.uid === user.uid)
  if (idx >= 0) accounts[idx] = entry
  else accounts.unshift(entry)
  localStorage.setItem('velix_accounts', JSON.stringify(accounts.slice(0, 5)))
}

export async function signIn(email: string, password: string, keepLoggedIn: boolean) {
  await setPersistence(auth, keepLoggedIn ? browserLocalPersistence : browserSessionPersistence)
  const cred = await signInWithEmailAndPassword(auth, email, password)
  saveAccountToHistory(cred.user, 'email')
  return cred
}

export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider)
  const userRef = doc(db, 'users', credential.user.uid)
  const snap = await getDoc(userRef)
  const isNewUser = !snap.exists()

  if (!isNewUser) saveAccountToHistory(credential.user, 'google')
  // New users: Firestore doc is NOT created here — must call completeGoogleSignup() after terms acceptance
  return { user: credential.user, isNewUser }
}

export async function completeGoogleSignup() {
  const user = auth.currentUser
  if (!user) throw new Error('no-user')
  const userRef = doc(db, 'users', user.uid)
  const base = (user.displayName || 'user').toLowerCase().replace(/\s+/g, '_')
  const username = `${base}_${user.uid.slice(0, 5)}`
  await setDoc(userRef, {
    username,
    displayName: user.displayName || 'User',
    photoUrl: user.photoURL || '',
    bio: '',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    isPrivate: false,
    socialLinks: [],
    createdAt: serverTimestamp() as unknown as number,
  })
  saveAccountToHistory(user, 'google')
}

export async function logOut() {
  await signOut(auth)
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserModel, 'displayName' | 'bio' | 'username' | 'photoUrl' | 'isPrivate' | 'socialLinks'>>
) {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() })
  if (data.displayName && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: data.displayName })
  }
}

export async function getUserDoc(uid: string): Promise<UserModel | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return { uid: snap.id, ...snap.data() } as UserModel
}

export async function isUsernameAvailable(username: string, currentUid: string): Promise<boolean> {
  const q = query(collection(db, 'users'), where('username', '==', username))
  const snap = await getDocs(q)
  return snap.empty || (snap.docs.length === 1 && snap.docs[0].id === currentUid)
}

export function getAuthProvider(): 'google' | 'email' | 'unknown' {
  const providers = auth.currentUser?.providerData ?? []
  if (providers.some(p => p.providerId === 'google.com')) return 'google'
  if (providers.some(p => p.providerId === 'password')) return 'email'
  return 'unknown'
}

export async function reauthWithEmail(password: string) {
  const user = auth.currentUser
  if (!user?.email) throw new Error('no-email')
  const credential = EmailAuthProvider.credential(user.email, password)
  await reauthenticateWithCredential(user, credential)
}

export async function reauthWithGoogle() {
  const user = auth.currentUser
  if (!user) throw new Error('no-user')
  await reauthenticateWithPopup(user, googleProvider)
}

export async function deleteAccount(uid: string) {
  await deleteDoc(doc(db, 'users', uid))
  if (auth.currentUser) await auth.currentUser.delete()
}

export async function cancelGoogleSignup(uid: string) {
  try { await deleteDoc(doc(db, 'users', uid)) } catch {}
  try { if (auth.currentUser) await auth.currentUser.delete() } catch {}
  await signOut(auth)
}
