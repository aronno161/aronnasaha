const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  page: {
    type: String,
    required: true,
    trim: true
  },
  referrer: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    trim: true
  }
});

// Index for efficient queries
visitorSchema.index({ timestamp: -1 });
visitorSchema.index({ page: 1, timestamp: -1 });

module.exports = mongoose.model('Visitor', visitorSchema);