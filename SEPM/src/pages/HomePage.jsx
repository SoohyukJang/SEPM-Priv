// HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="container mx-auto py-12 px-4 md:py-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="flex items-center mb-6">
            <img src="/logo.png" alt="NutriGen Bot Logo" className="h-16 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-emerald-700">NUTRIGEN BOT</h1>
            </div>
            <h2 className="text-2xl md:text-3xl text-emerald-600 mb-6">Your Daily Diet Assistant</h2>
            <p className="text-gray-600 mb-8">
              Healthy food is essential for maintaining overall well-being, as it provides
              the necessary nutrients, vitamins, and minerals that support bodily
              functions, boost the immune system, and reduce the risk of chronic
              diseases such as diabetes, heart disease, and obesity. Choose your own
              healthy food recipe based on your diet, health issues in a minute!
            </p>
            <div className="flex space-x-4">
              <Link to="/signup" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded">
                Sign Up
              </Link>
              <Link to="/login" className="bg-white hover:bg-gray-100 text-emerald-700 border border-emerald-600 font-bold py-2 px-6 rounded">
                Log In
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1551326844-4df70f78d0e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Healthy Food"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-emerald-50 py-12 px-4 md:py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-emerald-700 mb-12">How NutriGen Bot Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-emerald-700 mb-2">Create Your Profile</h3>
              <p className="text-gray-600">Enter your health details like weight, height, gender, age, and dietary preferences.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-emerald-700 mb-2">Get Personalized Recipes</h3>
              <p className="text-gray-600">Receive recipe recommendations tailored to your health profile and diet goals.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-emerald-700 mb-2">Save & Plan Meals</h3>
              <p className="text-gray-600">Save your favorite recipes and create meal plans for better nutrition management.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Recommendations */}
      <section className="container mx-auto py-12 px-4 md:py-20">
        <h2 className="text-3xl font-bold text-center text-emerald-700 mb-12">Recommended Recipes</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Recipe Card 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Healthy Salad" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">Low Calorie</span>
                <span className="text-gray-500 text-sm">320 calories</span>
              </div>
              <h3 className="text-xl font-semibold text-emerald-700 mb-2">Mediterranean Salad Bowl</h3>
              <p className="text-gray-600 mb-4">Fresh vegetables with olive oil and feta cheese for a perfect light lunch.</p>
              <button className="text-emerald-600 hover:text-emerald-800 font-semibold">View Recipe →</button>
            </div>
          </div>
          
          {/* Recipe Card 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Protein Bowl" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">High Protein</span>
                <span className="text-gray-500 text-sm">450 calories</span>
              </div>
              <h3 className="text-xl font-semibold text-emerald-700 mb-2">Quinoa Protein Bowl</h3>
              <p className="text-gray-600 mb-4">A balanced meal with quinoa, grilled chicken, and fresh vegetables.</p>
              <button className="text-emerald-600 hover:text-emerald-800 font-semibold">View Recipe →</button>
            </div>
          </div>
          
          {/* Recipe Card 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1495214783159-3503fd1b572d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Smoothie Bowl" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">Vegan</span>
                <span className="text-gray-500 text-sm">280 calories</span>
              </div>
              <h3 className="text-xl font-semibold text-emerald-700 mb-2">Berry Smoothie Bowl</h3>
              <p className="text-gray-600 mb-4">Refreshing smoothie bowl with mixed berries, banana, and chia seeds.</p>
              <button className="text-emerald-600 hover:text-emerald-800 font-semibold">View Recipe →</button>
            </div>
          </div>
        </div>
        <div className="text-center mt-10">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded">
            Explore All Recipes
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;