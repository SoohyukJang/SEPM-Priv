import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc, setDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

// Create context
const RecipeContext = createContext();

// Custom hook to use recipe context
export const useRecipes = () => useContext(RecipeContext);

// Provider component
export const RecipeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  // Fetch popular recipes on mount
  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        setLoading(true);
        // Mock data for now
        const mockPopularRecipes = [
          {
            id: 1,
            title: 'Vegetable Stir Fry',
            image: 'https://via.placeholder.com/300',
            readyInMinutes: 30,
            servings: 4
          },
          {
            id: 2,
            title: 'Chicken Curry',
            image: 'https://via.placeholder.com/300',
            readyInMinutes: 45,
            servings: 6
          },
          {
            id: 3,
            title: 'Quinoa Salad',
            image: 'https://via.placeholder.com/300',
            readyInMinutes: 20,
            servings: 2
          }
        ];
        
        setPopularRecipes(mockPopularRecipes);
      } catch (err) {
        console.error('Error fetching popular recipes:', err);
        setError('Failed to fetch popular recipes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopularRecipes();
  }, []);

  // Search recipes function
  const searchRecipes = async (query, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now
      const mockResults = [
        {
          id: 4,
          title: 'Pasta Primavera',
          image: 'https://via.placeholder.com/300',
          readyInMinutes: 25,
          servings: 4
        },
        {
          id: 5,
          title: 'Grilled Salmon',
          image: 'https://via.placeholder.com/300',
          readyInMinutes: 20,
          servings: 2
        }
      ];
      
      setSearchResults(mockResults);
      return mockResults;
    } catch (err) {
      console.error('Error searching recipes:', err);
      setError('Failed to search recipes');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get recipe details
  const getRecipeById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data based on ID
      const mockRecipe = {
        id: parseInt(id),
        title: `Recipe ${id}`,
        image: 'https://via.placeholder.com/600',
        readyInMinutes: 30,
        servings: 4,
        ingredients: [
          { id: 1, name: 'Ingredient 1', amount: 2, unit: 'cups' },
          { id: 2, name: 'Ingredient 2', amount: 1, unit: 'tablespoon' }
        ],
        instructions: [
          { number: 1, step: 'Step 1 of the recipe' },
          { number: 2, step: 'Step 2 of the recipe' }
        ]
      };
      
      return mockRecipe;
    } catch (err) {
      console.error(`Error getting recipe ${id}:`, err);
      setError(`Failed to get recipe details`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    loading,
    error,
    popularRecipes,
    searchResults,
    searchRecipes,
    getRecipeById
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeProvider;
