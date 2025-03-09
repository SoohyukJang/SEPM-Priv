import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase 구성 정보
const firebaseConfig = {
  apiKey: "AIzaSyAW8nOi840Z9spmYNJ3n0BNB8FH9Al0imo",
  authDomain: "nutrigen-bot.firebaseapp.com",
  databaseURL: "https://nutrigen-bot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nutrigen-bot",
  storageBucket: "nutrigen-bot.firebasestorage.app",
  messagingSenderId: "826370626365",
  appId: "1:826370626365:web:95e02188be1903c8db2b54",
  measurementId: "G-NN9N8W4RE9"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 각 서비스 인스턴스 가져오기
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 브라우저 환경에서만 애널리틱스 실행
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Auth 설정 변경 - 팝업 모드 지원
auth.useDeviceLanguage(); // 사용자의 기기 언어 사용

export { auth, db, storage, analytics };
