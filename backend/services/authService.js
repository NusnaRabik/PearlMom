import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', {
      fullName: userData.fullName,
      mobile: userData.mobile,
      email: userData.email,
      password: userData.password,
      role: userData.role
    });
    return response.data;
  },

  // Add this to your authService.js
    loginByName: async (fullName, password, role) => {
    const response = await api.post('/auth/login-by-name', { fullName, password, role });
    return response.data;
    },

  login: async (email, password, role) => {
    const response = await api.post('/auth/login', { email, password, role });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  checkProfile: async () => {
    const response = await api.get('/auth/check-profile');
    return response.data;
  },

  completeProfile: async (profileData) => {
    const response = await api.put('/auth/complete-profile', profileData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('pearlmom_token');
    localStorage.removeItem('pearlmom_user');
    localStorage.removeItem('pearlmom_new_registration');
  }
};

export default authService;