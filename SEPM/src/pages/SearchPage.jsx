import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeList from '../components/recipes/RecipeList';
import RecipeFilters from '../components/recipes/RecipeFilters';
import { fetchRecipes } from '../services/apiService';

const SearchPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    query: '',
    cuisine: '',
    diet: '',
    intolerances: [],
    maxReadyTime: 60,
    sort: 'popularity'
  });
  
  const location = useLocation();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const keywords = queryParams.getAll('keyword');
    
    if (keywords.length > 0) {
      // Update filters with keywords from URL
      setFilters(prev => ({
        ...prev,
        query: keywords.join(', ')
      }));
    }
  }, [location.search]);
  
  useEffect(() => {
    const searchRecipes = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRecipes(filters);
        setRecipes(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again later.');
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    searchRecipes();
  }, [filters]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Recipes</h1>
      
      {/* Display keywords if any */}
      {filters.query && (
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">Keywords:</h2>
          <div className="flex flex-wrap gap-2">
            {filters.query.split(', ').map((keyword, index) => (
              <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <RecipeFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        <div className="w-full md:w-3/4">
          {error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
            </div>
          ) : (
            <RecipeList 
              recipes={recipes} 
              isLoading={isLoading} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
