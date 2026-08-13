import type { ReactNode } from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import './company-button.css';

export type CompanyButtonVariant = 'primary' | 'secondary' | 'auxiliary' | 'text';

export type CompanyButtonProps = Omit<ButtonProps, 'type' | 'variant'> & {
  variant?: CompanyButtonVariant;
  trailingIcon?: ReactNode;
};

const buttonTypeByVariant: Record<CompanyButtonVariant, ButtonProps['type']> = {
  primary: 'primary',
  secondary: 'default',
  auxiliary: 'default',
  text: 'text',
};

export function CompanyButton({
  variant = 'auxiliary',
  trailingIcon,
  className,
  children,
  ...buttonProps
}: CompanyButtonProps) {
  const classes = ['company-button', `company-button-${variant}`, className].filter(Boolean).join(' ');

  return (
    <Button {...buttonProps} type={buttonTypeByVariant[variant]} className={classes}>
      {children}
      {trailingIcon}
    </Button>
  );
}
