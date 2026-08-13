import type { ReactNode } from 'react';
import { Badge } from 'antd';
import './company-badge.css';

export type CompanyBadgeProps = {
  children?: ReactNode;
  count?: ReactNode;
  dot?: boolean;
  showZero?: boolean;
  overflowCount?: number;
  offset?: [number, number];
  className?: string;
};

export function CompanyBadge({
  children,
  count = 0,
  dot = false,
  showZero = false,
  overflowCount = 999,
  offset,
  className = '',
}: CompanyBadgeProps) {
  return <Badge
    className={`company-badge ${className}`.trim()}
    count={dot ? undefined : count}
    dot={dot}
    showZero={showZero}
    overflowCount={overflowCount}
    offset={offset}
  >
    {children}
  </Badge>;
}
