import { Radio } from 'antd';
import type { ComponentProps, ReactNode } from 'react';
import type { RadioProps } from 'antd';
import './company-radio.css';

export type CompanyRadioVisualState = 'default' | 'hover';

export type CompanyRadioProps = RadioProps & {
  visualState?: CompanyRadioVisualState;
};

export function CompanyRadio({
  visualState = 'default',
  className,
  ...radioProps
}: CompanyRadioProps) {
  return <Radio
    {...radioProps}
    className={['company-radio', `is-${visualState}`, className].filter(Boolean).join(' ')}
  />;
}

export type CompanyRadioGroupProps = ComponentProps<typeof Radio.Group>;

export function CompanyRadioGroup({ className, ...groupProps }: CompanyRadioGroupProps) {
  return <Radio.Group
    {...groupProps}
    className={['company-radio-group', className].filter(Boolean).join(' ')}
  />;
}

export type CompanyRadioPillOption = {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
};

export type CompanyRadioPillGroupProps = Omit<CompanyRadioGroupProps, 'options'> & {
  options: CompanyRadioPillOption[];
};

export function CompanyRadioPillGroup({ options, className, ...groupProps }: CompanyRadioPillGroupProps) {
  return <Radio.Group
    {...groupProps}
    className={['company-radio-pill-group', className].filter(Boolean).join(' ')}
  >
    {options.map((option) => <Radio.Button
      key={String(option.value)}
      value={option.value}
      disabled={option.disabled}
    >
      {option.label}
    </Radio.Button>)}
  </Radio.Group>;
}

export type CompanyRadioCardProps = Omit<RadioProps, 'children'> & {
  title: ReactNode;
  description: ReactNode;
  visualState?: CompanyRadioVisualState;
};

export function CompanyRadioCard({
  title,
  description,
  visualState = 'default',
  className,
  ...radioProps
}: CompanyRadioCardProps) {
  return <Radio
    {...radioProps}
    className={['company-radio-card', `is-${visualState}`, className].filter(Boolean).join(' ')}
  >
    <span className="company-radio-card__content">
      <strong>{title}</strong>
      <span>{description}</span>
    </span>
  </Radio>;
}
