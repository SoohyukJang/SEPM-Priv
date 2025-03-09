import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

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

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
