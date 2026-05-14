const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'villa', 'land', 'commercial', 'penthouse', 'townhouse']
  },
  listingType: {
    type: String,
    required: true,
    enum: ['sale', 'rent', 'rent-to-own']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'GHS' // Ghanaian Cedi
  },
  bedrooms: {
    type: Number,
    min: 0
  },
  bathrooms: {
    type: Number,
    min: 0
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  areaUnit: {
    type: String,
    default: 'sqm', // Square meters
    enum: ['sqm', 'sqft']
  },
  yearBuilt: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  },
  condition: {
    type: String,
    enum: ['new', 'excellent', 'good', 'fair', 'poor']
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'Ghana'
    },
    postalCode: String,
    coordinates: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    }
  },
  features: [{
    type: String,
    trim: true
  }],
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  videos: [{
    url: String,
    caption: String
  }],
  virtualTours: [{
    url: String,
    caption: String
  }],
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make agentId optional to support owner listings
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // ownerId is always required
  },
  neighborhoodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Neighborhood'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'sold', 'rented', 'withdrawn'],
    default: 'pending'
  },
  listingScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  inquiries: {
    type: Number,
    default: 0,
    min: 0
  },
  seoMetadata: {
    title: String,
    description: String,
    keywords: [String]
  },
  publishedAt: Date,
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
propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for ownership queries
propertySchema.index({ ownerId: 1 });

// Index for searching
propertySchema.index({ title: 'text', description: 'text' });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ listingType: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ 'address.city': 1 });
propertySchema.index({ 'address.region': 1 });
propertySchema.index({ agentId: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ listingScore: -1 });

module.exports = mongoose.model('Property', propertySchema);