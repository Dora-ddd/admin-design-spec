import { TreeSelect } from 'antd';
import type { TreeSelectProps } from 'antd';
import { CompanyIcon, companyIcons } from '../../iconResources';
import './company-tree-select.css';

export type CompanyTreeSelectSize = 'compact' | 'regular' | 'loose';
export type CompanyTreeSelectVisualState = 'default' | 'hover' | 'focused' | 'error' | 'disabled';

export type CompanyTreeSelectProps = Omit<TreeSelectProps, 'size' | 'status' | 'classNames'> & {
  companySize?: CompanyTreeSelectSize;
  visualState?: CompanyTreeSelectVisualState;
};

const antSizeByCompanySize: Record<CompanyTreeSelectSize, TreeSelectProps['size']> = {
  compact: 'small',
  regular: 'middle',
  loose: 'large',
};

export function CompanyTreeSelect({
  companySize,
  visualState = 'default',
  className,
  disabled,
  multiple,
  treeCheckable,
  treeCheckStrictly,
  popupClassName,
  placeholder = '请选择',
  popupMatchSelectWidth,
  ...treeSelectProps
}: CompanyTreeSelectProps) {
  const resolvedCheckable = treeCheckable ?? multiple;
  const density = companySize ?? 'density';
  const classes = [
    'company-tree-select',
    `company-tree-select--${density}`,
    resolvedCheckable && 'company-tree-select--multiple',
    `is-${visualState}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <TreeSelect
      {...treeSelectProps}
      className={classes}
      size={companySize ? antSizeByCompanySize[companySize] : undefined}
      status={visualState === 'error' ? 'error' : undefined}
      disabled={disabled || visualState === 'disabled'}
      multiple={multiple}
      treeCheckable={resolvedCheckable}
      treeCheckStrictly={treeCheckStrictly ?? Boolean(resolvedCheckable)}
      placeholder={placeholder}
      popupClassName={['company-tree-select-dropdown', `company-tree-select-dropdown--${density}`, resolvedCheckable ? 'is-checkable' : '', popupClassName].filter(Boolean).join(' ')}
      popupMatchSelectWidth={popupMatchSelectWidth ?? (resolvedCheckable ? 267 : 239)}
      suffixIcon={<CompanyIcon type={companyIcons.down} />}
      switcherIcon={<CompanyIcon type={companyIcons.down} />}
      removeIcon={<CompanyIcon type={companyIcons.close} />}
      treeNodeFilterProp="title"
    />
  );
}
