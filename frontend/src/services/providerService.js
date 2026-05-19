// frontend/src/services/providerService.js
import api from './api';

/**
 * Provider Service
 * Handles provider-related API calls
 */

const providerService = {
  /**
   * Get provider profile
   * @param {string} providerId - Provider ID
   * @returns {Promise} Provider data
   */
  getProviderById: async (providerId) => {
    try {
      const response = await api.get(`/providers/${providerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch provider data' };
    }
  },

  /**
   * Update provider profile
   * @param {string} providerId - Provider ID
   * @param {Object} data - Updated data
   * @returns {Promise} Updated provider
   */
  updateProvider: async (providerId, data) => {
    try {
      const response = await api.put(`/providers/${providerId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update provider' };
    }
  },

  /**
   * Get provider's assigned mothers
   * @param {string} providerId - Provider ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Mothers list
   */
  getAssignedMothers: async (providerId, params = {}) => {
    try {
      const response = await api.get(`/providers/${providerId}/mothers`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch assigned mothers' };
    }
  },

  /**
   * Record clinic visit
   * @param {string} providerId - Provider ID
   * @param {string} motherId - Mother ID
   * @param {Object} visitData - Visit details
   * @returns {Promise} Created visit record
   */
  recordClinicVisit: async (providerId, motherId, visitData) => {
    try {
      const response = await api.post(`/providers/${providerId}/visits`, {
        motherId,
        ...visitData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to record visit' };
    }
  },

  /**
   * Get provider's clinic visits
   * @param {string} providerId - Provider ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Visits list
   */
  getClinicVisits: async (providerId, params = {}) => {
    try {
      const response = await api.get(`/providers/${providerId}/visits`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch visits' };
    }
  },

  /**
   * Get provider dashboard analytics
   * @param {string} providerId - Provider ID
   * @returns {Promise} Analytics data
   */
  getDashboardAnalytics: async (providerId) => {
    try {
      const response = await api.get(`/providers/${providerId}/analytics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch analytics' };
    }
  },

  /**
   * Check Thriposha eligibility for a mother
   * @param {string} motherId - Mother ID
   * @param {Object} data - Health metrics
   * @returns {Promise} Eligibility result
   */
  checkThriposhaEligibility: async (motherId, data) => {
    try {
      const response = await api.post(`/providers/thriposha/check-eligibility`, {
        motherId,
        ...data
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check eligibility' };
    }
  },

  /**
   * Log Thriposha distribution
   * @param {Object} distributionData - Distribution details
   * @returns {Promise} Distribution record
   */
  logThriposhaDistribution: async (distributionData) => {
    try {
      const response = await api.post('/providers/thriposha/distribution', distributionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to log distribution' };
    }
  },

  /**
   * Get Thriposha distribution history
   * @param {string} providerId - Provider ID
   * @returns {Promise} Distribution history
   */
  getThriposhaHistory: async (providerId) => {
    try {
      const response = await api.get(`/providers/${providerId}/thriposha-history`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch history' };
    }
  },

  /**
   * Export provider report
   * @param {string} providerId - Provider ID
   * @param {Object} params - Report parameters
   * @returns {Promise} Report data
   */
  exportReport: async (providerId, params = {}) => {
    try {
      const response = await api.get(`/providers/${providerId}/export`, { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to export report' };
    }
  }
};

export default providerService;