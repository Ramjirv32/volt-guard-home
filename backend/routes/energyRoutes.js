const express = require('express');
const { body } = require('express-validator');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const {
  getEnergyData,
  getCurrentUsage,
  recordEnergyData,
  getEnergyStats
} = require('../controllers/energyController');

const router = express.Router();

// Validation for sensor data
const sensorDataValidation = [
  body('sensorId').notEmpty(),
  body('voltage').optional().isNumeric(),
  body('current').optional().isNumeric(),
  body('power').optional().isNumeric(),
  body('energy').optional().isNumeric(),
  body('powerFactor').optional().isNumeric(),
  body('frequency').optional().isNumeric()
];

// Protected routes
router.get('/data', authenticate, getEnergyData);
router.get('/current', authenticate, getCurrentUsage);
router.get('/stats', authenticate, getEnergyStats);

// Public route for IoT sensors to post data
router.post('/record', sensorDataValidation, handleValidationErrors, recordEnergyData);

module.exports = router;