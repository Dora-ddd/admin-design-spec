import { CompanyButton } from '../button';
import { CompanyIcon, companyIcons } from '../../iconResources';
import { CompanyUploadFileList } from './CompanyUploadFileList';
import type { CompanyUploadFileItem } from './uploadTypes';

export type CompanyImportProgressProps = {
  completed?: number;
  total?: number;
  percent?: number;
  files?: CompanyUploadFileItem[];
  onCancel?: () => void;
  onClose?: () => void;
  className?: string;
};

const defaultImportFiles: CompanyUploadFileItem[] = [
  { id: 'import-done', name: '终端资产清单.xlsx', status: 'done' },
  { id: 'import-uploading', name: '终端安全策略.xlsx', status: 'uploading', percent: 65 },
  { id: 'import-paused', name: '终端基线配置.xlsx', status: 'paused', percent: 48 },
  { id: 'import-error', name: '终端分组关系.xlsx', status: 'error', percent: 35, errorText: '上传失败！失败原因xxx' },
];

export function CompanyImportProgress({
  completed = 4,
  total = 4,
  percent = 65,
  files = defaultImportFiles,
  onCancel,
  onClose,
  className,
}: CompanyImportProgressProps) {
  const uploaded = files.filter((file) => file.status === 'done').length;
  const uploading = files.filter((file) => file.status === 'uploading').length;
  const paused = files.filter((file) => file.status === 'paused').length;
  const failed = files.filter((file) => file.status === 'error').length;

  return (
    <section className={['company-import-progress', className].filter(Boolean).join(' ')}>
      <header className="company-import-progress__header">
        <strong>导入中</strong>
        <CompanyButton
          variant="text"
          className="company-import-progress__close"
          icon={<CompanyIcon type={companyIcons.closeCircle} />}
          aria-label="关闭导入进度"
          onClick={onClose}
        />
      </header>

      <div className="company-import-progress__summary">
        <img src="/assets/visual/3d-terminal-discovery.png" alt="" />
        <div>
          <h4>已完成进度 <strong>{completed}</strong></h4>
          <div className="company-import-progress__bar" aria-label={`导入进度 ${percent}%`}>
            <span style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
          </div>
          <p>
            文件总数: {total}&nbsp;&nbsp;&nbsp;已上传: {uploaded}&nbsp;&nbsp;&nbsp;上传中: {uploading}&nbsp;&nbsp;&nbsp;暂停: {paused}&nbsp;&nbsp;&nbsp;上传失败: <em>{failed}</em>
          </p>
        </div>
      </div>

      <div className="company-import-progress__files">
        <CompanyUploadFileList files={files} />
      </div>

      <footer className="company-import-progress__footer">
        <CompanyButton variant="primary" onClick={onCancel}>取消导入</CompanyButton>
      </footer>
    </section>
  );
}
