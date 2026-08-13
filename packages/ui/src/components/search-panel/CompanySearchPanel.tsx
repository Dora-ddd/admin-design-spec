import type { FormEvent, ReactNode } from 'react';
import { CompanyButton } from '../button';
import './company-search-panel.css';

export type CompanySearchPanelProps = {
  children: ReactNode;
  onSearch: () => void;
  onReset: () => void;
  renderAs?: 'form' | 'div';
  columns?: 2 | 3;
  searchText?: ReactNode;
  resetText?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

export type CompanySearchFieldProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

export function CompanySearchField({ label, children, className }: CompanySearchFieldProps) {
  const classes = ['company-search-field', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <span className="company-search-field__label">{label}</span>
      <div className="company-search-field__control">{children}</div>
    </div>
  );
}

export function CompanySearchPanel({
  children,
  onSearch,
  onReset,
  renderAs = 'form',
  columns = 2,
  searchText = '搜索',
  resetText = '清空',
  loading = false,
  disabled = false,
  className,
  ariaLabel = '搜索条件',
}: CompanySearchPanelProps) {
  const classes = ['company-search-panel', `company-search-panel--columns-${columns}`, className].filter(Boolean).join(' ');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  const content = (
    <div className="company-search-panel__layout">
      {children}
      <div className="company-search-panel__actions">
        <CompanyButton
          variant="primary"
          htmlType={renderAs === 'form' ? 'submit' : 'button'}
          loading={loading}
          disabled={disabled}
          onClick={renderAs === 'div' ? onSearch : undefined}
        >
          {searchText}
        </CompanyButton>
        <CompanyButton variant="auxiliary" htmlType="button" disabled={disabled || loading} onClick={onReset}>
          {resetText}
        </CompanyButton>
      </div>
    </div>
  );

  if (renderAs === 'div') {
    return <div className={classes} role="search" aria-label={ariaLabel}>{content}</div>;
  }

  return <form className={classes} aria-label={ariaLabel} onSubmit={handleSubmit}>{content}</form>;
}
