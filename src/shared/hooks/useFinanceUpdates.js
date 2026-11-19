import { useEffect, useRef, useState } from 'react';
import { socketClient } from '@/shared/api/client/socketClient';

/**
 * Returns a counter that increases whenever the backend reports that one of
 * this user's deposits/withdrawals was created or changed status
 * ("finance:updated"). Put it in an effect's dependency list to refetch.
 *
 * @param {'deposit'|'withdrawal'} [kind] only react to this kind (default: both)
 */
export function useFinanceUpdates(kind) {
  const [version, setVersion] = useState(0);
  const kindRef = useRef(kind);

  useEffect(() => {
    kindRef.current = kind;
  }, [kind]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return undefined;
    const socket = socketClient.connect(token);
    const onUpdate = (evt) => {
      if (!kindRef.current || evt?.kind === kindRef.current) setVersion((v) => v + 1);
    };
    socket.on('finance:updated', onUpdate);
    return () => socket.off('finance:updated', onUpdate);
  }, []);

  return version;
}
