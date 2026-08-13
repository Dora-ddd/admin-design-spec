import type { KeyboardEvent, ReactNode } from 'react';
import { CompanyIcon, companyIcons } from '../../iconResources';
import { CompanyTag } from '../tags';
import './company-statistic.css';

export type CompanyStatisticVariant =
  | 'trend-up'
  | 'trend-down'
  | 'center'
  | 'left'
  | 'rate'
  | 'ticket'
  | 'ticket-selected'
  | 'summary'
  | 'matrix'
  | 'icon';

export type CompanyStatisticTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export type CompanyStatisticItem = {
  label: string;
  value: ReactNode;
  tone?: CompanyStatisticTone;
};

export type CompanyStatisticProps = {
  variant?: CompanyStatisticVariant;
  title?: ReactNode;
  value?: number | string;
  suffix?: ReactNode;
  icon?: string;
  items?: CompanyStatisticItem[];
  metaLabel?: ReactNode;
  metaValue?: ReactNode;
  tag?: ReactNode;
  className?: string;
  onClick?: () => void;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function formatValue(value: number | string) {
  return typeof value === 'number' ? value.toLocaleString('en-US') : value;
}

const fallbackItems: CompanyStatisticItem[] = [
  { label: '新增待确认', value: 23, tone: 'warning' },
  { label: '变更待确认', value: 12, tone: 'warning' },
];

function StatisticValue({ value, suffix, className }: { value: number | string; suffix?: ReactNode; className?: string }) {
  return <span className={classes('company-statistic__value', className)}>
    <strong>{formatValue(value)}</strong>
    {suffix !== undefined && <span className="company-statistic__suffix">{suffix}</span>}
  </span>;
}

export function CompanyStatistic({
  variant = 'trend-up',
  title = '请求次数(次)',
  value = 12346,
  suffix,
  icon = companyIcons.applicationInfo,
  items = fallbackItems,
  metaLabel = '工单数',
  metaValue = 50,
  tag,
  className,
  onClick,
}: CompanyStatisticProps) {
  const interactive = Boolean(onClick) || variant === 'ticket' || variant === 'ticket-selected';
  const commonProps = interactive ? { role: 'button', tabIndex: 0 } : {};
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onClick || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    onClick();
  };

  if (variant === 'trend-up' || variant === 'trend-down') {
    const rising = variant === 'trend-up';
    return <article className={classes('company-statistic', 'company-statistic--trend', className)}>
      <span className="company-statistic__title">{title}</span>
      <div className="company-statistic__trend-row">
        <StatisticValue value={value} suffix={suffix} />
        <CompanyIcon type={rising ? companyIcons.trendUp : companyIcons.trendDown} className={rising ? 'is-up' : 'is-down'} />
      </div>
    </article>;
  }

  if (variant === 'center' || variant === 'left') {
    return <article className={classes('company-statistic', `company-statistic--${variant}`, className)}>
      <span className="company-statistic__title">{title}</span>
      <StatisticValue value={value} suffix={suffix} />
    </article>;
  }

  if (variant === 'rate') {
    const detailItems = items.length ? items.slice(0, 2) : fallbackItems;
    return <article className={classes('company-statistic', 'company-statistic--rate', className)}>
      <div className="company-statistic__rate-main">
        <StatisticValue value={value} suffix={suffix ?? '%'} />
        <span>{title}</span>
      </div>
      <i className="company-statistic__divider" aria-hidden="true" />
      {detailItems.map((item) => <div className="company-statistic__rate-item" key={item.label}>
        <strong className={`tone-${item.tone ?? 'default'}`}>{item.value}</strong>
        <span>{item.label}</span>
      </div>)}
    </article>;
  }

  if (variant === 'ticket' || variant === 'ticket-selected') {
    const selected = variant === 'ticket-selected';
    return <article
      className={classes('company-statistic', 'company-statistic--ticket', selected && 'is-selected', className)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...commonProps}
    >
      <span className="company-statistic__ticket-icon"><CompanyIcon type={icon} /></span>
      <div className="company-statistic__ticket-content">
        <div className="company-statistic__ticket-heading"><span>{title}</span><small>{metaLabel} <b>{metaValue}</b></small></div>
        <div className="company-statistic__ticket-value"><StatisticValue value={value} />{tag ?? <CompanyTag tone="warning" variant="light">待处理</CompanyTag>}</div>
      </div>
      {selected && <i className="company-statistic__selected-mark" aria-hidden="true" />}
    </article>;
  }

  if (variant === 'summary') {
    return <article className={classes('company-statistic', 'company-statistic--summary', className)}>
      <header><span className="company-statistic__header-icon"><CompanyIcon type={icon} /></span><strong>{title}</strong></header>
      <div className="company-statistic__summary-items">
        <div><span>总数</span><strong>{formatValue(value)}</strong></div>
        {items.slice(0, 2).map((item) => <div key={item.label}><span>{item.label}</span><strong className={`tone-${item.tone ?? 'default'}`}>{item.value}</strong></div>)}
      </div>
    </article>;
  }

  if (variant === 'matrix') {
    return <article className={classes('company-statistic', 'company-statistic--matrix', className)}>
      <div className="company-statistic__matrix-lead">
        <header><span className="company-statistic__header-icon"><CompanyIcon type={icon} /></span><strong>{title}</strong></header>
        <span>总数</span>
        <StatisticValue value={value} />
      </div>
      <div className="company-statistic__matrix-grid">
        {items.slice(0, 4).map((item) => <div key={item.label}><span>{item.label}</span><strong className={`tone-${item.tone ?? 'default'}`}>{item.value}</strong></div>)}
      </div>
    </article>;
  }

  return <article className={classes('company-statistic', 'company-statistic--icon', className)}>
    <span className="company-statistic__icon-tile"><CompanyIcon type={icon} /></span>
    <div className="company-statistic__icon-content">
      <span>{title}</span>
      <div><StatisticValue value={value} />{tag ?? <CompanyTag tone="high" variant="light">高危</CompanyTag>}</div>
      <small>{metaLabel} <b>{metaValue}</b></small>
    </div>
  </article>;
}
