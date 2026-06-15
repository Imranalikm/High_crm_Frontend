import { adminRouteModules } from '@/config/routes/admin-routes.config';

/**
 * Sidebar Navigation Sections
 * 
 * Defines the high-level groupings for the sidebar navigation menu.
 */

export const adminNavigationSections = [
  { id: 'main', label: 'Main' },
  { id: 'management', label: 'Management' },
  { id: 'system', label: 'System' },
];

const ensureAdminPrefix = (path) => {
  if (path.startsWith('/admin')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/admin${cleanPath}`;
};

export const adminNavigation = adminRouteModules.map((module) => {
  const defaultPath = ensureAdminPrefix(module.defaultPath);

  return {
    id: module.id,
    label: module.label,
    icon: module.icon,
    path: defaultPath,
    permission: module.permission,
    navSection: module.navSection,
    subItems: module.routes
      .filter((route) => route.navLabel)
      .map((route) => {
        const subPath = ensureAdminPrefix(route.path);
        return {
          id: route.id,
          label: route.navLabel,
          path: subPath,
          permission: route.permission,
        };
      }),
  };
});
