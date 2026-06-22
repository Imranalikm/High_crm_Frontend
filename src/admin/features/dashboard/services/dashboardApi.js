import { apiClient } from '@/shared/api/client/apiClient';

/**
 * Dashboard API Service
 *
 * Aggregates data from existing backend endpoints to compute
 * dashboard-level metrics for the admin overview.
 */
export const dashboardApi = {
  /**
   * Fetch all dashboard data in parallel from existing endpoints.
   * Returns a unified object with users, kyc, deposits, withdrawals, tickets.
   */
  async fetchAll() {
    const [
      usersRes,
      kycAllRes,
      kycPendingRes,
      depositsRes,
      depositsPendingRes,
      withdrawalsRes,
      withdrawalsPendingRes,
      ticketsRes,
    ] = await Promise.allSettled([
      apiClient.get('/user-management'),
      apiClient.get('/kyc'),
      apiClient.get('/kyc?status=pending'),
      apiClient.get('/deposits'),
      apiClient.get('/deposits?status=PENDING'),
      apiClient.get('/withdrawals'),
      apiClient.get('/withdrawals?status=PENDING'),
      apiClient.get('/tickets'),
    ]);

    return {
      users: extractArray(usersRes, ['data', 'users']),
      kycAll: extractArray(kycAllRes, ['data']),
      kycPending: extractArray(kycPendingRes, ['data']),
      deposits: extractArray(depositsRes, ['data']),
      depositsPending: extractArray(depositsPendingRes, ['data']),
      withdrawals: extractArray(withdrawalsRes, ['data', 'withdrawals']),
      withdrawalsPending: extractArray(withdrawalsPendingRes, ['data', 'withdrawals']),
      tickets: extractTickets(ticketsRes),
    };
  },
};

/**
 * Safely extract an array from a settled promise result,
 * trying multiple property paths on the response.
 */
function extractArray(settled, paths = ['data']) {
  if (settled.status !== 'fulfilled') return [];
  const res = settled.value;
  if (Array.isArray(res)) return res;
  for (const key of paths) {
    if (res && Array.isArray(res[key])) return res[key];
  }
  // Try nested data.users, data.data etc.
  if (res?.data) {
    if (Array.isArray(res.data)) return res.data;
    for (const key of paths) {
      if (res.data && Array.isArray(res.data[key])) return res.data[key];
    }
  }
  return [];
}

function extractTickets(settled) {
  if (settled.status !== 'fulfilled') return [];
  const res = settled.value;
  if (Array.isArray(res)) return res;
  if (res?.data && Array.isArray(res.data)) return res.data;
  return [];
}
