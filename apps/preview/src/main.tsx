import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntApp, ConfigProvider } from 'antd';
import { ChartProvider, type ChartTheme } from '@company/charts';
import zhCN from 'antd/locale/zh_CN';
import App from './App';
import '@company/charts/style.css';
import {
  DEFAULT_DENSITY,
  DEFAULT_MODE,
  DENSITY_COMPONENT_SIZES,
  DENSITY_MODES,
  THEME_MODES,
  getCompanyCssVariables,
  getCompanyTheme,
  getThemeTokens,
  type DensityMode,
  type ThemeMode,
} from '@company/theme';
import './styles.css';

const storedThemeMode = window.localStorage.getItem('company-preview-theme');
const storedDensityMode = window.localStorage.getItem('company-preview-density');
const initialThemeMode = THEME_MODES.includes(storedThemeMode as ThemeMode) ? storedThemeMode as ThemeMode : DEFAULT_MODE;
const initialDensityMode = DENSITY_MODES.includes(storedDensityMode as DensityMode) ? storedDensityMode as DensityMode : DEFAULT_DENSITY;

function applyPreviewPreferences(themeMode: ThemeMode, densityMode: DensityMode) {
  Object.entries(getCompanyCssVariables(themeMode)).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, String(value));
  });
  document.documentElement.dataset.theme = themeMode;
  document.documentElement.dataset.density = densityMode;
  document.documentElement.style.colorScheme = themeMode.includes('暗黑') ? 'dark' : 'light';
}

applyPreviewPreferences(initialThemeMode, initialDensityMode);

function PreviewRoot() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialThemeMode);
  const [densityMode, setDensityMode] = useState<DensityMode>(initialDensityMode);
  const companyTheme = useMemo(() => getCompanyTheme(themeMode), [themeMode]);
  const chartTheme = useMemo<Partial<ChartTheme>>(() => {
    const token = getThemeTokens(themeMode);

    return {
      textColor: token.colorText,
      secondaryTextColor: token.colorTextSecondary,
      gridColor: token.colorBorderSecondary,
      borderColor: token.colorBorder,
      backgroundColor: token.colorBgContainer,
      semanticColors: {
        critical: token.colorError,
        highRisk: token.colorHighRisk,
        mediumRisk: token.colorWarning,
        lowRisk: token.colorLowRisk,
        success: token.colorSuccess,
        info: token.colorInfo,
      },
      trendUpColor: token.colorError,
      trendDownColor: token.colorSuccess,
      borderRadius: `${token.borderRadius}px`,
      fontFamily: token.fontFamily,
    };
  }, [themeMode]);

  useEffect(() => {
    applyPreviewPreferences(themeMode, densityMode);
    window.localStorage.setItem('company-preview-theme', themeMode);
    window.localStorage.setItem('company-preview-density', densityMode);
  }, [themeMode, densityMode]);

  return <ConfigProvider
    locale={zhCN}
    theme={companyTheme}
    componentSize={DENSITY_COMPONENT_SIZES[densityMode]}
  >
    <ChartProvider paletteMode={themeMode.includes('蓝') ? 'blue' : 'green'} theme={chartTheme}>
      <AntApp>
        <App
          themeMode={themeMode}
          densityMode={densityMode}
          onThemeModeChange={setThemeMode}
          onDensityModeChange={setDensityMode}
        />
      </AntApp>
    </ChartProvider>
  </ConfigProvider>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PreviewRoot />
  </React.StrictMode>,
);
