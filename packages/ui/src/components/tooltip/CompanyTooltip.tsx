import type { ReactElement, ReactNode } from 'react';
import { Tooltip } from 'antd';
import type { TooltipProps } from 'antd';
import './company-tooltip.css';

export type CompanyTooltipPlacement = NonNullable<TooltipProps['placement']>;
export type CompanyTooltipTrigger = NonNullable<TooltipProps['trigger']>;

export type CompanyTooltipProps = {
  title: ReactNode;
  children: ReactElement;
  placement?: CompanyTooltipPlacement;
  trigger?: CompanyTooltipTrigger;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

export function CompanyTooltip({
  title,
  children,
  placement = 'top',
  trigger = ['hover', 'focus'],
  open,
  defaultOpen,
  disabled = false,
  className = '',
  onOpenChange,
}: CompanyTooltipProps) {
  return <Tooltip
    title={disabled ? null : title}
    placement={placement}
    trigger={trigger}
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    classNames={{ root: `company-tooltip ${className}`.trim() }}
  >
    {children}
  </Tooltip>;
}
