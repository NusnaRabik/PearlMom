// frontend/src/services/thriposhService.js
import api from './api';

/**
 * Thriposha Service
 * Handles Thriposha program-related API calls
 */

const thriposhaService = {
  /**
   * Check eligibility for a mother
   * @param {string} motherId - Mother ID
   * @param {Object} healthData - BMI, weight, health conditions
   * @returns {Promise} Eligibility result
   */
  checkEligibility: async (motherId, healthData) => {
    try {
      const response = await api.post('/thriposha/check-eligibility', {
        motherId,
        ...healthData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check eligibility' };
    }
  },

  /**
   * Get eligibility criteria
   * @returns {Promise} Criteria data
   */
  getCriteria: async () => {
    try {
      const response = await api.get('/thriposha/criteria');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch criteria' };
    }
  },

  /**
   * Log distribution
   * @param {Object} distributionData - Distribution details
   * @returns {Promise} Distribution record
   */
  logDistribution: async (distributionData) => {
    try {
      const response = await api.post('/thriposha/distribution', distributionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to log distribution' };
    }
  },

  /**
   * Get distribution history for a mother
   * @param {string} motherId - Mother ID
   * @returns {Promise} Distribution history
   */
  getDistributionHistory: async (motherId) => {
    try {
      const response = await api.get(`/thriposha/history/${motherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch history' };
    }
  },

  /**
   * Get provider's distribution records
   * @param {string} providerId - Provider ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Distribution records
   */
  getProviderDistributions: async (providerId, params = {}) => {
    try {
      const response = await api.get(`/thriposha/provider/${providerId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch distributions' };
    }
  },

  /**
   * Get inventory status
   * @param {string} clinicId - Clinic ID
   * @returns {Promise} Inventory data
   */
  getInventory: async (clinicId) => {
    try {
      const response = await api.get(`/thriposha/inventory/${clinicId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inventory' };
    }
  },

  /**
   * Request stock replenishment
   * @param {string} clinicId - Clinic ID
   * @param {number} quantity - Requested quantity
   * @returns {Promise} Request status
   */
  requestStock: async (clinicId, quantity) => {
    try {
      const response = await api.post('/thriposha/request-stock', {
        clinicId,
        quantity
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to request stock' };
    }
  },

  /**
   * Get eligibility report
   * @param {Object} params - Query parameters
   * @returns {Promise} Report data
   */
  getEligibilityReport: async (params = {}) => {
    try {
      const response = await api.get('/thriposha/report/eligibility', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch report' };
    }
  },

  /**
   * Export distribution report
   * @param {Object} params - Report parameters
   * @returns {Promise} Report file
   */
  exportReport: async (params = {}) => {
    try {
      const response = await api.get('/thriposha/report/export', {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to export report' };
    }
  }
};

export default thriposhaService;