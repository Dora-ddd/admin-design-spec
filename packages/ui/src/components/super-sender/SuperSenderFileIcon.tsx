import './super-sender-file-icon.css';

const fileIconUrls = {
  word: new URL('./assets/file-icons/word.png', import.meta.url).href,
  excel: new URL('./assets/file-icons/excel.png', import.meta.url).href,
  ppt: new URL('./assets/file-icons/ppt.png', import.meta.url).href,
  pdf: new URL('./assets/file-icons/pdf.png', import.meta.url).href,
  txt: new URL('./assets/file-icons/txt.png', import.meta.url).href,
  audio: new URL('./assets/file-icons/audio.png', import.meta.url).href,
  video: new URL('./assets/file-icons/video.png', import.meta.url).href,
  image: new URL('./assets/file-icons/image.png', import.meta.url).href,
  archive: new URL('./assets/file-icons/archive.png', import.meta.url).href,
  exe: new URL('./assets/file-icons/exe.png', import.meta.url).href,
  markdown: new URL('./assets/file-icons/markdown.png', import.meta.url).href,
  json: new URL('./assets/file-icons/json.png', import.meta.url).href,
  yaml: new URL('./assets/file-icons/yaml.png', import.meta.url).href,
  csv: new URL('./assets/file-icons/csv.png', import.meta.url).href,
  document: new URL('./assets/file-icons/document.png', import.meta.url).href,
  gif: new URL('./assets/file-icons/gif.png', import.meta.url).href,
  svg: new URL('./assets/file-icons/svg.png', import.meta.url).href,
  unknown: new URL('./assets/file-icons/unknown.png', import.meta.url).href,
} as const;

export type SuperSenderFileType = keyof typeof fileIconUrls | 'file';

const extensionGroups: Array<[SuperSenderFileType, string[]]> = [
  ['word', ['doc', 'docx', 'rtf']],
  ['excel', ['xls', 'xlsx', 'et']],
  ['ppt', ['ppt', 'pptx', 'dps']],
  ['pdf', ['pdf']],
  ['txt', ['txt', 'log']],
  ['audio', ['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg']],
  ['video', ['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v']],
  ['gif', ['gif']],
  ['svg', ['svg']],
  ['image', ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tif', 'tiff']],
  ['archive', ['zip', 'rar', '7z', 'tar', 'gz', 'bz2']],
  ['exe', ['exe', 'msi', 'dmg', 'pkg']],
  ['markdown', ['md', 'markdown']],
  ['json', ['json']],
  ['yaml', ['yaml', 'yml']],
  ['csv', ['csv']],
  ['document', ['html', 'htm', 'xml', 'pages']],
];

export function inferSuperSenderFileType(name: string): SuperSenderFileType {
  const extension = name.split('.').pop()?.toLowerCase();
  if (!extension || extension === name.toLowerCase()) return 'unknown';
  return extensionGroups.find(([, extensions]) => extensions.includes(extension))?.[0] ?? 'unknown';
}

export function SuperSenderFileIcon({ type }: { type: SuperSenderFileType }) {
  const normalizedType = type === 'file' ? 'unknown' : type;
  return <img className="company-super-sender-file-icon" src={fileIconUrls[normalizedType]} alt="" aria-hidden="true" />;
}
