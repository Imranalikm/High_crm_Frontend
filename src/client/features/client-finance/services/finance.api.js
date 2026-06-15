import { apiClient } from '@/shared/api/client/apiClient';

export const financeApi = {
  async getDeposits() {
    const data = await apiClient.get('/deposits/my-deposits');
    return data.data || [];
  },

  async createDeposit(payload) {
    const data = await apiClient.post('/deposits', payload);
    return data;
  },

  async getWallet() {
    const data = await apiClient.get('/panel/wallet');
    return data.data || {};
  },

  async getWithdrawals() {
    const data = await apiClient.get('/withdrawals/my-withdrawals');
    return data.withdrawals || data.data || [];
  },

  async createWithdrawal(payload) {
    const data = await apiClient.post('/withdrawals', payload);
    return data;
  }
};
