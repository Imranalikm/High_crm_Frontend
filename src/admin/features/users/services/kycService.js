import { apiClient } from '@/shared/api/client/apiClient';

const mapKycRecord = (rawKyc) => {
  if (!rawKyc) return null;
  
  // Resolve user display name
  let userName = rawKyc.fullName || (rawKyc.user ? rawKyc.user.name : 'Unknown User');

  // Resolve status: UI expects uppercase 'PENDING', 'VERIFIED' (for approved), 'REJECTED'
  let mappedStatus = 'PENDING';
  const rawStatus = (rawKyc.status || 'pending').toLowerCase();
  if (rawStatus === 'approved' || rawStatus === 'verified') {
    mappedStatus = 'VERIFIED';
  } else if (rawStatus === 'rejected') {
    mappedStatus = 'REJECTED';
  } else if (rawStatus === 'draft') {
    mappedStatus = 'DRAFT';
  }

  // Count documents
  let docCount = 0;
  if (rawKyc.idFrontImage) docCount++;
  if (rawKyc.idBackImage) docCount++;
  if (rawKyc.selfieImage) docCount++;
  if (rawKyc.addressDocImage) docCount++;

  return {
    id: rawKyc.id || 'N/A',
    userId: rawKyc.userId || (rawKyc.user ? rawKyc.user.id : 'N/A'),
    user: userName,
    tier: rawKyc.user?.tier || 'Standard',
    country: rawKyc.country || (rawKyc.user ? rawKyc.user.country : 'GLOBAL'),
    status: mappedStatus,
    eta: mappedStatus === 'VERIFIED' ? 'Completed' : (mappedStatus === 'REJECTED' ? 'Requires outreach' : 'Review pending'),
    docs: `${docCount}/${rawKyc.idDocType === 'passport' ? '3' : '4'}`,
    risk: rawKyc.user?.riskStatus || 'LOW',
    submittedAt: rawKyc.createdAt || rawKyc.updatedAt || '',
    raw: rawKyc
  };
};

export const kycService = {
  async list(status) {
    let endpoint = '/kyc';
    if (status && status !== 'all') {
      let backendStatus = status.toLowerCase();
      if (backendStatus === 'verified') {
        backendStatus = 'approved';
      }
      endpoint += `?status=${backendStatus}`;
    }
    try {
      const response = await apiClient.get(endpoint);
      const listData = response?.data ?? response ?? [];
      return Array.isArray(listData) ? listData.map(mapKycRecord) : [];
    } catch (error) {
      console.warn('Failed to list KYC submissions from API:', error);
      return [];
    }
  },

  async getById(id) {
    if (!id) return null;
    try {
      const response = await apiClient.get(`/kyc/${id}`);
      const rawKyc = response?.data?.kyc ?? response?.kyc ?? response?.data ?? response;
      return mapKycRecord(rawKyc);
    } catch (error) {
      console.warn(`Failed to get KYC details for ID ${id} from API:`, error);
      throw error;
    }
  },

  async approve(id) {
    if (!id) return null;
    try {
      const response = await apiClient.put(`/kyc/${id}/approve`);
      return response?.data ?? response;
    } catch (error) {
      console.error(`Failed to approve KYC for ID ${id}`, error);
      throw error;
    }
  },

  async reject(id, reason) {
    if (!id) return null;
    try {
      const response = await apiClient.put(`/kyc/${id}/reject`, { reason });
      return response?.data ?? response;
    } catch (error) {
      console.error(`Failed to reject KYC for ID ${id}`, error);
      throw error;
    }
  },

  updateStatusByUserId(userId, status) {
    return null;
  },
};


