// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8XzVe7f1yxQMCuvvruJp01120I6SIaXI",
  authDomain: "counterspell-sv-backup.firebaseapp.com",
  projectId: "counterspell-sv-backup",
  storageBucket: "counterspell-sv-backup.firebasestorage.app",
  messagingSenderId: "789922174346",
  appId: "1:789922174346:web:f9887ff798b21fe25be473"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
