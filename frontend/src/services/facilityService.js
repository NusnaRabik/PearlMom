// frontend/src/services/facilityService.js
import api from './api';

/**
 * Facility/Clinic Service
 * Handles healthcare facility-related API calls
 */

const facilityService = {
  /**
   * Get all facilities
   * @param {Object} params - Query parameters (search, type, services)
   * @returns {Promise} Facilities list
   */
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/facilities', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch facilities' };
    }
  },

  /**
   * Get facility by ID
   * @param {string} facilityId - Facility ID
   * @returns {Promise} Facility data
   */
  getById: async (facilityId) => {
    try {
      const response = await api.get(`/facilities/${facilityId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch facility' };
    }
  },

  /**
   * Get nearby facilities
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {number} radius - Search radius in km
   * @returns {Promise} Nearby facilities
   */
  getNearby: async (latitude, longitude, radius = 10) => {
    try {
      const response = await api.get('/facilities/nearby', {
        params: { latitude, longitude, radius }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch nearby facilities' };
    }
  },

  /**
   * Search facilities
   * @param {string} query - Search query
   * @returns {Promise} Search results
   */
  search: async (query) => {
    try {
      const response = await api.get('/facilities/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Search failed' };
    }
  },

  /**
   * Add favorite facility
   * @param {string} userId - User ID
   * @param {string} facilityId - Facility ID
   * @returns {Promise} Updated favorites
   */
  addFavorite: async (userId, facilityId) => {
    try {
      const response = await api.post('/facilities/favorites', { userId, facilityId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add favorite' };
    }
  },

  /**
   * Remove favorite facility
   * @param {string} userId - User ID
   * @param {string} facilityId - Facility ID
   * @returns {Promise} Updated favorites
   */
  removeFavorite: async (userId, facilityId) => {
    try {
      const response = await api.delete(`/facilities/favorites/${userId}/${facilityId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove favorite' };
    }
  },

  /**
   * Get user's favorite facilities
   * @param {string} userId - User ID
   * @returns {Promise} Favorites list
   */
  getFavorites: async (userId) => {
    try {
      const response = await api.get(`/facilities/favorites/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch favorites' };
    }
  },

  /**
   * Get directions to facility
   * @param {number} originLat - Origin latitude
   * @param {number} originLng - Origin longitude
   * @param {number} destLat - Destination latitude
   * @param {number} destLng - Destination longitude
   * @returns {Promise} Directions data
   */
  getDirections: async (originLat, originLng, destLat, destLng) => {
    try {
      const response = await api.get('/facilities/directions', {
        params: { originLat, originLng, destLat, destLng }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get directions' };
    }
  }
};

export default facilityService;