// src/components/search/TrendingRecipes.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TrendingRecipes = ({ setIsOpen, limit = 5 }) => {
  const navigate = useNavigate();

  // Mock data for trending recipes
  // In a real application, this would come from an API or Firebase
  const trendingRecipes = [
    {
      id: 716429,
      title: "Pasta with Garlic and Olive Oil",
      image: "https://spoonacular.com/recipeImages/716429-312x231.jpg",
      views: 243,
      category: "Dinner"
    },
    {
      id: 715538,
      title: "Maple Dijon Chicken with Roasted Vegetables",
      image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
      views: 189,
      category: "Dinner"
    },
    {
      id: 715594,
      title: "Homemade Garlic Bread with Herbs",
      image: "https://spoonacular.com/recipeImages/715594-312x231.jpg",
      views: 156,
      category: "Side Dish"
    },
    {
      id: 642129,
      title: "Easy Vegetable Soup with Beans",
      image: "https://spoonacular.com/recipeImages/642129-312x231.jpg",
      views: 143,
      category: "Lunch"
    },
    {
      id: 663126,
      title: "Thai Basil Chicken with Jasmine Rice",
      image: "https://spoonacular.com/recipeImages/663126-312x231.jpg",
      views: 129,
      category: "Dinner"
    },
    {
      id: 716426,
      title: "Cauliflower, Potato, and Pea Curry",
      image: "https://spoonacular.com/recipeImages/716426-312x231.jpg",
      views: 122,
      category: "Dinner"
    },
    {
      id: 716627,
      title: "Easy Homemade Greek Yogurt",
      image: "https://spoonacular.com/recipeImages/716627-312x231.jpg",
      views: 118,
      category: "Breakfast"
    },
    {
      id: 716408,
      title: "Greek-Style Baked Fish with Tomatoes and Olives",
      image: "https://spoonacular.com/recipeImages/716408-312x231.jpg",
      views: 112,
      category: "Dinner"
    },
    {
      id: 795751,
      title: "Chicken Fajita Stuffed Bell Pepper",
      image: "https://spoonacular.com/recipeImages/795751-312x231.jpg",
      views: 108,
      category: "Dinner"
    },
    {
      id: 640941,
      title: "Crunchy Brussels Sprouts Side Dish",
      image: "https://spoonacular.com/recipeImages/640941-312x231.jpg",
      views: 104,
      category: "Side Dish"
    }
  ];

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
    if (setIsOpen) setIsOpen(false);
  };

  // Get only the requested number of recipes
  const displayRecipes = trendingRecipes.slice(0, limit);

  return (
    <div className="space-y-4">
      {displayRecipes.map((recipe, index) => (
        <div 
          key={recipe.id}
          onClick={() => handleRecipeClick(recipe.id)}
          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition duration-150"
        >
          <div className="text-emerald-700 font-semibold text-lg min-w-[24px]">{index + 1}</div>
          <div className="h-16 w-16 flex-shrink-0">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="h-full w-full object-cover rounded-md shadow-sm"
            />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-800 line-clamp-2">{recipe.title}</h4>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {recipe.category}
              </span>
              <span className="text-xs text-gray-500">{recipe.views} views today</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingRecipes;