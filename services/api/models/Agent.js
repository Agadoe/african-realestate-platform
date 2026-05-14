const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  agencyName: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  commissionRate: {
    type: Number,
    required: true,
    default: 5.0,
    min: 0,
    max: 20
  },
  responseTimeMinutes: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  specialties: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true
  }],
  serviceAreas: [{
    city: String,
    region: String
  }],
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  website: String,
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['license', 'id', 'certificate', 'other']
    },
    url: String,
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  availability: {
    monday: {
      start: String, // e.g., "09:00"
      end: String   // e.g., "17:00"
    },
    tuesday: {
      start: String,
      end: String
    },
    wednesday: {
      start: String,
      end: String
    },
    thursday: {
      start: String,
      end: String
    },
    friday: {
      start: String,
      end: String
    },
    saturday: {
      start: String,
      end: String
    },
    sunday: {
      start: String,
      end: String
    }
  },
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
agentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for searching
agentSchema.index({ agencyName: 1 });
agentSchema.index({ rating: -1 });
agentSchema.index({ verificationStatus: 1 });
agentSchema.index({ 'serviceAreas.city': 1 });

module.exports = mongoose.model('Agent', agentSchema);