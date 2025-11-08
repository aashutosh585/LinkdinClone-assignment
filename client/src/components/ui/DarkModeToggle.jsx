import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const DarkModeToggle = ({ className = '', size = 'md' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center rounded-full
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-twitter-blue focus:ring-offset-2
        ${sizeClasses[size]}
        ${isDarkMode 
          ? 'bg-dark-secondary hover:bg-dark-tertiary border border-dark-border' 
          : 'bg-light-secondary hover:bg-light-tertiary border border-light-border'
        }
        ${className}
      `}
      style={{
        backgroundColor: isDarkMode ? 'var(--bg-secondary)' : 'var(--bg-secondary)',
        borderColor: isDarkMode ? 'var(--border-primary)' : 'var(--border-primary)',
      }}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Background gradient effect */}
      <div className={`
        absolute inset-0 rounded-full transition-all duration-500
        ${isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' 
          : 'bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50'
        }
      `} />
      
      {/* Icon container */}
      <div className="relative z-10">
        {/* Sun Icon */}
        <Sun 
          className={`
            absolute inset-0 transition-all duration-500 ease-in-out
            ${iconSizes[size]}
            ${isDarkMode 
              ? 'opacity-0 scale-0 rotate-180 text-yellow-400' 
              : 'opacity-100 scale-100 rotate-0 text-yellow-600'
            }
          `}
        />
        
        {/* Moon Icon */}
        <Moon 
          className={`
            absolute inset-0 transition-all duration-500 ease-in-out
            ${iconSizes[size]}
            ${isDarkMode 
              ? 'opacity-100 scale-100 rotate-0 text-blue-300' 
              : 'opacity-0 scale-0 -rotate-180 text-blue-600'
            }
          `}
        />
      </div>

      {/* Animated glow effect */}
      <div className={`
        absolute inset-0 rounded-full transition-all duration-300
        ${isDarkMode 
          ? 'shadow-lg shadow-blue-500/20' 
          : 'shadow-lg shadow-yellow-500/20'
        }
        opacity-0 hover:opacity-100
      `} />
    </button>
  );
};

export default DarkModeToggle;