import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const NotFound = () => {
  useScrollAnimation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="text-center relative z-10 max-w-2xl">
        {/* 404 Number */}
        <div className="scroll-animate mb-8">
          <h1 className="text-9xl md:text-[12rem] font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Alert Icon */}
        <div className="scroll-animate inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6" style={{transitionDelay: '100ms'}}>
          <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <h2 className="scroll-animate text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4" style={{transitionDelay: '200ms'}}>
          Page Not Found
        </h2>
        
        {/* Description */}
        <p className="scroll-animate text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto" style={{transitionDelay: '300ms'}}>
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        {/* Go Home Button */}
        <Link 
          to="/" 
          className="scroll-animate group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          style={{transitionDelay: '400ms'}}
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Go Home</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        {/* Additional Help Text */}
        <p className="scroll-animate text-sm text-gray-500 dark:text-gray-500 mt-8" style={{transitionDelay: '500ms'}}>
          Need help? <Link to="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Go to Dashboard</Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
