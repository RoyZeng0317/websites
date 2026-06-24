import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCVJrprceAsTIVk_is9vyYKsrtbHoz-KlU',
  authDomain: 'file-share-platfrom.firebaseapp.com',
  projectId: 'file-share-platfrom',
  storageBucket: 'file-share-platfrom.firebasestorage.app',
  messagingSenderId: '624061901571',
  appId: '1:624061901571:web:5414bd1eeddf9779331736',
  measurementId: 'G-TTPRP2RSJK',
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
