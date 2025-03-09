import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import App from './App';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import './firebase/config';

// 로그인 상태 유지를 위한 Firebase 인증 지속성 설정
const auth = getAuth();
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase auth persistence set to LOCAL');
  })
  .catch((error) => {
    console.error('Firebase auth persistence error:', error);
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
