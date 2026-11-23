import { apiClient } from '@/shared/api/client/apiClient';

// Build multipart body: plain fields + details as JSON + optional QR image
function toFormData({ type, region, label, enabled, details, qrFile, removeQr }) {
  const fd = new FormData();
  if (type) fd.append('type', type);
  if (region) fd.append('region', region);
  fd.append('label', label);
  if (enabled !== undefined) fd.append('enabled', String(enabled));
  fd.append('details', JSON.stringify(details || {}));
  if (qrFile) fd.append('qrImage', qrFile);
  if (removeQr) fd.append('removeQr', 'true');
  return fd;
}

export const paymentMethodsService = {
  // → { settings: { bank, upi, usdt }, methods: [...] }
  async list() {
    const response = await apiClient.get('/payment-methods');
    return response?.data || { settings: { bank: true, upi: true, usdt: true }, methods: [] };
  },

  async create(payload) {
    const response = await apiClient.post('/payment-methods', toFormData(payload));
    return response?.data || null;
  },

  async update(id, payload) {
    const response = await apiClient.put(`/payment-methods/${id}`, toFormData(payload));
    return response?.data || null;
  },

  async toggle(id, enabled) {
    const response = await apiClient.patch(`/payment-methods/${id}/toggle`, { enabled });
    return response?.data || null;
  },

  async remove(id) {
    await apiClient.delete(`/payment-methods/${id}`);
  },

  // Save display order for one group (a type, or a bank region): ids in their new order
  async reorder(ids) {
    await apiClient.put('/payment-methods/reorder', { ids });
  },

  // Master switch per type, e.g. { upi: false }
  async updateTypeSettings(patch) {
    const response = await apiClient.put('/payment-methods/settings', patch);
    return response?.data || null;
  },
};
