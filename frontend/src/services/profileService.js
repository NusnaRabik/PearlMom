// frontend/src/services/profileService.js
import api from './api';

/**
 * Profile Service
 * Handles user profile-related API calls
 */

const profileService = {
  /**
   * Get user profile
   * @returns {Promise} Profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  /**
   * Update profile
   * @param {Object} data - Updated profile data
   * @returns {Promise} Updated profile
   */
  updateProfile: async (data) => {
    try {
      const response = await api.put('/profile', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  /**
   * Upload profile picture
   * @param {FormData} formData - Image file
   * @returns {Promise} Updated profile with image URL
   */
  uploadPhoto: async (formData) => {
    try {
      const response = await api.upload('/profile/photo', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload photo' };
    }
  },

  /**
   * Delete profile picture
   * @returns {Promise} Success status
   */
  deletePhoto: async () => {
    try {
      const response = await api.delete('/profile/photo');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete photo' };
    }
  },

  /**
   * Get security logs
   * @param {Object} params - Query parameters
   * @returns {Promise} Security logs
   */
  getSecurityLogs: async (params = {}) => {
    try {
      const response = await api.get('/profile/security-logs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch security logs' };
    }
  },

  /**
   * Get active sessions
   * @returns {Promise} Active sessions list
   */
  getActiveSessions: async () => {
    try {
      const response = await api.get('/profile/sessions');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch sessions' };
    }
  },

  /**
   * Terminate a session
   * @param {string} sessionId - Session ID
   * @returns {Promise} Success status
   */
  terminateSession: async (sessionId) => {
    try {
      const response = await api.delete(`/profile/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to terminate session' };
    }
  },

  /**
   * Terminate all other sessions
   * @returns {Promise} Success status
   */
  terminateAllSessions: async () => {
    try {
      const response = await api.delete('/profile/sessions');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to terminate sessions' };
    }
  },

  /**
   * Deactivate account
   * @param {string} reason - Deactivation reason
   * @returns {Promise} Success status
   */
  deactivateAccount: async (reason = '') => {
    try {
      const response = await api.post('/profile/deactivate', { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to deactivate account' };
    }
  },

  /**
   * Export personal data
   * @returns {Promise} Personal data export
   */
  exportData: async () => {
    try {
      const response = await api.get('/profile/export-data', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to export data' };
    }
  },

  /**
   * Update privacy settings
   * @param {Object} settings - Privacy settings
   * @returns {Promise} Updated settings
   */
  updatePrivacySettings: async (settings) => {
    try {
      const response = await api.put('/profile/privacy', settings);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update privacy settings' };
    }
  }
};

export default profileService;