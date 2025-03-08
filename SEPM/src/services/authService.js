// src/services/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthService = {
  // Register a new user with email and password
  registerUser: async (email, password, userData) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set display name if provided
      if (userData.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName
        });
      }

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: userData.displayName || '',
        healthProfile: {
          weight: userData.weight || null,
          height: userData.height || null,
          gender: userData.gender || '',
          age: userData.age || null,
          activityLevel: userData.activityLevel || 'moderate',
          dietGoal: userData.dietGoal || 'maintain',
          allergies: userData.allergies || []
        },
        favoriteRecipes: [],
        createdAt: new Date().toISOString()
      });

      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      // If not, create a new user document
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName || '',
          healthProfile: {
            weight: null,
            height: null,
            gender: '',
            age: null,
            activityLevel: 'moderate',
            dietGoal: 'maintain',
            allergies: []
          },
          favoriteRecipes: [],
          createdAt: new Date().toISOString()
        });
      }

      return user;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Send password reset email
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Get user profile data
  getUserProfile: async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error('No user profile found');
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user health profile
  updateHealthProfile: async (userId, healthData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'healthProfile': healthData
      });
      return true;
    } catch (error) {
      console.error('Error updating health profile:', error);
      throw error;
    }
  },

  // Add a recipe to favorites
  addFavoriteRecipe: async (userId, recipe) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favorites = userData.favoriteRecipes || [];
        
        // Check if recipe already exists in favorites
        if (!favorites.some(fav => fav.id === recipe.id)) {
          await updateDoc(userRef, {
            favoriteRecipes: [...favorites, {
              id: recipe.id,
              title: recipe.title,
              image: recipe.image,
              calories: recipe.calories || 0,
              dietType: recipe.dietType || '',
              savedAt: new Date().toISOString()
            }]
          });
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding favorite recipe:', error);
      throw error;
    }
  },

  // Remove a recipe from favorites
  removeFavoriteRecipe: async (userId, recipeId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favorites = userData.favoriteRecipes || [];
        
        await updateDoc(userRef, {
          favoriteRecipes: favorites.filter(recipe => recipe.id !== recipeId)
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing favorite recipe:', error);
      throw error;
    }
  }
};

export default AuthService;