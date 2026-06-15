import { useEffect, useMemo, useState } from 'react';
import { supportApi } from '../services/support.api';

export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  /* Filters */
  const [statusFilter,   setStatusFilter]   = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    supportApi.getTickets().then((data) => {
      if (!active) return;
      setTickets(data);
      setLoading(false);
    }).catch((err) => {
      if (!active) return;
      setError(err);
      setLoading(false);
    });
    return () => { active = false; };
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
    return () => { active = false; };
  }, [id]);

  const sendMessage = async (text) => {
    const msg = await supportApi.sendMessage(id, text);
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  return { ticket, messages, loading, error, sendMessage };
}
