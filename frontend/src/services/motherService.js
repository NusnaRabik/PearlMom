// frontend/src/services/motherService.js
import api from './api';

/**
 * Mother Service
 * Handles mother-related API calls
 */

const motherService = {
  /**
   * Get mother dashboard data
   * @returns {Promise} Dashboard data
   */
  getDashboard: async () => {
    try {
      const response = await api.get('/mothers/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error.response?.data || { message: 'Failed to fetch dashboard data' };
    }
  },

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
   * Get current mother's profile
   * @returns {Promise} Mother profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get('/mothers/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  /**
   * Get all mothers (for provider/admin)
   * @param {Object} params - Query parameters (page, limit, search, status)
   * @returns {Promise} Paginated mothers list
   */
  getAllMothers: async (params = {}) => {
    try {
      const response = await api.get('/mothers/all', { params });
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
   * Update current mother's profile
   * @param {Object} data - Updated data
   * @returns {Promise} Updated mother data
   */
  updateProfile: async (data) => {
    try {
      const response = await api.put('/mothers/profile', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
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
      const response = await api.post(`/mothers/${motherId}/lab-reports`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
  },

  /**
   * Change password
   * @param {Object} passwordData - Old and new password
   * @returns {Promise} Response data
   */
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/mothers/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  /**
   * Deactivate account
   * @returns {Promise} Response data
   */
  deactivateAccount: async () => {
    try {
      const response = await api.delete('/mothers/deactivate');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to deactivate account' };
    }
  },

  /**
   * Upload profile picture
   * @param {Object} pictureData - Profile picture data
   * @returns {Promise} Response data
   */
  uploadProfilePicture: async (pictureData) => {
    try {
      const response = await api.put('/mothers/upload-profile-picture', pictureData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload profile picture' };
    }
  },

  /**
   * Update medical details
   * @param {Object} medicalData - Medical details
   * @returns {Promise} Updated mother data
   */
  updateMedicalDetails: async (medicalData) => {
    try {
      const response = await api.put('/mothers/medical-details', medicalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update medical details' };
    }
  },

  /**
   * Create or update mother profile (for registration completion)
   * @param {Object} profileData - Profile data
   * @returns {Promise} Updated mother data
   */
  createOrUpdateProfile: async (profileData) => {
    try {
      const response = await api.post('/mothers/create-or-update', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to save profile' };
    }
  }
};

export default motherService;