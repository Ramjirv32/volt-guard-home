const EnergyData = require('../models/EnergyData');
const Device = require('../models/Device');
const mongoose = require('mongoose');

const getEnergyData = async (req, res) => {
  try {
    const { period = 'hourly', limit = 24 } = req.query;
    const userId = req.userId;
    
    // Demo data for viewer account
    if (userId === 'demo-viewer-id') {
      const now = new Date();
      const demoData = [];
      
      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now - i * 3600000);
        demoData.push({
          timestamp: timestamp.toISOString(),
          totalUsage: Math.random() * 10 + 5,
          deviceBreakdown: [
            { deviceId: 'demo-1', deviceName: 'Living Room Light', usage: Math.random() * 2 },
            { deviceId: 'demo-2', deviceName: 'Smart Thermostat', usage: Math.random() * 5 },
            { deviceId: 'demo-3', deviceName: 'Kitchen Plug', usage: Math.random() * 3 }
          ],
          cost: Math.random() * 5 + 2
        });
      }
      return res.json(demoData);
    }

    // Calculate date range based on period
    let startDate = new Date();
    let groupByFormat = '%Y-%m-%dT%H:00:00.000Z'; // Hourly default

    switch (period) {
      case 'hourly':
        startDate.setHours(startDate.getHours() - parseInt(limit));
        groupByFormat = '%Y-%m-%dT%H:00:00.000Z';
        break;
      case 'daily':
        startDate.setDate(startDate.getDate() - parseInt(limit));
        groupByFormat = '%Y-%m-%dT00:00:00.000Z';
        break;
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - parseInt(limit));
        groupByFormat = '%Y-%m-01T00:00:00.000Z';
        break;
    }

    // Use aggregation to get properly grouped data
    const energyData = await EnergyData.aggregate([
      { 
        $match: {
          userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId,
          timestamp: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: groupByFormat, date: '$timestamp' } }
          },
          totalUsage: { $sum: '$totalUsage' },
          cost: { $sum: '$cost' },
          deviceBreakdown: { 
            $push: {
              deviceId: '$deviceBreakdown.deviceId',
              deviceName: '$deviceBreakdown.deviceName',
              usage: '$deviceBreakdown.usage'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          timestamp: '$_id.date',
          totalUsage: 1,
          cost: 1,
          deviceBreakdown: { $slice: ['$deviceBreakdown', 1] }, // Take first entry for now
          count: 1
        }
      },
      { $sort: { timestamp: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Transform data to match expected format
    const formattedData = energyData.map(entry => ({
      timestamp: entry.timestamp,
      totalUsage: parseFloat(entry.totalUsage.toFixed(3)),
      cost: parseFloat(entry.cost.toFixed(2)),
      deviceBreakdown: entry.deviceBreakdown[0] || []
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Get energy data error:', error);
    res.status(500).json({ message: 'Failed to fetch energy data', error: error.message });
  }
};

// Get current usage
const getCurrentUsage = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Demo data for viewer account
    if (userId === 'demo-viewer-id') {
      return res.json({ 
        usage: Math.random() * 100 + 50,
        timestamp: new Date().toISOString()
      });
    }

    // Get all active devices
    const devices = await Device.find({ 
      userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId, 
      status: 'on' 
    });
    
    // Calculate total current usage
    const totalUsage = devices.reduce((sum, device) => sum + device.powerUsage, 0);
    
    // Get most recent energy data for trend analysis
    const recentData = await EnergyData.aggregate([
      { 
        $match: { 
          userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId 
        } 
      },
      { $sort: { timestamp: -1 } },
      { $limit: 2 },
      { 
        $group: {
          _id: null,
          current: { $first: '$totalUsage' },
          previous: { $last: '$totalUsage' }
        }
      }
    ]);

    // Calculate trend (percentage change)
    let trend = 0;
    if (recentData.length > 0 && recentData[0].previous > 0) {
      trend = ((recentData[0].current - recentData[0].previous) / recentData[0].previous) * 100;
    }
    
    res.json({ 
      usage: totalUsage / 1000, // Convert watts to kW
      timestamp: new Date().toISOString(),
      trend: parseFloat(trend.toFixed(2)),
      deviceCount: devices.length
    });
  } catch (error) {
    console.error('Get current usage error:', error);
    res.status(500).json({ message: 'Failed to fetch current usage', error: error.message });
  }
};

// Record energy data (from IoT sensors)
const recordEnergyData = async (req, res) => {
  try {
    const { sensorId, voltage, current, power, energy, powerFactor, frequency } = req.body;
    
    // Find device by sensor ID
    const device = await Device.findOne({ sensorId });
    if (!device) {
      return res.status(404).json({ message: 'Device with sensor ID not found' });
    }
    
    // Update device power usage
    device.powerUsage = power || 0;
    device.lastActive = Date.now();
    await device.save();
    
    // Calculate cost based on energy
    const kwhRate = 0.15; // $0.15 per kWh - ideally from user settings
    const cost = (energy || 0) * kwhRate;
    
    // Create energy data record
    const energyData = new EnergyData({
      userId: device.userId,
      totalUsage: energy || 0,
      deviceBreakdown: [{
        deviceId: device._id,
        deviceName: device.name,
        usage: energy || 0
      }],
      voltage,
      current,
      powerFactor,
      frequency,
      cost,
      period: 'hourly'
    });
    
    await energyData.save();
    
    res.json({ 
      message: 'Energy data recorded',
      data: energyData 
    });
  } catch (error) {
    console.error('Record energy data error:', error);
    res.status(500).json({ message: 'Failed to record energy data', error: error.message });
  }
};

// Get energy statistics
const getEnergyStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate, period = 'daily' } = req.query;
    
    // Demo data for viewer account
    if (userId === 'demo-viewer-id') {
      return res.json({
        totalUsage: 325.42,
        totalCost: 48.81,
        avgUsage: 10.85,
        maxUsage: 18.32,
        minUsage: 5.21,
        savings: 12.5,
        trend: -8.3
      });
    }
    
    // Set up date filters
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      // Default to last 30 days if no dates provided
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      dateFilter.timestamp = { $gte: thirtyDaysAgo };
    }
    
    // Query MongoDB
    const stats = await EnergyData.aggregate([
      { 
        $match: { 
          userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId,
          ...dateFilter
        } 
      },
      {
        $group: {
          _id: null,
          totalUsage: { $sum: '$totalUsage' },
          totalCost: { $sum: '$cost' },
          avgUsage: { $avg: '$totalUsage' },
          maxUsage: { $max: '$totalUsage' },
          minUsage: { $min: '$totalUsage' },
          recordCount: { $sum: 1 }
        }
      }
    ]);
    
    // Get previous period data for comparison
    let previousPeriodStart, previousPeriodEnd;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const duration = end - start;
      
      previousPeriodStart = new Date(start.getTime() - duration);
      previousPeriodEnd = new Date(start);
    } else {
      // Default to previous 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date();
      const sixtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      sixtyDaysAgo.setDate(today.getDate() - 60);
      
      previousPeriodStart = sixtyDaysAgo;
      previousPeriodEnd = thirtyDaysAgo;
    }
    
    const previousStats = await EnergyData.aggregate([
      { 
        $match: { 
          userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId,
          timestamp: { $gte: previousPeriodStart, $lt: previousPeriodEnd }
        } 
      },
      {
        $group: {
          _id: null,
          totalUsage: { $sum: '$totalUsage' },
          totalCost: { $sum: '$cost' }
        }
      }
    ]);
    
    // Calculate savings and trend
    let savings = 0;
    let trend = 0;
    
    if (previousStats.length > 0 && previousStats[0].totalCost > 0) {
      const currentCost = stats.length > 0 ? stats[0].totalCost : 0;
      savings = previousStats[0].totalCost - currentCost;
      
      if (previousStats[0].totalUsage > 0) {
        const currentUsage = stats.length > 0 ? stats[0].totalUsage : 0;
        trend = ((currentUsage - previousStats[0].totalUsage) / previousStats[0].totalUsage) * 100;
      }
    }
    
    // Create response object with defaults for empty results
    const result = stats.length > 0 ? {
      totalUsage: parseFloat(stats[0].totalUsage.toFixed(2)),
      totalCost: parseFloat(stats[0].totalCost.toFixed(2)),
      avgUsage: parseFloat(stats[0].avgUsage.toFixed(2)),
      maxUsage: parseFloat(stats[0].maxUsage.toFixed(2)),
      minUsage: parseFloat(stats[0].minUsage.toFixed(2)),
      recordCount: stats[0].recordCount,
      savings: parseFloat(savings.toFixed(2)),
      trend: parseFloat(trend.toFixed(1))
    } : {
      totalUsage: 0,
      totalCost: 0,
      avgUsage: 0,
      maxUsage: 0,
      minUsage: 0,
      recordCount: 0,
      savings: 0,
      trend: 0
    };
    
    res.json(result);
  } catch (error) {
    console.error('Get energy stats error:', error);
    res.status(500).json({ message: 'Failed to fetch energy statistics', error: error.message });
  }
};

