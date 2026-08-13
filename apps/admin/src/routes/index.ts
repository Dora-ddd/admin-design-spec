export type AdminRoute = {
  key: string;
  path: string;
  title: string;
};

export const adminRoutes: AdminRoute[] = [
  { key: 'workspace', path: '/', title: '工作台' },
];

export function normalizeAdminPath(pathname: string) {
  const normalized = `/${pathname}`.replace(/\/{2,}/g, '/').replace(/\/$/, '');
  return normalized || '/';
}

export function findAdminRoute(pathname: string) {
  const normalizedPath = normalizeAdminPath(pathname);
  return adminRoutes.find((route) => normalizeAdminPath(route.path) === normalizedPath) ?? adminRoutes[0];
}

export function findAdminRouteByKey(key: string) {
  return adminRoutes.find((route) => route.key === key) ?? adminRoutes[0];
}
