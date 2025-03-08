// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Page components
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import RecipeDetail from './pages/RecipeDetail';
import ProfilePage from './pages/ProfilePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import BlogCreatePage from './pages/BlogCreatePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';

// Common components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import SearchSidebar from './components/search/SearchSidebar';

function App() {
  // State for search sidebar visibility
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Toggle search sidebar
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-cream">
        <Header toggleSearch={toggleSearch} />
        
        {/* Search sidebar */}
        <SearchSidebar isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/recipe/:recipeId" element={<RecipeDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/blogs/:blogId" element={<BlogDetailPage />} />
            <Route path="/blogs/create" element={<BlogCreatePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;