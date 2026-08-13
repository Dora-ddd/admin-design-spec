import { describe, expect, it } from 'vitest';
import { isShowroomExitKey, parseShowroomSample, updateShowroomSampleUrl } from './showroomState';

describe('showroom URL and fullscreen state', () => {
  it('uses the generic sample by default and accepts the terminal sample', () => {
    expect(parseShowroomSample('')).toBe('generic');
    expect(parseShowroomSample('?sample=terminal')).toBe('terminal');
    expect(parseShowroomSample('?sample=unknown')).toBe('generic');
  });

  it('updates only the sample query parameter', () => {
    const updated = updateShowroomSampleUrl('http://localhost:5173/?page=showroom&terminal=events', 'terminal');
    expect(updated.searchParams.get('page')).toBe('showroom');
    expect(updated.searchParams.get('terminal')).toBe('events');
    expect(updated.searchParams.get('sample')).toBe('terminal');
  });

  it('exits fullscreen only for Escape', () => {
    expect(isShowroomExitKey('Escape')).toBe(true);
    expect(isShowroomExitKey('Enter')).toBe(false);
  });
});
