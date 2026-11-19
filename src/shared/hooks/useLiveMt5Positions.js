import { useEffect, useState } from 'react';
import { socketClient } from '@/shared/api/client/socketClient';

/**
 * Live open MT5 positions for admins, pushed by the backend over Socket.IO
 * ("mt5:positions": { reset, upsert[], remove[] }).
 *
 * @returns {{ positions: object[], feedConnected: boolean|null, ready: boolean }}
 */
export function useLiveMt5Positions() {
  const [byId, setById] = useState({});
  const [ready, setReady] = useState(false);
  const [feedConnected, setFeedConnected] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return undefined;
    const socket = socketClient.connect(token);

    const onPositions = ({ reset, upsert = [], remove = [] } = {}) => {
      setById((prev) => {
        const next = reset ? {} : { ...prev };
        upsert.forEach((p) => { next[p.positionId] = p; });
        remove.forEach((id) => { delete next[id]; });
        return next;
      });
      if (reset) setReady(true);
    };
    const onStatus = (s = {}) => {
      if (typeof s.positions === 'boolean') setFeedConnected(s.positions);
    };
    const requestSnapshot = () => socket.emit('mt5:positions:snapshot');

    socket.on('mt5:positions', onPositions);
    socket.on('mt5:status', onStatus);
    socket.on('connect', requestSnapshot);
    if (socket.connected) requestSnapshot();

    return () => {
      socket.off('mt5:positions', onPositions);
      socket.off('mt5:status', onStatus);
      socket.off('connect', requestSnapshot);
    };
  }, []);

  return { positions: Object.values(byId), feedConnected, ready };
}
