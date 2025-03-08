// src/components/search/SearchSidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TrendingRecipes from './TrendingRecipes';
import CategoryBrowser from './CategoryBrowser';

const SearchSidebar = ({ isOpen, setIsOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'categories', 'trending'
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  
  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
    }
  };

  // Example search suggestions
  const searchSuggestions = [
    "low calorie dinner",
    "quick breakfast",
    "vegetarian lunch",
    "high protein",
    "gluten free dessert",
    "pasta with chicken",
    "healthy smoothie"
  ];

  // Popular meal categories
  const mealCategories = [
    { name: "Breakfast", icon: "☕" },
    { name: "Lunch", icon: "🥪" },
    { name: "Dinner", icon: "🍽️" },
    { name: "Dessert", icon: "🍰" },
    { name: "Snack", icon: "🥨" },
  ];

  // Diet categories
  const dietCategories = [
    { name: "Vegetarian", icon: "🥗" },
    { name: "Vegan", icon: "🌱" },
    { name: "Gluten Free", icon: "🌾" },
    { name: "Keto", icon: "🥑" },
    { name: "Low Calorie", icon: "⚖️" },
  ];
  
  return (
    <>
      {/* Overlay for background dimming */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    
      <div 
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full bg-white shadow-xl z-50 transform transition-all duration-300 ease-in-out w-96 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
        style={{ maxWidth: '90vw' }}
      >
        {/* Search sidebar header */}
        <div className="bg-emerald-700 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Find Your Perfect Recipe</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-emerald-600 rounded-full"
            aria-label="Close search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 font-medium ${
              activeTab === 'search' 
                ? 'text-emerald-700 border-b-2 border-emerald-500' 
                : 'text-gray-500 hover:text-emerald-600'
            }`}
            onClick={() => setActiveTab('search')}
          >
            Search
          </button>
          <button
            className={`flex-1 py-3 px-4 font-medium ${
              activeTab === 'categories' 
                ? 'text-emerald-700 border-b-2 border-emerald-500' 
                : 'text-gray-500 hover:text-emerald-600'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button
            className={`flex-1 py-3 px-4 font-medium ${
              activeTab === 'trending' 
                ? 'text-emerald-700 border-b-2 border-emerald-500' 
                : 'text-gray-500 hover:text-emerald-600'
            }`}
            onClick={() => setActiveTab('trending')}
          >
            Trending
          </button>
        </div>
        
        {/* Search Tab Content */}
        {activeTab === 'search' && (
          <div className="p-4">
            {/* Search guide */}
            <div className="bg-blue-50 p-3 rounded-md mb-4">
              <h3 className="text-blue-700 font-medium mb-1">How to search</h3>
              <p className="text-sm text-blue-600">
                Use keywords like ingredients, diets, or meal types. Examples:
              </p>
              <ul className="text-xs text-blue-500 list-disc pl-5 mt-1">
                <li>Ingredient combinations: "chicken rice spinach"</li>
                <li>Diet + meal: "keto breakfast", "vegan dinner"</li>
                <li>Time constraints: "quick lunch", "30 minute meals"</li>
              </ul>
            </div>
            
            {/* Search form */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Find recipes (e.g., 'potato, low sugar')"
                  className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button 
                  type="submit"
                  className="absolute inset-y-0 right-0 px-4 bg-emerald-600 text-white rounded-r-md hover:bg-emerald-700 font-medium"
                >
                  Search
                </button>
              </div>
            </form>
            
            {/* Search suggestions */}
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 font-medium mb-3">Popular searches:</h3>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchTerm(suggestion);
                      navigate(`/search?query=${encodeURIComponent(suggestion)}`);
                      setIsOpen(false);
                    }}
                    className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Recently viewed or random selections */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">You might also like:</h3>
              <TrendingRecipes setIsOpen={setIsOpen} limit={3} />
            </div>
          </div>
        )}
        
        {/* Categories Tab Content */}
        {activeTab === 'categories' && (
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Browse by Meal Type</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {mealCategories.map(category => (
                <button
                  key={category.name}
                  onClick={() => {
                    navigate(`/search?query=${encodeURIComponent(category.name)}`);
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-md hover:bg-emerald-100"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium text-emerald-700">{category.name}</span>
                </button>
              ))}
            </div>
            
            <h3 className="text-lg font-medium text-gray-800 mb-3">Browse by Diet</h3>
            <div className="grid grid-cols-2 gap-3">
              {dietCategories.map(category => (
                <button
                  key={category.name}
                  onClick={() => {
                    navigate(`/search?query=${encodeURIComponent(category.name)}`);
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-md hover:bg-emerald-100"
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium text-emerald-700">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Trending Tab Content */}
        {activeTab === 'trending' && (
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Today's Most Popular Recipes</h3>
            <TrendingRecipes setIsOpen={setIsOpen} limit={10} />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchSidebar;