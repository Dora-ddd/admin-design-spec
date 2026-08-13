import { Tooltip } from 'antd';
import { CompanyButton } from '../button';
import { CompanyIcon, companyIcons } from '../../iconResources';
import type { CompanyUploadFileAction, CompanyUploadFileItem } from './uploadTypes';

export type CompanyUploadFileListProps = {
  files: CompanyUploadFileItem[];
  onAction?: (action: CompanyUploadFileAction, file: CompanyUploadFileItem) => void;
  forceHoverId?: string;
  className?: string;
};

const statusLabel: Record<CompanyUploadFileItem['status'], string> = {
  done: '上传完成',
  uploading: '上传中',
  paused: '已暂停',
  error: '上传失败',
};

function ActionButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <Tooltip title={label}>
      <CompanyButton
        variant="text"
        className="company-upload-file__action"
        icon={<CompanyIcon type={icon} />}
        aria-label={label}
        onClick={onClick}
      />
    </Tooltip>
  );
}

export function CompanyUploadFileList({ files, onAction, forceHoverId, className }: CompanyUploadFileListProps) {
  if (files.length === 0) return null;

  return (
    <div className={['company-upload-file-list', className].filter(Boolean).join(' ')}>
      {files.map((file) => {
        const percent = file.status === 'done' ? 100 : Math.max(0, Math.min(100, file.percent ?? 0));
        return (
          <div
            key={file.id}
            className={[
              'company-upload-file',
              `status-${file.status}`,
              forceHoverId === file.id ? 'is-hover' : '',
            ].filter(Boolean).join(' ')}
          >
            <div className="company-upload-file__line">
              <span className="company-upload-file__identity">
                <CompanyIcon type={companyIcons.attachment} />
                <span className="company-upload-file__name" title={file.name}>{file.name}</span>
                {file.size ? <small>{file.size}</small> : null}
              </span>
              <span className="company-upload-file__actions">
                {file.status === 'done' && forceHoverId !== file.id ? (
                  <CompanyIcon className="company-upload-file__status-icon" type={companyIcons.success} />
                ) : null}
                {file.status === 'done' && forceHoverId === file.id ? (
                  <ActionButton label="移除文件" icon={companyIcons.closeCircle} onClick={() => onAction?.('remove', file)} />
                ) : null}
                {file.status === 'uploading' ? (
                  <ActionButton label="暂停上传" icon={companyIcons.stop} onClick={() => onAction?.('pause', file)} />
                ) : null}
                {file.status === 'paused' ? (
                  <ActionButton label="继续上传" icon={companyIcons.play} onClick={() => onAction?.('resume', file)} />
                ) : null}
                {file.status === 'error' ? (
                  <ActionButton label="重新上传" icon={companyIcons.refresh} onClick={() => onAction?.('retry', file)} />
                ) : null}
                {file.status !== 'done' ? (
                  <ActionButton label="移除文件" icon={companyIcons.closeCircle} onClick={() => onAction?.('remove', file)} />
                ) : null}
              </span>
            </div>

            {file.status !== 'done' ? (
              <div className="company-upload-file__progress" aria-label={`${statusLabel[file.status]} ${percent}%`}>
                <span style={{ width: `${percent}%` }} />
              </div>
            ) : null}

            {file.status === 'error' ? (
              <p className="company-upload-file__error">{file.errorText ?? '上传失败！失败原因xxx'}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
