// src/components/common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Header = ({ toggleSearch }) => {
  return (
    <nav className="bg-emerald-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Logo className="h-10 text-white" />
          <span className="text-xl font-bold">NutriGen Bot</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="hover:text-green-200">Home</Link>
          <Link to="/blogs" className="hover:text-green-200">Blog</Link>
          <Link to="/about" className="hover:text-green-200">About</Link>
          
          {/* Search button */}
          <button 
            onClick={toggleSearch}
            className="hover:text-green-200 flex items-center space-x-1"
            aria-label="Open search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </button>
          
          <span className="text-gray-300">|</span>
          <Link to="/signup" className="hover:text-green-200">Sign Up</Link>
          <Link to="/login" className="bg-white text-emerald-700 px-4 py-2 rounded-md hover:bg-green-100">Log In</Link>
        </div>
        
        <div className="flex items-center space-x-4 md:hidden">
          {/* Mobile search button */}
          <button 
            onClick={toggleSearch}
            className="text-white p-1"
            aria-label="Open search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Mobile menu button */}
          <button className="text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;