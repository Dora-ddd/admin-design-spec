import type { ReactNode } from 'react';
import { Popover } from 'antd';
import type { PopoverProps } from 'antd';
import { CompanyButton } from '../button';
import './company-popover.css';

export type CompanyPopoverProps = Omit<PopoverProps, 'content' | 'classNames'> & {
  content: ReactNode;
  withLink?: boolean;
  linkLabel?: ReactNode;
  onLinkClick?: () => void;
  popupClassName?: string;
};

export function CompanyPopover({
  content,
  withLink = false,
  linkLabel = '按钮文本',
  onLinkClick,
  popupClassName,
  children,
  ...popoverProps
}: CompanyPopoverProps) {
  const rootClassName = [
    'company-popover',
    withLink ? 'company-popover--linked' : 'company-popover--plain',
    popupClassName,
  ].filter(Boolean).join(' ');

  return (
    <Popover
      {...popoverProps}
      classNames={{ root: rootClassName }}
      content={(
        <div className="company-popover__content">
          <div className="company-popover__copy">{content}</div>
          {withLink ? (
            <CompanyButton
              className="company-popover__link"
              variant="text"
              size="small"
              onClick={onLinkClick}
            >
              {linkLabel}
            </CompanyButton>
          ) : null}
        </div>
      )}
    >
      {children}
    </Popover>
  );
}
