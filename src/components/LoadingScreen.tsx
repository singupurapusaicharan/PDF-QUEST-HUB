interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 flex items-center justify-center z-50">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-teal-500/5 via-transparent to-transparent"></div>
      
      <div className="relative flex flex-col items-center space-y-8">
        {/* Premium logo with subtle pulse */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 -m-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 blur-xl animate-pulse-gentle"></div>
          </div>
          
          {/* Logo container */}
          <div className="relative w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-500/25">
            {/* PDF icon with subtle animation */}
            <svg viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
              <path 
                d="M3 2 C3 0.895431 3.89543 0 5 0 L20 0 L29 9 L29 34 C29 35.1046 28.1046 36 27 36 L5 36 C3.89543 36 3 35.1046 3 34 L3 2 Z" 
                fill="white" 
                fillOpacity="0.95"
              />
              <path 
                d="M20 0 L20 7 C20 8.10457 20.8954 9 22 9 L29 9 L20 0 Z" 
                fill="rgba(229, 231, 235, 0.8)"
              />
              <circle 
                cx="16" 
                cy="19" 
                r="5.5" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                fill="none" 
                strokeLinecap="round"
                className="text-teal-500"
              />
              <line 
                x1="19.5" 
                y1="22.5" 
                x2="22" 
                y2="25" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round"
                className="text-teal-500"
              />
            </svg>
          </div>
        </div>

        {/* Elegant text with fade-in */}
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-fade-in-up">
            {message}
          </p>
          
          {/* Minimal progress dots */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce-gentle"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
