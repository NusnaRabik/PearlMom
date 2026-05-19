// frontend/src/services/api.js
import axios from 'axios';

/**
 * Axios instance with default configuration
 * Base URL can be configured via environment variable
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pearlmom_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('pearlmom_token');
        localStorage.removeItem('pearlmom_user');
        window.location.href = '/login';
      } else if (status === 403) {
        console.error('Access forbidden:', data.message);
      } else if (status === 404) {
        console.error('Resource not found:', data.message);
      } else if (status === 500) {
        console.error('Server error:', data.message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error - no response received');
    } else {
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper methods
const apiService = {
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  patch: (url, data) => api.patch(url, data),
  delete: (url) => api.delete(url),
  upload: (url, formData) => api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export default apiService;
export { api, API_BASE_URL };