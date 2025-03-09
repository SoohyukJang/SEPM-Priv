import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeById, getSimilarRecipes } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const RecipeDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await getRecipeById(id);
        setRecipe(data);
        
        // Check if recipe is saved
        if (currentUser) {
          const savedRef = doc(db, 'users', currentUser.uid, 'savedRecipes', id);
          const savedDoc = await getDoc(savedRef);
          setIsSaved(savedDoc.exists());
        }
        
        // Get similar recipes
        const similar = await getSimilarRecipes(id);
        setSimilarRecipes(similar);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id, currentUser]);

  const handleSaveRecipe = async () => {
    if (!currentUser) {
      alert('Please log in to save recipes');
      return;
    }
    
    try {
      setSaveLoading(true);
      const recipeRef = doc(db, 'users', currentUser.uid, 'savedRecipes', id);
      
      if (isSaved) {
        // Remove from saved recipes
        await deleteDoc(recipeRef);
        setIsSaved(false);
      } else {
        // Add to saved recipes
        await setDoc(recipeRef, {
          recipeId: id,
          title: recipe.title,
          image: recipe.image,
          savedAt: serverTimestamp()
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
      alert('Failed to save recipe. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Recipe not found'}</p>
            </div>
          </div>
        </div>
        <Link to="/search" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
          Back to Search
        </Link>
      </div>
    );
  }

  // Process recipe data
  const ingredients = recipe.extendedIngredients || [];
  const instructions = recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0
    ? recipe.analyzedInstructions[0].steps
    : [];
  
  // Extract nutrition data
  const nutrients = recipe.nutrition && recipe.nutrition.nutrients
    ? recipe.nutrition.nutrients.filter(n => 
        ['Calories', 'Fat', 'Carbohydrates', 'Protein', 'Fiber', 'Sugar'].includes(n.name)
      )
    : [];
  
  // Function to render HTML content safely
  const renderHTML = (html) => {
    return { __html: html };
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Recipe Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {recipe.readyInMinutes} minutes
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            {recipe.servings} servings
          </span>
          {recipe.vegetarian && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Vegetarian
            </span>
          )}
          {recipe.vegan && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Vegan
            </span>
          )}
          {recipe.glutenFree && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Gluten Free
            </span>
          )}
          {recipe.dairyFree && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Dairy Free
            </span>
          )}
        </div>
        
        <button
          onClick={handleSaveRecipe}
          disabled={saveLoading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
            isSaved
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {saveLoading ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isSaved ? (
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 8.586l-2.293-2.293z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .971.527 1.715 1.324 2.246.836.556 1.935.866 3.676.866 1.742 0 2.84-.31 3.676-.866.797-.53 1.324-1.275 1.324-2.246 0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 5.092V5zm1 4a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 10.234 6 11.009 6 12c0 .971.527 1.715 1.324 2.246.836.556 1.935.866 3.676.866 1.742 0 2.84-.31 3.676-.866.797-.53 1.324-1.275 1.324-2.246 0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V9z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          )}
          {isSaved ? 'Remove from Saved' : 'Save Recipe'}
        </button>
      </div>
      
      {/* Recipe Image and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-auto rounded-lg shadow-md object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About this recipe</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={renderHTML(recipe.summary)}
          />
        </div>
      </div>
      
      {/* Recipe Content Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`${
                activeTab === 'ingredients'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`${
                activeTab === 'instructions'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Instructions
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`${
                activeTab === 'nutrition'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Nutrition
            </button>
          </nav>
        </div>
        
        <div className="mt-8">
          {activeTab === 'ingredients' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start py-2">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>
                      <span className="font-medium">{ingredient.amount} {ingredient.unit}</span> {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {activeTab === 'instructions' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
              <ol className="space-y-4 list-decimal list-inside">
                {instructions.length > 0 ? (
                  instructions.map((step) => (
                    <li key={step.number} className="ml-6">
                      <span className="ml-2">{step.step}</span>
                    </li>
                  ))
                ) : (
                  <div
                    className="prose max-w-none mt-2"
                    dangerouslySetInnerHTML={renderHTML(recipe.instructions || 'No instructions available.')}
                  />
                )}
              </ol>
            </div>
          )}
          
          {activeTab === 'nutrition' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Nutrition Information</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    {nutrients.map((nutrient, index) => (
                      <div key={index} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">{nutrient.name}</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {nutrient.amount} {nutrient.unit}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Similar Recipes */}
      {similarRecipes.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipe/${recipe.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {recipe.readyInMinutes} mins
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
