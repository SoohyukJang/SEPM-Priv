import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }
  
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  
  async function logout() {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
  
  async function googleLogin() {
    try {
      // 명시적으로 새 provider 인스턴스 생성
      const provider = new GoogleAuthProvider();
      // 항상 계정 선택 창을 보여주도록 설정
      provider.setCustomParameters({ prompt: 'select_account' });
      
      console.log("Starting Google sign in process...");
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign in successful:", result);
      
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        console.log("Creating new user document in Firestore");
        await setDoc(doc(db, 'users', user.uid), {
          displayName: user.displayName || '',
          email: user.email,
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        console.log("User already exists in Firestore");
      }
      
      return user;
    } catch (error) {
      console.error("Google login error:", error.code, error.message);
      // 상세한 오류 정보 기록
      if (error.code === 'auth/popup-blocked') {
        console.error("Popup was blocked by the browser");
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.error("User closed the popup without completing signin");
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.error("Multiple popup requests were triggered");
      } else if (error.code === 'auth/network-request-failed') {
        console.error("Network error occurred during signin");
      }
      throw error;
    }
  }
  
  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "User is signed in" : "User is signed out");
      setCurrentUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    googleLogin,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
