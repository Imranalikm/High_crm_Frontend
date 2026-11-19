import { useEffect, useSyncExternalStore } from 'react';
import { apiClient } from '@/shared/api/client/apiClient';
import { socketClient } from '@/shared/api/client/socketClient';

/**
 * The signed-in user's in-app notifications (GET /notifications/my), kept in
 * one module-level store so every consumer (dashboard widget, topbar bell)
 * shares the same list and unread count. New ones arrive live over Socket.IO
 * ("new_notification" on the user's own room).
 */
let state = { items: [], unreadCount: 0, loaded: false, error: null };
const listeners = new Set();
let consumers = 0;
let socket = null;
let loading = null;

const emit = () => listeners.forEach((l) => l());
const setState = (patch) => { state = { ...state, ...patch }; emit(); };
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
const getSnapshot = () => state;

function load() {
  if (loading) return loading;
  loading = apiClient.get('/notifications/my?limit=30')
    .then((res) => setState({
      items: Array.isArray(res?.data) ? res.data : [],
      unreadCount: Number(res?.unreadCount) || 0,
      loaded: true,
      error: null,
    }))
    .catch((err) => setState({ loaded: true, error: err?.message || 'Failed to load notifications' }))
    .finally(() => { loading = null; });
  return loading;
}

function onNew(n) {
  if (!n || n.id == null) { load(); return; } // payload without a record: refetch
  if (state.items.some((x) => x.id === n.id)) return;
  setState({
    items: [n, ...state.items].slice(0, 50),
    unreadCount: state.unreadCount + (n.isRead ? 0 : 1),
  });
}

function connect() {
  const token = localStorage.getItem('admin_token');
  if (!token || socket) return;
  socket = socketClient.connect(token);
  socket.on('new_notification', onNew);
  socket.on('connect', load); // catch up after a reconnect
}

function disconnect() {
  if (!socket) return;
  socket.off('new_notification', onNew);
  socket.off('connect', load);
  socket = null;
}

export async function markNotificationRead(id) {
  const target = state.items.find((n) => n.id === id);
  if (!target || target.isRead) return;
  setState({
    items: state.items.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    unreadCount: Math.max(0, state.unreadCount - 1),
  });
  try { await apiClient.put(`/notifications/${id}/read`); } catch { load(); }
}

export async function markAllNotificationsRead() {
  if (!state.unreadCount) return;
  setState({ items: state.items.map((n) => ({ ...n, isRead: true })), unreadCount: 0 });
  try { await apiClient.put('/notifications/mark-all-read'); } catch { load(); }
}

/** @returns {{ items: object[], unreadCount: number, loaded: boolean, error: string|null }} */
export function useMyNotifications() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    consumers += 1;
    if (consumers === 1) { connect(); load(); }
    return () => {
      consumers -= 1;
      if (consumers === 0) disconnect();
    };
  }, []);

  return snapshot;
}
