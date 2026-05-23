import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBT9ueRFmd8CsFtb6VyRkjwLuVNy1sDsHM',
  authDomain: 'stocks-global.firebaseapp.com',
  projectId: 'stocks-global',
  storageBucket: 'stocks-global.firebasestorage.app',
  messagingSenderId: '896423596342',
  appId: '1:896423596342:web:95a76103ace72aa40ae397',
  measurementId: 'G-4JSGJ99VWG',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Failed to persist auth session:', error)
  })
}

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
export default app
