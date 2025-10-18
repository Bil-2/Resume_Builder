import { useState, useEffect } from 'react';

/**
 * Custom hook to detect screen size and device type
 * @returns {Object} - Screen size information
 */
const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Initial call
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Breakpoints (matching Tailwind defaults)
  const isMobile = screenSize.width < 768; // < md
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024; // md to lg
  const isDesktop = screenSize.width >= 1024; // >= lg
  const isLargeDesktop = screenSize.width >= 1280; // >= xl

  // Device orientation
  const isPortrait = screenSize.height > screenSize.width;
  const isLandscape = screenSize.width > screenSize.height;

  return {
    width: screenSize.width,
    height: screenSize.height,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isPortrait,
    isLandscape,
    // Convenience flags
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop,
  };
};

export default useResponsive;
