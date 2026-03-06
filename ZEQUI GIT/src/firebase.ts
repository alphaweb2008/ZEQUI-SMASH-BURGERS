import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfp9lvNJ7uLfe6--dAPCGY_8uIjyIwHvw",
  authDomain: "zequi-smash-burgers.firebaseapp.com",
  projectId: "zequi-smash-burgers",
  storageBucket: "zequi-smash-burgers.firebasestorage.app",
  messagingSenderId: "172239787065",
  appId: "1:172239787065:web:1953999cb7b78139ae29e8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
