import { useState } from 'react';
import { Upload } from 'antd';
import type { UploadProps } from 'antd';
import { CompanyIcon, companyIcons } from '../../iconResources';
import { CompanyUploadFileList } from './CompanyUploadFileList';
import type { CompanyUploadFileAction, CompanyUploadFileItem } from './uploadTypes';

export type CompanyUploadDraggerState = 'default' | 'hover' | 'uploading' | 'error' | 'disabled';

export type CompanyUploadDraggerProps = Omit<UploadProps, 'fileList' | 'showUploadList' | 'beforeUpload'> & {
  visualState?: CompanyUploadDraggerState;
  files?: CompanyUploadFileItem[];
  defaultFiles?: CompanyUploadFileItem[];
  onFilesChange?: (files: CompanyUploadFileItem[]) => void;
  title?: string;
  helperText?: string;
  errorText?: string;
  forceHoverId?: string;
};

export function CompanyUploadDragger({
  visualState = 'default',
  files,
  defaultFiles = [],
  onFilesChange,
  title = '点击或将文件拖拽到这里上传',
  helperText = '支持扩展名：.rar .zip .doc .docx .pdf .jpg...',
  errorText,
  forceHoverId,
  disabled = visualState === 'disabled',
  className,
  ...uploadProps
}: CompanyUploadDraggerProps) {
  const [innerFiles, setInnerFiles] = useState(defaultFiles);
  const currentFiles = files ?? innerFiles;
  const commit = (nextFiles: CompanyUploadFileItem[]) => {
    if (files === undefined) setInnerFiles(nextFiles);
    onFilesChange?.(nextFiles);
  };
  const handleAction = (action: CompanyUploadFileAction, target: CompanyUploadFileItem) => {
    if (action === 'remove') {
      commit(currentFiles.filter((file) => file.id !== target.id));
      return;
    }
    commit(currentFiles.map((file) => {
      if (file.id !== target.id) return file;
      if (action === 'pause') return { ...file, status: 'paused' as const };
      if (action === 'resume') return { ...file, status: 'uploading' as const, percent: Math.max(file.percent ?? 0, 45) };
      return { ...file, status: 'uploading' as const, percent: 10, errorText: undefined };
    }));
  };

  return (
    <div className={['company-upload-dragger-wrap', className].filter(Boolean).join(' ')}>
      <Upload.Dragger
        {...uploadProps}
        disabled={disabled}
        showUploadList={false}
        className={[
          'company-upload-dragger',
          `is-${visualState}`,
        ].join(' ')}
        beforeUpload={(file) => {
          commit([...currentFiles, {
            id: `${file.uid}`,
            name: file.name,
            status: 'uploading',
            percent: 10,
          }]);
          return false;
        }}
      >
        <CompanyIcon className="company-upload-dragger__icon" type={companyIcons.upload} />
        <p className="company-upload-dragger__title">{title}</p>
        <p className="company-upload-dragger__helper">{helperText}</p>
        {errorText ? <p className="company-upload-dragger__error">{errorText}</p> : null}
      </Upload.Dragger>
      <CompanyUploadFileList files={currentFiles} onAction={handleAction} forceHoverId={forceHoverId} />
    </div>
  );
}
