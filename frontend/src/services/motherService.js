// frontend/src/services/motherService.js
import api from './api';

/**
 * Mother Service
 * Handles mother-related API calls
 */

const motherService = {
  /**
   * Get mother profile by ID
   * @param {string} motherId - Mother ID
   * @returns {Promise} Mother data
   */
  getMotherById: async (motherId) => {
    try {
      const response = await api.get(`/mothers/${motherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch mother data' };
    }
  },

  /**
   * Get all mothers (for provider/admin)
   * @param {Object} params - Query parameters (page, limit, search, status)
   * @returns {Promise} Paginated mothers list
   */
  getAllMothers: async (params = {}) => {
    try {
      const response = await api.get('/mothers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch mothers' };
    }
  },

  /**
   * Update mother profile
   * @param {string} motherId - Mother ID
   * @param {Object} data - Updated data
   * @returns {Promise} Updated mother data
   */
  updateMother: async (motherId, data) => {
    try {
      const response = await api.put(`/mothers/${motherId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update mother' };
    }
  },

  /**
   * Get mother's appointments
   * @param {string} motherId - Mother ID
   * @returns {Promise} Appointments list
   */
  getAppointments: async (motherId) => {
    try {
      const response = await api.get(`/mothers/${motherId}/appointments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch appointments' };
    }
  },

  /**
   * Book new appointment
   * @param {string} motherId - Mother ID
   * @param {Object} appointmentData - Appointment details
   * @returns {Promise} Created appointment
   */
  bookAppointment: async (motherId, appointmentData) => {
    try {
      const response = await api.post(`/mothers/${motherId}/appointments`, appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to book appointment' };
    }
  },

  /**
   * Get mother's vaccinations
   * @param {string} motherId - Mother ID
   * @returns {Promise} Vaccinations list
   */
  getVaccinations: async (motherId) => {
    try {
      const response = await api.get(`/mothers/${motherId}/vaccinations`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch vaccinations' };
    }
  },

  /**
   * Get mother's lab reports
   * @param {string} motherId - Mother ID
   * @returns {Promise} Lab reports list
   */
  getLabReports: async (motherId) => {
    try {
      const response = await api.get(`/mothers/${motherId}/lab-reports`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch lab reports' };
    }
  },

  /**
   * Upload lab report
   * @param {string} motherId - Mother ID
   * @param {FormData} formData - File data
   * @returns {Promise} Uploaded report
   */
  uploadLabReport: async (motherId, formData) => {
    try {
      const response = await api.upload(`/mothers/${motherId}/lab-reports`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload report' };
    }
  },

  /**
   * Get mother's nutrition/Thriposha data
   * @param {string} motherId - Mother ID
   * @returns {Promise} Nutrition data
   */
  getNutritionData: async (motherId) => {
    try {
      const response = await api.get(`/mothers/${motherId}/nutrition`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch nutrition data' };
    }
  },

  /**
   * Get EMCH card data
   * @param {string} motherId - Mother ID
   * @returns {Promise} EMCH card data
   */
  getEMCHCard: async (motherId) => {
    try {
      const response = await api.get(`/mothers/${motherId}/emch-card`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch EMCH card' };
    }
  },

  /**
   * Get mother's visit history
   * @param {string} motherId - Mother ID
   * @returns {Promise} Visit history
   */
  getVisitHistory: async (motherId) => {
    try {
      const response = await api.get(`/mothers/${motherId}/visits`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch visit history' };
    }
  }
};

export default motherService;