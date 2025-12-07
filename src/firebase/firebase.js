// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzRx2G7EVUCtxKQkGvNmc2M27zIi_-fww",
  authDomain: "riffrate-70f6a.firebaseapp.com",
  projectId: "riffrate-70f6a",
  storageBucket: "riffrate-70f6a.firebasestorage.app",
  messagingSenderId: "458853345328",
  appId: "1:458853345328:web:4b184d57868ccbe3b3a5f5",
  measurementId: "G-KJ60Q034EX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };

