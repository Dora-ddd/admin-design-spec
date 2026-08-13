import { useMemo, useState } from 'react';
import { ChartRenderer } from '@company/charts';
import { Button, Input, Pagination, Progress, Segmented, Select, Table, Typography } from 'antd';
import type { TableProps } from 'antd';
import { CompanyIcon, companyIcons } from '@company/ui/icons';
import { CompanyTag } from '@company/ui/tags';
import { TerminalBusinessContainer, TerminalSearchField } from './TerminalContentComponents';
import './terminal-ransomware-page.css';

const { Text } = Typography;

type TerminalRansomwarePageProps = {
  onNotify?: (message: string) => void;
};

type ProtectionDevice = {
  key: number;
  name: string;
  ip: string;
  product: string;
  family: string;
  coverage: number;
};

type RansomwareSample = {
  key: number;
  hash: string;
  family: string;
  detections: number;
  blocks: number;
  rate: number;
};

const trendData = [
  { day: '06/16', value: 38 },
  { day: '06/17', value: 42 },
  { day: '06/18', value: 31 },
  { day: '06/19', value: 54 },
  { day: '06/20', value: 52 },
  { day: '06/21', value: 48 },
  { day: '今天', value: 93 },
];

const protectionDevices: ProtectionDevice[] = [
  { key: 1, name: '360TAS-A', ip: '192.168.0.11', product: 'Web应用防火墙', family: 'LockBit', coverage: 90 },
  { key: 2, name: '360EDR-P', ip: '192.168.1.12', product: '终端安全管理系统', family: 'BlackCat', coverage: 80 },
  { key: 3, name: '360NDR-A', ip: '192.168.1.14', product: '网络威胁检测系统', family: 'Clop', coverage: 80 },
  { key: 4, name: '360TSS', ip: '192.168.1.15', product: '服务器安全防护系统', family: 'Akira', coverage: 80 },
];

const ransomwareSamples: RansomwareSample[] = [
  { key: 1, hash: 'DrickFarStealer ADC & Gateway 样本', family: 'LockBit 3.0', detections: 100, blocks: 90, rate: 90 },
  { key: 2, hash: 'HTTP 协议远程加密执行样本', family: 'BlackCat', detections: 100, blocks: 60, rate: 90 },
  { key: 3, hash: 'PhishingPortal 勒索投递样本', family: 'Clop', detections: 100, blocks: 60, rate: 80 },
  { key: 4, hash: 'VPN 设备路径穿越利用样本', family: 'Akira', detections: 100, blocks: 80, rate: 80 },
  { key: 5, hash: 'WebShellConformance 勒索工具链', family: 'Royal', detections: 100, blocks: 80, rate: 80 },
];

const familyCloud = [
  ['LockBit', 95, 'large'], ['BLOCKER', 93, 'medium'], ['Abyss Locker', 94, 'medium'],
  ['CHAPAK', 84, 'medium'], ['CERBER', 85, 'small'], ['CRYPTOWALL', 68, 'small'],
  ['Ryuk', 23, 'small'], ['Trigona', 24, 'small'], ['REvil', 30, 'small'], ['BlackCat', 76, 'medium'],
] as const;

const matrixFamilies = ['LockBit', 'BlackCat', 'Clop', 'Akira', 'Royal', 'PLAY', 'RansomHub'];
const matrixTechniques = ['钓鱼邮件', '漏洞利用', '横向移动', '数据加密', '备份破坏', '外联通信', '权限提升'];
const matrixScores = [
  [90, 78, 62, 84, 55, 71, 86],
  [84, 92, 70, 79, 61, 67, 73],
  [72, 88, 81, 76, 48, 83, 65],
  [91, 69, 74, 87, 82, 64, 78],
  [67, 74, 86, 63, 77, 91, 58],
  [79, 83, 65, 92, 70, 76, 88],
  [88, 72, 79, 68, 91, 84, 73],
];

function scoreTone(score: number) {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 60) return 'medium';
  return 'poor';
}

function RansomwareRadar() {
  const axes = ['拒绝服务', '数据加密', '数据破坏', '数据窃取', '系统操控', '资源劫持', '对抗技术'];
  return <div className="terminal-ransomware-radar" role="img" aria-label="勒索病毒攻击影响雷达图">
    <div className="terminal-ransomware-radar-grid" />
    <div className="terminal-ransomware-radar-value" />
    {axes.map((axis, index) => <span key={axis} style={{ '--radar-index': index } as React.CSSProperties}>{axis}</span>)}
    <div className="terminal-ransomware-radar-legend"><i />防护率</div>
  </div>;
}

