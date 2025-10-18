import { Moon, Sun } from 'lucide-react';
import useThemeStore from '../../store/themeStore';
import { useEffect } from 'react';

const ThemeToggle = () => {
  const { theme, toggleTheme, initializeTheme } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group"
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {/* Sun Icon (visible in light mode) */}
      <Sun 
        className={`w-5 h-5 text-yellow-500 transition-all duration-300 ${
          theme === 'light' 
            ? 'rotate-0 scale-100 opacity-100' 
            : 'rotate-90 scale-0 opacity-0 absolute'
        }`}
      />
      
      {/* Moon Icon (visible in dark mode) */}
      <Moon 
        className={`w-5 h-5 text-blue-400 transition-all duration-300 ${
          theme === 'dark' 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0 absolute'
        }`}
      />
      
      {/* Hover effect ring */}
      <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all duration-300"></div>
    </button>
  );
};

export default ThemeToggle;
