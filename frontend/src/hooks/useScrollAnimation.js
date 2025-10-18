import { useEffect } from 'react';

/**
 * Custom hook to add scroll animations to elements
 * Usage: Add className="scroll-animate" to elements you want to animate
 */
const useScrollAnimation = (dependencies = []) => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    }, observerOptions);

    // Function to observe elements
    const observeElements = () => {
      const animateElements = document.querySelectorAll('.scroll-animate');
      animateElements.forEach(el => {
        if (!el.classList.contains('animate-visible')) {
          observer.observe(el);
        }
      });
    };

    // Initial observation
    observeElements();

    // Re-observe when DOM changes (for dynamic content)
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup
    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, dependencies);
};

export default useScrollAnimation;

// Export a global initializer for use in App.jsx
export const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
      }
    });
  }, observerOptions);

  const observeElements = () => {
    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(el => {
      if (!el.classList.contains('animate-visible')) {
        observer.observe(el);
      }
    });
  };

  observeElements();

  // Watch for DOM changes
  const mutationObserver = new MutationObserver(() => {
    observeElements();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  return () => {
    observer.disconnect();
    mutationObserver.disconnect();
  };
};
