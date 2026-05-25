// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVJrprceAsTIVk_is9vyYKsrtbHoz-KlU",
  authDomain: "file-share-platfrom.firebaseapp.com",
  projectId: "file-share-platfrom",
  storageBucket: "file-share-platfrom.firebasestorage.app",
  messagingSenderId: "624061901571",
  appId: "1:624061901571:web:5414bd1eeddf9779331736",
  measurementId: "G-TTPRP2RSJK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);