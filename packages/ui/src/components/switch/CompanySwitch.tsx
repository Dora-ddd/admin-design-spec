import { Switch } from 'antd';
import type { SwitchProps } from 'antd';
import './company-switch.css';

export type CompanySwitchSize = 'large' | 'small';

export type CompanySwitchProps = Omit<SwitchProps, 'size'> & {
  size?: CompanySwitchSize;
};

export function CompanySwitch({
  size = 'large',
  className,
  ...switchProps
}: CompanySwitchProps) {
  const classes = [
    'company-switch',
    `company-switch--${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Switch
      {...switchProps}
      className={classes}
      size={size === 'small' ? 'small' : 'default'}
    />
  );
}
