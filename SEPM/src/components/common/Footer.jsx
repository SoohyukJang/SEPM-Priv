import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-emerald-800 text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <Logo className="h-10 mr-3 text-white" />
            <span className="font-semibold text-xl">NutriGen Bot</span>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8 text-center md:text-left">
            <Link to="/terms" className="mb-2 md:mb-0 hover:text-green-200">Terms of Service</Link>
            <Link to="/privacy" className="mb-2 md:mb-0 hover:text-green-200">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-green-200">Contact Us</Link>
          </div>
        </div>
        <div className="border-t border-emerald-700 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} NutriGen Bot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;