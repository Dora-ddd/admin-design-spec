import { Button, Progress, Tag, Typography } from 'antd';
import type { TableProps } from 'antd';
import { ChartRenderer } from '@company/charts';
import type { ChartSpec } from '@company/charts';
import { CompanyIcon, companyIcons } from '@company/ui/icons';
import { CompanySurface } from '@company/ui/surface';
import { CompanyTable, CompanyTableLink } from '@company/ui/table';
import './generic-workbench-page.css';

const { Text, Title } = Typography;

type SummaryItem = {
  key: string;
  title: string;
  online: number;
  metrics: Array<{ label: string; value: string }>;
};

type WorkbenchTableRecord = {
  key: number;
  address: string;
  category: string;
  status: string;
};

const summaryItems: SummaryItem[] = Array.from({ length: 5 }, (_, index) => ({
  key: `summary-${index + 1}`,
  title: '标题',
  online: 5,
  metrics: [
    { label: '这里是文案的标题', value: '864' },
    { label: '文案的标题', value: '234' },
    { label: '文案类型一', value: '23' },
  ],
}));

const workbenchTableData: WorkbenchTableRecord[] = [
  { key: 1, address: '192.158.23.230', category: '单元格内容', status: '高危' },
  { key: 2, address: '255.255.255.255', category: '单元格内容', status: '高危' },
  { key: 3, address: '192.158.23.230', category: '单元格内容', status: '致命' },
  { key: 4, address: '192.158.23.230', category: '单元格内容', status: '安全' },
  { key: 5, address: '192.158.23.230', category: '单元格内容', status: '安全' },
];

const donutData = [
  { name: '图例一', value: 30 },
  { name: '图例二', value: 20 },
  { name: '图例三', value: 20 },
  { name: '图例四', value: 10 },
  { name: '图例五', value: 10 },
  { name: '图例六', value: 10 },
];

const trendData = [
  ['00:00', 610, 405, 270, 110, 8],
  ['04:00', 642, 412, 230, 112, 8],
  ['08:00', 340, 590, 280, 150, 18],
  ['12:00', 365, 420, 255, 200, 38],
  ['16:00', 370, 330, 300, 230, 62],
  ['20:00', 550, 70, 305, 285, 78],
  ['24:00', 530, 42, 278, 330, 92],
].flatMap(([time, one, two, three, four, five]) => [
  { time, series: '图例一', value: one },
  { time, series: '图例二', value: two },
  { time, series: '图例三', value: three },
  { time, series: '图例四', value: four },
  { time, series: '图例五', value: five },
]);

const rankingData = [
  { name: '类型的名称', value: 330 },
  { name: '类型的名称 ', value: 270 },
  { name: '类型的名称  ', value: 230 },
  { name: '类型的名称   ', value: 215 },
  { name: '标签签名', value: 205 },
  { name: '类型的名称    ', value: 155 },
  { name: '类型的名称     ', value: 125 },
  { name: '标签签名 ', value: 105 },
];

const donutSpec: ChartSpec = {
  type: 'donut',
  frame: 'bare',
  height: 210,
  data: donutData,
  angleField: 'value',
  colorField: 'name',
  config: {
    legend: false,
    style: { stroke: '#ffffff', lineWidth: 1 },
  },
};

const trendSpec: ChartSpec = {
  type: 'multi-line',
  frame: 'bare',
  height: 224,
  data: trendData,
  xField: 'time',
  yField: 'value',
  seriesField: 'series',
  config: {
    legend: { color: { position: 'top' } },
    interaction: {
      tooltip: {
        shared: true,
        mount: 'body',
        position: 'left',
        bounding: false,
        css: { '.g2-tooltip': { 'z-index': 2200 } },
      },
    },
    scale: { y: { domain: [0, 800] } },
    style: { lineWidth: 2 },
  },
};

const rankingSpec: ChartSpec = {
  type: 'ranking-bar',
  frame: 'bare',
  height: 236,
  data: rankingData,
  xField: 'name',
  yField: 'value',
  config: {
    legend: false,
    axis: {
      x: { title: false, grid: false },
      y: { title: false, line: false, tick: false },
    },
    style: { fill: '#2fc49a', radius: 0 },
  },
};

const simpleColumns: NonNullable<TableProps<WorkbenchTableRecord>['columns']> = [
  { title: '排名', dataIndex: 'key', width: 64 },
  { title: '标题字段', dataIndex: 'address', width: 150 },
  { title: '常规列', dataIndex: 'category' },
];

const detailedColumns: NonNullable<TableProps<WorkbenchTableRecord>['columns']> = [
  { title: '排名', dataIndex: 'key', width: 64 },
  { title: '标题字段', dataIndex: 'address', width: 150 },
  { title: '常规列', dataIndex: 'category', width: 120 },
  {
    title: '威胁等级',
    dataIndex: 'status',
    width: 104,
    sorter: (a, b) => a.status.localeCompare(b.status),
    render: (status: WorkbenchTableRecord['status']) => <Tag color={status === '致命' ? 'red' : status === '高危' ? 'orange' : 'green'}>{status}</Tag>,
  },
  { title: '常规列', dataIndex: 'category', width: 104 },
  { title: '操作', key: 'action', width: 72, render: () => <CompanyTableLink>详情</CompanyTableLink> },
];

