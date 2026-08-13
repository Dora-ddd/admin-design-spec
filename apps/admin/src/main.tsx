import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { DEFAULT_MODE, getCompanyCssVariables, getCompanyTheme } from '@company/theme';
import { App } from './app/App';
import './styles.css';

Object.entries(getCompanyCssVariables(DEFAULT_MODE)).forEach(([name, value]) => {
  document.documentElement.style.setProperty(name, String(value));
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={getCompanyTheme(DEFAULT_MODE)}>
      <AntApp><App /></AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);
