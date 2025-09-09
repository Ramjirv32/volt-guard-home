const EnergyData = require('../models/EnergyData');
const Device = require('../models/Device');

// Get energy data
const getEnergyData = async (req, res) => {
  try {
    const { period = 'hourly' } = req.query;
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
    switch (period) {
      case 'hourly':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case 'daily':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - 12);
        break;
    }

    const energyData = await EnergyData.find({
      userId,
      period,
      timestamp: { $gte: startDate }
    }).sort({ timestamp: -1 }).limit(100);

    res.json(energyData);
  } catch (error) {
    console.error('Get energy data error:', error);
    res.status(500).json({ message: 'Failed to fetch energy data' });
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
      userId, 
      status: 'on' 
    });
    
    // Calculate total current usage
    const totalUsage = devices.reduce((sum, device) => sum + device.powerUsage, 0);
    
    res.json({ 
      usage: totalUsage / 1000, // Convert watts to kW
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get current usage error:', error);
    res.status(500).json({ message: 'Failed to fetch current usage' });
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
      period: 'hourly'
    });
    
    await energyData.save();
    
    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`user_${device.userId}`).emit('energyUpdate', {
      type: 'energyUpdate',
      payload: {
        currentUsage: power,
        energyData: energyData
      }
    });
    
    res.json({ 
      message: 'Energy data recorded',
      data: energyData 
    });
  } catch (error) {
    console.error('Record energy data error:', error);
    res.status(500).json({ message: 'Failed to record energy data' });
  }
};

// Get energy statistics
const getEnergyStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;
    
    const query = { userId };
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const stats = await EnergyData.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalUsage: { $sum: '$totalUsage' },
          totalCost: { $sum: '$cost' },
          avgUsage: { $avg: '$totalUsage' },
          maxUsage: { $max: '$totalUsage' },
          minUsage: { $min: '$totalUsage' }
        }
      }
    ]);
    
    res.json(stats[0] || {
      totalUsage: 0,
      totalCost: 0,
      avgUsage: 0,
      maxUsage: 0,
      minUsage: 0
    });
  } catch (error) {
    console.error('Get energy stats error:', error);
    res.status(500).json({ message: 'Failed to fetch energy statistics' });
  }
};

module.exports = {
  getEnergyData,
  getCurrentUsage,
  recordEnergyData,
  getEnergyStats
};