import { apiClient } from '@/shared/api/client/apiClient';

export const tradingAccountsService = {
  async list() {
    try {
      const response = await apiClient.get('/mt5-accounts');
      return response?.data || [];
    } catch (error) {
      console.warn('Failed to fetch MT5 accounts:', error);
      return [];
    }
  },

  async create(payload) {
    // payload should contain: { userId, groupName, leverage }
    const response = await apiClient.post('/mt5-accounts', payload);
    return response.data; // expecting { account: {...} } or similar
  }
};
