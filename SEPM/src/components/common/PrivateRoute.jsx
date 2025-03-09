import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// 인증된 사용자만 접근 가능한 라우트
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    console.log('User not authenticated, redirecting to login...');
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default PrivateRoute;
