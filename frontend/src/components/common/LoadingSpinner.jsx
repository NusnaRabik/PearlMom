// frontend/src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-pink-100"></div>
        {/* Spinning ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-pink-600 border-r-pink-500 animate-spin`}></div>
      </div>
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-500 font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinnerContent}
    </div>
  );
};

// Small inline spinner for buttons
export const InlineSpinner = ({ className = '' }) => {
  return (
    <svg 
      className={`animate-spin h-4 w-4 ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Page loader with PearlMom branding
export const PageLoader = ({ text = 'Loading your sanctuary...' }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 to-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
          <span className="text-white font-bold text-2xl">PM</span>
        </div>
        
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-pink-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-600 animate-spin"></div>
        </div>
        
        {/* Text */}
        <p className="text-gray-600 font-medium text-sm animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;