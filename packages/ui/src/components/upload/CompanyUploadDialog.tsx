import { CompanyButton } from '../button';
import { CompanyIcon, companyIcons } from '../../iconResources';
import { CompanyUploadDragger } from './CompanyUploadDragger';
import type { CompanyUploadDraggerState } from './CompanyUploadDragger';
import type { CompanyUploadFileItem } from './uploadTypes';

export type CompanyUploadDialogState =
  | 'default'
  | 'drag'
  | 'format-error'
  | 'size-error'
  | 'uploading'
  | 'success'
  | 'success-hover'
  | 'failure';

export type CompanyUploadDialogProps = {
  state?: CompanyUploadDialogState;
  title?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  onDownloadTemplate?: () => void;
  className?: string;
};

const stateFiles: Partial<Record<CompanyUploadDialogState, CompanyUploadFileItem[]>> = {
  uploading: [{ id: 'dialog-uploading', name: '202310131601480300.xls', status: 'uploading', percent: 65 }],
  success: [{ id: 'dialog-success', name: '202310131601480300.xls', status: 'done' }],
  'success-hover': [{ id: 'dialog-success', name: '202310131601480300.xls', status: 'done' }],
  failure: [{ id: 'dialog-failure', name: '202310131601480300.xls', status: 'error', percent: 42, errorText: '导入失败！失败原因xxx' }],
};

export function CompanyUploadDialog({
  state = 'default',
  title = '上传文件',
  onCancel,
  onConfirm,
  onDownloadTemplate,
  className,
}: CompanyUploadDialogProps) {
  let visualState: CompanyUploadDraggerState = 'default';
  let errorText: string | undefined;
  if (state === 'drag') visualState = 'hover';
  if (state === 'format-error') {
    visualState = 'error';
    errorText = '上传文件格式错误！';
  }
  if (state === 'size-error') {
    visualState = 'error';
    errorText = '上传失败！文件大小不超过x';
  }

  return (
    <section className={['company-upload-dialog', `state-${state}`, className].filter(Boolean).join(' ')}>
      <header className="company-upload-dialog__header">
        <strong>{title}</strong>
        <CompanyButton
          variant="text"
          className="company-upload-dialog__close"
          icon={<CompanyIcon type={companyIcons.closeCircle} />}
          aria-label="关闭上传对话框"
          onClick={onCancel}
        />
      </header>

      <div className="company-upload-dialog__content">
        <CompanyUploadDragger
          visualState={visualState}
          files={stateFiles[state] ?? []}
          forceHoverId={state === 'success-hover' ? 'dialog-success' : undefined}
          helperText="一次只能上传导入一个文件支持扩展名：.xxx格式"
          errorText={errorText}
        />
      </div>

      <footer className="company-upload-dialog__footer">
        <div className="company-upload-dialog__template">
          <button type="button" onClick={onDownloadTemplate}>下载模版</button>
          <span>请下载模版完成填写后上传</span>
        </div>
        <div className="company-upload-dialog__actions">
          <CompanyButton variant="auxiliary" onClick={onCancel}>取消</CompanyButton>
          <CompanyButton variant="auxiliary" onClick={onConfirm}>
            确定
          </CompanyButton>
        </div>
      </footer>
    </section>
  );
}
