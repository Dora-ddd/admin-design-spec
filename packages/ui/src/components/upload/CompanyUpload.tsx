import { useState } from 'react';
import { Upload } from 'antd';
import type { UploadProps } from 'antd';
import { CompanyButton } from '../button';
import { CompanyIcon, companyIcons } from '../../iconResources';
import { CompanyUploadFileList } from './CompanyUploadFileList';
import type { CompanyUploadFileAction, CompanyUploadFileItem } from './uploadTypes';

export type CompanyUploadProps = Omit<UploadProps, 'fileList' | 'showUploadList' | 'beforeUpload'> & {
  files?: CompanyUploadFileItem[];
  defaultFiles?: CompanyUploadFileItem[];
  onFilesChange?: (files: CompanyUploadFileItem[]) => void;
  helperText?: string;
  buttonText?: string;
};

function updateFileStatus(
  files: CompanyUploadFileItem[],
  action: CompanyUploadFileAction,
  target: CompanyUploadFileItem,
) {
  if (action === 'remove') return files.filter((file) => file.id !== target.id);
  return files.map((file) => {
    if (file.id !== target.id) return file;
    if (action === 'pause') return { ...file, status: 'paused' as const };
    if (action === 'resume') return { ...file, status: 'uploading' as const, percent: Math.max(file.percent ?? 0, 45) };
    return { ...file, status: 'uploading' as const, percent: 10, errorText: undefined };
  });
}

export function CompanyUpload({
  files,
  defaultFiles = [],
  onFilesChange,
  helperText = '支持扩展名：.rar .zip .doc .docx .pdf .jpg...',
  buttonText = '文件上传',
  disabled,
  className,
  ...uploadProps
}: CompanyUploadProps) {
  const [innerFiles, setInnerFiles] = useState(defaultFiles);
  const currentFiles = files ?? innerFiles;

  const commit = (nextFiles: CompanyUploadFileItem[]) => {
    if (files === undefined) setInnerFiles(nextFiles);
    onFilesChange?.(nextFiles);
  };

  const handleAction = (action: CompanyUploadFileAction, file: CompanyUploadFileItem) => {
    commit(updateFileStatus(currentFiles, action, file));
  };

  return (
    <div className={['company-upload', disabled ? 'is-disabled' : '', className].filter(Boolean).join(' ')}>
      <Upload
        {...uploadProps}
        disabled={disabled}
        showUploadList={false}
        beforeUpload={(file) => {
          commit([
            ...currentFiles,
            {
              id: `${file.uid}`,
              name: file.name,
              status: 'uploading',
              percent: 10,
              size: file.size ? `${Math.max(1, Math.round(file.size / 1024))}KB` : undefined,
            },
          ]);
          return false;
        }}
      >
        <CompanyButton
          variant="auxiliary"
          disabled={disabled}
          icon={<CompanyIcon type={companyIcons.upload} />}
        >
          {buttonText}
        </CompanyButton>
      </Upload>
      <p className="company-upload__helper">{helperText}</p>
      <CompanyUploadFileList files={currentFiles} onAction={handleAction} />
    </div>
  );
}
