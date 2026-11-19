import { useEffect, useSyncExternalStore } from 'react';
import { socketClient } from '@/shared/api/client/socketClient';

/**
 * Live MT5 account data (balance, equity, margin, floating P/L...) pushed by
 * the backend over Socket.IO ("mt5:accounts"). The backend only sends a
 * client their own accounts; admins receive all CRM accounts.
 *
 * One shared store for the whole app, so several components can use the hook
 * without opening extra listeners or losing data between page changes.
 */

let state = { byLogin: {}, feedConnected: null };
const listeners = new Set();
let attachedSocket = null;
let subscribers = 0;

const emit = () => listeners.forEach((l) => l());

const onAccounts = (list) => {
  if (!Array.isArray(list) || !list.length) return;
  const byLogin = { ...state.byLogin };
  list.forEach((a) => { byLogin[String(a.login)] = a; });
  state = { ...state, byLogin };
  emit();
};

const onStatus = ({ connected } = {}) => {
  state = { ...state, feedConnected: !!connected };
  emit();
};

const requestSnapshot = () => attachedSocket?.emit('mt5:snapshot');

function attach() {
  const token = localStorage.getItem('admin_token');
  if (!token) return;
  const socket = socketClient.connect(token);
  if (socket === attachedSocket) return;
  detach();
  attachedSocket = socket;
  socket.on('mt5:accounts', onAccounts);
  socket.on('mt5:status', onStatus);
  socket.on('connect', requestSnapshot); // also after reconnects
  if (socket.connected) requestSnapshot();
}

function detach() {
  if (!attachedSocket) return;
  attachedSocket.off('mt5:accounts', onAccounts);
  attachedSocket.off('mt5:status', onStatus);
  attachedSocket.off('connect', requestSnapshot);
  attachedSocket = null;
}

const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
const getSnapshot = () => state;

export function useLiveMt5Accounts() {
  useEffect(() => {
    subscribers += 1;
    attach();
    return () => {
      subscribers -= 1;
      if (subscribers === 0) detach();
    };
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot);
}

/** Merge live values into a DB account row (accountid = MT5 login). */
export function withLive(account, byLogin) {
  const live = byLogin?.[String(account?.accountid ?? account?.login)];
  if (!live) return { ...account, isLive: false };
  return {
    ...account,
    balance: live.balance,
    equity: live.equity,
    credit: live.credit,
    margin: live.margin,
    marginFree: live.marginFree,
    marginLevel: live.marginLevel,
    floating: live.floating,
    profit: live.profit,
    liveTime: live.time,
    isLive: true,
  };
}
