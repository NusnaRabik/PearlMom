// frontend/src/services/authService.js
import api from './api';

/**
 * Authentication Service
 * Handles login, registration, password management
 */

const authService = {
  /**
   * Login user
   * @param {Object} credentials - { email, password, role }
   * @returns {Promise} Response with user data and token
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  /**
   * Register new user
   * @param {Object} userData - Registration data
   * @returns {Promise} Response with success message
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('pearlmom_token');
    localStorage.removeItem('pearlmom_user');
  },

  /**
   * Get current user profile
   * @returns {Promise} User data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  /**
   * Change password
   * @param {Object} passwordData - { oldPassword, newPassword }
   * @returns {Promise} Response
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password change failed' };
    }
  },

  /**
   * Forgot password - request reset link
   * @param {string} email - User email
   * @returns {Promise} Response
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Request failed' };
    }
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise} Response
   */
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  },

  /**
   * Verify OTP
   * @param {string} otp - One-time password
   * @param {string} mobile - Mobile number
   * @returns {Promise} Response
   */
  verifyOTP: async (otp, mobile) => {
    try {
      const response = await api.post('/auth/verify-otp', { otp, mobile });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'OTP verification failed' };
    }
  },

  /**
   * Send OTP
   * @param {string} mobile - Mobile number
   * @returns {Promise} Response
   */
  sendOTP: async (mobile) => {
    try {
      const response = await api.post('/auth/send-otp', { mobile });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send OTP' };
    }
  },

  /**
   * Refresh token
   * @returns {Promise} New token
   */
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token refresh failed' };
    }
  }
};

export default authService;