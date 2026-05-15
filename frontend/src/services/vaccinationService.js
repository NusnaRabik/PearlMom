import { api } from './api';

export const vaccinationService = {
  getSchedule: async (motherId) => {
    const res = await api.get(`/vaccinations/?motherId=${motherId}`);
    return res.data;
  },
  markCompleted: async (vaccineId) => {
    const res = await api.post(`/vaccinations/${vaccineId}`, { status: 'completed' });
    return res.data;
  }
};
