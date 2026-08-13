import type { ReactNode } from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';
import './company-input.css';

export type CompanyInputSize = 'compact' | 'regular' | 'loose';
export type CompanyInputVisualState = 'default' | 'hover' | 'focused' | 'completed' | 'error' | 'disabled';

export type CompanyInputProps = Omit<InputProps, 'size' | 'status' | 'prefix' | 'suffix'> & {
  size?: CompanyInputSize;
  visualState?: CompanyInputVisualState;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  leadingLabel?: ReactNode;
  trailingLabel?: ReactNode;
};

const antSizeByCompanySize: Record<CompanyInputSize, InputProps['size']> = {
  compact: 'small',
  regular: 'middle',
  loose: 'large',
};

function InputAffix({ kind, children }: { kind: 'icon' | 'label'; children: ReactNode }) {
  return <span className={`company-input__${kind}`}>{children}</span>;
}

export function CompanyInput({
  size,
  visualState = 'default',
  prefixIcon,
  suffixIcon,
  leadingLabel,
  trailingLabel,
  className,
  disabled,
  readOnly,
  value,
  defaultValue,
  ...inputProps
}: CompanyInputProps) {
  const isDisabled = disabled || visualState === 'disabled';
  const isError = visualState === 'error';
  const classes = [
    'company-input',
    size ? `company-input--${size}` : 'company-input--density',
    `is-${visualState}`,
    className,
  ].filter(Boolean).join(' ');

  const prefix = prefixIcon || leadingLabel
    ? <span className="company-input__affix-group">
      {leadingLabel ? <InputAffix kind="label">{leadingLabel}</InputAffix> : null}
      {prefixIcon ? <InputAffix kind="icon">{prefixIcon}</InputAffix> : null}
    </span>
    : undefined;

  const suffix = suffixIcon || trailingLabel
    ? <span className="company-input__affix-group">
      {suffixIcon ? <InputAffix kind="icon">{suffixIcon}</InputAffix> : null}
      {trailingLabel ? <InputAffix kind="label">{trailingLabel}</InputAffix> : null}
    </span>
    : undefined;

  return <Input
    {...inputProps}
    className={classes}
    size={size ? antSizeByCompanySize[size] : undefined}
    status={isError ? 'error' : undefined}
    disabled={isDisabled}
    readOnly={readOnly}
    value={value}
    defaultValue={defaultValue}
    prefix={prefix}
    suffix={suffix}
  />;
}
