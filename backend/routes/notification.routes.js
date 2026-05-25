const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const notificationController = require('../controllers/notification.controller');

// Get all notifications for logged-in user
router.get('/', protect, notificationController.getAllNotifications);

// Get unread count
router.get('/unread-count', protect, notificationController.getUnreadCount);

// Mark single notification as read
router.put('/:id/read', protect, notificationController.markAsRead);

// Mark all as read
router.put('/read-all', protect, notificationController.markAllAsRead);

// Delete single notification
router.delete('/:id', protect, notificationController.deleteNotification);

// Clear all notifications
router.delete('/clear-all', protect, notificationController.clearAllNotifications);

// Get notification preferences
router.get('/preferences', protect, notificationController.getPreferences);

// Update notification preferences
router.put('/preferences', protect, notificationController.updatePreferences);

// Send test notification (dev only)
router.post('/test', protect, notificationController.sendTestNotification);

module.exports = router;