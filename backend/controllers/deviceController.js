const Device = require('../models/Device');
const EnergyData = require('../models/EnergyData');

// Get all devices for user
const getDevices = async (req, res) => {
  try {
    // Demo data for viewer account
    if (req.userId === 'demo-viewer-id') {
      const demoDevices = [
        {
          id: 'demo-1',
          _id: 'demo-1',
          name: 'Living Room Light',
          type: 'light',
          status: 'on',
          powerUsage: 60,
          location: 'Living Room',
          automationEnabled: true,
          lastActive: new Date().toISOString(),
          sensorId: 'PZEM-001'
        },
        {
          id: 'demo-2',
          _id: 'demo-2',
          name: 'Smart Thermostat',
          type: 'thermostat',
          status: 'on',
          powerUsage: 150,
          location: 'Hallway',
          automationEnabled: true,
          lastActive: new Date().toISOString(),
          sensorId: 'PZEM-002'
        },
        {
          id: 'demo-3',
          _id: 'demo-3',
          name: 'Kitchen Plug',
          type: 'plug',
          status: 'idle',
          powerUsage: 5,
          location: 'Kitchen',
          automationEnabled: false,
          lastActive: new Date(Date.now() - 3600000).toISOString(),
          sensorId: 'PZEM-003'
        }
      ];
      return res.json(demoDevices);
    }

    const devices = await Device.find({ userId: req.userId });
    res.json(devices);
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ message: 'Failed to fetch devices' });
  }
};

// Get single device
const getDevice = async (req, res) => {
  try {
    const device = await Device.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    res.json(device);
  } catch (error) {
    console.error('Get device error:', error);
    res.status(500).json({ message: 'Failed to fetch device' });
  }
};

// Create new device
const createDevice = async (req, res) => {
  try {
    const device = new Device({
      ...req.body,
      userId: req.userId
    });
    
    await device.save();
    
    res.status(201).json(device);
  } catch (error) {
    console.error('Create device error:', error);
    res.status(500).json({ message: 'Failed to create device' });
  }
};

// Update device
const updateDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    res.json(device);
  } catch (error) {
    console.error('Update device error:', error);
    res.status(500).json({ message: 'Failed to update device' });
  }
};

// Toggle device status
const toggleDevice = async (req, res) => {
  try {
    const device = await Device.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    // Toggle status
    device.status = device.status === 'on' ? 'off' : 'on';
    device.lastActive = Date.now();
    await device.save();
    
    res.json(device);
  } catch (error) {
    console.error('Toggle device error:', error);
    res.status(500).json({ message: 'Failed to toggle device' });
  }
};

// Delete device
const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({ message: 'Failed to delete device' });
  }
};

module.exports = {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  toggleDevice,
  deleteDevice
};