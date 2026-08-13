import { describe, expect, it } from 'vitest';
import { adminRoutes, findAdminRoute, findAdminRouteByKey, normalizeAdminPath } from './index';

describe('admin route helpers', () => {
  it('normalizes duplicate and trailing slashes', () => {
    expect(normalizeAdminPath('//')).toBe('/');
    expect(normalizeAdminPath('/asset-config/')).toBe('/asset-config');
  });

  it('resolves known paths and falls back to the first route', () => {
    expect(findAdminRoute('/')).toEqual(adminRoutes[0]);
    expect(findAdminRoute('/missing')).toEqual(adminRoutes[0]);
  });

  it('resolves menu keys and falls back safely', () => {
    expect(findAdminRouteByKey('workspace')).toEqual(adminRoutes[0]);
    expect(findAdminRouteByKey('missing')).toEqual(adminRoutes[0]);
  });
});
