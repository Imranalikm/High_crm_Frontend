import { useEffect, useSyncExternalStore } from 'react';
import { socketClient } from '@/shared/api/client/socketClient';

/**
 * Live MT5 connection health ({ components: { api, manager }, server, checkedAt, probing }),
 * pushed by the backend monitor as "mt5:health" to staff sockets. One module-level store,
 * so the admin banner and the MT5 servers page share it.
 */
let state = null;
const listeners = new Set();
let consumers = 0;
let socket = null;

const emit = () => listeners.forEach((l) => l());
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
const getSnapshot = () => state;

const onHealth = (next) => { state = next; emit(); };
const requestSnapshot = () => socket?.emit('mt5:health:snapshot');

/** Replace the snapshot (e.g. with the result of a manual "Check now"). */
export function setMt5Health(next) {
  if (next) onHealth(next);
}

function connect() {
  const token = localStorage.getItem('admin_token');
  if (!token || socket) return;
  socket = socketClient.connect(token);
  socket.on('mt5:health', onHealth);
  socket.on('connect', requestSnapshot); // catch up after a reconnect
  if (socket.connected) requestSnapshot();
}

function disconnect() {
  if (!socket) return;
  socket.off('mt5:health', onHealth);
  socket.off('connect', requestSnapshot);
  socket = null;
}

/** @returns {null | { components: Record<'api'|'manager', { status: 'ok'|'down'|'unknown', since: number|null, lastOkAt: number|null, lastFailAt: number|null, lastError: string|null }>, server: object, checkedAt: number|null, probing: boolean }} */
export function useMt5Health() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    consumers += 1;
    connect();
    return () => {
      consumers -= 1;
      if (consumers === 0) disconnect();
    };
  }, []);

  return snapshot;
}
