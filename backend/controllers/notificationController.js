const Notification = require('../models/Notification');

// Get all notifications for user
const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Demo notifications for viewer account
    if (userId === 'demo-viewer-id') {
      const demoNotifications = [
        {
          id: 'demo-notif-1',
          _id: 'demo-notif-1',
          type: 'info',
          title: 'Welcome to Smart Home',
          message: 'Your smart home system is ready',
          timestamp: new Date().toISOString(),
          read: false
        },
        {
          id: 'demo-notif-2',
          _id: 'demo-notif-2',
          type: 'warning',
          title: 'High Energy Usage',
          message: 'Living Room Light has been on for 8 hours',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          deviceId: 'demo-1'
        },
        {
          id: 'demo-notif-3',
          _id: 'demo-notif-3',
          type: 'success',
          title: 'Device Added',
          message: 'Smart Thermostat connected successfully',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true,
          deviceId: 'demo-2'
        }
      ];
      return res.json(demoNotifications);
    }

    const notifications = await Notification.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('deviceId', 'name type');
    
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// Create notification
const createNotification = async (req, res) => {
  try {
    const notification = new Notification({
      ...req.body,
      userId: req.userId
    });
    
    await notification.save();
    
    // Emit socket event for real-time notification
    const io = req.app.get('io');
    io.to(`user_${req.userId}`).emit('alert', {
      type: 'alert',
      payload: notification
    });
    
    res.status(201).json(notification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Failed to create notification' });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

// Mark all as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.userId,
      read: false
    });
    
    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Failed to get unread count' });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
};