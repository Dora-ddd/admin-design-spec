import { lazy, Suspense } from 'react';
import type { ComponentProps } from 'react';
import { ChartFrame } from './ChartFrame';
import { useChartProvider } from './ChartProvider';
import { resolveChartTheme } from './theme';
import type { ChartConfig, ChartRendererProps, ChartSpec, ChartTheme } from './types';

const Line = lazy(() => import('@ant-design/plots').then((module) => ({ default: module.Line })));
const Area = lazy(() => import('@ant-design/plots').then((module) => ({ default: module.Area })));
const Column = lazy(() => import('@ant-design/plots').then((module) => ({ default: module.Column })));
const Bar = lazy(() => import('@ant-design/plots').then((module) => ({ default: module.Bar })));
const Pie = lazy(() => import('@ant-design/plots').then((module) => ({ default: module.Pie })));

function colorScale(spec: ChartSpec, theme: ChartTheme): ChartConfig {
  if (!spec.colorMap) {
    if (!('colorField' in spec)) return { range: [...theme.colors] };

    return {
      domain: [...new Set(spec.data.map((item) => item[spec.colorField]))],
      range: [...theme.colors],
    };
  }

  const entries = Object.entries(spec.colorMap);
  return {
    domain: entries.map(([value]) => value),
    range: entries.map(([, color]) => color in theme.semanticColors
      ? theme.semanticColors[color as keyof typeof theme.semanticColors]
      : color),
  };
}

function singleSeriesStyle(spec: ChartSpec, theme: ChartTheme): ChartConfig | undefined {
  if (!('xField' in spec) || spec.seriesField) return undefined;

  if (spec.type === 'line' || spec.type === 'multi-line') {
    return { stroke: theme.colors[0] };
  }

  if (spec.type === 'area') {
    return { fill: theme.colors[0], stroke: theme.colors[0] };
  }

  return { fill: theme.colors[0] };
}

function baseConfig(spec: ChartSpec, theme: ChartTheme): ChartConfig {
  const defaultStyle = singleSeriesStyle(spec, theme);
  const customStyle = spec.config?.style as ChartConfig | undefined;

  return {
    autoFit: true,
    height: spec.height ?? 280,
    scale: {
      color: colorScale(spec, theme),
    },
    axis: {
      x: {
        title: false,
        labelFill: theme.secondaryTextColor,
        labelOpacity: 1,
        labelFontSize: 12,
        lineStroke: theme.borderColor,
        lineStrokeOpacity: 1,
        tickStroke: theme.borderColor,
        tickStrokeOpacity: 1,
      },
      y: {
        title: false,
        labelFill: theme.secondaryTextColor,
        labelOpacity: 1,
        labelFontSize: 12,
        gridStroke: theme.gridColor,
        gridStrokeOpacity: 1,
        line: false,
        tick: false,
      },
    },
    legend: {
      color: {
        itemLabelFill: theme.secondaryTextColor,
        itemLabelFillOpacity: 1,
        itemLabelFontFamily: theme.fontFamily,
        itemValueFill: theme.textColor,
        itemValueFillOpacity: 1,
        navButtonFill: theme.secondaryTextColor,
        navButtonFillOpacity: 1,
        navPageNumFill: theme.secondaryTextColor,
        navPageNumFillOpacity: 1,
      },
    },
    ...(defaultStyle ? { style: defaultStyle } : {}),
    ...spec.config,
    ...((defaultStyle || customStyle) ? { style: { ...defaultStyle, ...customStyle } } : {}),
  };
}

function renderChart(spec: ChartSpec, theme: ChartTheme) {
  const common = baseConfig(spec, theme);

  if (!('xField' in spec)) {
    // G2's default theta coordinate renders source order counterclockwise.
    // Reverse only the marks so the legend can keep the original data order.
    const data = spec.direction === 'counterclockwise' ? spec.data : [...spec.data].reverse();
    const props = {
      ...common,
      data,
      angleField: spec.angleField,
      colorField: spec.colorField,
      innerRadius: spec.type === 'donut' ? 0.62 : 0,
      axis: false,
    } as ComponentProps<typeof Pie>;
    return <Pie {...props} />;
  }

  const cartesian = {
    ...common,
    data: spec.data,
    xField: spec.xField,
    yField: spec.yField,
    colorField: spec.seriesField,
  };

  switch (spec.type) {
    case 'line':
    case 'multi-line':
      return <Line {...cartesian as ComponentProps<typeof Line>} />;
    case 'area':
      return <Area {...cartesian as ComponentProps<typeof Area>} />;
    case 'bar':
    case 'ranking-bar':
      return <Bar {...cartesian as ComponentProps<typeof Bar>} />;
    case 'grouped-column':
      return <Column {...{ ...cartesian, group: true } as ComponentProps<typeof Column>} />;
    case 'stacked-column':
      return <Column {...{ ...cartesian, stack: true } as ComponentProps<typeof Column>} />;
    case 'column':
      return <Column {...cartesian as ComponentProps<typeof Column>} />;
  }
}

export function ChartRenderer({ spec }: ChartRendererProps) {
  const provider = useChartProvider();
  const theme = resolveChartTheme({ ...provider.theme, ...spec.theme }, spec.paletteMode ?? provider.paletteMode);

  return <ChartFrame
    title={spec.title}
    subtitle={spec.subtitle}
    extra={spec.extra}
    height={spec.height}
    loading={spec.loading}
    emptyText={spec.emptyText}
    hasData={spec.data.length > 0}
    ariaLabel={spec.ariaLabel}
    className={spec.className}
    style={spec.style}
    frame={spec.frame}
    theme={theme}
  >
    <Suspense fallback={<div className="company-chart-frame__state" role="status"><span className="company-chart-frame__spinner" />正在加载</div>}>
      {renderChart(spec, theme)}
    </Suspense>
  </ChartFrame>;
}
