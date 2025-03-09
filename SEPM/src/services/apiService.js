import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, query, where, getDocs } from 'firebase/firestore';
import { app } from '../firebase/config';

const API_KEY = '1c2cb4541bed45058be2c24ef6efe661';
const API_BASE_URL = 'https://api.spoonacular.com/recipes';

const db = getFirestore(app);

export const fetchRecipes = async (filters) => {
  try {
    const { query, cuisine, diet, intolerances, maxReadyTime, sort } = filters;
    
    let url = `${API_BASE_URL}/complexSearch?apiKey=${API_KEY}&number=20`;
    
    if (query) url += `&query=${encodeURIComponent(query)}`;
    if (cuisine) url += `&cuisine=${encodeURIComponent(cuisine)}`;
    if (diet) url += `&diet=${encodeURIComponent(diet)}`;
    if (intolerances && intolerances.length > 0) url += `&intolerances=${encodeURIComponent(intolerances.join(','))}`;
    if (maxReadyTime) url += `&maxReadyTime=${maxReadyTime}`;
    
    switch (sort) {
      case 'popularity':
        url += '&sort=popularity';
        break;
      case 'healthiness':
        url += '&sort=healthiness';
        break;
      case 'time':
        url += '&sort=time';
        break;
      default:
        url += '&sort=popularity';
    }
    
    // Add additional information about recipes
    url += '&addRecipeInformation=true&fillIngredients=true';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

// Alias for fetchRecipes to maintain compatibility
export const searchRecipes = fetchRecipes;

export const fetchRecipeById = async (recipeId) => {
  try {
    const url = `${API_BASE_URL}/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching recipe with ID ${recipeId}:`, error);
    throw error;
  }
};

// Alias for fetchRecipeById to maintain compatibility
export const getRecipeById = fetchRecipeById;

export const getSimilarRecipes = async (recipeId) => {
  try {
    const url = `${API_BASE_URL}/${recipeId}/similar?apiKey=${API_KEY}&number=4`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const similarRecipes = await response.json();
    
    // Fetch full details for each similar recipe
    const detailedRecipes = await Promise.all(
      similarRecipes.map(recipe => fetchRecipeById(recipe.id))
    );
    
    return detailedRecipes;
  } catch (error) {
    console.error(`Error fetching similar recipes for ID ${recipeId}:`, error);
    throw error;
  }
};

export const getRecommendations = async (userProfile) => {
  try {
    // Default parameters if user profile is not available
    let diet = '';
    let intolerances = [];
    let query = '';
    
    // If user profile exists, use it to customize recommendations
    if (userProfile) {
      if (userProfile.goal === 'Weight Loss') {
        diet = 'low-calorie';
      } else if (userProfile.goal === 'Build Muscle') {
        diet = 'high-protein';
      }
      
      intolerances = userProfile.allergies || [];
    }
    
    // Create filters object for fetching recipes
    const filters = {
      query,
      diet,
      intolerances,
      sort: 'popularity',
      maxReadyTime: 60
    };
    
    return await fetchRecipes(filters);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

export const saveRecipe = async (userId, recipe) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        savedRecipes: [recipe]
      });
    } else {
      // Add recipe to existing savedRecipes array
      await updateDoc(userRef, {
        savedRecipes: arrayUnion(recipe)
      });
    }
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
};

export const removeRecipe = async (userId, recipeId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const savedRecipes = userDoc.data().savedRecipes || [];
      const recipeToRemove = savedRecipes.find(recipe => recipe.id === recipeId);
      
      if (recipeToRemove) {
        await updateDoc(userRef, {
          savedRecipes: arrayRemove(recipeToRemove)
        });
      }
    }
  } catch (error) {
    console.error('Error removing recipe:', error);
    throw error;
  }
};

export const getSavedRecipes = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data().savedRecipes || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting saved recipes:', error);
    throw error;
  }
};

// Add more API service functions as needed
