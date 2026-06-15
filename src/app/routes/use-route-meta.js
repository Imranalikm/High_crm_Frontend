import { useLocation } from 'react-router-dom';
import { getRouteMeta } from './route-meta';

export function useRouteMeta() {
  const location = useLocation();
  return getRouteMeta(location.pathname);
}
