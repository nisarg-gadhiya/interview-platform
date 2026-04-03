import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-ee828.firebaseapp.com",
  projectId: "interviewiq-ee828",
  storageBucket: "interviewiq-ee828.firebasestorage.app",
  messagingSenderId: "101556118755",
  appId: "1:101556118755:web:d33b22883efbf7b7df11d6",
  measurementId: "G-C6VEG7DR5Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth,provider}