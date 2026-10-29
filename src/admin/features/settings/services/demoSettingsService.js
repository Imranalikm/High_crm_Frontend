import { apiClient } from '@/shared/api/client/apiClient';

export const demoSettingsService = {
  async get() {
    const response = await apiClient.get('/demo-settings');
    return response?.data || null;
  },

  async update(payload) {
    const response = await apiClient.put('/demo-settings', payload);
    return response?.data || null;
  },

  async listMt5Groups() {
    try {
      const response = await apiClient.get('/groups');
      return (response?.data || []).map((g) => g.groupName).filter(Boolean);
    } catch (error) {
      console.warn('Failed to fetch MT5 groups:', error);
      return [];
    }
  },
};
