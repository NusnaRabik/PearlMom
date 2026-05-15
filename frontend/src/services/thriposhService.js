import { api } from './api';

export const thriposhService = {
  getDistributionDates: async () => {
    const res = await api.get('/thriposh/dates');
    return res.data;
  },
  checkEligibility: async (motherId) => {
    const res = await api.get(`/thriposh/eligibility?motherId=${motherId}`);
    return res.data;
  }
};
