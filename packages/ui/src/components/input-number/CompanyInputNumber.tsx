import { InputNumber } from 'antd';
import type { InputNumberProps } from 'antd';
import { CompanyIcon, companyIcons } from '../../iconResources';
import './company-input-number.css';

export type CompanyInputNumberSize = 'compact' | 'regular' | 'loose';
export type CompanyInputNumberVisualState = 'default' | 'hover' | 'focused' | 'typing' | 'stepper' | 'completed' | 'error' | 'disabled';

export type CompanyInputNumberProps = Omit<InputNumberProps, 'size' | 'status'> & {
  size?: CompanyInputNumberSize;
  visualState?: CompanyInputNumberVisualState;
  errorMessage?: string;
};

const antSizeByCompanySize: Record<CompanyInputNumberSize, InputNumberProps['size']> = {
  compact: 'small',
  regular: 'middle',
  loose: 'large',
};

export function CompanyInputNumber({
  size,
  visualState = 'default',
  errorMessage = '请输入0-100之间的数值',
  className,
  disabled,
  controls,
  ...inputNumberProps
}: CompanyInputNumberProps) {
  const isDisabled = disabled || visualState === 'disabled';
  const isError = visualState === 'error';
  const classes = [
    'company-input-number',
    size ? `company-input-number--${size}` : 'company-input-number--density',
    `is-${visualState}`,
    className,
  ].filter(Boolean).join(' ');

  return <div className={`company-input-number-field ${isError ? 'has-error' : ''}`}>
    <InputNumber
      {...inputNumberProps}
      className={classes}
      size={size ? antSizeByCompanySize[size] : undefined}
      status={isError ? 'error' : undefined}
      disabled={isDisabled}
      controls={controls === false ? false : {
        upIcon: <CompanyIcon type={companyIcons.down} className="company-input-number__up-icon" />,
        downIcon: <CompanyIcon type={companyIcons.down} />,
      }}
    />
    {isError ? <span className="company-input-number__error">{errorMessage}</span> : null}
  </div>;
}
