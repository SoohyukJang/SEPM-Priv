import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

const FavoriteRecipes = () => {
  const { currentUser } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError('');
        
        const savedRecipesRef = collection(db, 'users', currentUser.uid, 'savedRecipes');
        const savedRecipesSnap = await getDocs(savedRecipesRef);
        
        if (savedRecipesSnap.empty) {
          setSavedRecipes([]);
          return;
        }
        
        const savedRecipesList = savedRecipesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by saved date, newest first
        savedRecipesList.sort((a, b) => {
          const aDate = a.savedAt?.toDate() || new Date(0);
          const bDate = b.savedAt?.toDate() || new Date(0);
          return bDate - aDate;
        });
        
        setSavedRecipes(savedRecipesList);
      } catch (err) {
        console.error('Error fetching saved recipes:', err);
        setError('Failed to load your saved recipes. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedRecipes();
  }, [currentUser]);

  const handleRemove = async (recipeId) => {
    if (!currentUser || isDeleting) return;
    
    try {
      setIsDeleting(true);
      
      // Delete the recipe from Firestore
      await deleteDoc(doc(db, 'users', currentUser.uid, 'savedRecipes', recipeId));
      
      // Update the local state
      setSavedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    } catch (err) {
      console.error('Error removing saved recipe:', err);
      setError('Failed to remove recipe. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

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

  if (savedRecipes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900">No saved recipes</h3>
        <p className="mt-2 text-sm text-gray-500">
          You haven't saved any recipes yet. Browse recipes and save your favorites!
        </p>
        <div className="mt-6">
          <Link 
            to="/search" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Find Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Saved Recipes ({savedRecipes.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedRecipes.map(recipe => (
          <div
            key={recipe.id}
            className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden flex"
          >
            <Link 
              to={`/recipe/${recipe.id}`}
              className="block w-1/3 h-auto overflow-hidden"
            >
              <img 
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </Link>
            <div className="w-2/3 p-4 flex flex-col justify-between">
              <div>
                <Link 
                  to={`/recipe/${recipe.id}`}
                  className="text-lg font-medium text-gray-900 hover:text-green-600 line-clamp-2"
                >
                  {recipe.title}
                </Link>
                <div className="text-sm text-gray-500 mt-1">
                  {recipe.savedAt?.toDate().toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => handleRemove(recipe.id)}
                  disabled={isDeleting}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteRecipes;
