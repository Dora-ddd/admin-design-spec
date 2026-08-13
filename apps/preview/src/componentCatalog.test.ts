/// <reference types="vite/client" />

import { describe, expect, it } from 'vitest';
import { componentCatalogByKey, getComponentSourceInfo } from './componentCatalog';

const repositoryFiles = new Set(
  Object.keys(
    import.meta.glob(
      [
        '../../../apps/**/*.ts',
        '../../../apps/**/*.tsx',
        '../../../docs/**/*.md',
        '../../../packages/**/*.ts',
        '../../../packages/**/*.tsx',
      ],
      { eager: true, import: 'default', query: '?raw' },
    ),
  ).map((path) => (path.startsWith('./') ? `apps/preview/src/${path.slice(2)}` : path.replace('../../../', ''))),
);

function localPath(reference: string) {
  const path = reference.split(' / ')[0];
  return /^(apps|docs|packages)\//.test(path) ? path : undefined;
}

describe('component catalog engineering references', () => {
  it('keeps every local document and code reference resolvable', () => {
    Object.values(componentCatalogByKey).forEach((entry) => {
      [entry.docRef, entry.codeRef].forEach((reference) => {
        const path = localPath(reference);
        if (path) {
          const exists = path.endsWith('/')
            ? [...repositoryFiles].some((file) => file.startsWith(path))
            : repositoryFiles.has(path);
          expect(exists, `${entry.key}: ${path}`).toBe(true);
        }
      });
      expect(entry.code.trim().length, `${entry.key}: code snippet`).toBeGreaterThan(0);
    });
  });

  it('identifies reusable company packages from their real source path', () => {
    expect(getComponentSourceInfo('input')).toMatchObject({ kind: 'company', standalone: true });
    expect(getComponentSourceInfo('table')).toMatchObject({ kind: 'company', standalone: true });
    expect(getComponentSourceInfo('list-page-pattern')).toMatchObject({ kind: 'composed', standalone: false });
  });
});
