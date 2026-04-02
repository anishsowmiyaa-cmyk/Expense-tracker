import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRB5mi7QKwpR2xRcWo6Xq9Tt-EjDYGte8",
  authDomain: "anishnetworthtracker.firebaseapp.com",
  projectId: "anishnetworthtracker",
  storageBucket: "anishnetworthtracker.firebasestorage.app",
  messagingSenderId: "230270177396",
  appId: "1:230270177396:web:b3fd05aca18e669db4c121",
  measurementId: "G-BJBMEGNMSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to enable auth persistence', error);
});
