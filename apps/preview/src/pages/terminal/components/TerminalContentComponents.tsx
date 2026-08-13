import type { ReactNode } from 'react';
import { Card, Typography } from 'antd';
import { ChartRenderer } from '@company/charts';

const { Text } = Typography;

export type TerminalMetric = {
  key: string;
  title: string;
  value: string;
  unit?: string;
  note: string;
  image: string;
  tone?: 'default' | 'danger' | 'warning';
  target?: string;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function TerminalMetricGroup({ items, onNavigate }: { items: TerminalMetric[]; onNavigate?: (target: string) => void }) {
  return <div className="terminal-metric-group">
    {items.map((item) => {
      const content = <>
        <img src={item.image} alt="" aria-hidden="true" />
        <span className="terminal-metric-copy">
          <span className="terminal-metric-title">{item.title}</span>
          <span className={`terminal-metric-value ${item.tone ?? 'default'}`}>{item.value}{item.unit && <small>{item.unit}</small>}</span>
          <span className="terminal-metric-note">{item.note}</span>
        </span>
      </>;

      return item.target && onNavigate
        ? <button type="button" className="terminal-metric-item interactive" key={item.key} onClick={() => onNavigate(item.target!)}>{content}</button>
        : <div className="terminal-metric-item" key={item.key}>{content}</div>;
    })}
  </div>;
}

export function TerminalBusinessContainer({
  title,
  extra,
  className,
  children,
}: {
  title?: ReactNode;
  extra?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return <Card className={classes('terminal-business-container', className)}>
    {(title || extra) && <div className="terminal-business-heading">
      <Text strong>{title}</Text>
      {extra && <div className="terminal-business-extra">{extra}</div>}
    </div>}
    {children}
  </Card>;
}

export function TerminalSearchField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="terminal-search-field">
    <span>{label}</span>
    <span className="terminal-search-control">{children}</span>
  </label>;
}

const trendData = [
  { label: '周一', event: 48, risk: 26 },
  { label: '周二', event: 66, risk: 38 },
  { label: '周三', event: 54, risk: 31 },
  { label: '周四', event: 76, risk: 45 },
  { label: '周五', event: 62, risk: 34 },
  { label: '周六', event: 42, risk: 22 },
  { label: '周日', event: 58, risk: 29 },
];

const trendSeries = trendData.flatMap((item) => [
  { label: item.label, category: '检测事件', value: item.event },
  { label: item.label, category: '风险事件', value: item.risk },
]);

export function TerminalTrendChart() {
  return <ChartRenderer spec={{
    type: 'grouped-column',
    frame: 'bare',
    height: 220,
    ariaLabel: '安全事件趋势',
    data: trendSeries,
    xField: 'label',
    yField: 'value',
    seriesField: 'category',
  }} />;
}

export function TerminalRiskDistribution() {
  return <div className="terminal-risk-overview">
    <div className="terminal-risk-chart">
      <ChartRenderer spec={{
        type: 'donut',
        frame: 'bare',
        height: 220,
        ariaLabel: '风险分布',
        data: [
          { level: '高危', value: 7 },
          { level: '中危', value: 38 },
          { level: '低危', value: 64 },
        ],
        angleField: 'value',
        colorField: 'level',
        direction: 'clockwise',
        colorMap: { '高危': 'highRisk', '中危': 'mediumRisk', '低危': 'lowRisk' },
        config: { legend: false },
      }} />
      <span className="terminal-risk-total"><strong>109</strong>风险总数</span>
    </div>
    <div className="terminal-risk-legend">
      <div><span><i className="risk-dot high" />高危</span><strong>7</strong></div>
      <div><span><i className="risk-dot medium" />中危</span><strong>38</strong></div>
      <div><span><i className="risk-dot low" />低危</span><strong>64</strong></div>
      <div><span><i className="risk-dot safe" />已处置</span><strong>312</strong></div>
    </div>
  </div>;
}
