import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/recipes/RecipeCard';
import { searchRecipes, getRecommendations } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [quickRecipes, setQuickRecipes] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        
        // Fetch popular recipes
        const popularFilters = { sort: 'popularity', number: 4 };
        const popularData = await searchRecipes(popularFilters);
        setPopularRecipes(popularData);
        
        // Fetch quick recipes (under 30 minutes)
        const quickFilters = { maxReadyTime: 30, sort: 'popularity', number: 4 };
        const quickData = await searchRecipes(quickFilters);
        setQuickRecipes(quickData);
        
        // Fetch recommended recipes if user is logged in
        if (user && userProfile) {
          const recommendedData = await getRecommendations(userProfile);
          setRecommendedRecipes(recommendedData.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipes();
  }, [user, userProfile]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-400 text-white py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Recipes</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-green-300 mb-6">Tailored for Your Health</h2>
            <p className="text-lg mb-8">Find delicious meals that match your dietary needs, health goals, and personal preferences. All recipes are personalized based on your unique health profile.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/recipes" className="bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-md font-semibold transition duration-300">
                Find Recipes
              </Link>
              <Link to="/profile" className="bg-white hover:bg-gray-100 text-green-600 py-3 px-6 rounded-md font-semibold transition duration-300">
                My Profile
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="/images/food-collage.jpg" 
              alt="Healthy food collage" 
              className="rounded-lg shadow-xl max-w-full"
              onError={(e) => {e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=Healthy+Food+Collage'}}
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-green-600 text-2xl font-semibold uppercase tracking-wider mb-2">FEATURES</h2>
          <h3 className="text-3xl font-bold mb-16">Why Choose NutriGen Bot?</h3>
          <p className="max-w-2xl mx-auto mb-12 text-gray-600">
            Our platform helps you find recipes that perfectly match your health needs and dietary preferences.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-4">Personalized Recommendations</h4>
              <p className="text-gray-600">Get recipe suggestions tailored specifically to your health profile and dietary needs.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-4">Quick Meals</h4>
              <p className="text-gray-600">Find delicious recipes that can be prepared in 30 minutes or less.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-4">Nutrition Analysis</h4>
              <p className="text-gray-600">Detailed nutritional information for every recipe to help you meet your health goals.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recipe Sections */}
      {!isLoading && (
        <>
          {user && userProfile && recommendedRecipes.length > 0 && (
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Recommended For You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendedRecipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link to="/recipes" className="text-green-600 hover:text-green-700 font-semibold">
                    View All Recommendations →
                  </Link>
                </div>
              </div>
            </section>
          )}
          
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">Popular Recipes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/recipes" className="text-green-600 hover:text-green-700 font-semibold">
                  View All Popular Recipes →
                </Link>
              </div>
            </div>
          </section>
          
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">Quick & Easy Recipes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/recipes" className="text-green-600 hover:text-green-700 font-semibold">
                  View All Quick Recipes →
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
      
      {isLoading && (
        <div className="py-16 text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading delicious recipes for you...</p>
        </div>
      )}
      
      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to personalize your nutrition journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Create your health profile today and discover recipes that are perfect for your unique needs.
          </p>
          <Link to="/signup" className="bg-white text-green-600 hover:bg-gray-100 py-3 px-8 rounded-md font-semibold text-lg transition duration-300">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
