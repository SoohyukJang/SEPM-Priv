// src/services/apiService.js
const API_KEY = '1c2cb4541bed45058be2c24ef6efe661';
const BASE_URL = 'https://api.spoonacular.com';

// Rate limiting variables
let lastCallTime = null;
const MIN_CALL_INTERVAL = 1000; // Minimum 1 second between API calls

// Helper function to respect rate limits
const throttledFetch = async (url) => {
  // Check if we need to wait before making another call
  if (lastCallTime) {
    const timeSinceLastCall = Date.now() - lastCallTime;
    if (timeSinceLastCall < MIN_CALL_INTERVAL) {
      // Wait for the remaining time
      await new Promise(resolve => setTimeout(resolve, MIN_CALL_INTERVAL - timeSinceLastCall));
    }
  }
  
  // Make the API call
  lastCallTime = Date.now();
  return fetch(url);
};

// Build query URL with parameters
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  // Add API key to params
  url.searchParams.append('apiKey', API_KEY);
  
  // Add other params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  
  return url;
};

// Search recipes
export const searchRecipes = async (query, params = {}) => {
  try {
    const url = buildUrl('/recipes/complexSearch', {
      query,
      addRecipeInformation: true,
      fillIngredients: true,
      ...params
    });
    
    const response = await throttledFetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to search recipes');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Get recipe by ID
export const getRecipeById = async (id) => {
  try {
    const url = buildUrl(`/recipes/${id}/information`, {
      includeNutrition: true
    });
    
    const response = await throttledFetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get recipe');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting recipe:', error);
    throw error;
  }
};

// Get similar recipes
export const getSimilarRecipes = async (id) => {
  try {
    const url = buildUrl(`/recipes/${id}/similar`, {
      number: 4
    });
    
    const response = await throttledFetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get similar recipes');
    }
    
    const data = await response.json();
    
    // Fetch full details for each similar recipe
    const detailedRecipes = await Promise.all(
      data.map(async (recipe) => {
        try {
          return await getRecipeById(recipe.id);
        } catch (error) {
          console.error(`Error fetching details for recipe ${recipe.id}:`, error);
          return recipe; // Return basic info if detailed fetch fails
        }
      })
    );
    
    return detailedRecipes;
  } catch (error) {
    console.error('Error getting similar recipes:', error);
    throw error;
  }
};

// Get recipe recommendations based on user profile
export const getRecommendations = async (healthProfile, params = {}) => {
  try {
    // Build parameters based on health profile
    const recommendationParams = { ...params };
    
    // Add dietary restrictions
    if (healthProfile?.dietaryRestrictions?.length > 0) {
      recommendationParams.diet = healthProfile.dietaryRestrictions[0]; // API only accepts one diet
    }
    
    // Add allergies/intolerances
    if (healthProfile?.allergies?.length > 0) {
      recommendationParams.intolerances = healthProfile.allergies.join(',');
    }
    
    // Set calorie range if target calories are available
    if (healthProfile?.targetCalories) {
      const targetCal = healthProfile.targetCalories;
      recommendationParams.minCalories = Math.round(targetCal * 0.9);
      recommendationParams.maxCalories = Math.round(targetCal * 1.1);
    }
    
    // Other recommendation parameters
    recommendationParams.sort = 'random';
    recommendationParams.number = params.number || 10;
    
    return await searchRecipes('', recommendationParams);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

// Get recipes by ingredients
export const getRecipesByIngredients = async (ingredients, params = {}) => {
  try {
    const url = buildUrl('/recipes/findByIngredients', {
      ingredients: ingredients.join(','),
      number: params.number || 10,
      ranking: 2, // Maximize used ingredients
      ...params
    });
    
    const response = await throttledFetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to find recipes by ingredients');
    }
    
    const data = await response.json();
    
    // Get detailed information for each recipe
    const recipeDetails = await Promise.all(
      data.map(async (recipe) => {
        try {
          return await getRecipeById(recipe.id);
        } catch (error) {
          console.error(`Error fetching details for recipe ${recipe.id}:`, error);
          return recipe; // Return basic info if detailed fetch fails
        }
      })
    );
    
    return recipeDetails;
  } catch (error) {
    console.error('Error finding recipes by ingredients:', error);
    throw error;
  }
};

export default {
  searchRecipes,
  getRecipeById,
  getSimilarRecipes,
  getRecommendations,
  getRecipesByIngredients
};
