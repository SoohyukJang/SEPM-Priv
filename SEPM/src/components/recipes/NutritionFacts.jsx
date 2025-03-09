import React from 'react';

const NutritionFacts = ({ nutrients }) => {
  if (!nutrients || nutrients.length === 0) {
    return <div className="text-gray-500">No nutrition information available</div>;
  }

  // Important nutrients to display
  const keyNutrients = [
    'Calories',
    'Fat',
    'Saturated Fat',
    'Carbohydrates',
    'Sugar',
    'Fiber',
    'Protein',
    'Sodium',
    'Cholesterol'
  ];

  // Filter and sort nutrients
  const sortedNutrients = nutrients
    .filter(nutrient => keyNutrients.includes(nutrient.name))
    .sort((a, b) => {
      const indexA = keyNutrients.indexOf(a.name);
      const indexB = keyNutrients.indexOf(b.name);
      return indexA - indexB;
    });

  return (
    <div className="nutrition-facts bg-white p-4 border border-gray-200 rounded-md">
      <div className="border-b-2 border-black pb-2 mb-2">
        <h3 className="text-xl font-bold">Nutrition Facts</h3>
      </div>
      
      {sortedNutrients.map((nutrient, index) => (
        <div 
          key={nutrient.name}
          className={`py-1 flex justify-between items-center ${
            index !== sortedNutrients.length - 1 ? 'border-b border-gray-200' : ''
          }`}
        >
          <div className="font-medium">
            {nutrient.name}
            {nutrient.name === 'Calories' ? '' : ` (${nutrient.unit})`}
          </div>
          <div className="text-right">
            {Math.round(nutrient.amount * 10) / 10}
            {nutrient.percentOfDailyNeeds && (
              <span className="text-gray-500 text-sm ml-2">
                {Math.round(nutrient.percentOfDailyNeeds)}% DV
              </span>
            )}
          </div>
        </div>
      ))}
      
      <div className="text-xs text-gray-500 mt-2">
        * Percent Daily Values are based on a 2,000 calorie diet.
      </div>
    </div>
  );
};

export default NutritionFacts;