// New endpoint to get device energy breakdown
const getDeviceBreakdown = async (req, res) => {
  try {
    const userId = req.userId;
    const { period = 'daily', limit = 5 } = req.query;
    
    // Demo data for viewer account
    if (userId === 'demo-viewer-id') {
      return res.json([
        { deviceId: 'demo-1', deviceName: 'Living Room Light', usage: 42.3, percentage: 12 },
        { deviceId: 'demo-2', deviceName: 'Smart Thermostat', usage: 103.5, percentage: 32 },
        { deviceId: 'demo-3', deviceName: 'Kitchen Plug', usage: 89.7, percentage: 28 },
        { deviceId: 'demo-4', deviceName: 'TV Plug', usage: 56.2, percentage: 17 },
        { deviceId: 'demo-5', deviceName: 'Bedroom Light', usage: 33.7, percentage: 11 }
      ]);
    }
    
    // Get start date based on period
    let startDate = new Date();
    switch (period) {
      case 'daily':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 1);
    }
    
    // Aggregate to get device breakdown
    const deviceBreakdown = await EnergyData.aggregate([
      { 
        $match: { 
          userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId,
          timestamp: { $gte: startDate }
        } 
      },
      { $unwind: '$deviceBreakdown' },
      {
        $group: {
          _id: { deviceId: '$deviceBreakdown.deviceId', deviceName: '$deviceBreakdown.deviceName' },
          usage: { $sum: '$deviceBreakdown.usage' }
        }
      },
      {
        $project: {
          _id: 0,
          deviceId: '$_id.deviceId',
          deviceName: '$_id.deviceName',
          usage: 1
        }
      },
      { $sort: { usage: -1 } },
      { $limit: parseInt(limit) }
    ]);
    
    // Calculate total usage for percentage
    const totalUsage = deviceBreakdown.reduce((sum, device) => sum + device.usage, 0);
    
    // Add percentage to each device
    const result = deviceBreakdown.map(device => ({
      ...device,
      usage: parseFloat(device.usage.toFixed(2)),
      percentage: totalUsage > 0 ? Math.round((device.usage / totalUsage) * 100) : 0
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Get device breakdown error:', error);
    res.status(500).json({ message: 'Failed to fetch device breakdown', error: error.message });
  }
};

module.exports = {
  getEnergyData,
  getCurrentUsage,
  recordEnergyData,
  getEnergyStats,
  getDeviceBreakdown
};