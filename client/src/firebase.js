// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernestate-4923f.firebaseapp.com",
  projectId: "mernestate-4923f",
  storageBucket: "mernestate-4923f.appspot.com",
  messagingSenderId: "920483808926",
  appId: "1:920483808926:web:ea7cb90ddc3ab2c177dd8f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);