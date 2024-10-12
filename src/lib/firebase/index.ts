// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDovTu77F0_sI2Z3zp6kwpzIx5_9snsUME",
  authDomain: "counterspell-sv.firebaseapp.com",
  projectId: "counterspell-sv",
  storageBucket: "counterspell-sv.appspot.com",
  messagingSenderId: "888228905363",
  appId: "1:888228905363:web:71acfa5cca55b397d6e866",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
