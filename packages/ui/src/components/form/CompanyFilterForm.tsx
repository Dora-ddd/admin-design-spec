import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { CompanyIcon, companyIcons } from '../../iconResources';
import { CompanyButton } from '../button';
import { CompanyInput } from '../input';
import { CompanySelect } from '../select';
import './company-form.css';

export type CompanyFilterFormVariant = 'inline' | 'labeled' | 'section';

export type CompanyFilterFormProps = {
  children: ReactNode;
  variant?: CompanyFilterFormVariant;
  title?: ReactNode;
  columns?: 2 | 3;
  searchText?: ReactNode;
  resetText?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onSearch: () => void;
  onReset: () => void;
};

export type CompanyFilterFieldProps = {
  label?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function CompanyFilterField({ label, children, className }: CompanyFilterFieldProps) {
  return (
    <div className={['company-filter-field', className].filter(Boolean).join(' ')}>
      {label ? <span className="company-filter-field__label">{label}</span> : null}
      <div className="company-filter-field__control">{children}</div>
    </div>
  );
}

export function CompanyFilterForm({
  children,
  variant = 'labeled',
  title = '查询',
  columns = 3,
  searchText = '搜索',
  resetText = '重置',
  disabled = false,
  loading = false,
  className,
  onSearch,
  onReset,
}: CompanyFilterFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form
      className={['company-filter-form', `company-filter-form--${variant}`, `company-filter-form--columns-${columns}`, className].filter(Boolean).join(' ')}
      aria-label="筛选条件"
      onSubmit={handleSubmit}
    >
      {variant === 'section' ? <h3 className="company-filter-form__title">{title}</h3> : null}
      <div className="company-filter-form__content">
        <div className="company-filter-form__fields">{children}</div>
        <div className="company-filter-form__actions">
          <CompanyButton variant="primary" htmlType="submit" loading={loading} disabled={disabled}>{searchText}</CompanyButton>
          <CompanyButton variant="auxiliary" htmlType="button" disabled={disabled || loading} onClick={onReset}>{resetText}</CompanyButton>
        </div>
      </div>
    </form>
  );
}

export type CompanySearchBarOption = { label: string; value: string };

export type CompanySearchBarProps = {
  scopeOptions?: CompanySearchBarOption[];
  defaultScope?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onSearch?: (value: string, scope: string) => void;
};

const defaultSearchScopes: CompanySearchBarOption[] = [
  { label: '全部', value: 'all' },
  { label: '事件', value: 'event' },
  { label: '终端', value: 'terminal' },
];

export function CompanySearchBar({
  scopeOptions = defaultSearchScopes,
  defaultScope,
  defaultValue = '',
  placeholder = '请输入关键词',
  disabled = false,
  className,
  onSearch,
}: CompanySearchBarProps) {
  const [scope, setScope] = useState(defaultScope ?? scopeOptions[0]?.value ?? '');
  const [value, setValue] = useState(defaultValue);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(value, scope);
  };

  return (
    <form className={['company-search-bar', className].filter(Boolean).join(' ')} role="search" onSubmit={submit}>
      <CompanySelect
        className="company-search-bar__scope"
        value={scope}
        disabled={disabled}
        options={scopeOptions}
        onChange={setScope}
      />
      <span className="company-search-bar__divider" aria-hidden="true" />
      <CompanyInput
        className="company-search-bar__input"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
      />
      <CompanyButton
        className="company-search-bar__submit"
        variant="primary"
        htmlType="submit"
        icon={<CompanyIcon type={companyIcons.search} />}
        disabled={disabled}
        aria-label="搜索"
      />
    </form>
  );
}
