const { Notification } = require('../models');
const { success, error } = require('../utils/response');

// Get all notifications for logged-in user
const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      user_id: req.user.user_id,
      is_deleted: false
    };

    if (type) {
      whereClause.notification_type = type;
    }

    const { count, rows } = await Notification.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return success(res, {
      notifications: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        unread: await Notification.count({
          where: { user_id: req.user.user_id, is_read: false, is_deleted: false }
        })
      }
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return error(res, 'Error fetching notifications');
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        user_id: req.user.user_id,
        is_read: false,
        is_deleted: false
      }
    });

    return success(res, { unread_count: count });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    return error(res, 'Error fetching unread count');
  }
};

// Mark single notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        notification_id: req.params.id,
        user_id: req.user.user_id
      }
    });

    if (!notification) {
      return error(res, 'Notification not found', 404);
    }

    await notification.update({
      is_read: true,
      read_date: new Date()
    });

    return success(res, { notification }, 'Notification marked as read');
  } catch (err) {
    console.error('Error marking notification:', err);
    return error(res, 'Error marking notification');
  }
};

// Mark all as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      {
        is_read: true,
        read_date: new Date()
      },
      {
        where: {
          user_id: req.user.user_id,
          is_read: false,
          is_deleted: false
        }
      }
    );

    return success(res, null, 'All notifications marked as read');
  } catch (err) {
    console.error('Error marking all notifications:', err);
    return error(res, 'Error marking all notifications');
  }
};

// Delete single notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        notification_id: req.params.id,
        user_id: req.user.user_id
      }
    });

    if (!notification) {
      return error(res, 'Notification not found', 404);
    }

    await notification.update({ is_deleted: true });

    return success(res, null, 'Notification deleted');
  } catch (err) {
    console.error('Error deleting notification:', err);
    return error(res, 'Error deleting notification');
  }
};

// Clear all notifications
const clearAllNotifications = async (req, res) => {
  try {
    await Notification.update(
      { is_deleted: true },
      {
        where: {
          user_id: req.user.user_id,
          is_deleted: false
        }
      }
    );

    return success(res, null, 'All notifications cleared');
  } catch (err) {
    console.error('Error clearing notifications:', err);
    return error(res, 'Error clearing notifications');
  }
};

// Get notification preferences
const getPreferences = async (req, res) => {
  try {
    // In production, fetch from database
    // For now, return defaults
    const defaultPreferences = {
      appointment_reminders: true,
      vaccination_alerts: true,
      checkup_reminders: true,
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true
    };

    return success(res, { preferences: defaultPreferences });
  } catch (err) {
    console.error('Error fetching preferences:', err);
    return error(res, 'Error fetching preferences');
  }
};

// Update notification preferences
const updatePreferences = async (req, res) => {
  try {
    // In production, save to database
    return success(res, { preferences: req.body }, 'Preferences updated');
  } catch (err) {
    console.error('Error updating preferences:', err);
    return error(res, 'Error updating preferences');
  }
};

// Send test notification (dev only)
const sendTestNotification = async (req, res) => {
  try {
    const notification = await Notification.create({
      user_id: req.user.user_id,
      notification_type: 'general',
      title: 'Test Notification',
      message: 'This is a test notification from Pearl MOM system.',
      is_read: false,
      sent_via: 'in_app',
      sent_date: new Date()
    });

    return success(res, { notification }, 'Test notification sent', 201);
  } catch (err) {
    console.error('Error sending test notification:', err);
    return error(res, 'Error sending test notification');
  }
};

module.exports = {
  getAllNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getPreferences,
  updatePreferences,
  sendTestNotification
};