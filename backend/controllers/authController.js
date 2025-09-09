const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      displayName: displayName || email.split('@')[0]
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Demo viewer account
    if (email === 'viewer@smarthome.demo' && password === 'Demo123!') {
      const demoUser = {
        _id: 'demo-viewer-id',
        email: 'viewer@smarthome.demo',
        displayName: 'Demo Viewer',
        role: 'viewer',
        emailVerified: true,
        settings: {
          theme: 'system',
          emailNotifications: true,
          pushNotifications: false,
          whatsappNotifications: false,
          energyGoal: 500,
          currency: 'USD',
          timezone: 'America/New_York'
        }
      };
      
      const token = generateToken('demo-viewer-id');
      return res.json({
        message: 'Login successful',
        token,
        user: demoUser
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Get current user
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// Update user settings
const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update settings
    Object.assign(user.settings, settings);
    await user.save();

    res.json({
      message: 'Settings updated',
      settings: user.settings
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateSettings
};