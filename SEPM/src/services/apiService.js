// src/services/apiService.js
import axios from 'axios';

// Spoonacular API configuration
const API_KEY = 'eeb775beabdd459eb5f8e5983978fff1';
const BASE_URL = 'https://api.spoonacular.com';

// Create Axios instance with default configurations
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY
  }
});

// Mock data for fallback in case API is unavailable
const mockRecipes = [
  {
    id: 1,
    title: 'Mediterranean Salad Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    calories: 320,
    dietType: 'Low Calorie',
    readyInMinutes: 15,
    servings: 2,
    summary: 'Fresh vegetables with olive oil and feta cheese for a perfect light lunch.'
  },
  {
    id: 2,
    title: 'Quinoa Protein Bowl',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
    calories: 450,
    dietType: 'High Protein',
    readyInMinutes: 25,
    servings: 2,
    summary: 'A balanced meal with quinoa, grilled chicken, and fresh vegetables.'
  },
  {
    id: 3,
    title: 'Berry Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d',
    calories: 280,
    dietType: 'Vegan',
    readyInMinutes: 10,
    servings: 1,
    summary: 'Refreshing smoothie bowl with mixed berries, banana, and chia seeds.'
  }
];

// API Service for recipe operations
const RecipeService = {
  // Search recipes with complex filtering
  searchRecipes: async (params) => {
    try {
      const response = await apiClient.get('/recipes/complexSearch', {
        params: {
          ...params,
          addRecipeNutrition: true,
          number: 12
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      // Return mock data if API fails
      return { results: mockRecipes };
    }
  },

  // Get recipes by ingredients
  getRecipesByIngredients: async (ingredients, number = 10) => {
    try {
      const response = await apiClient.get('/recipes/findByIngredients', {
        params: {
          ingredients: ingredients.join(','),
          number
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes by ingredients:', error);
      return mockRecipes;
    }
  },

  // Get recipes by nutrients
  getRecipesByNutrients: async (params) => {
    try {
      const response = await apiClient.get('/recipes/findByNutrients', {
        params: {
          ...params,
          number: 10
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes by nutrients:', error);
      return mockRecipes;
    }
  },

  // Get recipe details by ID
  getRecipeDetails: async (id) => {
    try {
      const response = await apiClient.get(`/recipes/${id}/information`, {
        params: {
          includeNutrition: true
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipe details for ID ${id}:`, error);
      // Return a mock recipe if API fails
      return mockRecipes.find(recipe => recipe.id === id) || mockRecipes[0];
    }
  },

  // Get personalized recommendations based on user profile
  getPersonalizedRecipes: async (userProfile) => {
    // Extract relevant user data for recipe recommendations
    const { diet, intolerances, excludeIngredients, targetCalories } = userProfile;
    
    try {
      const response = await apiClient.get('/recipes/complexSearch', {
        params: {
          diet,
          intolerances,
          excludeIngredients,
          maxCalories: targetCalories,
          addRecipeNutrition: true,
          number: 6,
          sort: 'random'
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching personalized recipes:', error);
      return mockRecipes;
    }
  }
};

export default RecipeService;