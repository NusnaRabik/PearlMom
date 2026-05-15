import { api } from './api';

export const facilityService = {
  getNearbyClinics: async (lat, lng) => {
    const res = await api.get(`/facilities?lat=${lat}&lng=${lng}`);
    return res.data;
  },
  getClinicDetails: async (id) => {
    const res = await api.get(`/facilities/${id}`);
    return res.data;
  }
};
