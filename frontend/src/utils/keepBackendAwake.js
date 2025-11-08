/**
 * Keep Backend Awake Service
 * Pings the backend every 10 minutes to prevent Render cold starts
 */

const BACKEND_HEALTH_URL = import.meta.env.VITE_API_URL?.replace('/api', '/health') || 'http://localhost:5001/health';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

let pingInterval = null;

/**
 * Ping the backend health endpoint
 */
const pingBackend = async () => {
  try {
    const response = await fetch(BACKEND_HEALTH_URL, {
      method: 'GET',
      cache: 'no-cache',
    });
    
    if (response.ok) {
      console.log('🔄 Backend keepalive ping successful');
    }
  } catch (error) {
    // Silently fail - don't spam console with errors
    console.debug('Backend ping failed (this is normal if offline)');
  }
};

/**
 * Start the keepalive service
 */
export const startKeepAlive = () => {
  // Only run in production
  if (import.meta.env.DEV) {
    console.log('⏸️ Backend keepalive disabled in development');
    return;
  }

  // Ping immediately on start
  pingBackend();

  // Set up interval to ping every 10 minutes
  if (!pingInterval) {
    pingInterval = setInterval(pingBackend, PING_INTERVAL);
    console.log('✅ Backend keepalive service started (pings every 10 minutes)');
  }
};

/**
 * Stop the keepalive service
 */
export const stopKeepAlive = () => {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
    console.log('⏹️ Backend keepalive service stopped');
  }
};

// Auto-start when module is imported
if (!import.meta.env.DEV) {
  startKeepAlive();
}

export default {
  start: startKeepAlive,
  stop: stopKeepAlive,
};
