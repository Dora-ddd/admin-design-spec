import type { CSSProperties, ReactNode } from 'react';
import { useChartProvider } from './ChartProvider';
import { getChartCssVariables, resolveChartTheme } from './theme';

export type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  trend?: number;
  note?: ReactNode;
  className?: string;
};

export function StatCard({ label, value, unit, trend, note, className }: StatCardProps) {
  const provider = useChartProvider();
  const theme = resolveChartTheme(provider.theme, provider.paletteMode);

  return <article
    className={['company-chart-stat', className].filter(Boolean).join(' ')}
    style={getChartCssVariables(theme)}
  >
    <span className="company-chart-stat__label">{label}</span>
    <div className="company-chart-stat__value"><strong>{value}</strong>{unit && <span>{unit}</span>}</div>
    {(trend !== undefined || note) && <div className="company-chart-stat__meta">
      {trend !== undefined && <span className={trend >= 0 ? 'is-up' : 'is-down'}>{trend >= 0 ? '+' : ''}{trend}%</span>}
      {note && <span>{note}</span>}
    </div>}
  </article>;
}

export type ChartGridProps = {
  children: ReactNode;
  minColumnWidth?: number;
  className?: string;
  style?: CSSProperties;
};

export function ChartGrid({ children, minColumnWidth = 360, className, style }: ChartGridProps) {
  return <div
    className={['company-chart-grid', className].filter(Boolean).join(' ')}
    style={{ '--company-chart-grid-min': `${minColumnWidth}px`, ...style } as CSSProperties}
  >
    {children}
  </div>;
}
