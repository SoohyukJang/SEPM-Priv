// src/components/search/CategoryBrowser.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryBrowser = ({ setIsOpen }) => {
  const navigate = useNavigate();

  // Category data
  const categories = [
    {
      title: "Meal Types",
      items: [
        { name: "Breakfast", icon: "☕", query: "breakfast" },
        { name: "Lunch", icon: "🥪", query: "lunch" },
        { name: "Dinner", icon: "🍽️", query: "dinner" },
        { name: "Dessert", icon: "🍰", query: "dessert" },
        { name: "Snack", icon: "🥨", query: "snack" },
        { name: "Appetizer", icon: "🥗", query: "appetizer" }
      ]
    },
    {
      title: "Cuisines",
      items: [
        { name: "Italian", icon: "🍝", query: "italian" },
        { name: "Mexican", icon: "🌮", query: "mexican" },
        { name: "Asian", icon: "🍜", query: "asian" },
        { name: "Mediterranean", icon: "🫒", query: "mediterranean" },
        { name: "Indian", icon: "🍛", query: "indian" },
        { name: "American", icon: "🍔", query: "american" }
      ]
    },
    {
      title: "Dietary Needs",
      items: [
        { name: "Vegetarian", icon: "🥦", query: "vegetarian" },
        { name: "Vegan", icon: "🌱", query: "vegan" },
        { name: "Gluten Free", icon: "🌾", query: "gluten free" },
        { name: "Keto", icon: "🥑", query: "keto" },
        { name: "Low Carb", icon: "🥩", query: "low carb" },
        { name: "Paleo", icon: "🍗", query: "paleo" }
      ]
    }
  ];

  const handleCategoryClick = (query) => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.title} className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            {category.title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {category.items.map((item) => (
              <button
                key={item.name}
                onClick={() => handleCategoryClick(item.query)}
                className="flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <span className="text-2xl mb-2">{item.icon}</span>
                <span className="text-sm font-medium text-emerald-700">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryBrowser;