import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { CompanyIcon, companyIcons } from '../../iconResources';
import { CompanyLoadingRing } from '../loading';
import './company-select.css';

export type CompanySelectSize = 'compact' | 'regular' | 'loose';
export type CompanySelectVisualState = 'default' | 'hover' | 'focused' | 'loading' | 'completed' | 'error' | 'disabled';

export type CompanySelectProps<ValueType = string> = Omit<SelectProps<ValueType>, 'size' | 'status'> & {
  companySize?: CompanySelectSize;
  visualState?: CompanySelectVisualState;
};

const antSizeByCompanySize: Record<CompanySelectSize, SelectProps['size']> = {
  compact: 'small',
  regular: 'middle',
  loose: 'large',
};

export function CompanySelect<ValueType = string>({
  companySize,
  visualState = 'default',
  className,
  disabled,
  loading,
  placeholder = '请选择',
  mode,
  maxTagCount,
  maxTagPlaceholder,
  ...selectProps
}: CompanySelectProps<ValueType>) {
  const resolvedLoading = loading || visualState === 'loading';
  const classes = [
    'company-select',
    companySize ? `company-select--${companySize}` : 'company-select--density',
    mode === 'multiple' && 'company-select--multiple',
    `is-${visualState}`,
    className,
  ].filter(Boolean).join(' ');

  return <Select<ValueType>
    {...selectProps}
    className={classes}
    size={companySize ? antSizeByCompanySize[companySize] : undefined}
    status={visualState === 'error' ? 'error' : undefined}
    disabled={disabled || visualState === 'disabled'}
    loading={resolvedLoading}
    mode={mode}
    placeholder={placeholder}
    maxTagCount={mode === 'multiple' ? (maxTagCount ?? 2) : maxTagCount}
    maxTagPlaceholder={maxTagPlaceholder ?? ((omittedValues) => `+${omittedValues.length}...`)}
    suffixIcon={resolvedLoading
      ? <CompanyLoadingRing size={12} strokeWidth={1.5} ariaLabel="选项加载中" />
      : <CompanyIcon type={companyIcons.down} />}
    removeIcon={<CompanyIcon type={companyIcons.close} />}
    clearIcon={<CompanyIcon type={companyIcons.close} />}
    classNames={{ popup: { root: `company-select-dropdown company-select-dropdown--${companySize ?? 'density'}` } }}
  />;
}
