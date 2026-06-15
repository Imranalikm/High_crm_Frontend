// API Endpoints replacing localStorage

import { apiClient } from '@/shared/api/client/apiClient';

export const groupService = {
  async list() {
    try {
      const response = await apiClient.get('/crm-groups');
      const data = response?.data || [];
      // Map createdAt to date for frontend compatibility
      return data.map(g => ({ ...g, date: g.createdAt ? g.createdAt.substring(0, 10) : '' }));
    } catch (error) {
      console.warn('Failed to fetch CRM groups:', error);
      return [];
    }
  },
  
  async create(payload) {
    const formattedPayload = {
      ...payload,
      minFirstDeposit: Number(payload.minFirstDeposit || 0),
      minDeposit: Number(payload.minDeposit || 0),
      minWithdrawal: Number(payload.minWithdrawal || 0),
      perProfileMaxAccount: Number(payload.perProfileMaxAccount || 0),
      maxWithdrawalPerDay: Number(payload.maxWithdrawalPerDay || 0)
    };
    const response = await apiClient.post('/crm-groups', formattedPayload);
    return response.data;
  },
  
  async update(id, payload) {
    const formattedPayload = {
      ...payload,
      minFirstDeposit: Number(payload.minFirstDeposit || 0),
      minDeposit: Number(payload.minDeposit || 0),
      minWithdrawal: Number(payload.minWithdrawal || 0),
      perProfileMaxAccount: Number(payload.perProfileMaxAccount || 0),
      maxWithdrawalPerDay: Number(payload.maxWithdrawalPerDay || 0)
    };
    const response = await apiClient.put(`/crm-groups/${id}`, formattedPayload);
    return response.data;
  },
  
  async delete(id) {
    const response = await apiClient.delete(`/crm-groups/${id}`);
    return response.success;
  },
  
  async listMt5Groups() {
    try {
      const response = await apiClient.get('/groups');
      const listData = response?.data?.data ?? response?.data ?? response ?? [];
      return Array.isArray(listData) ? listData.map(g => g.groupName) : [];
    } catch (error) {
      console.warn('Failed to fetch MT5 groups:', error);
      return [];
    }
  },
  
  async syncMt5Groups() {
    try {
      const response = await apiClient.post('/groups/sync');
      return response?.data ?? response;
    } catch (error) {
      console.warn('Failed to sync MT5 groups:', error);
      throw error;
    }
  },
  
  listPolicies() {
    return {
      accountOpenPolicies: ['Select Account Deposit Policy', 'Auto Approve', 'Manual Audit Needed', 'Block Opening'],
      depositPolicies: ['Select Deposit Policy', 'Auto Approve', 'Manual Audit Needed', 'Block Deposits'],
      withdrawalPolicies: ['Select withdrawal Policy', 'Auto Approve', 'Manual Audit Needed', 'Block Withdrawals'],
      tradingTypes: ['Select Trading Type', 'Standard Trading', 'Hedging Only', 'Read Only']
    };
  }
};
