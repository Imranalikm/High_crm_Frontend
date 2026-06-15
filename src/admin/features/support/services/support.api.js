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
      messages: t.messages?.length || 1,
      created: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updated: new Date(t.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      owner: t.agent ? { name: t.agent.name, id: t.agent.id } : null,
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
      owner: t.agent ? { name: t.agent.name, id: t.agent.id } : null,
      conversation: [
        {
          id: t.id + '-init',
          type: 'user',
          author: t.user?.name || 'User',
          role: 'Client',
          ts: new Date(t.createdAt).toLocaleString('en-GB').replace(',', ''),
          body: t.description,
        },
        ...(t.messages || []).map(msg => ({
          id: msg.id,
          type: msg.type,
          author: msg.author?.name || 'Unknown',
          role: msg.author?.role?.type === 'admin' ? 'Admin' : (msg.type === 'user' ? 'Client' : 'Support'),
          ts: new Date(msg.createdAt).toLocaleString('en-GB').replace(',', ''),
          body: msg.body
        }))
      ]
    };
  },

  async replyToTicket(uuid, text, type) {
    const res = await apiClient.post(`/tickets/${uuid}/messages`, { body: text, type });
    return res.data;
  },

  async updateTicketStatus(uuid, status) {
    const res = await apiClient.patch(`/tickets/${uuid}`, { status });
    return res.data;
  },

  async assignTicketAgent(uuid, agentId) {
    const res = await apiClient.patch(`/tickets/${uuid}`, { agentId });
    return res.data;
  }
};
