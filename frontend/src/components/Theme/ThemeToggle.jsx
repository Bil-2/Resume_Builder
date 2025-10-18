import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        relative p-2 rounded-lg
        bg-gray-100 dark:bg-dark-800
        hover:bg-gray-200 dark:hover:bg-dark-700
        transition-all duration-300
        group
      "
      aria-label="Toggle theme"
    >
      {/* Sun Icon (Light Mode) */}
      <Sun 
        className={`
          w-5 h-5 text-yellow-500
          transition-all duration-300
          ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}
        `}
      />
      
      {/* Moon Icon (Dark Mode) */}
      <Moon 
        className={`
          absolute inset-0 m-auto w-5 h-5 text-blue-400
          transition-all duration-300
          ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}
        `}
      />
    </button>
  );
};

export default ThemeToggle;
