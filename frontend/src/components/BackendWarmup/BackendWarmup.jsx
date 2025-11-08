import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Backend Warmup Component
 * Shows a loading message during Render cold start
 */
const BackendWarmup = ({ children }) => {
  const [isWarming, setIsWarming] = useState(false);
  const [warmupTime, setWarmupTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isWarming) {
      timer = setInterval(() => {
        setWarmupTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWarming]);

  // Expose method to show warmup screen
  useEffect(() => {
    window.showBackendWarmup = () => {
      setIsWarming(true);
      setWarmupTime(0);
    };
    window.hideBackendWarmup = () => {
      setIsWarming(false);
      setWarmupTime(0);
    };
  }, []);

  if (!isWarming) {
    return children;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 flex items-center justify-center z-50">
      <div className="text-center space-y-6 p-8">
        {/* Animated Logo/Spinner */}
        <div className="flex justify-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Waking up the server...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This may take up to 30 seconds on first load
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Time elapsed: {warmupTime}s
          </p>
        </div>

        {/* Progress indicator */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((warmupTime / 30) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Tip */}
        <p className="text-xs text-gray-500 dark:text-gray-500 max-w-md">
          💡 Tip: The server sleeps after 15 minutes of inactivity (free tier limitation).
          Subsequent requests will be instant!
        </p>
      </div>
    </div>
  );
};

export default BackendWarmup;
