// src/components/recipes/RecipeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  // Extract recipe properties
  const { id, title, image, readyInMinutes, servings } = recipe;
  
  // Calculate calories if available, or use placeholder
  const calories = recipe.nutrition?.nutrients.find(n => n.name === 'Calories')?.amount || 
                  recipe.calories || 
                  Math.floor(Math.random() * 400 + 200); // Placeholder for demo
  
  // Extract diet labels if available
  const dietLabels = recipe.diets || [];
  
  // Determine diet type to display (just take the first one for simplicity)
  const dietType = dietLabels.length > 0 ? dietLabels[0] : 
                  (recipe.vegan ? 'Vegan' : 
                  (recipe.vegetarian ? 'Vegetarian' : 
                  (calories < 400 ? 'Low Calorie' : 'Regular')));

  return (
    <Link to={`/recipe/${id}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Recipe Image */}
        <div className="relative h-48">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          
          {/* Time indicator overlay */}
          {readyInMinutes && (
            <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-emerald-800 text-sm font-medium px-2 py-1 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readyInMinutes} min
            </div>
          )}
        </div>
        
        {/* Recipe Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">
              {dietType.charAt(0).toUpperCase() + dietType.slice(1).replace(/-/g, ' ')}
            </span>
            <span className="text-gray-500 text-sm">{Math.round(calories)} cal</span>
          </div>
          
          <h3 className="text-lg font-semibold text-emerald-700 mb-2 line-clamp-2">{title}</h3>
          
          {/* Additional details */}
          <div className="flex justify-between text-sm text-gray-500 mt-4">
            {servings && (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                {servings} {servings === 1 ? 'serving' : 'servings'}
              </span>
            )}
            
            <span className="text-emerald-600 font-medium">View Recipe →</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;