// src/pages/RecipeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RecipeService from '../services/apiService';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  
  // Fetch recipe data based on ID
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!recipeId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await RecipeService.getRecipeDetails(recipeId);
        setRecipe(data);
        
        // Fetch similar recipes
        if (data) {
          const params = {
            number: 3,
            limitLicense: true
          };
          
          // Add tags if available
          if (data.cuisines && data.cuisines.length > 0) {
            params.cuisine = data.cuisines[0];
          }
          if (data.diets && data.diets.length > 0) {
            params.diet = data.diets[0];
          }
          if (data.dishTypes && data.dishTypes.length > 0) {
            params.type = data.dishTypes[0];
          }
          
          const similarData = await RecipeService.searchRecipes(params);
          // Filter out the current recipe
          const filteredSimilar = similarData.results
            .filter(r => r.id !== parseInt(recipeId))
            .slice(0, 3);
            
          setSimilarRecipes(filteredSimilar);
        }
      } catch (err) {
        console.error('Error fetching recipe details:', err);
        setError('Failed to load recipe details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipeDetails();
  }, [recipeId]);
  
  // Function to toggle save/bookmark
  const toggleSave = () => {
    setSaved(!saved);
    // Here you would typically call an API to save the recipe to the user's account
    // For now, we'll just toggle the state for the UI
  };
  
  // Function to generate stars for recipe rating
  const renderRating = (score) => {
    // Convert healthScore or spoonacularScore to a 5-star rating
    const rating = Math.round(score / 20);
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i}
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Recipe</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 p-6 rounded-lg max-w-xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Recipe Not Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find the recipe you're looking for.</p>
          <Link to="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
            Browse Other Recipes
          </Link>
        </div>
      </div>
    );
  }

  // Extract recipe data
  const {
    title,
    image,
    readyInMinutes,
    servings,
    healthScore,
    spoonacularScore,
    sourceName,
    sourceUrl,
    summary,
    diets = [],
    dishTypes = [],
    extendedIngredients = [],
    analyzedInstructions = []
  } = recipe;
  
  // Nutrition data
  const hasNutrition = recipe.nutrition && recipe.nutrition.nutrients;
  const calories = hasNutrition ? 
    recipe.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 0 : 0;
  const protein = hasNutrition ? 
    recipe.nutrition.nutrients.find(n => n.name === 'Protein')?.amount || 0 : 0;
  const fat = hasNutrition ? 
    recipe.nutrition.nutrients.find(n => n.name === 'Fat')?.amount || 0 : 0;
  const carbs = hasNutrition ? 
    recipe.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0 : 0;

  return (
    <div className="bg-cream">
      {/* Recipe Hero Section */}
      <div className="bg-emerald-700 text-white py-6">
        <div className="container mx-auto px-4">
          <nav className="text-sm mb-4">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link to="/" className="text-emerald-200 hover:text-white">Home</Link>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="flex items-center">
                <Link to="/search" className="text-emerald-200 hover:text-white">Recipes</Link>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>{title}</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          {diets.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {diets.map(diet => (
                <span key={diet} className="inline-block bg-emerald-800 text-emerald-100 text-xs px-2 py-1 rounded">
                  {diet}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Basic Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <img src={image} alt={title} className="w-full h-auto object-cover" />
              <div className="p-6">
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">
                      <span className="font-semibold">{readyInMinutes}</span> minutes
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    <span className="text-gray-700">
                      <span className="font-semibold">{servings}</span> servings
                    </span>
                  </div>
                  {calories > 0 && (
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                      </svg>
                      <span className="text-gray-700">
                        <span className="font-semibold">{Math.round(calories)}</span> calories
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    {renderRating(healthScore)}
                    <span className="ml-2 text-gray-700">
                      Health Score: <span className="font-semibold">{healthScore}</span>
                    </span>
                  </div>
                </div>
                
                {/* Save Button */}
                <div className="flex justify-end">
                  <button 
                    onClick={toggleSave}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill={saved ? "currentColor" : "none"} 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span>{saved ? 'Saved' : 'Save Recipe'}</span>
                  </button>
                </div>

                {/* Summary */}
                <div className="mt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">About this Recipe</h2>
                  <div 
                    className="text-gray-600 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: summary }}
                  />
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Cooking Instructions</h2>
                
                {analyzedInstructions.length > 0 && analyzedInstructions[0].steps ? (
                  <ol className="list-none p-0 space-y-6">
                    {analyzedInstructions[0].steps.map(step => (
                      <li key={step.number} className="flex">
                        <div className="mr-4 flex-shrink-0">
                          <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-semibold">
                            {step.number}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-700">{step.step}</p>
                          
                          {/* Equipment used in this step */}
                          {step.equipment && step.equipment.length > 0 && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">Equipment: </span>
                              <span className="text-sm text-gray-600">
                                {step.equipment.map(e => e.name).join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-600">No detailed instructions available for this recipe.</p>
                )}
              </div>
            </div>

            {/* Similar Recipes */}
            {similarRecipes.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">You Might Also Like</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {similarRecipes.map(similar => (
                      <Link 
                        key={similar.id} 
                        to={`/recipe/${similar.id}`}
                        className="group"
                      >
                        <div className="bg-emerald-50 rounded-lg overflow-hidden transition-all group-hover:shadow-md">
                          <img 
                            src={similar.image} 
                            alt={similar.title} 
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-3">
                            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-emerald-700">
                              {similar.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Ingredients and Nutrition */}
          <div>
            {/* Ingredients */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h2>
                <p className="text-gray-600 mb-4">{servings} servings</p>
                
                <ul className="space-y-3">
                  {extendedIngredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">
                        {ingredient.original}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Nutrition Information */}
            {hasNutrition && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Nutrition Facts</h2>
                  <p className="text-gray-600 mb-4">Per serving</p>
                  
                  {/* Main Macros */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700 font-medium">Calories</span>
                        <span className="text-gray-600">{Math.round(calories)} kcal</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700 font-medium">Protein</span>
                        <span className="text-gray-600">{Math.round(protein)}g</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min((protein/50) * 100, 100)}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700 font-medium">Carbohydrates</span>
                        <span className="text-gray-600">{Math.round(carbs)}g</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${Math.min((carbs/100) * 100, 100)}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700 font-medium">Fat</span>
                        <span className="text-gray-600">{Math.round(fat)}g</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${Math.min((fat/50) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Other Nutrients */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Other Nutrients</h3>
                    <div className="space-y-2">
                      {recipe.nutrition.nutrients
                        .filter(n => !['Calories', 'Protein', 'Fat', 'Carbohydrates'].includes(n.name))
                        .slice(0, 6)
                        .map(nutrient => (
                          <div key={nutrient.name} className="flex justify-between text-sm">
                            <span className="text-gray-600">{nutrient.name}</span>
                            <span className="text-gray-700 font-medium">
                              {Math.round(nutrient.amount)} {nutrient.unit}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Source Information */}
            {sourceName && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Source</h2>
                  <p className="text-gray-600 mb-3">
                    Recipe by <span className="font-medium">{sourceName}</span>
                  </p>
                  {sourceUrl && (
                    <a 
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center"
                    >
                      View Original
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;