

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBoF5w5hN8DiIc8uprFlw3Oj-_npj__Ayg",
  authDomain: "foundation-gen6.firebaseapp.com",
  projectId: "foundation-gen6",
  storageBucket: "foundation-gen6.firebasestorage.app",
  messagingSenderId: "1076627218418",
  appId: "1:1076627218418:web:0397f05a2801e575fc156b",
  measurementId: "G-X2D6EPFQEQ"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
export {auth};
