import { useState } from 'react';
import { Progress, Tooltip, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { CompanyButton } from '../button';
import { CompanyIcon, companyIcons } from '../../iconResources';

export type CompanyPictureUploadStatus = 'done' | 'uploading' | 'error';

export type CompanyPictureUploadItem = {
  id: string;
  name: string;
  src?: string;
  status: CompanyPictureUploadStatus;
  percent?: number;
};

export type CompanyPictureUploadProps = Omit<UploadProps, 'fileList' | 'showUploadList' | 'beforeUpload'> & {
  value?: CompanyPictureUploadItem[];
  defaultValue?: CompanyPictureUploadItem[];
  onChange?: (items: CompanyPictureUploadItem[]) => void;
  maxCount?: number;
  helperText?: string;
  forceHoverId?: string;
};

export function CompanyPictureUpload({
  value,
  defaultValue = [],
  onChange,
  maxCount = 9,
  helperText = '建议尺寸 900*400，最多 9 张，单个图片不超过 20M。',
  forceHoverId,
  disabled,
  className,
  ...uploadProps
}: CompanyPictureUploadProps) {
  const [innerItems, setInnerItems] = useState(defaultValue);
  const items = value ?? innerItems;
  const commit = (nextItems: CompanyPictureUploadItem[]) => {
    if (value === undefined) setInnerItems(nextItems);
    onChange?.(nextItems);
  };

  return (
    <div className={['company-picture-upload', disabled ? 'is-disabled' : '', className].filter(Boolean).join(' ')}>
      <div className="company-picture-upload__grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={[
              'company-picture-upload__item',
              `status-${item.status}`,
              forceHoverId === item.id ? 'is-hover' : '',
            ].filter(Boolean).join(' ')}
          >
            {item.src ? <img src={item.src} alt={item.name} /> : null}
            {item.status === 'uploading' ? (
              <Progress type="circle" size={40} percent={item.percent ?? 45} showInfo={false} />
            ) : null}
            {item.status === 'error' ? (
              <span className="company-picture-upload__error">
                <CompanyIcon type={companyIcons.failed} />
                上传失败
              </span>
            ) : null}
            <Tooltip title="删除图片">
              <CompanyButton
                variant="text"
                className="company-picture-upload__remove"
                icon={<CompanyIcon type={companyIcons.closeCircle} />}
                aria-label={`删除${item.name}`}
                onClick={() => commit(items.filter(({ id }) => id !== item.id))}
              />
            </Tooltip>
          </div>
        ))}

        {items.length < maxCount ? (
          <Upload
            {...uploadProps}
            accept="image/*"
            disabled={disabled}
            showUploadList={false}
            beforeUpload={(file) => {
              commit([...items, {
                id: `${file.uid}`,
                name: file.name,
                src: URL.createObjectURL(file),
                status: 'done',
                percent: 100,
              }]);
              return false;
            }}
          >
            <button type="button" className="company-picture-upload__add" disabled={disabled} aria-label="上传图片">
              <CompanyIcon type={companyIcons.add} />
            </button>
          </Upload>
        ) : null}
      </div>
      <p className="company-picture-upload__helper">{helperText}</p>
    </div>
  );
}
