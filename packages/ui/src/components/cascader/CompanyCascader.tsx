import { Cascader } from 'antd';
import type { ReactElement } from 'react';
import type { CascaderProps } from 'antd';
import { CompanyIcon, companyIcons } from '../../iconResources';
import './company-cascader.css';

export type CompanyCascaderSize = 'compact' | 'regular' | 'loose';
export type CompanyCascaderVisualState = 'default' | 'hover' | 'focused' | 'error' | 'disabled';

export type CompanyCascaderProps = Omit<CascaderProps, 'size' | 'status'> & {
  companySize?: CompanyCascaderSize;
  visualState?: CompanyCascaderVisualState;
};

type CascaderRendererProps = CompanyCascaderProps & Pick<CascaderProps, 'size' | 'status' | 'suffixIcon' | 'classNames'>;

const CascaderRenderer = Cascader as unknown as (props: CascaderRendererProps) => ReactElement;

const antSizeByCompanySize: Record<CompanyCascaderSize, CascaderProps['size']> = {
  compact: 'small',
  regular: 'middle',
  loose: 'large',
};

export function CompanyCascader({
  companySize,
  visualState = 'default',
  className,
  disabled,
  placeholder = '请选择',
  ...cascaderProps
}: CompanyCascaderProps) {
  const classes = [
    'company-cascader',
    companySize ? `company-cascader--${companySize}` : 'company-cascader--density',
    `is-${visualState}`,
    className,
  ].filter(Boolean).join(' ');

  return <CascaderRenderer
    {...cascaderProps}
    className={classes}
    size={companySize ? antSizeByCompanySize[companySize] : undefined}
    status={visualState === 'error' ? 'error' : undefined}
    disabled={disabled || visualState === 'disabled'}
    placeholder={placeholder}
    suffixIcon={<CompanyIcon type={companyIcons.down} />}
    classNames={{ popup: { root: 'company-cascader-dropdown' } }}
  />;
}
