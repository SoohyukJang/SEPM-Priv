import React from 'react';

const Logo = ({ className = 'h-10' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      className={className}
      fill="currentColor"
    >
      {/* Apple shape */}
      <path
        d="M250,120 C300,120 320,180 320,240 C320,300 280,320 250,320 C220,320 200,300 180,300 C160,300 140,320 110,320 C80,320 40,300 40,240 C40,180 60,120 110,120 C160,120 180,150 200,150 C220,150 240,120 250,120 Z"
        fill="#F5F5DC"
      />
      {/* Leaf */}
      <path
        d="M270,120 C260,80 240,60 220,40 C250,40 290,70 310,110 C290,120 280,120 270,120 Z"
        fill="#F5F5DC"
      />
      {/* Chat bubble */}
      <path
        d="M180,200 L180,160 C180,140 200,120 220,120 L300,120 C320,120 340,140 340,160 L340,240 C340,260 320,280 300,280 L290,280 L290,310 L260,280 L220,280 C200,280 180,260 180,240 Z"
        fill="#F5F5DC"
      />
      {/* Smile face */}
      <path
        d="M230,180 C240,180 240,190 230,190 C220,190 220,180 230,180 Z"
        fill="#4F7942"
      />
      <path
        d="M290,180 C300,180 300,190 290,190 C280,190 280,180 290,180 Z"
        fill="#4F7942"
      />
      <path
        d="M230,220 C250,240 270,240 290,220"
        stroke="#4F7942"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;