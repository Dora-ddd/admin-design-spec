import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { ChartPaletteMode, ChartTheme } from './types';

type ChartProviderValue = {
  paletteMode: ChartPaletteMode;
  theme?: Partial<ChartTheme>;
};

const ChartContext = createContext<ChartProviderValue>({ paletteMode: 'green' });

export type ChartProviderProps = ChartProviderValue & {
  children: ReactNode;
};

export function ChartProvider({ paletteMode, theme, children }: ChartProviderProps) {
  return <ChartContext.Provider value={{ paletteMode, theme }}>{children}</ChartContext.Provider>;
}

export function useChartProvider() {
  return useContext(ChartContext);
}
