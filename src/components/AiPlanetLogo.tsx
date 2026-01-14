import React from 'react';

interface AiPlanetLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const AiPlanetLogo = ({ size = 'md', showText = true }: AiPlanetLogoProps) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {/* Base container */}
        <div className={`${sizeClasses[size]} rounded-full`}></div>
        
        {/* Green outer strip - exactly 2px */}
        <div className="absolute inset-0 rounded-full border-[2px] border-[#00B86B]"></div>
        
        {/* White middle strip - exactly 2px */}
        <div className="absolute top-[2px] left-[2px] right-[2px] bottom-[2px] rounded-full border-[2px] border-white dark:border-white"></div>
        
        {/* Green inner circle with ai text */}
        <div className="absolute top-[4px] left-[4px] right-[4px] bottom-[4px] bg-[#00B86B] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-base">ai</span>
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-black dark:text-white text-xl">planet</span>
          <div className="flex items-center text-[10px] -mt-1">
            <span className="text-black dark:text-gray-300">formerly </span>
            <span className="text-[#00B86B] font-medium ml-[1px]">DPhi</span>
          </div>
        </div>
      )}
    </div>
  );
};
