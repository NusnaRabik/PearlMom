// frontend/src/services/notificationService.js
import api from './api';

/**
 * Notification Service
 * Handles notification-related API calls
 */

const notificationService = {
  /**
   * Get all notifications
   * @param {Object} params - Query parameters
   * @returns {Promise} Notifications list
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch notifications' };
    }
  },

  /**
   * Get unread notifications count
   * @returns {Promise} Unread count
   */
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch unread count' };
    }
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Updated notification
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark as read' };
    }
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Success status
   */
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark all as read' };
    }
  },

  /**
   * Delete notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Success status
   */
  delete: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete notification' };
    }
  },

  /**
   * Clear all notifications
   * @returns {Promise} Success status
   */
  clearAll: async () => {
    try {
      const response = await api.delete('/notifications/clear-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to clear notifications' };
    }
  },

  /**
   * Update notification preferences
   * @param {Object} preferences - Preference settings
   * @returns {Promise} Updated preferences
   */
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/notifications/preferences', preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update preferences' };
    }
  },

  /**
   * Get notification preferences
   * @returns {Promise} Preferences data
   */
  getPreferences: async () => {
    try {
      const response = await api.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch preferences' };
    }
  },

  /**
   * Send test notification (for development)
   * @returns {Promise} Created notification
   */
  sendTest: async () => {
    try {
      const response = await api.post('/notifications/test');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send test notification' };
    }
  }
};

export default notificationService;