const riskMetrics = [
  { title: '数据标题', value: '180', change: '较昨日+12', tone: 'up', note: <>总资产 <b>2,304</b></> },
  { title: '数据类型', value: '220', change: '较昨日+12', tone: 'up', note: <>待处置 <b>180</b>　处置中 <b>20</b>　处置完成 <b>20</b></> },
  { title: '数据类型', value: '276', change: '较昨日+12', tone: 'up', note: <>待处置 <b>180</b>　处置中 <b>20</b>　处置完成 <b>20</b></> },
  { title: '数据标题', value: '236', change: '较昨日+12', tone: 'up', note: <>待处置 <b>180</b>　处置中 <b>20</b>　处置完成 <b>20</b></> },
  { title: '数据类型', value: '12', change: '较昨日-5', tone: 'down', note: <>待处置 <b>180</b>　处置中 <b>20</b>　处置完成 <b>20</b></> },
  { title: '数据类型', value: '5,360', change: '', tone: 'neutral', note: <>采集速率：300EPS</> },
] as const;

function ModuleHeading({ action }: { action?: React.ReactNode }) {
  return <div className="generic-workbench-module-heading"><Title level={4}>模块标题</Title>{action}</div>;
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <CompanySurface className={`generic-workbench-panel ${className}`.trim()} tone="business">{children}</CompanySurface>;
}

function DonutChart() {
  return <div className="generic-workbench-donut">
    <div className="generic-workbench-donut-plot">
      <ChartRenderer spec={donutSpec} />
      <div className="generic-workbench-donut-total"><span>总数</span><strong>8,966</strong></div>
    </div>
    <div className="generic-workbench-donut-legend">
      {donutData.map((item, index) => <span key={item.name}><i className={`is-${index + 1}`} />{item.name}</span>)}
    </div>
  </div>;
}

export function GenericWorkbenchPage() {
  return <main className="generic-workbench-main">
    <div className="generic-workbench-page">
      <section>
        <ModuleHeading />
        <div className="generic-workbench-summary-grid">
          {summaryItems.map((item) => <Panel className="generic-workbench-summary-card" key={item.key}>
            <div className="generic-workbench-summary-head">
              <span className="generic-workbench-summary-icon"><CompanyIcon type={companyIcons.terminalOnline} /></span>
              <div><Text strong>{item.title}</Text><Text type="secondary">在线 <b>{item.online}</b> 台</Text></div>
            </div>
            <div className="generic-workbench-summary-list">
              {item.metrics.map((metric) => <div key={metric.label}><Text type="secondary">{metric.label}</Text><strong>{metric.value}</strong></div>)}
            </div>
          </Panel>)}
        </div>
      </section>

      <section>
        <ModuleHeading action={<Button size="small">自定义图表</Button>} />
        <Panel className="generic-workbench-risk-panel">
          <div className="generic-workbench-risk-score">
            <Text strong>当前系统风险</Text>
            <Progress
              className="generic-workbench-risk-gauge"
              type="dashboard"
              size={160}
              percent={72}
              gapDegree={118}
              strokeWidth={10}
              strokeColor={{ '0%': '#f05a0a', '48%': '#dfbc00', '100%': '#52c41a' }}
              railColor="#eef0f2"
              format={() => <span><b>安全</b><small>系统表现</small></span>}
            />
          </div>
          <div className="generic-workbench-risk-metrics">
            {riskMetrics.map((metric, index) => <div className="generic-workbench-risk-metric" key={`${metric.title}-${index}`}>
              <span className="generic-workbench-risk-metric-icon"><CompanyIcon type={companyIcons.visualization} /></span>
              <div>
                <Text>{metric.title}</Text>
                <div className="generic-workbench-risk-value"><strong>{metric.value}</strong>{metric.change && <span className={`is-${metric.tone}`}>{metric.change}</span>}</div>
                <Text type="secondary" className="generic-workbench-risk-note">{metric.note}</Text>
              </div>
            </div>)}
          </div>
        </Panel>
      </section>

      <section>
        <ModuleHeading />
        <div className="generic-workbench-grid generic-workbench-grid--three">
          <Panel className="generic-workbench-chart-panel"><Title level={5}>标题</Title><DonutChart /></Panel>
          <Panel><Title level={5}>标题</Title><CompanyTable<WorkbenchTableRecord> size="small" columns={detailedColumns} dataSource={workbenchTableData} pagination={false} /></Panel>
          <Panel><Title level={5}>标题</Title><CompanyTable<WorkbenchTableRecord> size="small" columns={simpleColumns} dataSource={workbenchTableData} pagination={false} /></Panel>
        </div>
      </section>

      <section>
        <ModuleHeading />
        <div className="generic-workbench-grid generic-workbench-grid--two">
          <Panel><Title level={5}>标题</Title><CompanyTable<WorkbenchTableRecord> size="small" columns={detailedColumns.filter((column) => column.key !== 'action')} dataSource={workbenchTableData} pagination={false} /></Panel>
          <Panel className="generic-workbench-chart-panel"><Title level={5}>标题</Title><ChartRenderer spec={trendSpec} /></Panel>
        </div>
      </section>

      <section>
        <ModuleHeading />
        <div className="generic-workbench-grid generic-workbench-grid--bottom">
          <Panel className="generic-workbench-chart-panel"><Title level={5}>标题</Title><DonutChart /></Panel>
          <Panel className="generic-workbench-chart-panel"><Title level={5}>标题</Title><ChartRenderer spec={rankingSpec} /></Panel>
          <Panel><Title level={5}>标题</Title><CompanyTable<WorkbenchTableRecord> size="small" columns={simpleColumns} dataSource={workbenchTableData} pagination={false} /></Panel>
        </div>
      </section>
    </div>
  </main>;
}
