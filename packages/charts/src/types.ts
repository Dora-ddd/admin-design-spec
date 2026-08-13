import type { CSSProperties, ReactNode } from 'react';

export type ChartDatum = Record<string, unknown>;
export type ChartConfig = Record<string, unknown>;

export type ChartKind =
  | 'line'
  | 'multi-line'
  | 'area'
  | 'column'
  | 'grouped-column'
  | 'stacked-column'
  | 'bar'
  | 'ranking-bar'
  | 'pie'
  | 'donut';

export type ChartFrameVariant = 'framed' | 'bare';
export type ChartPaletteMode = 'green' | 'blue';
export type ChartDirection = 'clockwise' | 'counterclockwise';
export type ChartSemanticColor = 'critical' | 'highRisk' | 'mediumRisk' | 'lowRisk' | 'success' | 'info';
export type ChartColorReference = ChartSemanticColor | (string & {});

export type ChartSemanticColors = Record<ChartSemanticColor, string>;

export type ChartTheme = {
  colors: readonly string[];
  semanticColors: ChartSemanticColors;
  textColor: string;
  secondaryTextColor: string;
  gridColor: string;
  borderColor: string;
  backgroundColor: string;
  trendUpColor: string;
  trendDownColor: string;
  borderRadius: string;
  fontFamily: string;
};

export type BaseChartSpec = {
  id?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;
  height?: number;
  loading?: boolean;
  emptyText?: ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  frame?: ChartFrameVariant;
  paletteMode?: ChartPaletteMode;
  colorMap?: Readonly<Record<string, ChartColorReference>>;
  theme?: Partial<ChartTheme>;
  config?: ChartConfig;
};

export type CartesianChartSpec = BaseChartSpec & {
  type: Exclude<ChartKind, 'pie' | 'donut'>;
  data: ChartDatum[];
  xField: string;
  yField: string;
  seriesField?: string;
};

export type PieChartSpec = BaseChartSpec & {
  type: 'pie' | 'donut';
  data: ChartDatum[];
  angleField: string;
  colorField: string;
  direction?: ChartDirection;
};

export type ChartSpec = CartesianChartSpec | PieChartSpec;

export type ChartRendererProps = {
  spec: ChartSpec;
};

export type ChartFrameProps = Pick<
  BaseChartSpec,
  'title' | 'subtitle' | 'extra' | 'height' | 'loading' | 'emptyText' | 'ariaLabel' | 'className' | 'style' | 'frame'
> & {
  hasData?: boolean;
  theme?: Partial<ChartTheme>;
  children?: ReactNode;
};
