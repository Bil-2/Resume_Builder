import { useEffect, useState } from 'react';

/**
 * Custom hook for animating numbers counting up
 * @param {number} end - The final number to count to
 * @param {number} duration - Duration in milliseconds (default: 1000)
 * @param {number} start - Starting number (default: 0)
 */
const useCountUp = (end, duration = 1000, start = 0) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (end === start) return;

    const startTime = Date.now();
    const difference = end - start;

    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuad = (t) => t * (2 - t);
      const currentCount = start + difference * easeOutQuad(progress);

      setCount(Math.floor(currentCount));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration, start]);

  return count;
};

export default useCountUp;
