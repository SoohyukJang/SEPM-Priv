import axios from 'axios';
import sampleRecipes from '../data/sample-recipes.json';

// API 키
const API_KEY = '1c2cb4541bed45058be2c24ef6efe661';
const BASE_URL = 'https://api.spoonacular.com/recipes';

// 로컬 스토리지 키
const CACHE_KEYS = {
  POPULAR_RECIPES: 'nutrigen_popular_recipes',
  QUICK_RECIPES: 'nutrigen_quick_recipes',
  RECIPE_DETAILS: 'nutrigen_recipe_details_',
  SEARCH_RESULTS: 'nutrigen_search_results_',
  SIMILAR_RECIPES: 'nutrigen_similar_recipes_',
  CACHE_TIMESTAMP: '_timestamp',
  CACHE_EXPIRY: 60 * 60 * 1000, // 1시간 캐시 유효시간 (밀리초)
};

// 캐시 관리 함수
const cacheManager = {
  // 캐시 저장
  setCache(key, data) {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(key, JSON.stringify(cacheData));
      return true;
    } catch (error) {
      console.error('Cache storage error:', error);
      return false;
    }
  },

  // 캐시 조회
  getCache(key) {
    try {
      const cacheData = localStorage.getItem(key);
      if (!cacheData) return null;

      const { data, timestamp } = JSON.parse(cacheData);
      // 캐시 유효시간 확인
      if (Date.now() - timestamp > CACHE_KEYS.CACHE_EXPIRY) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  },

  // 캐시 삭제
  clearCache(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Cache removal error:', error);
      return false;
    }
  },
};

// API 요청 함수 (오프라인 대비 및 캐싱 포함)
const apiRequest = async (endpoint, params = {}) => {
  // 캐시 키 생성
  const queryString = new URLSearchParams({
    ...params,
    apiKey: API_KEY,
  }).toString();
  
  const cacheKey = endpoint.replace(/\//g, '_') + '_' + queryString;
  
  // 캐시 확인
  const cachedData = cacheManager.getCache(cacheKey);
  if (cachedData) {
    console.log('Using cached data for:', endpoint);
    return cachedData;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params: {
        ...params,
        apiKey: API_KEY,
      },
    });
    
    // 응답 캐싱
    cacheManager.setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    
    // API 호출 실패 시 오프라인 데이터 사용
    if (endpoint.includes('complexSearch')) {
      console.log('Using offline data for search');
      return {
        results: sampleRecipes,
        offset: 0,
        number: sampleRecipes.length,
        totalResults: sampleRecipes.length,
      };
    } 
    else if (endpoint.match(/^\/\d+\/information/)) {
      // 레시피 상세 정보 요청의 경우
      const recipeId = endpoint.split('/')[1];
      const offlineRecipe = sampleRecipes.find(recipe => recipe.id.toString() === recipeId);
      
      if (offlineRecipe) {
        console.log('Using offline data for recipe detail');
        return offlineRecipe;
      }
    }
    else if (endpoint.match(/^\/\d+\/similar/)) {
      // 유사 레시피 요청의 경우
      console.log('Using offline data for similar recipes');
      // 무작위로 다른 샘플 레시피 2개 선택
      const shuffled = [...sampleRecipes]
        .filter(recipe => recipe.id.toString() !== endpoint.split('/')[1])
        .sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    }
    
    // 기타 경우 빈 결과 반환
    return { results: [] };
  }
};

// 검색 함수
export const searchRecipes = async (query, options = {}) => {
  const cacheKey = CACHE_KEYS.SEARCH_RESULTS + query + JSON.stringify(options);
  const cachedData = cacheManager.getCache(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const results = await apiRequest('/complexSearch', {
      query,
      addRecipeInformation: true,
      fillIngredients: true,
      ...options,
    });
    
    cacheManager.setCache(cacheKey, results);
    return results;
  } catch (error) {
    console.error('Search failed:', error);
    
    // 오프라인 데이터 필터링
    let filteredRecipes = [...sampleRecipes];
    
    // 검색어 필터링
    if (query) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // 추가 필터링 (시간, 다이어트 등)
    if (options.maxReadyTime) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.readyInMinutes <= options.maxReadyTime
      );
    }
    
    if (options.diet) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        recipe.diets && recipe.diets.includes(options.diet)
      );
    }
    
    // 정렬
    if (options.sort) {
      switch(options.sort) {
        case 'popularity':
          filteredRecipes.sort((a, b) => b.spoonacularScore - a.spoonacularScore);
          break;
        case 'time':
          filteredRecipes.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
          break;
        case 'healthiness':
          filteredRecipes.sort((a, b) => b.healthScore - a.healthScore);
          break;
      }
    }
    
    // 결과 개수 제한
    if (options.number) {
      filteredRecipes = filteredRecipes.slice(0, options.number);
    }
    
    return {
      results: filteredRecipes,
      offset: 0,
      number: filteredRecipes.length,
      totalResults: filteredRecipes.length
    };
  }
};

