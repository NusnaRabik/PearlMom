import { api } from './api';

export const motherService = {
  getProfile: async (id) => {
    const res = await api.get(`/mothers/${id}`);
    return res.data;
  },
  updateProfile: async (id, data) => {
    const res = await api.post(`/mothers/${id}`, data);
    return res.data;
  }
};
