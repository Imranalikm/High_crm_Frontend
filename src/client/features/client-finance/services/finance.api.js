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
  },

  // ── Bank Accounts / Payment Methods ──

  async getBankAccounts() {
    const data = await apiClient.get('/bank-accounts');
    return data.bankAccounts || data.data || [];
  },

  async createBankAccount(payload) {
    const data = await apiClient.post('/bank-accounts', payload);
    return data;
  },

  async updateBankAccount(id, payload) {
    const data = await apiClient.put(`/bank-accounts/${id}`, payload);
    return data;
  },

  async deleteBankAccount(id) {
    const data = await apiClient.delete(`/bank-accounts/${id}`);
    return data;
  },

  async setDefaultBankAccount(id) {
    const data = await apiClient.patch(`/bank-accounts/${id}/default`);
    return data;
  },
};
