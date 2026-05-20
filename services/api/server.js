const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { helmetConfig, apiLimiter, authLimiter, uploadLimiter, validateEnvironment } = require('./middleware/security');

// Validate environment at startup
validateEnvironment();

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Apply Helmet security headers
app.use(helmetConfig);

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Whitelist of allowed origins
const CORS_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (CORS_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS policy violation: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = require('./config/database');
connectDB();

// Startup logging
console.log(`[STARTUP] MongoDB URI: ${(process.env.MONGODB_URI || '').replace(/\/\/.*:.*@/, '//USER:PASS@')}`);
console.log(`[STARTUP] PORT: ${process.env.PORT}`);
console.log(`[STARTUP] NODE_ENV: ${process.env.NODE_ENV}`);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'African Real Estate API is running' });
});

// Property routes
app.use('/api/properties', require('./routes/properties'));

// Agent routes
app.use('/api/agents', require('./routes/agents'));

// Neighborhood routes
app.use('/api/neighborhoods', require('./routes/neighborhoods'));

// User routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Messaging routes
app.use('/api/messaging', require('./routes/messaging'));

// Analytics routes
app.use('/api/analytics', require('./routes/analytics'));

// AI routes
app.use('/api/ai', require('./routes/ai'));

// Payment routes
app.use('/api/payments', require('./routes/payments'));

// Upload routes (Cloudinary + multer)
app.use('/api/upload', require('./routes/upload'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`African Real Estate API server running on port ${PORT}`);
});

module.exports = app;