const mongoose = require('mongoose');

const verificationTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  purpose: {
    type: String,
    required: true,
    enum: ['admin_login']
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
  },
  used: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
verificationTokenSchema.index({ token: 1 });

// Clean up expired tokens
verificationTokenSchema.statics.cleanupExpired = async function() {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);