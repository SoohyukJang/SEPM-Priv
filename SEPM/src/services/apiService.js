import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove} from 'firebase/firestore';
import { app } from '../firebase/config';

const API_KEY = 'eeb775beabdd459eb5f8e5983978fff1';
const BASE_URL = 'https://api.spoonacular.com/recipes';
const db = getFirestore(app);

// Sample data to use when API calls fail
const sampleRecipes = [
  {
    id: 715538,
    title: "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
    image: "https://img.spoonacular.com/recipes/715538-312x231.jpg",
    readyInMinutes: 45,
    servings: 2,
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false
  },
  {
    id: 716429,
    title: "Simple Skillet Lasagna",
    image: "https://spoonacular.com/recipeImages/716429-312x231.jpg",
    readyInMinutes: 35,
    servings: 4,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false
  },
  {
    id: 715497,
    title: "Berry Banana Breakfast Smoothie",
    image: "https://spoonacular.com/recipeImages/715497-312x231.jpg",
    readyInMinutes: 5,
    servings: 1,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true
  },
  {
    id: 721146,
    title: "Homemade Strawberry Lemonade",
    image: "https://spoonacular.com/recipeImages/721146-312x231.jpg",
    readyInMinutes: 15,
    servings: 8,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true
  },
  // More sample recipes...
];

// Cache for storing API responses
const apiCache = {
  searches: {},
  recipes: {},
  recommendations: {}
};

// Check if we have network connection
const isOnline = () => {
  return navigator.onLine;
};

// Helper to construct API URLs with params
const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.append('apiKey', API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

// Filter sample recipes based on user filters
const filterSampleRecipes = (filters) => {
  let filtered = [...sampleRecipes];
  
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(recipe => 
      recipe.title.toLowerCase().includes(query)
    );
  }
  
  if (filters.diet === 'vegetarian') {
    filtered = filtered.filter(recipe => recipe.vegetarian);
  } else if (filters.diet === 'vegan') {
    filtered = filtered.filter(recipe => recipe.vegan);
  } else if (filters.diet === 'gluten free') {
    filtered = filtered.filter(recipe => recipe.glutenFree);
  } else if (filters.diet === 'dairy free') {
    filtered = filtered.filter(recipe => recipe.dairyFree);
  }
  
  if (filters.maxReadyTime) {
    filtered = filtered.filter(recipe => recipe.readyInMinutes <= filters.maxReadyTime);
  }
  
  return filtered;
};

// Helper to create cache key from filters
const createCacheKey = (filters) => {
  return JSON.stringify(filters);
};

export const fetchRecipes = async (filters) => {
  try {
    const cacheKey = createCacheKey(filters);
    
    // Check cache first
    if (apiCache.searches[cacheKey]) {
      console.log("Using cached search results");
      return apiCache.searches[cacheKey];
    }
    
    // If offline, use sample data
    if (!isOnline()) {
      console.log("Offline mode: Using sample data");
      return filterSampleRecipes(filters);
    }
    
    const { query, cuisine, diet, intolerances, maxReadyTime, sort, offset, number = 10 } = filters;
    
    // Build API params
    const params = {
      query,
      cuisine,
      diet,
      intolerances,
      maxReadyTime,
      sort,
      offset,
      number,
      addRecipeInformation: true,
      fillIngredients: true
    };
    
    // Add additional filters if provided
    if (filters.includeIngredients) params.includeIngredients = filters.includeIngredients;
    if (filters.excludeIngredients) params.excludeIngredients = filters.excludeIngredients;
    if (filters.type) params.type = filters.type;
    if (filters.minCalories) params.minCalories = filters.minCalories;
    if (filters.maxCalories) params.maxCalories = filters.maxCalories;
    if (filters.minProtein) params.minProtein = filters.minProtein;
    if (filters.maxProtein) params.maxProtein = filters.maxProtein;
    if (filters.minCarbs) params.minCarbs = filters.minCarbs;
    if (filters.maxCarbs) params.maxCarbs = filters.maxCarbs;
    if (filters.minFat) params.minFat = filters.minFat;
    if (filters.maxFat) params.maxFat = filters.maxFat;
    
    const url = buildApiUrl('complexSearch', params);
    console.log("Fetching recipes from API:", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("API request failed with status: " + response.status);
    }
    
    const data = await response.json();
    const results = data.results || [];
    
    // Cache the results
    apiCache.searches[cacheKey] = results;
    
    return results;
  } catch (error) {
    console.error("Error in fetchRecipes:", error);
    // Fallback to sample data
    return filterSampleRecipes(filters);
  }
};

export const searchRecipes = fetchRecipes;

