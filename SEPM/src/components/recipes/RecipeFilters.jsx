import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const RecipeFilters = ({ onApplyFilters }) => {
  const { currentUser } = useAuth();
  
  const [filters, setFilters] = useState({
    query: '',
    mealType: '',
    cuisine: '',
    maxReadyTime: '',
    sortBy: 'popularity'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Extract user profile dietary restrictions and allergies if available
    let userFilters = {};
    
    if (currentUser && currentUser.healthProfile) {
      if (currentUser.healthProfile.dietaryRestrictions) {
        userFilters.diet = currentUser.healthProfile.dietaryRestrictions;
      }
      
      if (currentUser.healthProfile.allergies) {
        userFilters.intolerances = currentUser.healthProfile.allergies;
      }
    }
    
    // Apply filters
    onApplyFilters({ ...filters, ...userFilters });
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      mealType: '',
      cuisine: '',
      maxReadyTime: '',
      sortBy: 'popularity'
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Recipes</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Search Query */}
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="query"
              name="query"
              value={filters.query}
              onChange={handleInputChange}
              placeholder="E.g., chicken, pasta, vegetarian..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Meal Type */}
          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
              Meal Type
            </label>
            <select
              id="mealType"
              name="mealType"
              value={filters.mealType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Meal Types</option>
              <option value="breakfast">Breakfast</option>
              <option value="main course">Main Course</option>
              <option value="side dish">Side Dish</option>
              <option value="appetizer">Appetizer</option>
              <option value="salad">Salad</option>
              <option value="soup">Soup</option>
              <option value="dessert">Dessert</option>
              <option value="snack">Snack</option>
              <option value="drink">Drink</option>
            </select>
          </div>

          {/* Cuisine */}
          <div>
            <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
              Cuisine
            </label>
            <select
              id="cuisine"
              name="cuisine"
              value={filters.cuisine}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Cuisines</option>
              <option value="american">American</option>
              <option value="italian">Italian</option>
              <option value="asian">Asian</option>
              <option value="mexican">Mexican</option>
              <option value="french">French</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="indian">Indian</option>
              <option value="chinese">Chinese</option>
              <option value="japanese">Japanese</option>
              <option value="thai">Thai</option>
              <option value="vietnamese">Vietnamese</option>
              <option value="korean">Korean</option>
              <option value="middle eastern">Middle Eastern</option>
              <option value="african">African</option>
            </select>
          </div>

          {/* Max Ready Time */}
          <div>
            <label htmlFor="maxReadyTime" className="block text-sm font-medium text-gray-700 mb-1">
              Max Ready Time (minutes)
            </label>
            <select
              id="maxReadyTime"
              name="maxReadyTime"
              value={filters.maxReadyTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Any Time</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="popularity">Popularity</option>
              <option value="healthiness">Healthiness</option>
              <option value="time">Cooking Time</option>
              <option value="calories">Calories (Low to High)</option>
              <option value="protein">Protein (High to Low)</option>
            </select>
          </div>
        </div>

        {/* User Profile Info */}
        {currentUser && currentUser.healthProfile && (
          <div className="mb-4 p-3 bg-green-50 rounded-md">
            <h3 className="text-sm font-medium text-green-800 mb-2">
              Using Your Health Profile Settings
            </h3>
            <div className="text-xs text-green-700">
              {currentUser.healthProfile.dietaryRestrictions && (
                <p className="mb-1">
                  <span className="font-semibold">Dietary Restrictions:</span> {currentUser.healthProfile.dietaryRestrictions.join(', ')}
                </p>
              )}
              {currentUser.healthProfile.allergies && (
                <p>
                  <span className="font-semibold">Allergies & Intolerances:</span> {currentUser.healthProfile.allergies.join(', ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Clear Filters
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeFilters;
