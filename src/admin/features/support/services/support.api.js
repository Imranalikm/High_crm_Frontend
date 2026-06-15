import { apiClient } from '@/shared/api/client/apiClient';

export const adminSupportApi = {
  async getTickets() {
    const data = await apiClient.get('/tickets');
    return (data.data || []).map(t => ({
      id: t.ticketId, // Frontend uses this ID format typically
      uuid: t.id,
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      status: t.status,
      user: t.user?.name || 'Unknown User',
      uid: t.user ? `U-${t.user.id}` : 'U-???',
      unread: false,
      messages: 1,
      created: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updated: new Date(t.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      slaMins: 120 // mock SLA for now
    }));
  },

  async getTicket(id) {
    const data = await apiClient.get(`/tickets/${id}`);
    if (!data.data) return null;
    const t = data.data;
    
    return {
      id: t.ticketId,
      uuid: t.id,
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      status: t.status,
      user: t.user?.name || 'Unknown User',
      uid: t.user ? `U-${t.user.id}` : 'U-???',
      created: new Date(t.createdAt).toLocaleDateString(),
      updated: new Date(t.updatedAt).toLocaleDateString(),
      conversation: [
        {
          id: 1,
          from: 'user',
          name: t.user?.name || 'User',
          initials: t.user?.name?.substring(0,2).toUpperCase() || 'US',
          ts: new Date(t.createdAt).toLocaleDateString(),
          text: t.description,
          attachments: []
        }
      ]
    };
  }
};
