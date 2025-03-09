import React from 'react';
import { useEffect, useState } from 'react';
import NetworkUtils from '../../utils/NetworkUtils';

const OfflineNotice = () => {
  const [isOffline, setIsOffline] = useState(!NetworkUtils.isOnline());
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
    };
    
    const handleOffline = () => {
      setIsOffline(true);
    };
    
    // 네트워크 상태 리스너 등록
    NetworkUtils.addNetworkStatusListener(handleOnline, handleOffline);
    
    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      NetworkUtils.removeNetworkStatusListener(handleOnline, handleOffline);
    };
  }, []);
  
  if (!isOffline) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-yellow-50 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-yellow-700 truncate">
                <span className="md:hidden">
                  You're offline. Limited features available.
                </span>
                <span className="hidden md:inline">
                  You're currently offline. Some features may be limited, but you can still browse cached content.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineNotice;
