import { matchPath } from 'react-router-dom';
import { adminRouteMeta } from '@/shared/config/routes/admin-routes.config';


export const ROUTE_META = adminRouteMeta;

export function getRouteMeta(pathname) {
  return ROUTE_META.find((route) => matchPath({ path: route.pattern, end: true }, pathname))
    ?? ROUTE_META[0];
}
