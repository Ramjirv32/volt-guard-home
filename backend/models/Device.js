const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['light', 'thermostat', 'plug', 'sensor', 'camera', 'lock'],
    required: true
  },
  status: {
    type: String,
    enum: ['on', 'off', 'idle'],
    default: 'off'
  },
  powerUsage: {
    type: Number,
    default: 0 // in watts
  },
  location: {
    type: String,
    required: true
  },
  automationEnabled: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  sensorId: {
    type: String,
    sparse: true // For PZEM-004T or other sensor IDs
  },
  automationRules: [{
    trigger: {
      type: String,
      enum: ['time', 'idle', 'presence', 'energy']
    },
    condition: String,
    action: {
      type: String,
      enum: ['on', 'off', 'dim', 'notify']
    },
    enabled: Boolean
  }],
  metadata: {
    manufacturer: String,
    model: String,
    firmwareVersion: String,
    ipAddress: String
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

// Update timestamp on save
deviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
deviceSchema.index({ userId: 1, status: 1 });
deviceSchema.index({ sensorId: 1 });

module.exports = mongoose.model('Device', deviceSchema);