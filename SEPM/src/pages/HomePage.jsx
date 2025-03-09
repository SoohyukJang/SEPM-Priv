import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getRecommendations, searchRecipes } from '../services/apiService';

const HomePage = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [quickRecipes, setQuickRecipes] = useState([]);

  // Fetch user profile and recommendations
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      
      try {
        // Get popular recipes regardless of user login
        const popularResult = await searchRecipes('', {
          sort: 'popularity',
          number: 4
        });
        
        if (popularResult && popularResult.results) {
          setPopularRecipes(popularResult.results);
        }
        
        // Get quick recipes
        const quickResult = await searchRecipes('', {
          maxReadyTime: 30,
          sort: 'time',
          number: 4
        });
        
        if (quickResult && quickResult.results) {
          setQuickRecipes(quickResult.results);
        }
        
        // If user is logged in, get personalized recommendations
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          
          if (userDoc.exists() && userDoc.data().healthProfile) {
            const healthProfile = userDoc.data().healthProfile;
            setUserProfile(healthProfile);
            
            // Get personalized recommendations
            const recommendResult = await getRecommendations(healthProfile, { number: 8 });
            
            if (recommendResult && recommendResult.results) {
              setRecommendations(recommendResult.results);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-xl overflow-hidden mb-12">
        <div className="px-6 py-12 md:px-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Discover Healthy Recipes Tailored for You
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Find recipes that match your dietary preferences, health goals, and food allergies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/search" 
              className="px-6 py-3 bg-white text-green-600 rounded-md hover:bg-green-50 shadow-md font-medium"
            >
              Search Recipes
            </Link>
            {!currentUser ? (
              <Link 
                to="/signup" 
                className="px-6 py-3 bg-green-700 text-white border border-green-400 rounded-md hover:bg-green-800 shadow-md font-medium"
              >
                Sign Up for Personalized Recipes
              </Link>
            ) : !userProfile ? (
              <Link 
                to="/profile" 
                className="px-6 py-3 bg-green-700 text-white border border-green-400 rounded-md hover:bg-green-800 shadow-md font-medium"
              >
                Complete Your Health Profile
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      
      {/* Personalized Recommendations Section */}
      {currentUser && userProfile && recommendations.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Your Personalized Recommendations
            </h2>
            <Link to="/search" className="text-green-600 hover:text-green-700 font-medium text-sm">
              View all →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.slice(0, 4).map(recipe => (
              <Link
                key={recipe.id}
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Popular Recipes Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Popular Recipes
          </h2>
          <Link to="/search?sort=popularity" className="text-green-600 hover:text-green-700 font-medium text-sm">
            View all →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularRecipes.map(recipe => (
              <Link
                key={recipe.id}
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
                  <div className="flex flex-wrap gap-2">
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Quick Meals Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Quick Meals (Under 30 Minutes)
          </h2>
          <Link to="/search?maxReadyTime=30" className="text-green-600 hover:text-green-700 font-medium text-sm">
            View all →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {quickRecipes.map(recipe => (
              <Link
                key={recipe.id}
                to={`/recipe/${recipe.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 m-2 rounded text-xs font-medium">
                    {recipe.readyInMinutes} mins
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                    {recipe.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Call to Action */}
      {!currentUser && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Get Personalized Recipe Recommendations
          </h2>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            Create an account and complete your health profile to receive personalized recipe recommendations based on your dietary preferences, health goals, and food allergies.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Sign Up Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
