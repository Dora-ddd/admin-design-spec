import { getChartCssVariables } from './theme';
import { useChartProvider } from './ChartProvider';
import { resolveChartTheme } from './theme';
import type { ChartFrameProps } from './types';

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function ChartFrame({
  title,
  subtitle,
  extra,
  height = 280,
  loading = false,
  emptyText = '暂无数据',
  hasData = true,
  ariaLabel,
  className,
  style,
  frame = 'framed',
  theme,
  children,
}: ChartFrameProps) {
  const provider = useChartProvider();
  const resolvedTheme = resolveChartTheme({ ...provider.theme, ...theme }, provider.paletteMode);

  return <section
    className={classes('company-chart-frame', `company-chart-frame--${frame}`, className)}
    style={{ ...getChartCssVariables(resolvedTheme), ...style }}
    aria-label={ariaLabel ?? (typeof title === 'string' ? title : '数据图表')}
  >
    {(title || subtitle || extra) && <header className="company-chart-frame__header">
      <div className="company-chart-frame__heading">
        {title && <h3>{title}</h3>}
        {subtitle && <p>{subtitle}</p>}
      </div>
      {extra && <div className="company-chart-frame__extra">{extra}</div>}
    </header>}
    <div className="company-chart-frame__body" style={{ height }}>
      {loading
        ? <div className="company-chart-frame__state" role="status"><span className="company-chart-frame__spinner" />正在加载</div>
        : hasData
          ? children
          : <div className="company-chart-frame__state">{emptyText}</div>}
    </div>
  </section>;
}
