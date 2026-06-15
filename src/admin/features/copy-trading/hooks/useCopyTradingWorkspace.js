import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

export function useCopyTradingWorkspace() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const parts = location.pathname.split('/');
    const lastPart = parts[parts.length - 1];
    const validTabs = ['strategies', 'providers', 'followers', 'subscriptions', 'performance', 'logs'];
    return validTabs.includes(lastPart) ? lastPart : 'strategies';
  }, [location.pathname]);

  const setActiveTab = (tabId) => {
    navigate(`/admin/copy-trading/${tabId}`);
  };

  return {
    activeTab,
    setActiveTab,
  };
}

export default useCopyTradingWorkspace;
