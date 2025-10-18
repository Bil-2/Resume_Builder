// PM2 Production Configuration
// This ensures your app NEVER crashes and auto-restarts if anything goes wrong

module.exports = {
  apps: [
    {
      name: 'resume-backend',
      script: './backend/server.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 5001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 3000,
      kill_timeout: 5000,
      restart_delay: 4000,
      exp_backoff_restart_delay: 100
    }
  ]
};
