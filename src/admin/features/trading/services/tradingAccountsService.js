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

  async getByLogin(login) {
    try {
      const response = await apiClient.get(`/mt5-accounts/${encodeURIComponent(login)}`);
      return response?.data || null;
    } catch (error) {
      console.warn('Failed to fetch MT5 account:', error);
      return null;
    }
  },

  // Add (positive) or deduct (negative) balance on a DEMO account; throws with server message
  async adjustDemoBalance(login, amount, comment) {
    const response = await apiClient.post(`/mt5-accounts/${encodeURIComponent(login)}/demo-balance`, { amount, comment });
    return response?.data;
  },

  async create(payload) {
    // payload should contain: { userId, groupName, leverage }
    const response = await apiClient.post('/mt5-accounts', payload);
    return response.data; // expecting { account: {...} } or similar
  }
};
