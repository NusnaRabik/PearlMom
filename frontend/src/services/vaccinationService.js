// frontend/src/services/vaccinationService.js
import api from './api';

/**
 * Vaccination Service
 * Handles vaccination-related API calls
 */

const vaccinationService = {
  /**
   * Get vaccination schedule
   * @param {string} type - 'mother' or 'newborn'
   * @returns {Promise} Schedule data
   */
  getSchedule: async (type = 'mother') => {
    try {
      const response = await api.get('/vaccinations/schedule', { params: { type } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch schedule' };
    }
  },

  /**
   * Get mother's vaccination status
   * @param {string} motherId - Mother ID
   * @returns {Promise} Vaccination records
   */
  getMotherVaccinations: async (motherId) => {
    try {
      const response = await api.get(`/vaccinations/mother/${motherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch vaccinations' };
    }
  },

  /**
   * Record vaccination
   * @param {Object} vaccinationData - Vaccination details
   * @returns {Promise} Created record
   */
  recordVaccination: async (vaccinationData) => {
    try {
      const response = await api.post('/vaccinations/record', vaccinationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to record vaccination' };
    }
  },

  /**
   * Update vaccination status
   * @param {string} vaccinationId - Vaccination ID
   * @param {Object} data - Updated data
   * @returns {Promise} Updated record
   */
  updateVaccination: async (vaccinationId, data) => {
    try {
      const response = await api.put(`/vaccinations/${vaccinationId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update vaccination' };
    }
  },

  /**
   * Get upcoming vaccinations
   * @param {string} motherId - Mother ID
   * @returns {Promise} Upcoming vaccinations
   */
  getUpcomingVaccinations: async (motherId) => {
    try {
      const response = await api.get(`/vaccinations/upcoming/${motherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch upcoming vaccinations' };
    }
  },

  /**
   * Get overdue vaccinations
   * @param {string} motherId - Mother ID
   * @returns {Promise} Overdue vaccinations
   */
  getOverdueVaccinations: async (motherId) => {
    try {
      const response = await api.get(`/vaccinations/overdue/${motherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch overdue vaccinations' };
    }
  },

  /**
   * Download vaccination certificate
   * @param {string} motherId - Mother ID
   * @returns {Promise} Certificate PDF
   */
  downloadCertificate: async (motherId) => {
    try {
      const response = await api.get(`/vaccinations/certificate/${motherId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to download certificate' };
    }
  },

  /**
   * Get vaccination statistics
   * @param {Object} params - Query parameters
   * @returns {Promise} Statistics data
   */
  getStatistics: async (params = {}) => {
    try {
      const response = await api.get('/vaccinations/statistics', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch statistics' };
    }
  }
};

export default vaccinationService;