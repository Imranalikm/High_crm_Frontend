import { useCallback, useEffect, useState } from 'react';
import { kycApi } from '../services/kyc.api';

export function useKyc() {
  const [overview, setOverview] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [nextOverview, nextHistory] = await Promise.all([kycApi.getOverview(), kycApi.getHistory()]);
    setOverview(nextOverview);
    setHistory(nextHistory);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([kycApi.getOverview(), kycApi.getHistory()]).then(([nextOverview, nextHistory]) => {
      if (!active) return;
      setOverview(nextOverview);
      setHistory(nextHistory);
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return { overview, history, loading, refresh };
}
