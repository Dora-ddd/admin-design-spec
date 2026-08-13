import type { ReactNode } from 'react';
import { Breadcrumb } from 'antd';
import type { BreadcrumbProps } from 'antd';
import './company-page-header.css';

export type CompanyPageHeaderProps = {
  breadcrumbItems: NonNullable<BreadcrumbProps['items']>;
  actions?: ReactNode;
  className?: string;
};

export function CompanyPageHeader({ breadcrumbItems, actions, className }: CompanyPageHeaderProps) {
  const classes = ['company-page-header', className].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      <Breadcrumb items={breadcrumbItems} />
      {actions && <div className="company-page-header__actions">{actions}</div>}
    </header>
  );
}
