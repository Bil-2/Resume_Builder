import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import skillRoutes from './routes/skillRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Security middleware with Cross-Origin policies configured
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

// Enable CORS for all routes and forcefully handle OPTIONS preflight.
// Using explicit headers is more reliable in Vercel than the 'cors' package.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://resume-builder-biltu.netlify.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting - More permissive for development
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // Increased to 1000 requests
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development for localhost
    if (process.env.NODE_ENV === 'development') {
      return req.ip === '::1' || req.ip === '127.0.0.1' || req.ip === '::ffff:127.0.0.1';
    }
    return false;
  },
});

app.use('/api/', limiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/skills', skillRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Resume Builder & Career Ecosystem API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      resumes: '/api/resumes',
      projects: '/api/projects',
      courses: '/api/courses',
      achievements: '/api/achievements',
      skills: '/api/skills'
    },
    documentation: 'See README.md for API documentation'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server (only if not running in a Vercel serverless environment)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  const server = app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🚀 Resume Builder & Career Ecosystem API                ║
  ║                                                           ║
  ║   Server running in ${process.env.NODE_ENV || 'development'} mode                      ║
  ║   Port: ${PORT}                                            ║
  ║   URL: http://localhost:${PORT}                            ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
    `);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
} else {
  // Unhandled error handlers for Vercel environment
  process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
  });

  process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
  });
}

export default app;
