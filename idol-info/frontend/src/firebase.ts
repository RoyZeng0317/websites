// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOJ05PW8IWv0HaL9F9ZB4FY9Ptkrq6CoE",
  authDomain: "idol-infomation.firebaseapp.com",
  projectId: "idol-infomation",
  storageBucket: "idol-infomation.firebasestorage.app",
  messagingSenderId: "545377291586",
  appId: "1:545377291586:web:3819806e472d6b4389ccdb",
  measurementId: "G-2KVEFGE1SC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);