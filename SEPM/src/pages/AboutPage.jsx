import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          About NutriGen Bot
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Your personal nutrition assistant for healthy eating based on your unique profile.
        </p>
      </div>
      
      <div className="prose prose-green max-w-none">
        <h2>Our Mission</h2>
        <p>
          NutriGen Bot was created with a simple mission: to make healthy eating accessible,
          personalized, and enjoyable for everyone. We believe that nutrition should be tailored
          to individual needs, preferences, and health goals.
        </p>
        
        <h2>How It Works</h2>
        <p>
          NutriGen Bot uses advanced algorithms to analyze your health profile, dietary preferences,
          and nutritional needs to recommend recipes that are perfect for you. Our platform considers
          factors such as:
        </p>
        
        <ul>
          <li>Your height, weight, age, and gender</li>
          <li>Activity level and exercise frequency</li>
          <li>Health goals (weight loss, maintenance, or gain)</li>
          <li>Food allergies and intolerances</li>
          <li>Dietary restrictions and preferences</li>
        </ul>
        
        <p>
          Based on this information, we calculate your basal metabolic rate (BMR), total daily
          energy expenditure (TDEE), and recommend a target calorie intake. We then filter and
          recommend recipes that align with your nutritional needs and preferences.
        </p>
        
        <h2>Our Features</h2>
        
        <h3>Personalized Recipe Recommendations</h3>
        <p>
          Get recipe suggestions tailored specifically to your health profile, dietary restrictions,
          and nutritional goals.
        </p>
        
        <h3>Comprehensive Recipe Search</h3>
        <p>
          Search for recipes based on ingredients, cuisines, meal types, and more. Filter results
          based on cooking time, nutritional content, and dietary requirements.
        </p>
        
        <h3>Recipe Details</h3>
        <p>
          View detailed information about each recipe, including ingredients, step-by-step instructions,
          cooking time, and complete nutritional breakdown.
        </p>
        
        <h3>Save Your Favorites</h3>
        <p>
          Save recipes you love to your personal collection for quick access later.
        </p>
        
        <h2>Get Started</h2>
        <p>
          Ready to discover recipes tailored to your health needs? Create an account, complete your
          health profile, and start exploring personalized recipe recommendations today!
        </p>
        
        <div className="mt-8 flex justify-center">
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Sign Up Now
          </Link>
        </div>
        
        <h2 className="mt-10">Data Privacy</h2>
        <p>
          We take your privacy seriously. Your health information is stored securely and used only
          to provide personalized recipe recommendations. We do not share your data with third parties
          for marketing purposes.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
