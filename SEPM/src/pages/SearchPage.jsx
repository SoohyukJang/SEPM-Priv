import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { searchRecipes } from '../services/apiService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const SearchPage = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [filters, setFilters] = useState({
    diet: '',
    intolerances: [],
    cuisine: '',
    type: '',
    maxReadyTime: '',
    sort: 'popularity'
  });

  // Diet options
  const dietOptions = [
    { value: '', label: 'Any Diet' },
    { value: 'gluten free', label: 'Gluten Free' },
    { value: 'ketogenic', label: 'Ketogenic' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'lacto-vegetarian', label: 'Lacto-Vegetarian' },
    { value: 'ovo-vegetarian', label: 'Ovo-Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'pescetarian', label: 'Pescetarian' },
    { value: 'paleo', label: 'Paleo' }
  ];

  // Intolerance options
  const intoleranceOptions = [
    'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 
    'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
  ];

  // Cuisine options
  const cuisineOptions = [
    { value: '', label: 'Any Cuisine' },
    { value: 'african', label: 'African' },
    { value: 'american', label: 'American' },
    { value: 'british', label: 'British' },
    { value: 'cajun', label: 'Cajun' },
    { value: 'caribbean', label: 'Caribbean' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'eastern european', label: 'Eastern European' },
    { value: 'european', label: 'European' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'greek', label: 'Greek' },
    { value: 'indian', label: 'Indian' },
    { value: 'irish', label: 'Irish' },
    { value: 'italian', label: 'Italian' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'jewish', label: 'Jewish' },
    { value: 'korean', label: 'Korean' },
    { value: 'latin american', label: 'Latin American' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'middle eastern', label: 'Middle Eastern' },
    { value: 'nordic', label: 'Nordic' },
    { value: 'southern', label: 'Southern' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'thai', label: 'Thai' },
    { value: 'vietnamese', label: 'Vietnamese' }
  ];

  // Meal type options
  const typeOptions = [
    { value: '', label: 'Any Type' },
    { value: 'main course', label: 'Main Course' },
    { value: 'side dish', label: 'Side Dish' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'appetizer', label: 'Appetizer' },
    { value: 'salad', label: 'Salad' },
    { value: 'bread', label: 'Bread' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'soup', label: 'Soup' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'sauce', label: 'Sauce' },
    { value: 'marinade', label: 'Marinade' },
    { value: 'fingerfood', label: 'Fingerfood' },
    { value: 'snack', label: 'Snack' },
    { value: 'drink', label: 'Drink' }
  ];

  // Sorting options
  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'healthiness', label: 'Healthiness' },
    { value: 'time', label: 'Time' },
    { value: 'random', label: 'Random' }
  ];

  // Fetch user profile and apply allergies/diet restrictions as initial filters
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists() && userDoc.data().healthProfile) {
          const healthProfile = userDoc.data().healthProfile;
          setUserProfile(healthProfile);
          
          // Apply allergies from user profile
          if (healthProfile.allergies && healthProfile.allergies.length > 0) {
            setFilters(prev => ({
              ...prev,
              intolerances: healthProfile.allergies
            }));
          }
          
          // Apply dietary restriction from user profile
          if (healthProfile.dietaryRestrictions && healthProfile.dietaryRestrictions.length > 0) {
            setFilters(prev => ({
              ...prev,
              diet: healthProfile.dietaryRestrictions[0].toLowerCase() // API only accepts one diet
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    
    fetchUserProfile();
  }, [currentUser]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle intolerances
  const handleIntoleranceToggle = (intolerance) => {
    setFilters(prev => {
      const intolerances = [...prev.intolerances];
      
      if (intolerances.includes(intolerance)) {
        return {
          ...prev,
          intolerances: intolerances.filter(item => item !== intolerance)
        };
      } else {
        return {
          ...prev,
          intolerances: [...intolerances, intolerance]
        };
      }
    });
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Prepare search parameters
      const searchParams = {
        ...filters,
        intolerances: filters.intolerances.join(',')
      };
      
      const result = await searchRecipes(searchTerm, searchParams);
      
      if (result && result.results) {
        setRecipes(result.results);
      } else {
        setRecipes([]);
      }
    } catch (err) {
      console.error('Error searching recipes:', err);
      setError('Failed to search recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar with Filters */}
        <div className="lg:w-1/4">
          <div className="bg-white shadow rounded-lg p-6 sticky top-20">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Search Recipes</h2>
            
            <form onSubmit={handleSearch}>
              <div className="mb-6">
                <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="searchTerm"
                    id="searchTerm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="focus:ring-green-500 focus:border-green-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g. pasta, chicken, salad"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Dietary Restrictions</h3>
                <select
                  name="diet"
                  id="diet"
                  value={filters.diet}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  {dietOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Allergies & Intolerances</h3>
                <div className="space-y-2">
                  {intoleranceOptions.map(intolerance => (
                    <div key={intolerance} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`intolerance-${intolerance}`}
                          name={`intolerance-${intolerance}`}
                          type="checkbox"
                          checked={filters.intolerances.includes(intolerance)}
                          onChange={() => handleIntoleranceToggle(intolerance)}
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`intolerance-${intolerance}`} className="font-medium text-gray-700">
                          {intolerance}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Cuisine</h3>
                <select
                  name="cuisine"
                  id="cuisine"
                  value={filters.cuisine}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  {cuisineOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Meal Type</h3>
                <select
                  name="type"
                  id="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="maxReadyTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Ready Time (minutes)
                </label>
                <input
                  type="number"
                  name="maxReadyTime"
                  id="maxReadyTime"
                  value={filters.maxReadyTime}
                  onChange={handleFilterChange}
                  className="focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g. 30"
                />
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Sort By</h3>
                <select
                  name="sort"
                  id="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      Search Recipes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe Search</h1>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {userProfile && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Recipes are filtered based on your health profile preferences.
                      {userProfile.dietaryRestrictions && userProfile.dietaryRestrictions.length > 0 && (
                        <span> Diet: <strong>{userProfile.dietaryRestrictions.join(', ')}</strong>.</span>
                      )}
                      {userProfile.allergies && userProfile.allergies.length > 0 && (
                        <span> Allergies: <strong>{userProfile.allergies.join(', ')}</strong>.</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
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
                      {recipe.readyInMinutes && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 m-2 rounded text-xs font-medium">
                          {recipe.readyInMinutes} mins
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                        {recipe.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {recipe.vegetarian && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Vegetarian
                          </span>
                        )}
                        {recipe.vegan && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Vegan
                          </span>
                        )}
                        {recipe.glutenFree && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Gluten Free
                          </span>
                        )}
                        {recipe.dairyFree && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Dairy Free
                          </span>
                        )}
                      </div>
                      {recipe.nutrition && recipe.nutrition.nutrients && (
                        <div className="text-sm text-gray-500">
                          {recipe.nutrition.nutrients.find(n => n.name === 'Calories') && (
                            <span>
                              {recipe.nutrition.nutrients.find(n => n.name === 'Calories').amount} calories
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    <p className="mt-4 text-gray-500">Searching for recipes...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg className="h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="mt-2 text-gray-500">Search for recipes to get started</p>
                    <p className="text-gray-400 text-sm">Try searching for ingredients, dish names, or cuisines</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
