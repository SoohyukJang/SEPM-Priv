import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// 비인증 사용자만 접근 가능한 라우트 (로그인, 회원가입 등)
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    console.log('User already authenticated, redirecting to home...');
    return <Navigate to="/" />;
  }
  
  return children;
};

export default PublicRoute;
