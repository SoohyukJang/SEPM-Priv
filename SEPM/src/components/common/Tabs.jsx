import React from 'react';

export const Tab = ({ children, isActive }) => {
  return (
    <div className={`tab-content ${isActive ? 'block' : 'hidden'}`}>
      {children}
    </div>
  );
};

export const Tabs = ({ children, activeTab, onChange }) => {
  // Filter out only Tab components
  const tabs = React.Children.toArray(children).filter(
    (child) => child.type.name === 'Tab'
  );

  return (
    <div className="tabs-container">
      <div className="border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab) => {
            const isActive = tab.props.id === activeTab;
            return (
              <li className="mr-2" key={tab.props.id}>
                <button
                  onClick={() => onChange(tab.props.id)}
                  className={`inline-block py-4 px-4 font-medium text-center ${
                    isActive
                      ? 'text-green-500 border-b-2 border-green-500'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.props.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="py-4">
        {tabs.map((tab) => {
          return React.cloneElement(tab, {
            isActive: tab.props.id === activeTab,
            key: tab.props.id
          });
        })}
      </div>
    </div>
  );
};
