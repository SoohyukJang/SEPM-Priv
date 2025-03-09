// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAW8nOi840Z9spmYNJ3n0BNB8FH9Al0imo",
  authDomain: "nutrigen-bot.firebaseapp.com",
  databaseURL: "https://nutrigen-bot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nutrigen-bot",
  storageBucket: "nutrigen-bot.firebasestorage.app",
  messagingSenderId: "826370626365",
  appId: "1:826370626365:web:95e02188be1903c8db2b54",
  measurementId: "G-NN9N8W4RE9"
};

// Initialize Firebase with debug logs
console.log('Initializing Firebase with config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  databaseURL: firebaseConfig.databaseURL
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Authentication instance
const auth = getAuth(app);

// Get Firestore instance
const db = getFirestore(app);

// Get Storage instance
const storage = getStorage(app);

// Get Analytics instance (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

console.log('Firebase initialized successfully');
console.log('Auth instance:', auth ? 'Created' : 'Failed');
console.log('Firestore instance:', db ? 'Created' : 'Failed');
console.log('Storage instance:', storage ? 'Created' : 'Failed');

// Use local emulators when in development if needed
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
  console.log('Using Firebase emulators');
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}

export { app, auth, db, storage, analytics };
