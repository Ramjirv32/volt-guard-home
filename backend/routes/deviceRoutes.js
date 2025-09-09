const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  toggleDevice,
  deleteDevice
} = require('../controllers/deviceController');

const router = express.Router();

// Validation rules
const deviceValidation = [
  body('name').notEmpty().trim(),
  body('type').isIn(['light', 'thermostat', 'plug', 'sensor', 'camera', 'lock']),
  body('location').notEmpty().trim(),
  body('sensorId').optional().trim()
];

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getDevices);
router.get('/:id', getDevice);
router.post('/', deviceValidation, handleValidationErrors, createDevice);
router.patch('/:id', updateDevice);
router.post('/:id/toggle', toggleDevice);
router.delete('/:id', deleteDevice);

module.exports = router;