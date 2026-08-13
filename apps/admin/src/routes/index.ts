export type AdminRoute = {
  key: string;
  path: string;
  title: string;
};

export const adminRoutes: AdminRoute[] = [
  { key: 'workspace', path: '/', title: '工作台' },
];
