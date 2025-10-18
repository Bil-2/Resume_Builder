import axios from 'axios';

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

/**
 * Sleep utility for delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
const getRetryDelay = (retryCount, baseDelay = RETRY_CONFIG.retryDelay) => {
  return baseDelay * Math.pow(2, retryCount);
};

/**
 * Check if error is retryable
 */
const isRetryableError = (error) => {
  if (!error.response) {
    // Network errors are retryable
    return true;
  }
  
  return RETRY_CONFIG.retryableStatuses.includes(error.response.status);
};

/**
 * Retry wrapper for API calls
 */
export const withRetry = async (
  fn,
  options = {}
) => {
  const {
    maxRetries = RETRY_CONFIG.maxRetries,
    retryDelay = RETRY_CONFIG.retryDelay,
    onRetry = null,
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if not retryable or last attempt
      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }

      // Calculate delay and wait
      const delay = getRetryDelay(attempt, retryDelay);
      
      if (onRetry) {
        onRetry(attempt + 1, delay, error);
      }

      await sleep(delay);
    }
  }

  throw lastError;
};

/**
 * Create cancellable request
 */
export const createCancellableRequest = () => {
  const source = axios.CancelToken.source();
  
  return {
    cancelToken: source.token,
    cancel: (message = 'Request cancelled') => source.cancel(message),
  };
};

/**
 * Check if error is a cancellation
 */
export const isCancelError = (error) => {
  return axios.isCancel(error);
};

/**
 * Network status detector
 */
export const isOnline = () => {
  return navigator.onLine;
};

/**
 * Wait for network to be online
 */
export const waitForOnline = () => {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve();
      return;
    }

    const handleOnline = () => {
      window.removeEventListener('online', handleOnline);
      resolve();
    };

    window.addEventListener('online', handleOnline);
  });
};

/**
 * Format error message for display
 */
export const formatErrorMessage = (error) => {
  if (isCancelError(error)) {
    return 'Request was cancelled';
  }

  if (!isOnline()) {
    return 'No internet connection. Please check your network.';
  }

  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data?.message || 'Invalid request. Please check your input.';
      case 401:
        return 'Session expired. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server error. Please try again later.';
      default:
        return data?.message || 'An unexpected error occurred.';
    }
  }

  if (error.request) {
    return 'No response from server. Please check your connection.';
  }

  return error.message || 'An unexpected error occurred.';
};

/**
 * Debounce function for auto-save
 */
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for rate limiting
 */
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default {
  withRetry,
  createCancellableRequest,
  isCancelError,
  isOnline,
  waitForOnline,
  formatErrorMessage,
  debounce,
  throttle,
};
