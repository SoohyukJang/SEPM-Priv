import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  getDoc, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../../firebase/config';

const UserStats = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    savedRecipes: 0,
    recentSearches: [],
    healthProfile: null,
    bmr: 0,
    tdee: 0,
    targetCalories: 0
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Get saved recipes count
        const savedRecipesRef = collection(db, 'users', currentUser.uid, 'savedRecipes');
        const savedRecipesSnap = await getDocs(savedRecipesRef);
        const savedRecipesCount = savedRecipesSnap.size;
        
        // Get recent searches
        const searchesRef = collection(db, 'users', currentUser.uid, 'searches');
        const searchesQuery = query(
          searchesRef,
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        const searchesSnap = await getDocs(searchesQuery);
        const recentSearches = searchesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));
        
        // Get health profile
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const healthProfile = userDoc.exists() ? userDoc.data().healthProfile : null;
        
        // Get BMR, TDEE, and target calories
        let bmr = 0;
        let tdee = 0;
        let targetCalories = 0;
        
        if (healthProfile) {
          bmr = healthProfile.bmr || 0;
          tdee = healthProfile.tdee || 0;
          targetCalories = healthProfile.targetCalories || 0;
        }
        
        setStats({
          savedRecipes: savedRecipesCount,
          recentSearches,
          healthProfile,
          bmr,
          tdee,
          targetCalories
        });
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setError('Failed to load user statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserStats();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9v4a1 1 0 11-2 0v-4a1 1 0 112 0zm0-4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Nutrition Summary */}
      {stats.healthProfile && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-green-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Your Nutrition Summary
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-gray-500">Basal Metabolic Rate</h4>
                <div className="text-2xl font-bold text-green-600 mt-2">{stats.bmr} calories</div>
                <p className="text-xs text-gray-500 mt-1">Calories you burn at rest</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-gray-500">Total Daily Energy</h4>
                <div className="text-2xl font-bold text-blue-600 mt-2">{stats.tdee} calories</div>
                <p className="text-xs text-gray-500 mt-1">Calories you burn daily with activity</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <h4 className="text-sm font-medium text-gray-500">Target Daily Calories</h4>
                <div className="text-2xl font-bold text-purple-600 mt-2">{stats.targetCalories} calories</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.healthProfile.goal === 'weightLoss' ? 'For weight loss' : 
                   stats.healthProfile.goal === 'weightGain' ? 'For weight gain' : 
                   'For maintenance'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Activity Overview */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Activity Overview
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Saved Recipes</h4>
                  <p className="text-sm text-gray-500">Recipes you've saved for later</p>
                </div>
                <div className="ml-auto">
                  <span className="text-2xl font-bold text-gray-900">{stats.savedRecipes}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Profile Completion</h4>
                  <p className="text-sm text-gray-500">Your profile status</p>
                </div>
                <div className="ml-auto">
                  <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                    stats.healthProfile ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {stats.healthProfile ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Searches */}
      {stats.recentSearches.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Searches
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {stats.recentSearches.map(search => (
                <li key={search.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-100 p-2 rounded-full">
                      <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{search.term}</p>
                      <p className="text-xs text-gray-500">
                        {search.timestamp?.toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">
                      {search.resultCount} results
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStats;
