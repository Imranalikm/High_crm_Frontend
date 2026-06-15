import { useEffect, useState } from 'react';
import { supportApi } from '../services/support.api';

export function useSupport() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    supportApi.getStats().then((data) => {
      if (!active) return;
      setStats(data);
      setLoading(false);
    }).catch((err) => {
      if (!active) return;
      setError(err);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return { stats, loading, error };
}
