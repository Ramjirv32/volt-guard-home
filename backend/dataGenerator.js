const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Device = require('./models/Device');
const EnergyData = require('./models/EnergyData');

const API_URL = process.env.API_URL || 'http://localhost:5000';
const INTERVAL_TIME = process.env.GENERATOR_INTERVAL || 60000; // 1 minute by default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ramji:vikas2311@cluster0.ln4g5.mongodb.net/smarthome?retryWrites=true&w=majority&appName=Cluster0';

const randomInRange = (min, max) => Math.random() * (max - min) + min;

// Connect to database
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully for data generator'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Function to generate sensor data for a device
const generateSensorData = (device) => {
  // Generate realistic values based on device type
  let power = 0;
  let energy = 0;
  let voltage = randomInRange(215, 240); // Standard voltage with fluctuations
  let current = 0;
  let powerFactor = randomInRange(0.8, 0.98); // Realistic power factor
  let frequency = randomInRange(49.8, 50.2); // Standard frequency with fluctuations

  // Only generate power usage if device is on
  if (device.status === 'on') {
    switch (device.type) {
      case 'light':
        power = randomInRange(5, 100); // LED lights to incandescent
        break;
      case 'thermostat':
        power = randomInRange(100, 1500); // Depending on heating/cooling
        break;
      case 'plug':
        power = randomInRange(0, 2000); // Various appliances
        break;
      case 'sensor':
        power = randomInRange(1, 5); // Minimal power for sensors
        break;
      case 'camera':
        power = randomInRange(5, 15); // Security cameras
        break;
      case 'lock':
        power = randomInRange(3, 8); // Smart locks
        break;
      default:
        power = randomInRange(5, 50);
    }
    
    // Calculate current based on power and voltage (P = VI)
    current = power / voltage;
    
    // Convert power (W) to energy (kWh) for a period (assume 1 hour = 1/60 for a minute interval)
    energy = power * (INTERVAL_TIME / (1000 * 60 * 60)) / 1000;
  } else if (device.status === 'idle') {
    // Idle devices still use some power
    power = randomInRange(0.5, 5);
    current = power / voltage;
    energy = power * (INTERVAL_TIME / (1000 * 60 * 60)) / 1000;
  }
  
  return {
    sensorId: device.sensorId,
    voltage,
    current,
    power,
    energy,
    powerFactor,
    frequency
  };
};

// Function to send data to API
const sendSensorData = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/iot/record`, data);
    console.log(`✅ Data sent for sensor ${data.sensorId}: ${data.power.toFixed(2)} W`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error sending data for sensor ${data.sensorId}:`, error.message);
    return null;
  }
};

// Function to record data directly to DB (alternative to API)
const recordDataToDB = async (device, sensorData) => {
  try {
    // Update device power usage
    device.powerUsage = sensorData.power || 0;
    device.lastActive = new Date();
    await device.save();
    
    // Create energy data record
    const energyData = new EnergyData({
      userId: device.userId,
      totalUsage: sensorData.energy || 0,
      deviceBreakdown: [{
        deviceId: device._id,
        deviceName: device.name,
        usage: sensorData.energy || 0
      }],
      voltage: sensorData.voltage,
      current: sensorData.current,
      powerFactor: sensorData.powerFactor,
      frequency: sensorData.frequency,
      period: 'hourly',
      cost: calculateCost(sensorData.energy) // Calculate cost based on energy usage
    });
    
    await energyData.save();
    console.log(`✅ Data recorded for device ${device.name}: ${sensorData.power.toFixed(2)} W`);
    return energyData;
  } catch (error) {
    console.error(`❌ Error recording data for device ${device.name}:`, error.message);
    return null;
  }
};

// Utility function to calculate cost based on energy usage
const calculateCost = (energy) => {
  const ratePerKWh = 0.15; // $0.15 per kWh - could be stored in settings
  return energy * ratePerKWh;
};

// Main function to run the data generator
const runGenerator = async () => {
  try {
    console.log('📊 Starting data generator...');
    
    // Get all devices that have sensor IDs
    const devices = await Device.find({ sensorId: { $exists: true, $ne: null } });
    
    if (devices.length === 0) {
      console.log('⚠️ No devices with sensor IDs found. Creating sample devices...');
      await createSampleDevices();
      return; // Exit and retry on next interval
    }
    
    console.log(`🔍 Found ${devices.length} devices with sensors`);
    
    // Process each device
    for (const device of devices) {
      // Generate sensor data
      const sensorData = generateSensorData(device);
      
      // Option 1: Send to API endpoint
      // await sendSensorData(sensorData);
      
      // Option 2: Record directly to database
      await recordDataToDB(device, sensorData);
    }
    
    console.log('✅ Data generation cycle completed');
  } catch (error) {
    console.error('❌ Error in data generator:', error.message);
  }
};

// Function to create sample devices if none exist
const createSampleDevices = async () => {
  try {
    // Find or create a sample user
    let user = await User.findOne({ email: 'demo@voltguard.com' });
    
    if (!user) {
      user = new User({
        email: 'demo@voltguard.com',
        password: 'Demo123!',  // This will be hashed by the pre-save hook
        displayName: 'Demo User',
        emailVerified: true,
        role: 'user'
      });
      await user.save();
      console.log('✅ Created demo user');
    }
    
    // Sample devices
    const sampleDevices = [
      {
        name: 'Living Room Light',
        type: 'light',
        status: 'on',
        powerUsage: 60,
        location: 'Living Room',
        automationEnabled: true,
        sensorId: 'PZEM-001'
      },
      {
        name: 'Kitchen Light',
        type: 'light',
        status: 'off',
        powerUsage: 0,
        location: 'Kitchen',
        automationEnabled: false,
        sensorId: 'PZEM-002'
      },
      {
        name: 'Smart Thermostat',
        type: 'thermostat',
        status: 'on',
        powerUsage: 120,
        location: 'Hallway',
        automationEnabled: true,
        sensorId: 'PZEM-003'
      },
      {
        name: 'TV Plug',
        type: 'plug',
        status: 'on',
        powerUsage: 150,
        location: 'Living Room',
        automationEnabled: false,
        sensorId: 'PZEM-004'
      },
      {
        name: 'Fridge Plug',
        type: 'plug',
        status: 'on',
        powerUsage: 100,
        location: 'Kitchen',
        automationEnabled: false,
        sensorId: 'PZEM-005'
      },
      {
        name: 'Bedroom Light',
        type: 'light',
        status: 'off',
        powerUsage: 0,
        location: 'Bedroom',
        automationEnabled: true,
        sensorId: 'PZEM-006'
      }
    ];
    
    for (const deviceData of sampleDevices) {
      const device = new Device({
        ...deviceData,
        userId: user._id
      });
      await device.save();
    }
    
    console.log('✅ Created sample devices');
  } catch (error) {
    console.error('❌ Error creating sample devices:', error);
  }
};

// Start the generator
console.log(`🔄 Data generator will run every ${INTERVAL_TIME / 1000} seconds`);
runGenerator(); // Run immediately

// Then set up interval
setInterval(runGenerator, INTERVAL_TIME);

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('📝 Shutting down data generator...');
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
});
