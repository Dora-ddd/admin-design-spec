# @company/charts

独立 React 图表组件包。底层适配 Ant Design Charts 开源仓库中的 `@ant-design/plots`，业务工程只依赖本包公开出口。

## 开发

```bash
npm install
npm run dev
npm run build
```

## 使用

宿主安装包并引入样式：

```tsx
import { ChartRenderer, type ChartSpec } from '@company/charts';
import '@company/charts/style.css';

const spec: ChartSpec = {
  type: 'multi-line',
  title: '近 7 日安全事件趋势',
  data,
  xField: 'day',
  yField: 'value',
  seriesField: 'category',
};

export function TrendPanel() {
  return <ChartRenderer spec={spec} />;
}
```

公共出口包括 `ChartRenderer`、`ChartFrame`、`ChartGrid`、`StatCard`、图表协议类型和主题配置。底层原生配置可通过 `spec.config` 传入。

业务代码不直接引入底层图表引擎，新增图表能力统一在本包适配层完成。
