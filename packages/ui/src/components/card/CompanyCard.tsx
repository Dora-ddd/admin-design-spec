import { Card } from 'antd';
import type { CardProps } from 'antd';
import './company-card.css';

export type CompanyCardProps = Omit<CardProps, 'bordered' | 'variant'> & {
  bordered?: boolean;
};

export function CompanyCard({
  bordered = true,
  className,
  children,
  ...cardProps
}: CompanyCardProps) {
  const classes = [
    'company-card',
    bordered ? 'company-card--bordered' : 'company-card--borderless',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Card {...cardProps} className={classes} variant={bordered ? 'outlined' : 'borderless'}>
      {children}
    </Card>
  );
}
