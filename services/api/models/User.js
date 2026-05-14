const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false // Don't include in queries by default
  },
  role: {
    type: String,
    enum: ['buyer', 'agent', 'admin', 'owner'],
    default: 'buyer'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  address: {
    street: String,
    city: String,
    region: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  preferences: {
    preferredListingType: {
      type: String,
      enum: ['sale', 'rent', 'rent-to-own'],
      default: 'sale'
    },
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    }
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  viewedProperties: [{
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  searchHistory: [{
    query: String,
    filters: Object,
    timestamp: {
      type: Date,
      default: Date.now
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
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for email
userSchema.index({ email: 1 });

// Index for role
userSchema.index({ role: 1 });

// Index for favorites
userSchema.index({ favorites: 1 });

module.exports = mongoose.model('User', userSchema);