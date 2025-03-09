import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeById, getSimilarRecipes, saveRecipe, removeRecipe } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';
import NutritionFacts from '../components/recipes/NutritionFacts';
import RecipeCard from '../components/recipes/RecipeCard';
import Loader from '../components/common/Loader';

const RecipeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        
        // Fetch recipe details
        const recipeData = await getRecipeById(id);
        setRecipe(recipeData);
        
        // Check if recipe is saved by user
        if (user) {
          // Here you would check if the recipe is saved by the user
          // This is a placeholder implementation
          setIsSaved(false);
        }
        
        // Fetch similar recipes
        const similar = await getSimilarRecipes(id);
        setSimilarRecipes(similar);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id, user]);

  const handleSaveRecipe = async () => {
    if (!user) {
      // Redirect to login or show login prompt
      return;
    }
    
    try {
      if (isSaved) {
        await removeRecipe(user.uid, recipe.id);
        setIsSaved(false);
      } else {
        await saveRecipe(user.uid, {
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          readyInMinutes: recipe.readyInMinutes,
          servings: recipe.servings,
          healthScore: recipe.healthScore
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
        <div className="mt-4">
          <Link to="/recipes" className="text-green-600 hover:text-green-700">
            &larr; Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/recipes" className="text-green-600 hover:text-green-700">
          &larr; Back to Recipes
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Recipe Header */}
        <div className="relative">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 object-cover"
            onError={(e) => {e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x400?text=Recipe+Image'}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">{recipe.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.diets && recipe.diets.map((diet, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm capitalize">
                  {diet}
                </span>
              ))}
              {recipe.vegetarian && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Vegetarian</span>
              )}
              {recipe.vegan && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Vegan</span>
              )}
              {recipe.glutenFree && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Gluten Free</span>
              )}
              {recipe.dairyFree && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Dairy Free</span>
              )}
            </div>
            <div className="flex flex-wrap gap-6 text-white">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{recipe.readyInMinutes} minutes</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Health Score: {recipe.healthScore}%</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleSaveRecipe}
            className={`absolute top-4 right-4 p-2 rounded-full ${
              isSaved ? 'bg-red-500 text-white' : 'bg-white text-red-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        
        {/* Recipe Content */}
        <div className="p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-4 font-medium ${
                  activeTab === 'ingredients' 
                    ? 'border-b-2 border-green-500 text-green-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => setActiveTab('instructions')}
                className={`pb-4 font-medium ${
                  activeTab === 'instructions' 
                    ? 'border-b-2 border-green-500 text-green-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Instructions
              </button>
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`pb-4 font-medium ${
                  activeTab === 'nutrition' 
                    ? 'border-b-2 border-green-500 text-green-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Nutrition Facts
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div>
            {/* Ingredients Tab */}
            {activeTab === 'ingredients' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {recipe.extendedIngredients && recipe.extendedIngredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>{ingredient.original}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Instructions Tab */}
            {activeTab === 'instructions' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Cooking Instructions</h2>
                {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
                  <ol className="list-decimal list-inside space-y-4">
                    {recipe.analyzedInstructions[0].steps.map(step => (
                      <li key={step.number} className="ml-4">
                        <span className="font-medium">Step {step.number}: </span>
                        {step.step}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="text-gray-600">
                    <p>{recipe.instructions || 'No detailed instructions available for this recipe.'}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Nutrition Tab */}
            {activeTab === 'nutrition' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Nutrition Facts</h2>
                {recipe.nutrition ? (
                  <NutritionFacts nutrition={recipe.nutrition} />
                ) : (
                  <p className="text-gray-600">Nutrition information not available for this recipe.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Similar Recipes */}
      {similarRecipes.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Recipes You Might Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarRecipes.map(similarRecipe => (
              <RecipeCard key={similarRecipe.id} recipe={similarRecipe} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
