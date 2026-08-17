import { useState } from 'react';
import type { ReactNode } from 'react';
import { Pagination } from 'antd';
import type { PaginationProps } from 'antd';
import { CompanyInput } from '../input';
import { CompanySelect } from '../select';
import './company-pagination.css';

export type CompanyPaginationProps = Omit<
  PaginationProps,
  'current' | 'defaultCurrent' | 'pageSize' | 'defaultPageSize' | 'pageSizeOptions' | 'showTotal' | 'showSizeChanger' | 'showQuickJumper' | 'onChange' | 'onShowSizeChange'
> & {
  current?: number;
  defaultCurrent?: number;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeOptions?: Array<number | string>;
  showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode);
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
};

export function CompanyPagination({
  current,
  defaultCurrent = 1,
  pageSize,
  defaultPageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
  showTotal = true,
  showSizeChanger = true,
  showQuickJumper = true,
  onChange,
  onShowSizeChange,
  total = 0,
  disabled = false,
  simple = false,
  className,
  ...paginationProps
}: CompanyPaginationProps) {
  const [innerCurrent, setInnerCurrent] = useState(defaultCurrent);
  const [innerPageSize, setInnerPageSize] = useState(defaultPageSize);
  const [jumpValue, setJumpValue] = useState('');
  const resolvedCurrent = current ?? innerCurrent;
  const resolvedPageSize = pageSize ?? innerPageSize;
  const maxPage = Math.max(1, Math.ceil(total / resolvedPageSize));
  const start = total === 0 ? 0 : (resolvedCurrent - 1) * resolvedPageSize + 1;
  const end = Math.min(resolvedCurrent * resolvedPageSize, total);
  const classes = ['company-pagination', simple && 'company-pagination--simple', className].filter(Boolean).join(' ');

  const updatePage = (nextPage: number, nextPageSize = resolvedPageSize) => {
    if (current === undefined) setInnerCurrent(nextPage);
    if (pageSize === undefined) setInnerPageSize(nextPageSize);
    onChange?.(nextPage, nextPageSize);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    const nextPage = Math.min(resolvedCurrent, Math.max(1, Math.ceil(total / nextPageSize)));
    updatePage(nextPage, nextPageSize);
    onShowSizeChange?.(nextPage, nextPageSize);
  };

  const submitJump = () => {
    const parsedPage = Number(jumpValue);
    if (!Number.isInteger(parsedPage) || parsedPage < 1) return;
    updatePage(Math.min(parsedPage, maxPage));
    setJumpValue('');
  };

  if (simple) {
    return <Pagination
      {...paginationProps}
      className={classes}
      current={resolvedCurrent}
      pageSize={resolvedPageSize}
      total={total}
      disabled={disabled}
      simple
      onChange={updatePage}
    />;
  }

  const totalContent = typeof showTotal === 'function'
    ? showTotal(total, [start, end])
    : `共计 ${total} 条`;

  return <div className={classes} aria-label="分页">
    {showTotal ? <span className="company-pagination__total">{totalContent}</span> : null}
    {showSizeChanger ? <CompanySelect<number>
      className="company-pagination__size"
      companySize="regular"
      aria-label="每页条数"
      value={resolvedPageSize}
      disabled={disabled}
      options={pageSizeOptions.map((option) => ({ value: Number(option), label: `${option}条/页` }))}
      onChange={handlePageSizeChange}
    /> : null}
    <Pagination
      {...paginationProps}
      className="company-pagination__track"
      current={resolvedCurrent}
      pageSize={resolvedPageSize}
      total={total}
      disabled={disabled}
      showSizeChanger={false}
      showQuickJumper={false}
      showTotal={undefined}
      responsive={false}
      onChange={updatePage}
    />
    {showQuickJumper ? <span className="company-pagination__jumper">
      <span>前往</span>
      <CompanyInput
        className="company-pagination__jump-input"
        size="regular"
        aria-label="跳转页码"
        inputMode="numeric"
        value={jumpValue}
        disabled={disabled}
        onChange={(event) => setJumpValue(event.target.value.replace(/\D/g, ''))}
        onPressEnter={submitJump}
      />
      <span>页</span>
    </span> : null}
  </div>;
}
