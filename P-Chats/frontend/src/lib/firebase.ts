import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD05YrLl8ll974Yvh_m9VjLiiYyhpf6FBw',
  authDomain: 'p-chats-26652.firebaseapp.com',
  projectId: 'p-chats-26652',
  storageBucket: 'p-chats-26652.firebasestorage.app',
  messagingSenderId: '277447074008',
  appId: '1:277447074008:web:da2e5b56682e43161077ad',
  measurementId: 'G-YHMM16RSHZ',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
