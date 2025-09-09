const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/authMiddleware');
const { handleValidationErrors } = require('../middleware/validationMiddleware');
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');

const router = express.Router();

// Validation rules
const notificationValidation = [
  body('type').optional().isIn(['info', 'warning', 'error', 'success']),
  body('title').notEmpty().trim(),
  body('message').notEmpty().trim(),
  body('deviceId').optional(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical'])
];

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.post('/', notificationValidation, handleValidationErrors, createNotification);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;