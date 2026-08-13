export type CompanyUploadFileStatus = 'done' | 'uploading' | 'paused' | 'error';

export type CompanyUploadFileItem = {
  id: string;
  name: string;
  status: CompanyUploadFileStatus;
  percent?: number;
  size?: string;
  errorText?: string;
};

export type CompanyUploadFileAction = 'pause' | 'resume' | 'retry' | 'remove';
