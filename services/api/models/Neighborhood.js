const mongoose = require('mongoose');

const neighborhoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  region: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    default: 'Ghana',
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    type: {
      type: String,
      default: 'Polygon'
    },
    coordinates: {
      type: [[[Number]]], // Array of arrays of [longitude, latitude] pairs
      index: '2dsphere'
    },
    bounds: {
      northeast: {
        lat: Number,
        lng: Number
      },
      southwest: {
        lat: Number,
        lng: Number
      }
    }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  priceTrends: [{
    year: {
      type: Number,
      required: true
    },
    averagePrice: {
      type: Number,
      required: true
    },
    priceChange: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'GHS'
    }
  }],
  safetyScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  infrastructureScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  appreciationRate: {
    type: Number,
    default: 0
  },
  propertyCount: {
    type: Number,
    default: 0,
    min: 0
  },
  demographic: {
    population: Number,
    medianAge: Number,
    householdIncome: Number,
    educationLevel: String
  },
  transportation: [{
    type: String,
    trim: true
  }],
  schools: [{
    name: String,
    type: {
      type: String,
      enum: ['primary', 'secondary', 'tertiary']
    },
    rating: Number
  }],
  hospitals: [{
    name: String,
    type: {
      type: String,
      enum: ['public', 'private', 'clinic']
    }
  }],
  seoMetadata: {
    title: String,
    description: String,
    keywords: [String]
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
neighborhoodSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for searching
neighborhoodSchema.index({ name: 'text', description: 'text' });
neighborhoodSchema.index({ city: 1 });
neighborhoodSchema.index({ region: 1 });
neighborhoodSchema.index({ safetyScore: -1 });
neighborhoodSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Neighborhood', neighborhoodSchema);