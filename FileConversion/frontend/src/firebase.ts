import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBanOhJ3QGbk-C91CQrrDoIoVV12_-sghY',
  authDomain: 'file-convert-b5a76.firebaseapp.com',
  projectId: 'file-convert-b5a76',
  storageBucket: 'file-convert-b5a76.firebasestorage.app',
  messagingSenderId: '32856833940',
  appId: '1:32856833940:web:e8438d2415f4925c635981',
  measurementId: 'G-T9C931QYQY',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Failed to persist auth session:', error)
  })
}

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
export default app
