import { Inbox, Clock, CheckCircle2, Zap } from 'lucide-react';
import { KB_ARTICLES, KB_FAQS, KB_CATEGORIES } from '../configs/knowledge.config';
import { ANNOUNCEMENTS, INCIDENTS } from '../configs/announcements.config';

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

import { apiClient } from '@/shared/api/client/apiClient';

export const supportApi = {
  /* ── Overview ── */
  async getStats() {
    const data = await apiClient.get('/tickets');
    const tickets = data.data || [];
    const open = tickets.filter(t => t.status === 'OPEN').length;
    const pending = tickets.filter(t => t.status === 'PENDING').length;
    const resolved = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
    return [
      { id: 'open',     label: 'Open',   value: open,   Icon: Inbox,        colorCls: 'text-brand',    bgCls: 'bg-brand/10 border-brand/20'       },
      { id: 'pending',  label: 'Pending',  value: pending,   Icon: Clock,        colorCls: 'text-warning',  bgCls: 'bg-warning/10 border-warning/20'   },
      { id: 'resolved', label: 'Resolved',  value: resolved,   Icon: CheckCircle2, colorCls: 'text-positive', bgCls: 'bg-positive/10 border-positive/20' },
      { id: 'response', label: 'Response time',    value: '2h', Icon: Zap,         colorCls: 'text-purple',   bgCls: 'bg-purple/10 border-purple/20'     },
    ];
  },

  /* ── Tickets ── */
  async getTickets() {
    const data = await apiClient.get('/tickets');
    // Map backend fields to frontend names
    return (data.data || []).map(t => ({
      id: t.id,
      ticketId: t.ticketId,
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      status: t.status,
      unread: false,
      messages: 1, // Only initial message for now
      created: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updated: new Date(t.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }));
  },

  async getTicket(id) {
    const data = await apiClient.get(`/tickets/${id}`);
    if (!data.data) return null;
    const t = data.data;
    
    // Construct single ticket with initial description as the conversation
    return {
      id: t.id,
      ticketId: t.ticketId,
      subject: t.subject,
      category: t.category,
      priority: t.priority,
      status: t.status,
      created: new Date(t.createdAt).toLocaleDateString(),
      updated: new Date(t.updatedAt).toLocaleDateString(),
      conversation: [
        {
          id: `${t.id}-init`,
          from: 'user',
          name: t.user?.name || 'You',
          initials: 'ME',
          ts: new Date(t.createdAt).toLocaleString('en-GB').replace(',', ''),
          text: t.description,
          attachments: t.attachments || []
        },
        ...(t.messages || []).map(msg => ({
          id: msg.id,
          from: msg.type === 'user' ? 'user' : 'support',
          name: msg.author?.name || 'Support',
          initials: msg.type === 'user' ? 'ME' : 'SA',
          ts: new Date(msg.createdAt).toLocaleString('en-GB').replace(',', ''),
          text: msg.body,
          attachments: msg.attachments || []
        }))
      ]
    };
  },

  async createTicket(payload) {
    if (payload.files && payload.files.length > 0) {
      const formData = new FormData();
      formData.append('subject', payload.subject);
      formData.append('category', payload.category);
      formData.append('priority', payload.priority);
      formData.append('description', payload.message);
      payload.files.forEach((file) => {
        formData.append('attachments', file);
      });
      const data = await apiClient.post('/tickets', formData);
      return data.data;
    } else {
      const data = await apiClient.post('/tickets', {
        subject: payload.subject,
        category: payload.category,
        priority: payload.priority,
        description: payload.message
      });
      return data.data;
    }
  },

  async sendMessage(ticketId, message) {
    const res = await apiClient.post(`/tickets/${ticketId}/messages`, { body: message, type: 'user' });
    const msg = res.data;
    return {
      id: msg.id,
      from: 'user',
      name: msg.author?.name || 'You',
      initials: 'ME',
      ts: new Date(msg.createdAt).toLocaleString('en-GB').replace(',', ''),
      text: msg.body,
      attachments: msg.attachments || [],
    };
  },

  async sendMessageWithFiles(ticketId, formData) {
    const res = await apiClient.post(`/tickets/${ticketId}/messages`, formData);
    const msg = res.data;
    return {
      id: msg.id,
      from: 'user',
      name: msg.author?.name || 'You',
      initials: 'ME',
      ts: new Date(msg.createdAt).toLocaleString('en-GB').replace(',', ''),
      text: msg.body,
      attachments: msg.attachments || [],
    };
  },

  /* ── Knowledge Base ── */
  async getKBCategories() {
    await wait();
    return KB_CATEGORIES;
  },

  async getKBArticles(query = '') {
    await wait();
    if (!query) return KB_ARTICLES;
    const q = query.toLowerCase();
    return KB_ARTICLES.filter((a) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  },

  async getFaqs() {
    await wait();
    return KB_FAQS;
  },

  /* ── Announcements ── */
  async getAnnouncements() {
    await wait();
    return ANNOUNCEMENTS;
  },

  async getIncidents() {
    await wait();
    return INCIDENTS;
  },
};
