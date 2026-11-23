import { apiClient } from '@/shared/api/client/apiClient';

export const mt5ServersService = {
  // → { servers: [...], activeSource: 'db' | 'env' | 'error' }
  async list() {
    const response = await apiClient.get('/mt5-servers');
    return response?.data || { servers: [], activeSource: 'env' };
  },

  // History entries, newest first (optionally for one server)
  async logs(serverId) {
    const response = await apiClient.get(`/mt5-servers/logs${serverId ? `?serverId=${serverId}` : ''}`);
    return response?.data || [];
  },

  async create(payload) {
    const response = await apiClient.post('/mt5-servers', payload);
    return response?.data || null;
  },

  // Blank apiPassword / managerPassword keep the saved ones
  async update(id, payload) {
    const response = await apiClient.put(`/mt5-servers/${id}`, payload);
    return response?.data || null;
  },

  // Test form values; pass serverId to reuse saved passwords left blank
  async test(payload) {
    const response = await apiClient.post('/mt5-servers/test', payload);
    return response?.data || null;
  },

  // Throws ApiError with data.code === 'TEST_FAILED' when the pre-activation test fails (retry with force)
  async activate(id, force = false) {
    return apiClient.post(`/mt5-servers/${id}/activate`, { force });
  },

  async remove(id) {
    await apiClient.delete(`/mt5-servers/${id}`);
  },
};