export function TerminalRansomwarePage({ onNotify }: TerminalRansomwarePageProps) {
  const [period, setPeriod] = useState('近30天');
  const [family, setFamily] = useState('全部家族');
  const [keyword, setKeyword] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('LockBit');
  const [matrixMode, setMatrixMode] = useState<'防护' | '检测' | '阻断'>('防护');
  const [matrixExpanded, setMatrixExpanded] = useState(false);

  const filteredSamples = useMemo(() => ransomwareSamples.filter((item) => {
    const matchFamily = family === '全部家族' || item.family === family;
    const normalizedKeyword = keyword.trim().toLowerCase();
    return matchFamily && (!normalizedKeyword || `${item.hash}${item.family}`.toLowerCase().includes(normalizedKeyword));
  }), [family, keyword]);

  const deviceColumns: TableProps<ProtectionDevice>['columns'] = [
    { title: '安全设备名称', dataIndex: 'name', width: 122, render: (value) => <Text strong>{value}</Text> },
    { title: '设备IP地址', dataIndex: 'ip', width: 124 },
    { title: '设备类型', dataIndex: 'product', ellipsis: true },
    { title: '勒索家族', dataIndex: 'family', width: 92 },
    { title: '防护率', dataIndex: 'coverage', width: 106, sorter: (a, b) => a.coverage - b.coverage, render: (value) => <div className="terminal-ransomware-rate"><Progress percent={value} showInfo={false} size="small" /><span>{value}%</span></div> },
  ];

  const sampleColumns: TableProps<RansomwareSample>['columns'] = [
    { title: '序号', dataIndex: 'key', width: 72 },
    { title: '勒索病毒样本', dataIndex: 'hash', ellipsis: true },
    { title: '家族', dataIndex: 'family', width: 132, filters: [...new Set(ransomwareSamples.map((item) => item.family))].map((value) => ({ text: value, value })), onFilter: (value, record) => record.family === value },
    { title: '执行次数', dataIndex: 'detections', width: 112, sorter: (a, b) => a.detections - b.detections },
    { title: '防护数', dataIndex: 'blocks', width: 100 },
    { title: '防护率', dataIndex: 'rate', width: 138, sorter: (a, b) => a.rate - b.rate, render: (value) => <div className="terminal-ransomware-rate"><Progress percent={value} showInfo={false} size="small" /><span>{value}%</span></div> },
    { title: '操作', key: 'action', width: 88, fixed: 'right', render: (_, record) => <Button type="link" size="small" onClick={() => onNotify?.(`正在查看 ${record.family} 样本详情`)}>详情</Button> },
  ];

  return <div className="terminal-ransomware-page">
    <section className="terminal-ransomware-filter" aria-label="勒索分析筛选条件">
      <div className="terminal-ransomware-filter-fields">
        <TerminalSearchField label="统计周期"><Select value={period} onChange={setPeriod} options={['近7天', '近30天', '近90天'].map((value) => ({ value, label: value }))} /></TerminalSearchField>
        <TerminalSearchField label="勒索家族"><Select value={family} onChange={setFamily} options={['全部家族', ...new Set(ransomwareSamples.map((item) => item.family))].map((value) => ({ value, label: value }))} /></TerminalSearchField>
        <TerminalSearchField label="样本检索"><Input allowClear value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="请输入样本名称或家族" /></TerminalSearchField>
      </div>
      <div className="terminal-ransomware-filter-actions">
        <Button type="primary" icon={<CompanyIcon type={companyIcons.search} />} onClick={() => onNotify?.(`已更新${period}勒索专项分析数据`)}>查询</Button>
        <Button onClick={() => { setPeriod('近30天'); setFamily('全部家族'); setKeyword(''); }}>重置</Button>
      </div>
    </section>

    <section className="terminal-ransomware-metrics" aria-label="勒索专项核心指标">
      {[
        { key: 'sample', image: '/assets/visual/3d-security-event.png', title: '勒索病毒样本', value: '5,000', unit: '个', detail: '新增 128 个' },
        { key: 'event', image: '/assets/visual/3d-risk-asset.png', title: '勒索攻击事件', value: '4,000', unit: '次', detail: '高危 80 次' },
        { key: 'asset', image: '/assets/visual/3d-terminal-discovery.png', title: '受影响资产', value: '4,000', unit: '台', detail: '已处置 80%' },
        { key: 'protection', image: '/assets/visual/3d-smart-qa.png', title: '综合防护率', value: '80', unit: '%', detail: '较上期 +6%' },
      ].map((item) => <div className="terminal-ransomware-metric" key={item.key}>
        <img src={item.image} alt="" aria-hidden="true" />
        <div><Text>{item.title}</Text><strong>{item.value}<small>{item.unit}</small></strong><span>{item.detail}</span></div>
      </div>)}
    </section>

    <div className="terminal-ransomware-grid">
      <TerminalBusinessContainer title="勒索防护率趋势" extra={<CompanyTag tone="success" variant="light">{period}</CompanyTag>} className="terminal-ransomware-card terminal-ransomware-chart-card">
        <ChartRenderer spec={{ type: 'line', frame: 'bare', height: 232, ariaLabel: '勒索防护率趋势', data: trendData, xField: 'day', yField: 'value', config: { scale: { y: { domain: [0, 100] } }, style: { lineWidth: 2 } } }} />
      </TerminalBusinessContainer>
      <TerminalBusinessContainer title="勒索病毒攻击影响" className="terminal-ransomware-card terminal-ransomware-chart-card">
        <RansomwareRadar />
      </TerminalBusinessContainer>

      <TerminalBusinessContainer title="勒索家族防护率" extra={<Text type="secondary">点击标签切换</Text>} className="terminal-ransomware-card">
        <div className="terminal-ransomware-family-cloud">
          {familyCloud.map(([name, score, size], index) => <button type="button" className={`${size} ${selectedFamily === name ? 'active' : ''} tone-${index % 5}`} key={name} onClick={() => setSelectedFamily(name)}>{name} {score}%</button>)}
        </div>
      </TerminalBusinessContainer>
      <TerminalBusinessContainer title="安全设备防护情况" extra={<Text type="secondary">{selectedFamily} 家族</Text>} className="terminal-ransomware-card terminal-ransomware-table-card">
        <Table rowKey="key" columns={deviceColumns} dataSource={protectionDevices} pagination={false} size="small" scroll={{ x: 650 }} />
        <Pagination size="small" defaultCurrent={1} total={20} pageSize={4} showSizeChanger={false} />
      </TerminalBusinessContainer>
    </div>

    <TerminalBusinessContainer title="勒索病毒样本执行与防护情况" extra={<Button icon={<CompanyIcon type={companyIcons.export} />} onClick={() => onNotify?.('勒索样本清单导出任务已创建')}>导出</Button>} className="terminal-ransomware-card terminal-ransomware-sample-card">
      <Table rowKey="key" columns={sampleColumns} dataSource={filteredSamples} pagination={false} size="small" scroll={{ x: 1040 }} />
      <div className="terminal-ransomware-pagination"><Text type="secondary">共计 {filteredSamples.length} 条</Text><Pagination size="small" defaultCurrent={1} total={Math.max(filteredSamples.length, 20)} pageSize={5} showSizeChanger={false} /></div>
    </TerminalBusinessContainer>

    <TerminalBusinessContainer
      title="勒索专项防护能力矩阵"
      extra={<div className="terminal-ransomware-matrix-actions"><Segmented size="small" value={matrixMode} options={['防护', '检测', '阻断']} onChange={(value) => setMatrixMode(value as typeof matrixMode)} /><Button type="text" onClick={() => setMatrixExpanded((value) => !value)}>{matrixExpanded ? '收起' : '展开全部'} <CompanyIcon type={companyIcons.down} /></Button></div>}
      className="terminal-ransomware-card terminal-ransomware-matrix-card"
    >
      <div className="terminal-ransomware-legend"><Text strong>{matrixMode}效果图例</Text><span className="excellent">优</span><span className="good">良</span><span className="medium">中</span><span className="poor">差</span></div>
      <div className={`terminal-ransomware-matrix ${matrixExpanded ? 'expanded' : ''}`}>
        <div className="terminal-ransomware-matrix-head"><strong>勒索技术</strong>{matrixFamilies.map((item) => <strong key={item}>{item}</strong>)}</div>
        {matrixTechniques.map((technique, rowIndex) => <div className="terminal-ransomware-matrix-row" key={technique}>
          <span>{technique}</span>
          {matrixFamilies.map((familyName, columnIndex) => {
            const score = matrixScores[rowIndex][columnIndex];
            return <button type="button" className={scoreTone(score)} key={familyName} onClick={() => onNotify?.(`${familyName} · ${technique}：${matrixMode}评分 ${score}`)}><strong>{score}%</strong><small>{score}/100</small></button>;
          })}
        </div>)}
      </div>
    </TerminalBusinessContainer>
  </div>;
}
