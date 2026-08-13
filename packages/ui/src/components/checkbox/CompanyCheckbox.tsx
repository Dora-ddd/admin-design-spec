import { Checkbox } from 'antd';
import type { ComponentProps } from 'react';
import type { CheckboxProps } from 'antd';
import './company-checkbox.css';

export type CompanyCheckboxVisualState = 'default' | 'hover';

export type CompanyCheckboxProps = CheckboxProps & {
  visualState?: CompanyCheckboxVisualState;
};

export function CompanyCheckbox({
  visualState = 'default',
  className,
  ...checkboxProps
}: CompanyCheckboxProps) {
  const classes = [
    'company-checkbox',
    `is-${visualState}`,
    className,
  ].filter(Boolean).join(' ');

  return <Checkbox {...checkboxProps} className={classes} />;
}

export type CompanyCheckboxGroupProps = ComponentProps<typeof Checkbox.Group>;

export function CompanyCheckboxGroup({ className, ...groupProps }: CompanyCheckboxGroupProps) {
  return <Checkbox.Group
    {...groupProps}
    className={['company-checkbox-group', className].filter(Boolean).join(' ')}
  />;
}
