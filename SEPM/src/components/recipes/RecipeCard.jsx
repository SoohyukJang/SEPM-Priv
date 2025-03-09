import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  if (!recipe) return null;

  return (
    <Link
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
        <div className="flex items-center text-sm text-gray-500">
          {recipe.aggregateLikes !== undefined && (
            <span className="flex items-center mr-4">
              <svg className="h-4 w-4 mr-1 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {recipe.aggregateLikes}
            </span>
          )}
          {recipe.healthScore !== undefined && (
            <span className="flex items-center">
              <svg className="h-4 w-4 mr-1 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
              </svg>
              {recipe.healthScore}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
