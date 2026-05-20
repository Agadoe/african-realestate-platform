const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Joi = require('joi');

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs for auth
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for upload endpoints
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 uploads per hour
  message: { error: 'Too many upload requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helmet configuration for security headers
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      connectSrc: ["'self'", "https://api.mapbox.com", "https://events.mapbox.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https:", "blob:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Request validation schemas
const validationSchemas = {
  // Auth validation schemas
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  register: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/).optional(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('buyer', 'owner', 'agent').default('buyer'),
  }),

  // Property validation schemas
  createProperty: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).max(5000).required(),
    propertyType: Joi.string().valid('apartment', 'house', 'villa', 'land', 'commercial', 'penthouse', 'townhouse').required(),
    listingType: Joi.string().valid('sale', 'rent', 'rent-to-own').required(),
    price: Joi.number().positive().required(),
    currency: Joi.string().valid('GHS', 'USD').default('GHS'),
    bedrooms: Joi.number().integer().min(0).optional(),
    bathrooms: Joi.number().integer().min(0).optional(),
    area: Joi.number().positive().required(),
    areaUnit: Joi.string().valid('sqm', 'sqft').default('sqm'),
    yearBuilt: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
    condition: Joi.string().valid('new', 'excellent', 'good', 'fair', 'poor').optional(),
    features: Joi.array().items(Joi.string()).optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      caption: Joi.string().optional(),
      isPrimary: Joi.boolean().optional(),
    })).optional(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      region: Joi.string().required(),
      country: Joi.string().default('Ghana'),
      postalCode: Joi.string().optional(),
      coordinates: Joi.object({
        type: Joi.string().valid('Point').optional(),
        coordinates: Joi.array().items(Joi.number()).length(2).optional(),
      }).optional(),
    }).required(),
  }),
  updateProperty: Joi.object({
    title: Joi.string().min(5).max(200).optional(),
    description: Joi.string().min(10).max(5000).optional(),
    propertyType: Joi.string().valid('apartment', 'house', 'villa', 'land', 'commercial', 'penthouse', 'townhouse').optional(),
    listingType: Joi.string().valid('sale', 'rent', 'rent-to-own').optional(),
    price: Joi.number().positive().optional(),
    currency: Joi.string().valid('GHS', 'USD').optional(),
    bedrooms: Joi.number().integer().min(0).optional(),
    bathrooms: Joi.number().integer().min(0).optional(),
    area: Joi.number().positive().optional(),
    areaUnit: Joi.string().valid('sqm', 'sqft').optional(),
    yearBuilt: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
    condition: Joi.string().valid('new', 'excellent', 'good', 'fair', 'poor').optional(),
    features: Joi.array().items(Joi.string()).optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.object({
      url: Joi.string().uri().required(),
      caption: Joi.string().optional(),
      isPrimary: Joi.boolean().optional(),
    })).optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      region: Joi.string().optional(),
      country: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      coordinates: Joi.object({
        type: Joi.string().valid('Point').optional(),
        coordinates: Joi.array().items(Joi.number()).length(2).optional(),
      }).optional(),
    }).optional(),
    status: Joi.string().valid('active', 'pending', 'sold', 'rented', 'withdrawn').optional(),
  }),

  // User validation schemas
  updateUser: Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/).optional(),
  }),

  // Favorite validation schemas
  addFavorite: Joi.object({
    propertyId: Joi.string().required(),
  }),

  // Upload validation
  deleteImage: Joi.object({
    public_id: Joi.string().required(),
  }),
};

// Validation middleware factory
const validateRequest = (schemaName, source = 'body') => {
  return (req, res, next) => {
    const schema = validationSchemas[schemaName];
    if (!schema) {
      return next();
    }

    const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
    const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    // Replace with validated and sanitized data
    if (source === 'body') {
      req.body = value;
    }
    next();
  };
};

// Environment validation at startup
const validateEnvironment = () => {
  const required = ['JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }

  // Warn about weak configurations in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      console.warn('Warning: JWT_SECRET should be at least 32 characters for production');
    }
  }
};

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  helmetConfig,
  validationSchemas,
  validateRequest,
  validateEnvironment,
};