// getRecipeDetails와 getRecipeById는 동일한 기능 (이름만 다름)
export const getRecipeDetails = async (id) => {
  const cacheKey = CACHE_KEYS.RECIPE_DETAILS + id;
  const cachedData = cacheManager.getCache(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const result = await apiRequest(`/${id}/information`, {
      includeNutrition: true,
    });
    
    cacheManager.setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Failed to get recipe details for ID ${id}:`, error);
    
    // 오프라인 데이터에서 찾기
    const offlineRecipe = sampleRecipes.find(recipe => recipe.id == id);
    return offlineRecipe || null;
  }
};

// getRecipeById 함수 추가 (RecipeDetail.jsx에서 사용)
export const getRecipeById = async (id) => {
  // getRecipeDetails와 동일한 기능
  return getRecipeDetails(id);
};

// getSimilarRecipes 함수 추가 (RecipeDetail.jsx에서 사용)
export const getSimilarRecipes = async (id) => {
  const cacheKey = CACHE_KEYS.SIMILAR_RECIPES + id;
  const cachedData = cacheManager.getCache(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const result = await apiRequest(`/${id}/similar`, {
      number: 4
    });
    
    cacheManager.setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Failed to get similar recipes for ID ${id}:`, error);
    
    // 오프라인 데이터에서 유사 레시피 생성
    // 이 예에서는 간단히 다른 샘플 레시피 반환
    const otherRecipes = sampleRecipes.filter(recipe => recipe.id != id);
    const shuffled = [...otherRecipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }
};

// 건강 프로필 기반 추천 레시피 가져오기
export const getRecommendations = async (healthProfile, options = {}) => {
  try {
    // 건강 프로필 기반 추천 로직
    const params = {
      number: options.number || 8,
      addRecipeInformation: true,
      sort: 'random',
    };
    
    // 알러지 필터링
    if (healthProfile.allergies && healthProfile.allergies.length > 0) {
      params.intolerances = healthProfile.allergies.join(',');
    }
    
    // 식이 제한 필터링
    if (healthProfile.dietaryRestrictions && healthProfile.dietaryRestrictions.length > 0) {
      const diets = healthProfile.dietaryRestrictions.map(diet => {
        // 다이어트 이름 포맷팅 (예: "Gluten Free" -> "gluten-free")
        return diet.toLowerCase().replace(/\s+/g, '-');
      });
      
      params.diet = diets[0]; // API는 하나의 다이어트만 지원
    }
    
    // 칼로리 필터링 (목표 기반)
    if (healthProfile.targetCalories) {
      const mealPercentage = 0.3; // 한 끼 식사는 일일 칼로리의 약 30%
      const targetMealCalories = healthProfile.targetCalories * mealPercentage;
      
      params.maxCalories = Math.round(targetMealCalories);
    }
    
    const results = await apiRequest('/complexSearch', params);
    return results;
  } catch (error) {
    console.error('Failed to get recommendations:', error);
    
    // 오프라인 데이터로 대체
    // 여기서는 간단히 오프라인 데이터에서 무작위 추천
    const shuffled = [...sampleRecipes].sort(() => 0.5 - Math.random());
    const selectedRecipes = shuffled.slice(0, options.number || 4);
    
    return {
      results: selectedRecipes,
      offset: 0,
      number: selectedRecipes.length,
      totalResults: selectedRecipes.length
    };
  }
};

// 캐시 전체 초기화 함수
export const clearAllCache = () => {
  try {
    Object.values(CACHE_KEYS).forEach(key => {
      if (typeof key === 'string' && !key.includes('_')) {
        localStorage.removeItem(key);
      }
    });
    
    // 레시피 상세 정보 캐시 삭제
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEYS.RECIPE_DETAILS)) {
        localStorage.removeItem(key);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return false;
  }
};
