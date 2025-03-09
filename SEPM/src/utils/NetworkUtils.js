
// 네트워크 상태 감지 유틸리티
const NetworkUtils = {
  // 네트워크 연결 상태 확인
  isOnline: () => {
    return navigator.onLine;
  },
  
  // 네트워크 상태 이벤트 리스너 등록
  addNetworkStatusListener: (onlineCallback, offlineCallback) => {
    window.addEventListener('online', onlineCallback);
    window.addEventListener('offline', offlineCallback);
    
    // 현재 상태 바로 반환
    return navigator.onLine;
  },
  
  // 네트워크 상태 이벤트 리스너 제거
  removeNetworkStatusListener: (onlineCallback, offlineCallback) => {
    window.removeEventListener('online', onlineCallback);
    window.removeEventListener('offline', offlineCallback);
  },
  
  // API 연결 가능 여부 테스트 (더 정확한 온라인 확인)
  testApiConnection: async (testUrl = 'https://api.spoonacular.com/') => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(testUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      console.log('API connection test failed:', error.message);
      return false;
    }
  }
};

export default NetworkUtils;
