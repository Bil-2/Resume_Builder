/**
 * Responsive Design Verification Utility
 * Run this in console to check responsive design implementation
 */

export const verifyResponsive = () => {
  console.log('📱 RESPONSIVE DESIGN VERIFICATION');
  console.log('=====================================\n');

  // Get viewport dimensions
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Determine breakpoint
  let breakpoint = 'Mobile';
  if (width >= 1536) breakpoint = '2XL Desktop';
  else if (width >= 1280) breakpoint = 'XL Desktop';
  else if (width >= 1024) breakpoint = 'Desktop (lg)';
  else if (width >= 768) breakpoint = 'Tablet (md)';
  else if (width >= 640) breakpoint = 'Large Mobile (sm)';

  console.log(`📏 Viewport: ${width}x${height}`);
  console.log(`📱 Current Breakpoint: ${breakpoint}\n`);

  // Check for horizontal scroll
  const hasHorizontalScroll = document.body.scrollWidth > document.body.clientWidth;
  console.log(`${hasHorizontalScroll ? '❌' : '✅'} Horizontal Scroll: ${hasHorizontalScroll ? 'DETECTED (BAD)' : 'None (GOOD)'}\n`);

  // Check responsive classes
  const elementsWithResponsive = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]');
  console.log(`✅ Elements with responsive classes: ${elementsWithResponsive.length}\n`);

  // Check common responsive patterns
  const patterns = {
    'Responsive Grids': document.querySelectorAll('[class*="grid-cols"]').length,
    'Flex Layouts': document.querySelectorAll('[class*="flex-"]').length,
    'Responsive Text': document.querySelectorAll('[class*="text-"][class*="md:text-"]').length,
    'Responsive Padding': document.querySelectorAll('[class*="p-"][class*="md:p-"]').length,
    'Hidden Elements': document.querySelectorAll('[class*="hidden"][class*="lg:block"], [class*="block"][class*="lg:hidden"]').length,
  };

  console.log('📊 RESPONSIVE PATTERNS FOUND:\n');
  Object.entries(patterns).forEach(([name, count]) => {
    console.log(`  ${count > 0 ? '✅' : '⚠️ '} ${name}: ${count}`);
  });

  // Check touch targets (buttons should be ≥44x44px on mobile)
  console.log('\n👆 TOUCH TARGET SIZES (Mobile):\n');
  if (width < 768) {
    const buttons = document.querySelectorAll('button, a.btn, [role="button"]');
    let smallTargets = 0;
    
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        smallTargets++;
      }
    });
    
    if (smallTargets > 0) {
      console.log(`  ⚠️  ${smallTargets} buttons below 44x44px (may be hard to tap)`);
    } else {
      console.log(`  ✅ All buttons are ≥44x44px (good for touch)`);
    }
  } else {
    console.log(`  ℹ️  Touch target check only runs on mobile (<768px)`);
  }

  // Check for fixed max-width containers
  const containers = document.querySelectorAll('[class*="max-w"]');
  console.log(`\n📦 Max-width containers: ${containers.length}`);

  // Check images
  const images = document.querySelectorAll('img');
  let responsiveImages = 0;
  images.forEach(img => {
    if (img.classList.contains('w-full') || img.style.maxWidth === '100%') {
      responsiveImages++;
    }
  });
  console.log(`🖼️  Responsive images: ${responsiveImages}/${images.length}`);

  // Breakpoint guide
  console.log('\n📏 TAILWIND BREAKPOINTS:');
  console.log('  Default: 0px-639px    (Mobile)');
  console.log('  sm:     640px+        (Large Mobile)');
  console.log('  md:     768px+        (Tablet)');
  console.log('  lg:     1024px+       (Desktop)');
  console.log('  xl:     1280px+       (Large Desktop)');
  console.log('  2xl:    1536px+       (XL Desktop)');

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:\n');
  
  if (hasHorizontalScroll) {
    console.log('  ⚠️  Fix horizontal scroll - check for oversized elements');
  }
  
  if (width < 768 && patterns['Hidden Elements'] === 0) {
    console.log('  ℹ️  Consider hiding/showing elements based on screen size');
  }
  
  if (patterns['Responsive Text'] < 10) {
    console.log('  ℹ️  Consider adding responsive text sizes (md:text-*, lg:text-*)');
  }

  console.log('\n=====================================');
  console.log('🎉 VERIFICATION COMPLETE!');
  
  return {
    breakpoint,
    width,
    height,
    hasHorizontalScroll,
    responsiveElements: elementsWithResponsive.length,
    patterns,
    status: !hasHorizontalScroll ? 'PASS' : 'NEEDS ATTENTION',
  };
};

// Responsive breakpoint detector
export const getBreakpoint = () => {
  const width = window.innerWidth;
  if (width >= 1536) return '2xl';
  if (width >= 1280) return 'xl';
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  if (width >= 640) return 'sm';
  return 'mobile';
};

// Watch for breakpoint changes
export const watchBreakpoints = (callback) => {
  let currentBreakpoint = getBreakpoint();
  
  const checkBreakpoint = () => {
    const newBreakpoint = getBreakpoint();
    if (newBreakpoint !== currentBreakpoint) {
      currentBreakpoint = newBreakpoint;
      callback(newBreakpoint);
    }
  };
  
  window.addEventListener('resize', checkBreakpoint);
  
  return () => window.removeEventListener('resize', checkBreakpoint);
};

// Make available globally
if (typeof window !== 'undefined') {
  window.verifyResponsive = verifyResponsive;
  window.getBreakpoint = getBreakpoint;
  window.watchBreakpoints = watchBreakpoints;
  console.log('💡 Run window.verifyResponsive() to check responsive design');
}

export default verifyResponsive;
