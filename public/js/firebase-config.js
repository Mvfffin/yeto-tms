// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// IMPORTANT: Import getFirestore AND connectFirestoreEmulator
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlJiT0jItmwsU4f74O3dvbU-rGH5dGxg8",
  authDomain: "yeto-tms.firebaseapp.com",
  projectId: "yeto-tms",
  storageBucket: "yeto-tms.firebasestorage.app",
  messagingSenderId: "947336191481",
  appId: "1:947336191481:web:697aade7c525daf360f128"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firestore service
export const db = getFirestore(app);

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// NEW AND IMPORTANT PART: Connect to the local emulator
// This tells the app to use your local test database instead of the live one.
// The host and port MUST match what you see in the terminal when you run `firebase emulators:start`
connectFirestoreEmulator(db, '127.0.0.1', 8080);
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

