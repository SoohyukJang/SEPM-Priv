import React, { useState } from 'react';
import { Tabs, Tab } from '../components/common/Tabs';
import HealthProfileForm from '../components/profile/HealthProfileForm';
import UserStats from '../components/profile/UserStats';
import FavoriteRecipes from '../components/profile/FavoriteRecipes';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('health');
  const { user } = useAuth();

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-green-600 to-green-400 px-6 py-6 flex justify-between items-center rounded-xl overflow-hidden">
        <div className="flex items-center">
          <div className="mr-4">
            <img src="/images/Logo.png" alt="NutriGen Bot Logo" className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Health Profile</h1>
            <p className="text-white">Personalize your nutrition journey</p>
          </div>
        </div>
      </div>

      <Tabs activeTab={activeTab} onChange={handleTabChange}>
        <Tab id="health" label="Health Profile">
          <HealthProfileForm />
        </Tab>
        <Tab id="nutrition" label="Nutrition Dashboard">
          <UserStats user={user} />
        </Tab>
        <Tab id="saved" label="Saved Recipes">
          <FavoriteRecipes />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
