import type { CSSProperties } from 'react';
import type { ChartPaletteMode, ChartTheme } from './types';

const BASE_PALETTE_TAIL = [
  '#5D7092',
  '#F6BD16',
  '#E86452',
  '#6DC8EC',
  '#945FB9',
  '#FF9845',
  '#1E9493',
  '#FF99C3',
] as const;

const EXTENDED_PALETTE_TAIL = [
  '#CED4DE',
  '#FCEBB9',
  '#F8D0CB',
  '#D3EEF9',
  '#DECFEA',
  '#FFE0C7',
  '#BBDEDE',
  '#FFE0ED',
] as const;

export const CHART_BASE_PALETTES = {
  green: ['#2FC49A', '#5B8FF9', ...BASE_PALETTE_TAIL],
  blue: ['#5B8FF9', '#2FC49A', ...BASE_PALETTE_TAIL],
} as const satisfies Record<ChartPaletteMode, readonly string[]>;

export const CHART_EXTENDED_PALETTES = {
  green: ['#8BD9C3', '#CDDDFD', ...EXTENDED_PALETTE_TAIL],
  blue: ['#CDDDFD', '#8BD9C3', ...EXTENDED_PALETTE_TAIL],
} as const satisfies Record<ChartPaletteMode, readonly string[]>;

export const CHART_PALETTES = {
  green: [...CHART_BASE_PALETTES.green, ...CHART_EXTENDED_PALETTES.green],
  blue: [...CHART_BASE_PALETTES.blue, ...CHART_EXTENDED_PALETTES.blue],
} as const satisfies Record<ChartPaletteMode, readonly string[]>;

export const DEFAULT_CHART_COLORS = CHART_PALETTES.green;

export function getChartPalette(mode: ChartPaletteMode = 'green') {
  return CHART_PALETTES[mode];
}

export const CHART_COLOR_NAMES = [
  '主题色',
  '次主题色',
  '商务灰',
  '旭日黄',
  '薄暮红',
  '破晓蓝',
  '罗兰紫',
  '落日橘',
  '天水青',
  '桃花粉',
  '主题浅色',
  '次主题浅色',
  '商务浅灰',
  '旭日浅黄',
  '薄暮浅红',
  '破晓浅蓝',
  '罗兰浅紫',
  '落日浅橘',
  '天水浅青',
  '桃花浅粉',
] as const;

export const DEFAULT_CHART_THEME: ChartTheme = {
  colors: DEFAULT_CHART_COLORS,
  semanticColors: {
    critical: '#F0131E',
    highRisk: '#F05A0A',
    mediumRisk: '#F58A02',
    lowRisk: '#DFBC00',
    success: '#52C41A',
    info: '#1890FF',
  },
  textColor: '#242933',
  secondaryTextColor: '#8A9099',
  gridColor: '#E8EAED',
  borderColor: '#DFE1E6',
  backgroundColor: '#FFFFFF',
  trendUpColor: '#D4380D',
  trendDownColor: '#389E0D',
  borderRadius: '6px',
  fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
};

export function resolveChartTheme(theme?: Partial<ChartTheme>, paletteMode: ChartPaletteMode = 'green'): ChartTheme {
  return {
    ...DEFAULT_CHART_THEME,
    ...theme,
    colors: theme?.colors?.length ? theme.colors : getChartPalette(paletteMode),
    semanticColors: {
      ...DEFAULT_CHART_THEME.semanticColors,
      ...theme?.semanticColors,
    },
  };
}

export function getChartCssVariables(theme?: Partial<ChartTheme>): CSSProperties {
  const resolved = resolveChartTheme(theme);

  return {
    '--company-chart-text': resolved.textColor,
    '--company-chart-text-secondary': resolved.secondaryTextColor,
    '--company-chart-grid': resolved.gridColor,
    '--company-chart-border': resolved.borderColor,
    '--company-chart-background': resolved.backgroundColor,
    '--company-chart-trend-up': resolved.trendUpColor,
    '--company-chart-trend-down': resolved.trendDownColor,
    '--company-chart-critical': resolved.semanticColors.critical,
    '--company-chart-high-risk': resolved.semanticColors.highRisk,
    '--company-chart-medium-risk': resolved.semanticColors.mediumRisk,
    '--company-chart-low-risk': resolved.semanticColors.lowRisk,
    '--company-chart-success': resolved.semanticColors.success,
    '--company-chart-info': resolved.semanticColors.info,
    '--company-chart-radius': resolved.borderRadius,
    '--company-chart-font-family': resolved.fontFamily,
  } as CSSProperties;
}