export const fetchRecipeById = async (recipeId) => {
  try {
    // Check cache first
    if (apiCache.recipes[recipeId]) {
      console.log(`Using cached recipe data for ID: ${recipeId}`);
      return apiCache.recipes[recipeId];
    }
    
    // If offline, use sample data
    if (!isOnline()) {
      console.log("Offline mode: Using sample data for recipe details");
      const recipe = sampleRecipes.find(r => r.id === parseInt(recipeId));
      if (recipe) return recipe;
      throw new Error("Recipe not found in sample data");
    }
    
    // Fetch from API
    const params = {
      includeNutrition: true
    };
    
    const url = buildApiUrl(`${recipeId}/information`, params);
    console.log(`Fetching recipe details for ID: ${recipeId}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("API request failed with status: " + response.status);
    }
    
    const recipe = await response.json();
    
    // Cache the recipe
    apiCache.recipes[recipeId] = recipe;
    
    return recipe;
  } catch (error) {
    console.error(`Error fetching recipe ${recipeId}:`, error);
    
    // Try to find in sample data as fallback
    const recipe = sampleRecipes.find(r => r.id === parseInt(recipeId));
    
    if (recipe) {
      return recipe;
    }
    
    throw error;
  }
};

export const getRecipeById = fetchRecipeById;

export const getSimilarRecipes = async (recipeId) => {
  try {
    // If offline, use sample data
    if (!isOnline()) {
      console.log("Offline mode: Using sample data for similar recipes");
      const shuffled = [...sampleRecipes].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    }
    
    const url = buildApiUrl(`${recipeId}/similar`, { number: 4 });
    console.log(`Fetching similar recipes for ID: ${recipeId}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("API request failed with status: " + response.status);
    }
    
    const similarRecipes = await response.json();
    
    // Fetch full details for each similar recipe
    const detailedRecipes = await Promise.all(
      similarRecipes.map(async (recipe) => {
        try {
          return await fetchRecipeById(recipe.id);
        } catch (error) {
          console.error(`Error fetching details for similar recipe ${recipe.id}:`, error);
          return recipe; // Return basic info if details fetch fails
        }
      })
    );
    
    return detailedRecipes;
  } catch (error) {
    console.error("Error in getSimilarRecipes:", error);
    // Fallback to sample data
    const shuffled = [...sampleRecipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }
};

export const getRecommendations = async (userProfile) => {
  try {
    // Create a unique cache key based on user profile
    const cacheKey = userProfile ? JSON.stringify(userProfile) : 'default';
    
    // Check cache first
    if (apiCache.recommendations[cacheKey]) {
      console.log("Using cached recommendations");
      return apiCache.recommendations[cacheKey];
    }
    
    // If offline, use sample data
    if (!isOnline()) {
      console.log("Offline mode: Using sample data for recommendations");
      return filterSampleRecipes({});
    }
    
    // Default parameters if user profile is not available
    let diet = '';
    let intolerances = [];
    let query = '';
    let maxCalories = null;
    let minProtein = null;
    
    // If user profile exists, use it to customize recommendations
    if (userProfile) {
      if (userProfile.goal === 'Weight Loss') {
        diet = 'low-calorie';
        maxCalories = Math.round(userProfile.tdee * 0.8); // 20% deficit
      } else if (userProfile.goal === 'Build Muscle') {
        diet = 'high-protein';
        minProtein = 25; // Minimum 25g protein per serving
      } else if (userProfile.goal === 'Maintain Weight') {
        // Use TDEE as calories target
      }
      
      intolerances = userProfile.allergies || [];
    }
    
    // Create filters object for fetching recipes
    const filters = {
      query,
      diet,
      intolerances: intolerances.join(','),
      sort: 'popularity',
      maxReadyTime: 60,
      number: 10,
      maxCalories,
      minProtein,
      addRecipeInformation: true
    };
    
    const results = await fetchRecipes(filters);
    
    // Cache the recommendations
    apiCache.recommendations[cacheKey] = results;
    
    return results;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return filterSampleRecipes({});
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
    
    return true;
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
    
    return true;
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

// Clear cache
export const clearCache = () => {
  apiCache.searches = {};
  apiCache.recipes = {};
  apiCache.recommendations = {};
  console.log("API cache cleared");
};

// New function to check if a recipe is saved by user
export const isRecipeSaved = async (userId, recipeId) => {
  try {
    if (!userId) return false;
    
    const savedRecipes = await getSavedRecipes(userId);
    return savedRecipes.some(recipe => recipe.id === parseInt(recipeId));
  } catch (error) {
    console.error('Error checking if recipe is saved:', error);
    return false;
  }
};

// New function for advanced recipe search
export const advancedRecipeSearch = async (filters) => {
  return fetchRecipes({
    ...filters,
    addRecipeInformation: true,
    fillIngredients: true
  });
};

// New function to search by ingredients
export const searchByIngredients = async (ingredients, number = 10) => {
  try {
    if (!isOnline()) {
      console.log("Offline mode: Using sample data for ingredients search");
      return filterSampleRecipes({});
    }
    
    const params = {
      ingredients: ingredients.join(','),
      number,
      ranking: 1, // Maximize used ingredients
      ignorePantry: true
    };
    
    const url = buildApiUrl('findByIngredients', params);
    console.log("Searching recipes by ingredients:", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("API request failed with status: " + response.status);
    }
    
    const results = await response.json();
    
    // Get full recipe details for each result
    const detailedRecipes = await Promise.all(
      results.map(async (recipe) => {
        try {
          return await fetchRecipeById(recipe.id);
        } catch (error) {
          console.error(`Error fetching details for recipe ${recipe.id}:`, error);
          return recipe; // Return basic info if details fetch fails
        }
      })
    );
    
    return detailedRecipes;
  } catch (error) {
    console.error("Error in searchByIngredients:", error);
    return filterSampleRecipes({});
  }
};
