import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, query, where, getDocs } from 'firebase/firestore';
import { app } from '../firebase/config';

const API_KEY = '30086c984c1f431a9cf0c27760c850f2';
const API_BASE_URL = 'https://api.spoonacular.com/recipes';

const db = getFirestore(app);

// Sample data to use when API calls fail
const sampleRecipes = [
  {
    id: 715538,
    title: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
    image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
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
  {
    id: 782622,
    title: "Chocolate Peanut Butter Smoothie",
    image: "https://spoonacular.com/recipeImages/782622-312x231.jpg",
    readyInMinutes: 5,
    servings: 1,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: false
  },
  {
    id: 794349,
    title: "Broccoli and Chickpea Rice Salad",
    image: "https://spoonacular.com/recipeImages/794349-312x231.jpg",
    readyInMinutes: 45,
    servings: 6,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true
  },
  {
    id: 715415,
    title: "Red Lentil Soup with Chicken and Turnips",
    image: "https://spoonacular.com/recipeImages/715415-312x231.jpg",
    readyInMinutes: 55,
    servings: 8,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: true
  },
  {
    id: 716406,
    title: "Asparagus and Pea Soup",
    image: "https://spoonacular.com/recipeImages/716406-312x231.jpg",
    readyInMinutes: 30,
    servings: 2,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true
  },
  {
    id: 644387,
    title: "Garlicky Kale",
    image: "https://spoonacular.com/recipeImages/644387-312x231.jpg", 
    readyInMinutes: 45,
    servings: 2,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true
  },
  {
    id: 715446,
    title: "Slow Cooker Beef Stew",
    image: "https://spoonacular.com/recipeImages/715446-312x231.jpg",
    readyInMinutes: 490,
    servings: 6,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: true
  },
  {
    id: 782601,
    title: "Red Kidney Bean Jambalaya",
    image: "https://spoonacular.com/recipeImages/782601-312x231.jpg",
    readyInMinutes: 45,
    servings: 6,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true
  },
  {
    id: 795751,
    title: "Chicken Fajita Stuffed Bell Pepper",
    image: "https://spoonacular.com/recipeImages/795751-312x231.jpg",
    readyInMinutes: 45,
    servings: 6,
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: false
  },
  {
    id: 766453,
    title: "Hummus and Veggies Wrap",
    image: "https://spoonacular.com/recipeImages/766453-312x231.jpg",
    readyInMinutes: 45,
    servings: 2,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true
  },
  {
    id: 716627,
    title: "Easy Homemade Rice and Beans",
    image: "https://spoonacular.com/recipeImages/716627-312x231.jpg",
    readyInMinutes: 35,
    servings: 2,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true
  },
  {
    id: 798400,
    title: "Spicy Black Bean and Corn Burgers",
    image: "https://spoonacular.com/recipeImages/798400-312x231.jpg",
    readyInMinutes: 25,
    servings: 12,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true
  },
  {
    id: 646738,
    title: "Grilled Salmon with Avocado Greek Salsa and Orzo",
    image: "https://spoonacular.com/recipeImages/646738-312x231.jpg", 
    readyInMinutes: 15,
    servings: 4,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: true
  }
];

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


export const fetchRecipes = async (filters) => {
  try {
    const { query, cuisine, diet, intolerances, maxReadyTime, sort } = filters;
    
    // Construct URL properly using URL constructor
    const url = new URL(API_BASE_URL + "/complexSearch");
    
    // Add parameters
    url.searchParams.append("apiKey", API_KEY);
    url.searchParams.append("number", "50");
    
    if (query) url.searchParams.append("query", query);
    if (cuisine) url.searchParams.append("cuisine", cuisine);
    if (diet) url.searchParams.append("diet", diet);
    if (intolerances && intolerances.length > 0) url.searchParams.append("intolerances", intolerances.join(','));
    if (maxReadyTime) url.searchParams.append("maxReadyTime", maxReadyTime);
    
    switch (sort) {
      case 'popularity':
        url.searchParams.append("sort", "popularity");
        break;
      case 'healthiness':
        url.searchParams.append("sort", "healthiness");
        break;
      case 'time':
        url.searchParams.append("sort", "time");
        break;
      default:
        url.searchParams.append("sort", "popularity");
    }
    
    // Add additional information about recipes
    url.searchParams.append("addRecipeInformation", "true");
    url.searchParams.append("fillIngredients", "true");
    
    console.log("Fetching recipes with URL:", url.toString());
    
    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        console.warn("API request failed with status " + response.status + ". Using sample data.");
        console.info("This is expected behavior due to Spoonacular API limits. Using local sample data instead.");
        return filterSampleRecipes(filters);
      }
      
      const data = await response.json();
      console.log("API response received, results count:", data.results ? data.results.length : 0);
      return data.results || [];
    } catch (error) {
      console.error('Error fetching recipes:', error);
      console.warn('Using sample data for search');
      return filterSampleRecipes(filters);
    }
  } catch (error) {
    console.error('Error in fetchRecipes:', error);
    return filterSampleRecipes(filters);
  }
};

export const searchRecipes = fetchRecipes;

export const fetchRecipeById = async (recipeId) => {
  try {
    const url = new URL(API_BASE_URL + "/" + recipeId + "/information");
    url.searchParams.append("apiKey", API_KEY);
    url.searchParams.append("includeNutrition", "true");
    
    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        console.warn("API request failed with status " + response.status);
        throw new Error("Failed to fetch recipe with ID " + recipeId);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching recipe with ID " + recipeId + ":", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in fetchRecipeById:", error);
    throw error;
  }
};

export const getRecipeById = fetchRecipeById;

export const getSimilarRecipes = async (recipeId) => {
  try {
    const url = new URL(API_BASE_URL + "/" + recipeId + "/similar");
    url.searchParams.append("apiKey", API_KEY);
    url.searchParams.append("number", "4");
    
    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        console.warn("API request failed with status " + response.status);
        throw new Error("Failed to fetch similar recipes for ID " + recipeId);
      }
      
      const similarRecipes = await response.json();
      
      // Fetch full details for each similar recipe
      const detailedRecipes = await Promise.all(
        similarRecipes.map(recipe => fetchRecipeById(recipe.id))
      );
      
      return detailedRecipes;
    } catch (error) {
      console.error("Error fetching similar recipes for ID " + recipeId + ":", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in getSimilarRecipes:", error);
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
