// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC76Hs7eMOM8R1sYoy4rr2FFX2SzId8jVo",
  authDomain: "my-new-project-7fd04.firebaseapp.com",
  projectId: "my-new-project-7fd04",
  storageBucket: "my-new-project-7fd04.firebasestorage.app",
  messagingSenderId: "968238563657",
  appId: "1:968238563657:web:eba28032bc0a57e8221a98",
  measurementId: "G-NHX71Y9WEM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider, signInWithPopup };
