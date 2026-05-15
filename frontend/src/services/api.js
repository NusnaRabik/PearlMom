export const api = {
  get: async (endpoint) => {
    return new Promise(resolve => setTimeout(() => resolve({ data: [] }), 500));
  },
  post: async (endpoint, payload) => {
    return new Promise(resolve => setTimeout(() => resolve({ data: payload }), 500));
  }
};
