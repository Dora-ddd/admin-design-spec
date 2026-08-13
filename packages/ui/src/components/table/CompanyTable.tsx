import type { ReactNode } from 'react';
import { Progress, Table } from 'antd';
import type { TableProps } from 'antd';
import './company-table.css';

export type CompanyTableSize = 'small' | 'large';

export type CompanyTableProps<RecordType extends object = Record<string, unknown>> = Omit<TableProps<RecordType>, 'size'> & {
  size?: CompanyTableSize;
  zebra?: boolean;
};

export function CompanyTable<RecordType extends object = Record<string, unknown>>({
  size = 'large',
  zebra = false,
  className = '',
  rowClassName,
  ...tableProps
}: CompanyTableProps<RecordType>) {
  const resolveRowClassName: TableProps<RecordType>['rowClassName'] = (record, index, indent) => {
    const custom = typeof rowClassName === 'function' ? rowClassName(record, index, indent) : rowClassName;
    return [zebra && index % 2 === 1 ? 'company-table__row--zebra' : '', custom].filter(Boolean).join(' ');
  };

  return <Table<RecordType>
    {...tableProps}
    className={`company-table company-table--${size} ${className}`.trim()}
    size={size === 'small' ? 'small' : 'middle'}
    rowClassName={resolveRowClassName}
  />;
}

export function CompanyTableProgress({ value }: { value: number }) {
  return <Progress className="company-table-progress" percent={value} size="small" showInfo={false} />;
}

export function CompanyTableLink({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return <button type="button" className="company-table-link" onClick={onClick}>{children}</button>;
}

export function CompanyTableActions({ actions }: { actions: Array<{ key: string; label: ReactNode; onClick?: () => void }> }) {
  return <span className="company-table-actions">
    {actions.map((action) => <CompanyTableLink key={action.key} onClick={action.onClick}>{action.label}</CompanyTableLink>)}
  </span>;
}

export function CompanyTableTwoLine({ primary, secondary }: { primary: ReactNode; secondary: ReactNode }) {
  return <span className="company-table-two-line">
    <span>{primary}</span>
    <small>{secondary}</small>
  </span>;
}
