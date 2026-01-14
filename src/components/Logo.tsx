import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  linkTo?: string;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'w-8 h-8 rounded-lg',
    text: 'text-base'
  },
  md: {
    container: 'w-10 h-10 rounded-xl',
    text: 'text-lg'
  },
  lg: {
    container: 'w-12 h-12 rounded-xl',
    text: 'text-2xl'
  },
  xl: {
    container: 'w-16 h-16 rounded-2xl',
    text: 'text-3xl'
  }
};

// Custom PDF with Q icon (matches favicon)
const PDFQuestIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Document shape */}
    <path 
      d="M3 2 C3 0.895431 3.89543 0 5 0 L20 0 L29 9 L29 34 C29 35.1046 28.1046 36 27 36 L5 36 C3.89543 36 3 35.1046 3 34 L3 2 Z" 
      fill="white" 
      fillOpacity="0.95"
      stroke="white"
      strokeWidth="0.5"
      strokeOpacity="0.3"
    />
    {/* Corner fold */}
    <path 
      d="M20 0 L20 7 C20 8.10457 20.8954 9 22 9 L29 9 L20 0 Z" 
      fill="rgba(229, 231, 235, 0.8)"
    />
    
    {/* Q letter - circle */}
    <circle 
      cx="16" 
      cy="19" 
      r="5.5" 
      stroke="#14B8A6" 
      strokeWidth="2.2" 
      fill="none" 
      strokeLinecap="round"
    />
    {/* Q letter - tail */}
    <line 
      x1="19.5" 
      y1="22.5" 
      x2="22" 
      y2="25" 
      stroke="#14B8A6" 
      strokeWidth="2.2" 
      strokeLinecap="round"
    />
  </svg>
);

export const Logo = ({ size = 'md', showText = true, linkTo, className = '' }: LogoProps) => {
  const config = sizeConfig[size];
  
  const logoContent = (
    <div className={`flex items-center space-x-3 group cursor-pointer ${className}`}>
      <div className={`${config.container} bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:shadow-teal-500/40 transition-all duration-300 group-hover:scale-110`}>
        <PDFQuestIcon className={size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : size === 'lg' ? 'w-6 h-6' : 'w-8 h-8'} />
      </div>
      {showText && (
        <span className={`${config.text} font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-emerald-800 dark:from-white dark:via-teal-200 dark:to-emerald-200 bg-clip-text text-transparent`}>
          PDF Quest Hub
        </span>
      )}
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{logoContent}</Link>;
  }

  return logoContent;
};
