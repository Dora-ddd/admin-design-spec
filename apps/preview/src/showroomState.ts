export type ShowroomSample = 'generic' | 'terminal';

export function parseShowroomSample(search: string): ShowroomSample {
  return new URLSearchParams(search).get('sample') === 'terminal' ? 'terminal' : 'generic';
}

export function updateShowroomSampleUrl(currentUrl: string, sample: ShowroomSample) {
  const url = new URL(currentUrl);
  url.searchParams.set('sample', sample);
  return url;
}

export function isShowroomExitKey(key: string) {
  return key === 'Escape';
}
