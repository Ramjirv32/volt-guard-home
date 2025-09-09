const mongoose = require('mongoose');

const energyDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  totalUsage: {
    type: Number,
    required: true // in kWh
  },
  deviceBreakdown: [{
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device'
    },
    deviceName: String,
    usage: Number // in kWh
  }],
  cost: {
    type: Number,
    default: 0 // in user's currency
  },
  period: {
    type: String,
    enum: ['hourly', 'daily', 'monthly'],
    default: 'hourly'
  },
  voltage: Number,
  current: Number,
  powerFactor: Number,
  frequency: Number
});

// Index for efficient time-series queries
energyDataSchema.index({ userId: 1, timestamp: -1 });
energyDataSchema.index({ userId: 1, period: 1, timestamp: -1 });

module.exports = mongoose.model('EnergyData', energyDataSchema);