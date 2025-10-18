/**
 * Simple in-memory cache middleware for faster API responses
 * For production, consider using Redis
 */

const cache = new Map();
const CACHE_DURATION = 60 * 1000; // 1 minute in milliseconds

/**
 * Cache middleware
 * @param {number} duration - Cache duration in seconds (default: 60)
 */
export const cacheMiddleware = (duration = 60) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL and query params
    const cacheKey = `${req.originalUrl || req.url}`;

    // Check if cached response exists
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
      const { data, timestamp } = cachedResponse;
      const age = Date.now() - timestamp;

      // Check if cache is still valid
      if (age < duration * 1000) {
        console.log(`📦 Cache HIT: ${cacheKey}`);
        return res.json(data);
      } else {
        // Cache expired, remove it
        cache.delete(cacheKey);
      }
    }

    // Store original res.json function
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = function(data) {
      // Cache the response
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      console.log(`💾 Cache MISS: ${cacheKey} - Cached for ${duration}s`);

      // Call original json function
      return originalJson(data);
    };

    next();
  };
};

/**
 * Clear cache for specific pattern
 * @param {string} pattern - URL pattern to clear
 */
export const clearCache = (pattern) => {
  let cleared = 0;
  
  for (const [key] of cache) {
    if (key.includes(pattern)) {
      cache.delete(key);
      cleared++;
    }
  }

  console.log(`🗑️  Cleared ${cleared} cache entries matching: ${pattern}`);
  return cleared;
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  const size = cache.size;
  cache.clear();
  console.log(`🗑️  Cleared all ${size} cache entries`);
  return size;
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return {
    size: cache.size,
    entries: Array.from(cache.keys()),
  };
};

// Clear expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  let cleared = 0;

  for (const [key, value] of cache) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
      cleared++;
    }
  }

  if (cleared > 0) {
    console.log(`🧹 Auto-cleared ${cleared} expired cache entries`);
  }
}, 5 * 60 * 1000);

export default cacheMiddleware;
