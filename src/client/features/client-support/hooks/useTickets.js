import { useEffect, useMemo, useState } from 'react';
import { supportApi } from '../services/support.api';
import { socketClient } from '@/shared/api/client/socketClient';

export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  /* Filters */
  const [statusFilter,   setStatusFilter]   = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchTickets = () => {
    setLoading(true);
    supportApi.getTickets().then((data) => {
      setTickets(data);
      setLoading(false);
    }).catch((err) => {
      setError(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filtered = useMemo(() => {
    let rows = [...tickets];
    if (statusFilter   !== 'ALL') rows = rows.filter((t) => t.status   === statusFilter);
    if (categoryFilter !== 'ALL') rows = rows.filter((t) => t.category === categoryFilter);
    if (priorityFilter !== 'ALL') rows = rows.filter((t) => t.priority === priorityFilter);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((t) => t.subject.toLowerCase().includes(q) || t.id.includes(q));
    }
    return rows;
  }, [tickets, statusFilter, categoryFilter, priorityFilter, search]);

  return {
    tickets, filtered, loading, error,
    statusFilter,   setStatusFilter,
    categoryFilter, setCategoryFilter,
    priorityFilter, setPriorityFilter,
    search, setSearch,
    refresh: fetchTickets
  };
}

export function useTicket(id) {
  const [ticket, setTicket]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [messages, setMessages] = useState([]);

  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    setLoading(true);
  }

  useEffect(() => {
    if (!id) return;
    let active = true;

    // Connect socket
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
    const socket = socketClient.connect(token);
    
    socket.emit('join_ticket', id);

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, {
          id: msg.id,
          from: msg.type === 'user' ? 'user' : 'support',
          name: msg.author?.name || (msg.type === 'user' ? 'You' : 'Support'),
          initials: msg.type === 'user' ? 'ME' : 'SA',
          ts: new Date(msg.createdAt).toLocaleString('en-GB').replace(',', ''),
          text: msg.body,
          attachments: msg.attachments || []
        }];
      });
    };

    socket.on('new_message', handleNewMessage);

    supportApi.getTicket(id).then((data) => {
      if (!active) return;
      const { conversation = [], ...meta } = data;
      setTicket(meta);
      setMessages(conversation);
      setLoading(false);
    }).catch((err) => {
      if (!active) return;
      setError(err);
      setLoading(false);
    });

    return () => { 
      active = false; 
      socket.off('new_message', handleNewMessage);
      socket.emit('leave_ticket', id);
    };
  }, [id]);

  const sendMessage = async (text, files = []) => {
    let msg;
    if (files.length > 0) {
      const formData = new FormData();
      if (text?.trim()) formData.append('body', text.trim());
      formData.append('type', 'user');
      files.forEach((f) => formData.append('attachments', f));
      msg = await supportApi.sendMessageWithFiles(id, formData);
    } else {
      msg = await supportApi.sendMessage(id, text);
    }
    return msg;
  };

  return { ticket, messages, loading, error, sendMessage };
}
