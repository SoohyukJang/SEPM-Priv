import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp, 
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Create context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Register a new user with detailed logging
  const signup = async (email, password, displayName, phoneNumber = null) => {
    console.log('Signup function called with:', { email, displayName, phoneNumber });
    
    try {
      setError('');
      setLoading(true);
      
      console.log('Creating user with Firebase Auth...');
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Firebase Auth user created:', user.uid);
      
      console.log('Updating user profile with display name...');
      // Update profile with display name
      await updateProfile(user, { displayName });
      console.log('User profile updated with display name');
      
      // Create user document in Firestore
      console.log('Creating user document in Firestore...');
      const userData = {
        uid: user.uid,
        email,
        displayName,
        phoneNumber: phoneNumber || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        preferences: {
          theme: 'light',
          emailNotifications: true
        },
        healthProfile: null
      };
      
      // Create document with the user's UID as the document ID
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, userData);
      console.log('User document created in Firestore with ID:', user.uid);
      
      // Return the user object
      return user;
    } catch (err) {
      console.error('Signup error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google with detailed logging
  const signInWithGoogle = async () => {
    console.log('Google sign in function called');
    
    try {
      setError('');
      setLoading(true);
      
      console.log('Creating Google Auth provider...');
      const provider = new GoogleAuthProvider();
      
      console.log('Starting Google sign in popup...');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google sign in successful, user:', user.uid);
      
      // Check if user document exists in Firestore
      console.log('Checking if Firestore document exists for user...');
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      // If not, create a new user document
      if (!userDoc.exists()) {
        console.log('User document does not exist, creating new document...');
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber || null,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          preferences: {
            theme: 'light',
            emailNotifications: true
          },
          healthProfile: null
        };
        
        await setDoc(userDocRef, userData);
        console.log('Google user document created in Firestore with ID:', user.uid);
      } else {
        console.log('User document exists, updating lastLogin...');
        // Update lastLogin for existing user
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('User document updated with new login timestamp');
      }
      
      return user;
    } catch (err) {
      console.error('Google sign in error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Log in an existing user with detailed logging
  const login = async (email, password) => {
    console.log('Login function called with email:', email);
    
    try {
      setError('');
      setLoading(true);
      
      console.log('Signing in with Firebase Auth...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Sign in successful, user:', user.uid);
      
      // Update the user's lastLogin in Firestore
      console.log('Updating lastLogin in Firestore...');
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('User document updated with new login timestamp');
      return user;
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Rest of the functions remain the same...

  // Get user profile data
  const getUserProfile = async (userId) => {
    console.log('Getting user profile for ID:', userId);
    
    try {
      const userDocRef = doc(db, 'users', userId);
      console.log('Fetching user document...');
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User profile fetched successfully');
        return userData;
      }
      
      console.log('User profile not found');
      return null;
    } catch (err) {
      console.error('Get user profile error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Log out the current user
  const logout = async () => {
    try {
      setError('');
      console.log('Logging out user...');
      await signOut(auth);
      console.log('User logged out successfully');
      setUserProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError('');
      setLoading(true);
      console.log('Sending password reset email to:', email);
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully');
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update current user profile
  const updateUserProfile = async (userData) => {
    if (!currentUser) {
      setError('No user is logged in');
      return false;
    }
    
    try {
      setLoading(true);
      console.log('Updating user profile for:', currentUser.uid);
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Add timestamp for updatedAt
      const updatedUserData = {
        ...userData,
        updatedAt: serverTimestamp()
      };
      
      console.log('Updating user document in Firestore...');
      await updateDoc(userRef, updatedUserData);
      
      // Update display name in Auth if provided
      if (userData.displayName) {
        console.log('Updating display name in Auth profile...');
        await updateProfile(currentUser, { displayName: userData.displayName });
      }
      
      // Refresh the local user profile state
      console.log('Refreshing local user profile state...');
      const updatedProfile = await getUserProfile(currentUser.uid);
      setUserProfile(updatedProfile);
      
      console.log('User profile updated successfully');
      return true;
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data when the current user changes
  useEffect(() => {
    console.log('Setting up auth state change listener...');
    
    const fetchUserData = async (user) => {
      if (user) {
        try {
          console.log('User authenticated, fetching profile data...');
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          console.log('User profile loaded into state');
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    };

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed. Current user:', user?.email);
      setCurrentUser(user);
      
      if (user) {
        await fetchUserData(user);
      } else {
        console.log('No user authenticated, clearing profile');
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    
    // Return unsubscribe function to clean up on unmount
    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
