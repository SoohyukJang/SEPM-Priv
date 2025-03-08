// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipeService from '../services/apiService';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  
  // Fetch recipes based on search query
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!query.trim()) {
        setRecipes([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Parse query to extract potential keywords
        const params = parseSearchQuery(query);
        
        // Use the API service to search recipes
        const data = await RecipeService.searchRecipes(params);
        
        setRecipes(data.results || []);
        setTotalResults(data.totalResults || 0);
      } catch (err) {
        console.error('Error searching recipes:', err);
        setError('Failed to fetch recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipes();
  }, [query]);
  
  // Function to parse search query into API parameters
  const parseSearchQuery = (queryString) => {
    const params = { query: queryString };
    
    // Check for common diet types
    if (queryString.toLowerCase().includes('vegetarian')) {
      params.diet = 'vegetarian';
    } else if (queryString.toLowerCase().includes('vegan')) {
      params.diet = 'vegan';
    } else if (queryString.toLowerCase().includes('gluten free')) {
      params.diet = 'gluten free';
    }
    
    // Check for calorie mentions
    if (queryString.toLowerCase().includes('low calorie') || queryString.toLowerCase().includes('low cal')) {
      params.maxCalories = 500;
    }
    
    // Check for time constraints
    if (queryString.toLowerCase().includes('quick') || queryString.toLowerCase().includes('fast')) {
      params.maxReadyTime = 30;
    }
    
    return params;
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">Search Results</h1>
        {query && (
          <p className="text-gray-600">
            Showing results for <span className="font-medium">"{query}"</span>
            {totalResults > 0 && <span> • {totalResults} recipes found</span>}
          </p>
        )}
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-center my-8">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-emerald-600 hover:text-emerald-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* No results state */}
      {!loading && !error && recipes.length === 0 && query && (
        <div className="text-center py-12">
          <div className="text-emerald-700 text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No recipes found</h2>
          <p className="text-gray-500 mb-6">Try different keywords or check your spelling</p>
          <div className="max-w-md mx-auto">
            <p className="text-sm text-gray-500 mb-2">Try searching for:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["chicken pasta", "vegetarian dinner", "quick breakfast", "low calorie dessert", "gluten free"].map((suggestion) => (
                <a 
                  key={suggestion}
                  href={`/search?query=${encodeURIComponent(suggestion)}`}
                  className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100"
                >
                  {suggestion}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Results grid */}
      {!loading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;