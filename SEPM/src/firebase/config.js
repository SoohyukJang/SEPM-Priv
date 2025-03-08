// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "nutrigen-bot.firebaseapp.com",
  projectId: "nutrigen-bot",
  storageBucket: "nutrigen-bot.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Authentication instance
export const auth = getAuth(app);

// Get Firestore instance
export const db = getFirestore(app);

export default app;