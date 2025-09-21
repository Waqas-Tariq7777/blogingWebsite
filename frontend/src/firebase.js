// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-56551.firebaseapp.com",
  projectId: "mern-blog-56551",
  storageBucket: "mern-blog-56551.firebasestorage.app",
  messagingSenderId: "367187763126",
  appId: "1:367187763126:web:a0f993a71b2de2e4d3eb17"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);