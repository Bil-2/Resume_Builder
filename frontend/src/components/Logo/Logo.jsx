import { FileText } from 'lucide-react';

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizes[size]} bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden`}>
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Icon */}
        <FileText 
          size={iconSizes[size]} 
          className="text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" 
        />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${textSizes[size]} font-bold text-gray-900 dark:text-white tracking-tight`}>
            Resume
          </span>
          <span className={`text-xs font-medium text-blue-600 dark:text-blue-400 -mt-0.5`}>
            Builder
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
