import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import FavoriteRecipes from '../components/profile/FavoriteRecipes';
import UserStats from '../components/profile/UserStats';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // 사용자 건강 정보 상태
  const [healthProfile, setHealthProfile] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: '',
    goal: '',
    allergies: [],
    dietaryRestrictions: [],
    bmr: 0,
    tdee: 0,
    targetCalories: 0
  });
  
  // 알러지 및 식이 제한 옵션
  const allergyOptions = [
    'Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 
    'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
  ];
  
  const dietaryRestrictionOptions = [
    'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian', 
    'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Low FODMAP'
  ];
  
  // 활동 수준 옵션
  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Lightly active (light exercise/sports 1-3 days/week)' },
    { value: 'moderate', label: 'Moderately active (moderate exercise/sports 3-5 days/week)' },
    { value: 'active', label: 'Very active (hard exercise/sports 6-7 days a week)' },
    { value: 'veryActive', label: 'Super active (very hard exercise & physical job or 2x training)' }
  ];
  
  // 목표 옵션
  const goalOptions = [
    { value: 'weightLoss', label: 'Weight Loss' },
    { value: 'weightMaintenance', label: 'Weight Maintenance' },
    { value: 'weightGain', label: 'Weight Gain' }
  ];

  // 사용자 데이터 로드
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.healthProfile) {
            setHealthProfile(userData.healthProfile);
          } else {
            // 기본 프로필이 없는 경우 기본값 설정
            setHealthProfile({
              height: '',
              weight: '',
              age: '',
              gender: '',
              activityLevel: '',
              goal: '',
              allergies: [],
              dietaryRestrictions: [],
              bmr: 0,
              tdee: 0,
              targetCalories: 0
            });
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your health profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  // 입력 폼 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHealthProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 알러지 체크박스 핸들러
  const handleAllergyChange = (allergy) => {
    setHealthProfile(prev => {
      const allergies = [...prev.allergies];
      
      if (allergies.includes(allergy)) {
        return {
          ...prev,
          allergies: allergies.filter(item => item !== allergy)
        };
      } else {
        return {
          ...prev,
          allergies: [...allergies, allergy]
        };
      }
    });
  };
  
  // 식이 제한 체크박스 핸들러
  const handleDietaryRestrictionChange = (restriction) => {
    setHealthProfile(prev => {
      const restrictions = [...prev.dietaryRestrictions];
      
      if (restrictions.includes(restriction)) {
        return {
          ...prev,
          dietaryRestrictions: restrictions.filter(item => item !== restriction)
        };
      } else {
        return {
          ...prev,
          dietaryRestrictions: [...restrictions, restriction]
        };
      }
    });
  };

  // 프로필 저장 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to update your profile.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      // BMR 계산 (Harris-Benedict 방정식)
      let bmr = 0;
      if (healthProfile.gender && healthProfile.weight && healthProfile.height && healthProfile.age) {
        const weight = parseFloat(healthProfile.weight);
        const height = parseFloat(healthProfile.height);
        const age = parseInt(healthProfile.age);
        
        if (healthProfile.gender === 'male') {
          bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
          bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }
        
        // 활동 수준에 따른 조정
        const activityMultipliers = {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          active: 1.725,
          veryActive: 1.9
        };
        
        const tdee = bmr * (activityMultipliers[healthProfile.activityLevel] || 1.2);
        
        // 목표에 따른 칼로리 조정
        let targetCalories = tdee;
        if (healthProfile.goal === 'weightLoss') {
          targetCalories = tdee - 500; // 체중 감량은 하루 500 칼로리 적게
        } else if (healthProfile.goal === 'weightGain') {
          targetCalories = tdee + 500; // 체중 증가는 하루 500 칼로리 더
        }
        
        // 계산된 값 추가
        healthProfile.bmr = Math.round(bmr);
        healthProfile.tdee = Math.round(tdee);
        healthProfile.targetCalories = Math.round(targetCalories);
      }
      
      // Firestore 문서 업데이트
      await updateDoc(doc(db, 'users', currentUser.uid), {
        healthProfile,
        updatedAt: new Date()
      });
      
      setMessage('Your health profile has been updated successfully!');
      // 저장 후 자동으로 대시보드 탭으로 이동
      setActiveTab('dashboard');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out', err);
      setError('Failed to log out.');
    }
  };

  // 매크로 텍스트 설명 생성
  const getMacroDescription = () => {
    if (!healthProfile.goal) return 'Set your goal to see macro recommendations.';
    
    switch(healthProfile.goal) {
      case 'weightLoss':
        return 'For weight loss, we recommend a higher protein ratio to preserve muscle mass, moderate fat, and lower carbs.';
      case 'weightMaintenance':
        return 'For weight maintenance, we recommend a balanced distribution of macronutrients.';
      case 'weightGain':
        return 'For weight gain, we recommend higher carbs to fuel workouts, moderate protein for muscle building, and moderate fat.';
      default:
        return 'Set your goal to see macro recommendations.';
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to be logged in to view this page.{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-medium underline text-yellow-700 hover:text-yellow-600"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header with Logo and Sign Out */}
        <div className="bg-gradient-to-r from-green-600 to-green-400 px-6 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/Logo.png" alt="NutriGen Bot Logo" className="h-12 w-auto mr-4" />
            <div>
              <h1 className="text-xl font-bold text-white">My Health Profile</h1>
              <p className="text-green-100">Personalize your nutrition journey</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
          >
            Sign out
          </button>
        </div>
        
        {/* Notification Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-md">
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
        )}
        
        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 m-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-4 text-center font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'profile' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Health Profile
          </button>
          <button
            className={`flex-1 py-4 px-4 text-center font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'dashboard' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            Nutrition Dashboard
          </button>
          <button
            className={`flex-1 py-4 px-4 text-center font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'favorites' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('favorites')}
          >
            Saved Recipes
          </button>
        </div>
        
        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="px-6 py-6">
            <div className="mb-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Complete your health profile to get personalized recipes and nutrition recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Basic Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      id="height"
                      value={healthProfile.height}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Enter your height"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      value={healthProfile.weight}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Enter your weight"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      id="age"
                      value={healthProfile.age}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Enter your age"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      id="gender"
                      value={healthProfile.gender}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Activity & Goals */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Activity & Goals</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
                      Activity Level
                    </label>
                    <select
                      name="activityLevel"
                      id="activityLevel"
                      value={healthProfile.activityLevel}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="">Select activity level</option>
                      {activityLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                      Goal
                    </label>
                    <select
                      name="goal"
                      id="goal"
                      value={healthProfile.goal}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      <option value="">Select goal</option>
                      {goalOptions.map(goal => (
                        <option key={goal.value} value={goal.value}>
                          {goal.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Allergies */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Allergies</h2>
                <p className="text-sm text-gray-500 mb-4">Select any allergies to exclude them from your recipe recommendations.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {allergyOptions.map(allergy => (
                    <div key={allergy} className="flex items-center">
                      <input
                        id={`allergy-${allergy}`}
                        name={`allergy-${allergy}`}
                        type="checkbox"
                        checked={healthProfile.allergies.includes(allergy)}
                        onChange={() => handleAllergyChange(allergy)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`allergy-${allergy}`} className="ml-2 block text-sm text-gray-700">
                        {allergy}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Dietary Restrictions */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Dietary Restrictions</h2>
                <p className="text-sm text-gray-500 mb-4">Select any dietary restrictions to customize your recipe recommendations.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {dietaryRestrictionOptions.map(restriction => (
                    <div key={restriction} className="flex items-center">
                      <input
                        id={`restriction-${restriction}`}
                        name={`restriction-${restriction}`}
                        type="checkbox"
                        checked={healthProfile.dietaryRestrictions.includes(restriction)}
                        onChange={() => handleDietaryRestrictionChange(restriction)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`restriction-${restriction}`} className="ml-2 block text-sm text-gray-700">
                        {restriction}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="px-6 py-6">
            {healthProfile.bmr > 0 ? (
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-medium text-gray-900 mb-4">Your Nutrition Summary</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Calorie Target Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Daily Target</h3>
                      <div className="text-3xl font-bold text-green-600">{healthProfile.targetCalories} cal</div>
                      <p className="mt-2 text-sm text-gray-500">
                        Based on your {healthProfile.goal === 'weightLoss' ? 'weight loss' : 
                                      healthProfile.goal === 'weightGain' ? 'weight gain' : 
                                      'weight maintenance'} goal
                      </p>
                    </div>
                    
                    {/* BMR Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Basal Metabolic Rate</h3>
                      <div className="text-3xl font-bold text-blue-600">{healthProfile.bmr} cal</div>
                      <p className="mt-2 text-sm text-gray-500">
                        Calories your body needs at complete rest
                      </p>
                    </div>
                    
                    {/* TDEE Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Total Daily Energy</h3>
                      <div className="text-3xl font-bold text-indigo-600">{healthProfile.tdee} cal</div>
                      <p className="mt-2 text-sm text-gray-500">
                        Calories you burn daily with activity
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Recommended Macronutrient Distribution */}
                <div className="mb-8">
                  <h2 className="text-xl font-medium text-gray-900 mb-4">Recommended Macronutrient Distribution</h2>
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">{getMacroDescription()}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Protein */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                        <h3 className="text-md font-medium text-green-800">Protein</h3>
                        <div className="mt-2">
                          <div className="text-2xl font-bold text-green-600">
                            {healthProfile.goal === 'weightLoss' ? '40%' : 
                             healthProfile.goal === 'weightGain' ? '25%' : '30%'}
                          </div>
                          <p className="text-xs text-green-700 mt-1">
                            {healthProfile.goal === 'weightLoss' ? 'Higher protein to preserve muscle' : 
                             healthProfile.goal === 'weightGain' ? 'Moderate protein for muscle building' : 
                             'Balanced protein intake'}
                          </p>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2.5 mt-3">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ 
                            width: healthProfile.goal === 'weightLoss' ? '40%' : 
                                   healthProfile.goal === 'weightGain' ? '25%' : '30%' 
                          }}></div>
                        </div>
                      </div>
                        {/* Carbs */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                        <h3 className="text-md font-medium text-blue-800">Carbs</h3>
                        <div className="mt-2">
                          <div className="text-2xl font-bold text-blue-600">
                            {healthProfile.goal === 'weightLoss' ? '25%' : 
                             healthProfile.goal === 'weightGain' ? '50%' : '40%'}
                          </div>
                          <p className="text-xs text-blue-700 mt-1">
                            {healthProfile.goal === 'weightLoss' ? 'Lower carbs to reduce calories' : 
                             healthProfile.goal === 'weightGain' ? 'Higher carbs for energy' : 
                             'Balanced carb intake'}
                          </p>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2.5 mt-3">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ 
                            width: healthProfile.goal === 'weightLoss' ? '25%' : 
                                   healthProfile.goal === 'weightGain' ? '50%' : '40%' 
                          }}></div>
                        </div>
                      </div>
                      
                      {/* Fats */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
                        <h3 className="text-md font-medium text-yellow-800">Fats</h3>
                        <div className="mt-2">
                          <div className="text-2xl font-bold text-yellow-600">
                            {healthProfile.goal === 'weightLoss' ? '35%' : 
                             healthProfile.goal === 'weightGain' ? '25%' : '30%'}
                          </div>
                          <p className="text-xs text-yellow-700 mt-1">
                            {healthProfile.goal === 'weightLoss' ? 'Moderate healthy fats' : 
                             healthProfile.goal === 'weightGain' ? 'Lower fats for calorie control' : 
                             'Balanced fat intake'}
                          </p>
                        </div>
                        <div className="w-full bg-yellow-200 rounded-full h-2.5 mt-3">
                          <div className="bg-yellow-600 h-2.5 rounded-full" style={{ 
                            width: healthProfile.goal === 'weightLoss' ? '35%' : 
                                   healthProfile.goal === 'weightGain' ? '25%' : '30%' 
                          }}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Daily Calorie Breakdown */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-md font-medium text-gray-900 mb-3">Daily Calorie Breakdown</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 rounded-md bg-green-50 border border-green-100">
                          <h4 className="text-sm font-medium text-gray-700">Protein</h4>
                          <div className="mt-1 text-lg font-bold text-green-600">
                            {Math.round(healthProfile.targetCalories * 
                              (healthProfile.goal === 'weightLoss' ? 0.4 : 
                               healthProfile.goal === 'weightGain' ? 0.25 : 0.3) / 4)} g
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(healthProfile.targetCalories * 
                              (healthProfile.goal === 'weightLoss' ? 0.4 : 
                               healthProfile.goal === 'weightGain' ? 0.25 : 0.3))} calories
                          </p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-blue-50 border border-blue-100">
                          <h4 className="text-sm font-medium text-gray-700">Carbs</h4>
                          <div className="mt-1 text-lg font-bold text-blue-600">
                            {Math.round(healthProfile.targetCalories * 
                              (healthProfile.goal === 'weightLoss' ? 0.25 : 
                               healthProfile.goal === 'weightGain' ? 0.5 : 0.4) / 4)} g
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(healthProfile.targetCalories * 
                              (healthProfile.goal === 'weightLoss' ? 0.25 : 
                               healthProfile.goal === 'weightGain' ? 0.5 : 0.4))} calories
                          </p>
                        </div>
                        
                        <div className="p-3 rounded-md bg-yellow-50 border border-yellow-100">
                          <h4 className="text-sm font-medium text-gray-700">Fats</h4>
                          <div className="mt-1 text-lg font-bold text-yellow-600">
                            {Math.round(healthProfile.targetCalories * 
                              (healthProfile.goal === 'weightLoss' ? 0.35 : 
                               healthProfile.goal === 'weightGain' ? 0.25 : 0.3) / 9)} g
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(healthProfile.targetCalories * 
                              (healthProfile.goal === 'weightLoss' ? 0.35 : 
                               healthProfile.goal === 'weightGain' ? 0.25 : 0.3))} calories
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Dietary Preferences Summary */}
                <div className="mb-8">
                  <h2 className="text-xl font-medium text-gray-900 mb-4">Your Dietary Preferences</h2>
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    {/* Allergies */}
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-900 mb-2">Allergies to Avoid</h3>
                      {healthProfile.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {healthProfile.allergies.map(allergy => (
                            <span key={allergy} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No allergies specified</p>
                      )}
                    </div>
                    
                    {/* Dietary Restrictions */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Dietary Preferences</h3>
                      {healthProfile.dietaryRestrictions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {healthProfile.dietaryRestrictions.map(restriction => (
                            <span key={restriction} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {restriction}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No dietary restrictions specified</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Recipe Recommendations */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-gray-900">Recommended For You</h2>
                    <button
                      onClick={() => navigate('/search')}
                      className="text-sm font-medium text-green-600 hover:text-green-700"
                    >
                      View All
                    </button>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <p className="text-sm text-gray-500">
                      Your personalized recipe recommendations will appear here. 
                      Check out our recipe search to find recipes that match your nutritional goals.
                    </p>
                    <button
                      onClick={() => navigate('/search')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                    >
                      Find Recipes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">No health data available</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  Please complete your health profile to view your nutrition dashboard and get personalized recipe recommendations.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Complete Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Saved Recipes Tab Content */}
        {activeTab === 'favorites' && (
          <div className="px-6 py-6">
            <FavoriteRecipes />
          </div>
        )}
      </div>
      
      {/* User Stats Section */}
      {activeTab === 'dashboard' && healthProfile.bmr > 0 && (
        <div className="mt-6">
          <UserStats />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
