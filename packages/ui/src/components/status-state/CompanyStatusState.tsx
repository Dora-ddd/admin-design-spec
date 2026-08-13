import type { ReactNode } from 'react';
import { Button, Typography } from 'antd';
import './company-status-state.css';

const { Text } = Typography;

export type CompanyExceptionStateProps = {
  image: string;
  title: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export function CompanyExceptionState({ image, title, actionLabel, onAction }: CompanyExceptionStateProps) {
  return (
    <section className="company-status-state" role="status">
      <img src={image} alt="" />
      <Text>{title}</Text>
      {actionLabel && <Button size="small" onClick={onAction}>{actionLabel}</Button>}
    </section>
  );
}

export type CompanyDataLoadingStateProps = {
  columns: string[];
  image: string;
  label?: ReactNode;
};

export function CompanyDataLoadingState({ columns, image, label = '数据加载中' }: CompanyDataLoadingStateProps) {
  return (
    <section className="company-data-loading" aria-busy="true">
      <div className="company-data-loading__head">
        {columns.map((column) => <span key={column}>{column}</span>)}
      </div>
      <div className="company-status-state company-status-state-compact" role="status">
        <img src={image} alt="" />
        <Text type="secondary">{label}</Text>
      </div>
    </section>
  );
}
