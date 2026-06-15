import { apiClient } from '@/shared/api/client/apiClient';

export const adminFinanceApi = {
  async getDeposits(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.method && filters.method !== 'ALL') params.append('method', filters.method);
    
    const data = await apiClient.get(`/deposits?${params.toString()}`);
    return data.data || [];
  },

  async getDepositById(id) {
    const data = await apiClient.get(`/deposits/${id}`);
    return data.data;
  },

  async approveDeposit(id) {
    const data = await apiClient.put(`/deposits/${id}/approve`);
    return data;
  },

  async rejectDeposit(id, reason = '') {
    const data = await apiClient.put(`/deposits/${id}/reject`, { reason });
    return data;
  },

  async flagDeposit(id, reason = '') {
    const data = await apiClient.put(`/deposits/${id}/flag`, { reason });
    return data;
  },

  async createDeposit(payload) {
    const data = await apiClient.post('/deposits', payload);
    return data;
  },

  async getWithdrawals(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.method && filters.method !== 'ALL') params.append('method', filters.method);
    
    const data = await apiClient.get(`/withdrawals?${params.toString()}`);
    return data.withdrawals || data.data || [];
  },

  async getWithdrawalById(id) {
    const data = await apiClient.get(`/withdrawals/${id}`);
    return data.data;
  },

  async approveWithdrawal(id) {
    const data = await apiClient.put(`/withdrawals/${id}/approve`);
    return data;
  },

  async rejectWithdrawal(id, reason = '') {
    const data = await apiClient.put(`/withdrawals/${id}/reject`, { reason });
    return data;
  },

  async createWithdrawal(payload) {
    const data = await apiClient.post('/withdrawals', payload);
    return data;
  }
};
