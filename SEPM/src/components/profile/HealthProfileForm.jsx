import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const HealthProfileForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: 'Male',
    activityLevel: 'Sedentary (little or no exercise)',
    goal: 'Weight Loss',
    allergies: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically save the data to your backend
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Complete your health profile to get personalized recipes and nutrition recommendations.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="height" className="block mb-2">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block mb-2">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="age" className="block mb-2">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block mb-2">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Activity & Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="activityLevel" className="block mb-2">Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Sedentary (little or no exercise)">Sedentary (little or no exercise)</option>
                <option value="Lightly active (light exercise 1-3 days/week)">Lightly active (light exercise 1-3 days/week)</option>
                <option value="Moderately active (moderate exercise 3-5 days/week)">Moderately active (moderate exercise 3-5 days/week)</option>
                <option value="Very active (hard exercise 6-7 days/week)">Very active (hard exercise 6-7 days/week)</option>
                <option value="Super active (very hard exercise & physical job)">Super active (very hard exercise & physical job)</option>
              </select>
            </div>
            <div>
              <label htmlFor="goal" className="block mb-2">Goal</label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Maintain Weight">Maintain Weight</option>
                <option value="Weight Gain">Weight Gain</option>
                <option value="Build Muscle">Build Muscle</option>
                <option value="Improve Health">Improve Health</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Allergies</h2>
          <p className="mb-4">Select any allergies to exclude them from your recipe recommendations.</p>
          {/* Here you would add allergy checkboxes */}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthProfileForm;
