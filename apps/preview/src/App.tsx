import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import type { Key } from 'react';
import { Prompts, Sources, Think, ThoughtChain, Welcome } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import {
  CHART_BASE_PALETTES,
  CHART_EXTENDED_PALETTES,
  ChartGrid,
  ChartRenderer,
  StatCard,
  type ChartPaletteMode,
  type ChartSpec,
} from '@company/charts';
import {
  App as AntdApp,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  Pagination,
  Radio,
  Row,
  Segmented,
  Select,
  Space,
  Statistic,
  Steps,
  Switch,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  theme,
} from 'antd';
import type { MenuProps, TableProps } from 'antd';
import { CompanySuperSender, type CompanySuperSenderProps, type SuperSenderAttachment, type SuperSenderOption, type SuperSenderQuote } from '@company/ui/super-sender';
import { CompanySentMessage, type SentMessageFile } from '@company/ui/sent-message';
import { CompanyAIOutput, type AIOutputMedia } from '@company/ui/ai-output';
import { CompanyAIWorkspace, type AIWorkspaceConversation } from '@company/ui/ai-workspace';
import { CompanyBusinessLayout } from '@company/ui/business-layout';
import { CompanyButton } from '@company/ui/button';
import { CompanyPageHeader } from '@company/ui/page-header';
import { CompanySearchField, CompanySearchPanel } from '@company/ui/search-panel';
import { CompanySurface } from '@company/ui/surface';
import { CompanyTag, getBusinessTagTone } from '@company/ui/tags';
import {
  TerminalBusinessContainer,
  TerminalMetricGroup,
  TerminalRiskDistribution,
  TerminalSearchField,
  TerminalTrendChart,
  type TerminalMetric,
} from './pages/terminal/components/TerminalContentComponents';
import { TerminalRansomwarePage } from './pages/terminal/components/TerminalRansomwarePage';
import { CompanyIcon, companyIcons } from '@company/ui/icons';
import { COMPANY_SPACE, DENSITY_LABELS, DENSITY_MODES, THEME_MODES, type DensityMode, type ThemeMode } from '@company/theme';
import { isShowroomExitKey, parseShowroomSample, updateShowroomSampleUrl, type ShowroomSample } from './showroomState';

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const ComponentShowcasePage = lazy(() => import('./pages/components/ComponentShowcasePage'));

function AIIdentity({ compact = false }: { compact?: boolean }) {
  return <span className={`ai-identity ${compact ? 'compact' : ''}`}>AI</span>;
}

const xComponents = [
  ['AI Chat', 'AI 对话样板间'],
  ['Actions', '消息操作集合'], ['Attachments', '附件上传与管理'], ['Bubble', '对话气泡与消息列表'],
  ['CodeHighlighter', '代码高亮'], ['Conversations', '会话管理'], ['FileCard', '文件卡片'],
  ['Folder', '文件夹与目录树'], ['Mermaid', '流程图渲染'], ['Notification', 'AI 通知'],
  ['Prompts', '提示词推荐'], ['Sender', '消息输入与发送'], ['Sources', '引用来源'],
  ['Suggestion', '输入建议'], ['Think', '思考过程'], ['ThoughtChain', '思维链步骤'],
  ['Welcome', '欢迎与引导'], ['XProvider', '全局配置'], ['SentMessage', '发送内容与文件'],
  ['AIOutput', '智能体多类型输出'],
];

const superSenderQuote: SuperSenderQuote = {
  id: 'retail-report-reference',
  text: '大模型赋能安全事件应急处置方案制定的全流程实践，安全事件的应急处置能力直接决定了风险管控的效率与成效，而大模型的深度介入正为应急处置构建全新范式。',
};

const superSenderAttachments: SuperSenderAttachment[] = [
  { id: 'terminal-report-word', name: '终端安全防护报告.doc', size: '152KB', status: 'done', fileType: 'word' },
  { id: 'terminal-report-pdf', name: '终端安全防护运行状态评估报告.pdf', size: '152KB', status: 'done', fileType: 'pdf' },
  { id: 'terminal-report-uploading', name: '终端安全防护报告示例.ppt', status: 'uploading', progress: 10, fileType: 'ppt' },
  { id: 'terminal-report-error', name: '终端安全防护报告示例.doc', size: '152KB', status: 'error', fileType: 'word' },
];

const simulateAttachmentRequest = () => new Promise<void>((resolve) => {
  window.setTimeout(resolve, 1200);
});

const superSenderSearchEngines: SuperSenderOption[] = [
  { key: '360', label: '360搜索', icon: <CompanyIcon type={companyIcons.search360} /> },
  { key: 'bing', label: '必应搜索', icon: <CompanyIcon type={companyIcons.search} /> },
];

const superSenderAgents: SuperSenderOption[] = [
  { key: 'general', label: '智能体' },
  { key: 'alarm', label: '告警分析智能体' },
  { key: 'operation', label: '安全运营智能体' },
];

const superSenderMcps: SuperSenderOption[] = [
  { key: 'amap', label: '高德地图' },
  { key: 'knowledge', label: '安全知识库' },
  { key: 'asset', label: '资产检索' },
  { key: 'report', label: '报告生成' },
  { key: 'workflow', label: '处置编排' },
];

const sharedSuperSenderProps = {
  searchEngineOptions: superSenderSearchEngines,
  defaultSearchEngineKey: '360',
  agentOptions: superSenderAgents,
  defaultAgentKey: 'general',
  mcpOptions: superSenderMcps,
  features: { searchEngine: true, voice: true },
} satisfies Pick<CompanySuperSenderProps,
  'searchEngineOptions' | 'defaultSearchEngineKey' | 'agentOptions' | 'defaultAgentKey' | 'mcpOptions' | 'features'
>;

const sentMessageFiles: SentMessageFile[] = [
  { id: 'sent-word', name: '终端安全防护评估报告.doc', size: '152KB' },
  { id: 'sent-pdf', name: '安全事件应急处置方案.pdf', size: '1.2MB' },
  { id: 'sent-excel', name: '受影响资产清单.xlsx', size: '86KB' },
  { id: 'sent-image', name: '风险趋势截图.png', size: '721KB' },
];

type AIOutputShowcaseMediaType = Exclude<AIOutputMedia['type'], 'workflow'>;
type AIOutputShowcaseType = 'text' | 'loading' | AIOutputShowcaseMediaType;
type AIOutputTaskState = 'running' | 'finished';

const aiOutputTypeOptions: Array<{ label: string; value: AIOutputShowcaseType }> = [
  { label: '文字', value: 'text' },
  { label: '文件', value: 'file' },
  { label: '音频', value: 'audio' },
  { label: '图片', value: 'image' },
  { label: '视频', value: 'video' },
  { label: '表格', value: 'table' },
  { label: '图表', value: 'chart' },
  { label: '代码', value: 'code' },
  { label: '任务流', value: 'task' },
  { label: '加载', value: 'loading' },
];

const aiOutputTaskExamples: Record<AIOutputTaskState, Extract<AIOutputMedia, { type: 'task' }>> = {
  running: {
    type: 'task',
    title: '任务执行中...',
    tasks: [
      {
        id: 'query',
        kind: 'tool',
        title: '调用MCP工具：',
        toolName: '安全评估 - 行业风险分析',
        status: 'done',
        tags: [
          { key: 'qidian', label: 'qidianzhongwen.com' },
          { key: 'weread', label: 'weread.qq.com' },
          { key: 'huabao', label: '360huabao.com' },
          { key: 'cnfol', label: 'gold.cnfol.com' },
          { key: 'weibo', label: 'weibo.com' },
          { key: 'so', label: 'www.so.com' },
        ],
      },
      {
        id: 'process',
        kind: 'process',
        title: '已成功创建所需报告文档。因工具限制无法生成可视化风险图谱，将创建文本说明文件占位',
        detail: '{"tool":"newFileCreated","path":"isOutsideWorkspace":true,"content":"# 安全行业风险图谱生成失败说明"}',
        status: 'done',
      },
      { id: 'report', kind: 'tool', title: '调用MCP工具：', toolName: '纳米AI - 文献内容音乐素材', status: 'running' },
    ],
  },
  finished: {
    type: 'task',
    tasks: [
      {
        id: 'query',
        kind: 'tool',
        title: '调用MCP工具：',
        toolName: '安全评估 - 行业风险分析',
        status: 'done',
        tags: [
          { key: 'qidian', label: 'qidianzhongwen.com' },
          { key: 'weread', label: 'weread.qq.com' },
          { key: 'huabao', label: '360huabao.com' },
          { key: 'cnfol', label: 'gold.cnfol.com' },
          { key: 'weibo', label: 'weibo.com' },
          { key: 'so', label: 'www.so.com' },
        ],
      },
      {
        id: 'process',
        kind: 'process',
        title: '已成功创建所需报告文档。因工具限制无法生成可视化风险图谱，已创建文本说明文件',
        detail: '{"tool":"newFileCreated","path":"isOutsideWorkspace":true,"content":"# 安全行业风险图谱生成说明"}',
        status: 'done',
      },
      { id: 'report', kind: 'tool', title: '调用MCP工具：', toolName: '纳米AI - 文献内容音乐素材', status: 'done' },
    ],
  },
};

const chartShowcaseSeries = [
  ['周一', 38, 24], ['周二', 52, 32], ['周三', 44, 35], ['周四', 68, 48],
  ['周五', 57, 46], ['周六', 73, 61], ['周日', 49, 42],
].flatMap(([day, event, handled]) => [
  { day, category: '安全事件', value: event },
  { day, category: '已处置', value: handled },
]);

const aiOutputMediaExamples: Record<AIOutputShowcaseMediaType, AIOutputMedia> = {
  file: { type: 'file', name: '终端安全防护评估报告.doc', size: '152KB', fileType: 'word' },
  audio: { type: 'audio', name: '终端安全防护评估报告.mp3', duration: '02:30' },
  image: {
    type: 'image',
    images: [
      { id: 'risk-asset', src: '/assets/visual/3d-risk-asset.png', alt: '风险资产分析图' },
      { id: 'security-event', src: '/assets/visual/3d-security-event.png', alt: '安全事件分析图' },
      { id: 'terminal', src: '/assets/visual/3d-terminal-discovery.png', alt: '终端发现分析图' },
      { id: 'smart-qa', src: '/assets/visual/3d-smart-qa.png', alt: '智能问答分析图' },
    ],
  },
  video: { type: 'video', poster: '/assets/visual/3d-security-event.png', duration: '02:30' },
  table: {
    type: 'table',
    columns: ['终端名称', '风险等级', '处置状态'],
    rows: [
      ['DESKTOP-A021', '高危', '待处置'],
      ['SERVER-OPS-08', '中危', '处理中'],
      ['MAC-MKT-016', '低危', '已处置'],
      ['DESKTOP-HR32', '低危', '已处置'],
    ],
  },
  chart: {
    type: 'chart',
    spec: {
      type: 'multi-line',
      title: '近 7 日安全事件趋势',
      height: 280,
      data: chartShowcaseSeries,
      xField: 'day',
      yField: 'value',
      seriesField: 'category',
    },
  },
  code: { type: 'code', language: 'Python', code: "result = analyze_terminal_risk(asset_list)\nprint(result)" },
  task: aiOutputTaskExamples.running,
};

const menuItems: MenuProps['items'] = [
  { key: 'overview', icon: <CompanyIcon type={companyIcons.component} />, label: '资源总览' },
  { key: 'showroom', icon: <CompanyIcon type={companyIcons.product} />, label: '产品样板间' },
  { key: 'antd', icon: <CompanyIcon type={companyIcons.component} />, label: '基础组件' },
  { key: 'charts', icon: <CompanyIcon type={companyIcons.visualization} />, label: '可视化组件' },
  { key: 'x', icon: <CompanyIcon type={companyIcons.aiOverview} />, label: 'AI 组件' },
  { key: 'workspace', icon: <CompanyIcon type={companyIcons.aiChat} />, label: 'AI 工作台示例' },
  { type: 'divider' },
  { key: 'sdk', icon: <CompanyIcon type={companyIcons.sdk} />, label: '工程能力' },
];

function Overview() {
  return <div className="page-stack">
    <div><Title level={2}>公司组件资源总览</Title><Paragraph type="secondary">以安全 + AI UI 组件框架规范、主题变量、Iconfont 和视觉资源包作为唯一视觉来源。</Paragraph></div>
    <Row gutter={[COMPANY_SPACE[16], COMPANY_SPACE[16]]}>
      <Col xs={24} md={8}><Card><Statistic title="基础组件" value={49} prefix={<CompanyIcon type={companyIcons.component} />} /><Text type="secondary">公司主题与组件规范样式</Text></Card></Col>
      <Col xs={24} md={8}><Card><Statistic title="AI 组件" value={19} prefix={<CompanyIcon type={companyIcons.aiOverview} />} /><Text type="secondary">公司 AI 交互组件样式</Text></Card></Col>
      <Col xs={24} md={8}><Card><Statistic title="视觉资源" value={612} prefix={<CompanyIcon type={companyIcons.visualization} />} /><Text type="secondary">3D 图标、加载动效与缺省图</Text></Card></Col>
    </Row>
    <Card title="规范落地关系">
      <Steps items={[
        { title: '主题变量', content: '统一颜色、字号、圆角、投影和状态语义' },
        { title: '组件规范', content: '统一基础组件、AI 组件、Iconfont 和视觉资源' },
        { title: '业务页面', content: '组合为终端安全与 AI 工作台等产品页面' },
      ]} />
    </Card>
    <Card title="当前规范来源">
      <Descriptions column={{ xs: 1, md: 2 }} items={[
        { key: '1', label: '默认主题', children: '3.0-浅色绿' },
        { key: '2', label: '图标资源', children: 'Iconfont 项目 5177816' },
        { key: '3', label: '视觉资源', children: '3Dicon、加载动效、缺省图' },
        { key: '4', label: '产品框架', children: '终端安全、AI 工作台' },
      ]} />
    </Card>
  </div>;
}

const chartShowcaseSpecs: ChartSpec[] = [
  { type: 'multi-line', title: '多条折线图', subtitle: '近 7 日安全事件趋势', data: chartShowcaseSeries, xField: 'day', yField: 'value', seriesField: 'category' },
  { type: 'area', title: '基础面积图', data: chartShowcaseSeries.filter((item) => item.category === '安全事件'), xField: 'day', yField: 'value' },
  { type: 'grouped-column', title: '分组柱状图', data: chartShowcaseSeries, xField: 'day', yField: 'value', seriesField: 'category' },
  { type: 'stacked-column', title: '堆叠柱状图', data: chartShowcaseSeries, xField: 'day', yField: 'value', seriesField: 'category' },
  { type: 'ranking-bar', title: 'TOP 排名', data: [{ name: '高危事件', value: 86 }, { name: '异常外联', value: 64 }, { name: '弱口令', value: 42 }, { name: '策略缺失', value: 31 }], xField: 'name', yField: 'value' },
  {
    type: 'donut',
    title: '基础环图',
    data: [{ level: '高危', value: 7 }, { level: '中危', value: 38 }, { level: '低危', value: 64 }],
    angleField: 'value',
    colorField: 'level',
    direction: 'clockwise',
    colorMap: { '高危': 'highRisk', '中危': 'mediumRisk', '低危': 'lowRisk' },
  },
];

function ChartComponents({ paletteMode }: { paletteMode: ChartPaletteMode }) {
  const paletteGroups = [
    { key: 'base', title: '基础 10 色', colors: CHART_BASE_PALETTES[paletteMode] },
    { key: 'extended', title: '扩展 10 色', colors: CHART_EXTENDED_PALETTES[paletteMode] },
  ];

  return <div className="page-stack chart-library-page">
    <div className="chart-library-heading"><Title level={2}>可视化组件</Title><Paragraph type="secondary">由独立 @company/charts 包提供，业务页面只通过公共协议调用。</Paragraph></div>
    <section className="chart-palette-preview">
      <div className="chart-palette-heading"><Text strong>图例色板</Text><Text type="secondary">{paletteMode === 'green' ? '绿色主题' : '蓝色主题'}</Text></div>
      {paletteGroups.map((group) => <div className="chart-palette-group" key={group.key}>
        <Text type="secondary">{group.title}</Text>
        <div className="chart-palette-swatches">
          {group.colors.map((color, index) => <div className="chart-palette-swatch" key={color}>
            <i style={{ background: color }} />
            <span>{String(index + 1).padStart(2, '0')}</span>
            <code>{color}</code>
          </div>)}
        </div>
      </div>)}
    </section>
    <div className="chart-library-stats">
      <StatCard label="安全事件" value="1,286" unit="条" trend={12.5} note="较上周" />
      <StatCard label="风险资产" value="109" unit="台" trend={-8.2} note="较上周" />
      <StatCard label="处置率" value="91.4" unit="%" trend={3.6} note="较上周" />
    </div>
    <ChartGrid minColumnWidth={440}>{chartShowcaseSpecs.map((spec) => <ChartRenderer key={String(spec.title)} spec={spec} />)}</ChartGrid>
  </div>;
}

function ProductShowroom() {
  const [showroomFullscreen, setShowroomFullscreen] = useState(false);
  const [activeSample, setActiveSample] = useState<ShowroomSample>(() => parseShowroomSample(window.location.search));

  const changeSample = (nextSample: ShowroomSample) => {
    setActiveSample(nextSample);
    window.history.replaceState(null, '', updateShowroomSampleUrl(window.location.href, nextSample));
  };

  const sampleTitle = activeSample === 'generic' ? '通用列表样板间' : '终端安全样板间';
  const sampleDescription = activeSample === 'generic'
    ? '基于工程组件组合的后台基础列表页。'
    : '终端安全管理系统的完整框架与 Dashboard 页面。';
  const sampleContent = activeSample === 'generic' ? <GenericListFramework /> : <TerminalFramework />;

  useEffect(() => {
    if (!showroomFullscreen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isShowroomExitKey(event.key)) {
        setShowroomFullscreen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showroomFullscreen]);

  return <section className="product-showroom-section">
    <div className="product-showroom-heading">
      <div><Title level={3}>产品样板间</Title><Text type="secondary">{sampleDescription}</Text></div>
      <Space size={COMPANY_SPACE[12]} wrap>
        <Segmented
          options={[{ label: '通用列表样板', value: 'generic' }, { label: '终端安全样板', value: 'terminal' }]}
          value={activeSample}
          onChange={(value) => changeSample(value as ShowroomSample)}
        />
        <Button type="primary" icon={<CompanyIcon type="icon-quanping" />} onClick={() => setShowroomFullscreen(true)}>全屏展示</Button>
      </Space>
    </div>
    <div className="product-showroom-viewport">{sampleContent}</div>
    {showroomFullscreen && <div className="product-showroom-fullscreen" role="dialog" aria-modal="true" aria-label={`${sampleTitle}全屏展示`}>
      {sampleContent}
    </div>}
  </section>;
}

function XComponents() {
  const { message: appMessage } = AntdApp.useApp();
  const [aiOutputType, setAIOutputType] = useState<AIOutputShowcaseType>('text');
  const [aiOutputLoadState, setAIOutputLoadState] = useState<'loading' | 'error'>('loading');
  const [aiOutputTaskState, setAIOutputTaskState] = useState<AIOutputTaskState>('running');
  const promptItems = [
    { key: '1', icon: <CompanyIcon type="icon-jia" />, label: '生成页面结构', description: '根据需求整理页面区域和字段' },
    { key: '2', icon: <CompanyIcon type="icon-a-sousuofangdajing" />, label: '检索规范资源', description: '查找组件能力与规范依据' },
    { key: '3', icon: <CompanyIcon type="icon-shangchuan" />, label: '上传分析附件', description: '结合文档与截图生成建议' },
  ];
  return <div className="page-stack x-components-page">
    <div><Title level={2}>AI 组件</Title><Paragraph type="secondary">基于公司安全 + AI 规范展示欢迎引导、输入、输出、思考与引用能力。</Paragraph></div>
    <div className="x-inventory">{xComponents.map(([name, desc]) => <div className="component-row" key={name}><Text strong>{name}</Text><Text type="secondary">{desc}</Text></div>)}</div>
    <Row gutter={[COMPANY_SPACE[16], COMPANY_SPACE[16]]}>
      <Col xs={24} xl={14}><Card title="欢迎与提示"><Welcome className="company-ai-welcome" title={<span className="ai-welcome-title"><AIIdentity /> 安全智能助手</span>} description="聚合安全分析、组件检索与页面生成能力，选择下方任务即可开始。" /></Card></Col>
      <Col xs={24} xl={10}><Card title="AI 按钮"><div className="ai-button-showcase"><Button className="ai-gradient-button"><AIIdentity compact />开始智能分析</Button><Button className="ai-outline-button">生成分析建议</Button><Button type="text" className="ai-text-button">查看思考过程</Button></div></Card></Col>
    </Row>
    <Card title="欢迎提示"><Prompts className="company-ai-prompts" items={promptItems} wrap onItemClick={({ data }) => appMessage.success(`已选择：${data.label}`)} /></Card>
    <Card className="x-super-sender-card" title="超级输入框" extra={<Space size={COMPANY_SPACE[8]}><Tag>状态：引用与附件</Tag><Tag color="blue">类型：工程组件</Tag></Space>}>
      <div className="x-super-sender-demo">
        <CompanySuperSender
          {...sharedSuperSenderProps}
          quote={superSenderQuote}
          defaultAttachments={superSenderAttachments}
          onSubmit={({ value, agentKey, mcpKeys, deepThinking, webSearch }) => { appMessage.success(`已发送：${value}（智能体 ${agentKey}，MCP ${mcpKeys.length} 个${deepThinking ? '，深度思考' : ''}${webSearch ? '，联网搜索' : ''}）`); }}
          onAction={(action, enabled) => appMessage.info(`${action}${enabled === undefined ? '' : enabled ? '已启用' : '已关闭'}`)}
          onQuoteRemove={() => appMessage.info('已移除引用')}
          onRemoveAttachment={(attachment) => appMessage.info(`已移除附件：${attachment.name}`)}
          onRetryAttachment={async (attachment) => {
            await simulateAttachmentRequest();
            appMessage.success(`已重新上传：${attachment.name}`);
            return { ...attachment, status: 'done', progress: 100 };
          }}
          onUpload={async (file) => {
            await simulateAttachmentRequest();
            appMessage.success(`已添加文件：${file.name}`);
          }}
        />
      </div>
    </Card>
    <Card title="发送内容" extra={<Space size={COMPANY_SPACE[8]}><Tag>文字与文件</Tag><Tag color="blue">可编辑组件</Tag></Space>}>
      <div className="company-sent-message-showcase">
        <CompanySentMessage
          defaultValue="请根据受影响资产清单，生成一份安全事件应急处置方案。"
          defaultHistory={['请生成安全事件应急处置方案。', '请根据受影响资产清单，生成一份安全事件应急处置方案。']}
          files={sentMessageFiles}
          onCopy={() => appMessage.success('已复制发送内容')}
          onSave={(value) => appMessage.success(`已保存编辑：${value}`)}
        />
        <CompanySentMessage status="sending" defaultValue="正在发送终端风险研判请求，请稍候。" showActions={false} />
        <CompanySentMessage status="error" defaultValue="请重新分析终端安全事件并生成处置建议。" onCopy={() => appMessage.success('已复制发送内容')} onRetry={() => appMessage.success('已重新发送')} />
      </div>
    </Card>
    <Row gutter={[COMPANY_SPACE[16], COMPANY_SPACE[16]]}>
      <Col xs={24} xl={12}><Card title="思考过程"><Think className="company-ai-think" title="已完成分析" defaultExpanded>已识别页面目标、组件范围与主题变量，正在生成符合公司规范的实现建议。</Think><ThoughtChain className="company-ai-chain" items={[{ title: '理解问题', description: '识别用户目标' }, { title: '检索资料', description: '读取组件与规范' }, { title: '生成结果', description: '组织可执行答案', status: 'success' }]} /></Card></Col>
      <Col xs={24} xl={12}><Card title="引用来源"><Sources className="company-ai-sources" title="参考了 3 个来源" defaultExpanded items={[{ key: '1', title: '安全 + AI UI 组件框架规范 V3.0', description: 'AI 组件视觉与状态规范' }, { key: '2', title: '公司 AI 组件节点记录', description: '组件结构、状态与交互能力' }, { key: '3', title: '公司主题变量', description: '颜色、字体、圆角与投影' }]} /></Card></Col>
    </Row>
    <Card title="智能体输出" extra={<Space size={COMPANY_SPACE[8]}><Tag>多类型输出</Tag><Tag color="blue">工程组件</Tag></Space>}>
      <div className="company-ai-output-showcase">
        <div className="company-ai-output-showcase__toolbar">
          <Segmented options={aiOutputTypeOptions} value={aiOutputType} onChange={(value) => setAIOutputType(value as AIOutputShowcaseType)} />
          {aiOutputType === 'loading' && <Segmented
            options={[{ label: '加载中', value: 'loading' }, { label: '加载失败', value: 'error' }]}
            value={aiOutputLoadState}
            onChange={(value) => setAIOutputLoadState(value as 'loading' | 'error')}
          />}
          {aiOutputType === 'task' && <Segmented
            options={[{ label: '任务中', value: 'running' }, { label: '任务结束', value: 'finished' }]}
            value={aiOutputTaskState}
            onChange={(value) => setAIOutputTaskState(value as AIOutputTaskState)}
          />}
        </div>
        <CompanyAIOutput
          title="安全智能体漏洞报告"
          lead="智能体决策逻辑模块因输入验证不当，存在越权指令执行风险"
          annotation="本回答由 AI 生成，内容仅供参考，请仔细甄别。"
          thought={{
            title: '已完成思考',
            content: '已完成输入上下文、权限边界与风险影响分析，并根据终端安全规范组织处置建议。',
            status: 'complete',
          }}
          tags={[{ key: 'web', label: '智能体网页', icon: <CompanyIcon type={companyIcons.webSearch} /> }, { key: 'source', label: 'www.360.com' }]}
          media={aiOutputType === 'task' ? aiOutputTaskExamples[aiOutputTaskState] : aiOutputType !== 'text' && aiOutputType !== 'loading' ? aiOutputMediaExamples[aiOutputType] : undefined}
          status={aiOutputType === 'loading' ? aiOutputLoadState : 'ready'}
          onCopy={() => appMessage.success('已复制智能体输出')}
          onRegenerate={() => appMessage.success('正在重新生成')}
          onFeedback={(feedback) => appMessage.info(feedback === 'like' ? '已标记喜欢' : feedback === 'dislike' ? '已标记不喜欢' : '已取消反馈')}
          onDownload={(name) => appMessage.success(`已下载：${name}`)}
        >
          在指令处理入口增加严格的参数类型、范围及权限上下文校验。实施最小权限原则，对核心决策函数进行沙箱化隔离，建议版本更新至智能体核心框架 v2.1.5 及以上。
        </CompanyAIOutput>
      </div>
    </Card>
  </div>;
}

const terminalBrandAssets = {
  logo: '/assets/brand/terminal-security-logo.png',
  genericLogo: '/assets/brand/generic-product-logo.png',
  aiBadge: '/assets/brand/ai-badge.svg',
  navAiBadge: '/assets/brand/terminal-nav-ai-badge@2x.png',
} as const;

type GenericListRecord = {
  key: number;
  name: string;
  level: '高危';
  status: '进行中';
  category: string;
  owner: string;
};

const genericListData: GenericListRecord[] = Array.from({ length: 20 }, (_, index) => ({
  key: index + 1,
  name: '单元格',
  level: '高危',
  status: '进行中',
  category: '单元格',
  owner: '单元格',
}));

function GenericListFramework() {
  const { message: appMessage } = AntdApp.useApp();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([1, 2, 3]);
  const [currentPage, setCurrentPage] = useState(13);
  const [pageSize, setPageSize] = useState(20);
  const columns: TableProps<GenericListRecord>['columns'] = [
    { title: '多选列', dataIndex: 'name', width: 180, fixed: 'left' },
    {
      title: '标签',
      dataIndex: 'level',
      width: 180,
      sorter: (a, b) => a.level.localeCompare(b.level),
      filters: [{ text: '高危', value: '高危' }],
      onFilter: (value, record) => record.level === value,
      render: (value) => <CompanyTag tone={getBusinessTagTone(value)} variant="light">{value}</CompanyTag>,
    },
    { title: '状态', dataIndex: 'status', width: 180, render: (value) => <CompanyTag tone="info" variant="dot">{value}</CompanyTag> },
    { title: '常规列', dataIndex: 'category', width: 180 },
    { title: '常规列', dataIndex: 'owner', width: 180 },
    {
      title: '操作',
      key: 'actions',
      width: 190,
      fixed: 'right',
      render: () => <Space size={COMPANY_SPACE[4]}>
        <Button type="link" size="small" onClick={() => appMessage.info('详情操作已触发')}>详情</Button>
        <Button type="link" size="small" onClick={() => appMessage.info('编辑操作已触发')}>编辑</Button>
        <Dropdown menu={{ items: [{ key: 'copy', label: '复制' }, { key: 'delete', label: '删除' }], onClick: ({ key }) => appMessage.info(key === 'copy' ? '复制操作已触发' : '删除操作已触发') }}>
          <Button type="link" size="small">更多 <CompanyIcon type={companyIcons.down} /></Button>
        </Dropdown>
      </Space>,
    },
  ];

  const resetSearch = () => {
    form.resetFields();
    appMessage.success('筛选条件已重置');
  };

  const navigation = <div className="generic-showroom-navigation">
    <Menu
      mode="inline"
      selectedKeys={['basic-list']}
      items={[{ key: 'basic-list', icon: <CompanyIcon type={companyIcons.appFramework} />, label: '基础列表页' }]}
    />
    <div className="generic-showroom-navigation-footer"><CompanyIcon type={companyIcons.menu} /><Text type="secondary">V10.0</Text></div>
  </div>;

  return <div className="generic-showroom-frame">
    <Header className="generic-showroom-topbar">
      <div className="generic-showroom-topbar-left">
        <div className="generic-showroom-brand" aria-label="360实际产品名称标识">
          <img src={terminalBrandAssets.genericLogo} alt="360实际产品名称标识" />
          <img src={terminalBrandAssets.aiBadge} alt="AI" />
        </div>
        <Menu theme="dark" mode="horizontal" selectedKeys={['list']} items={[{ key: 'list', label: '列表页' }]} />
      </div>
      <Space size={COMPANY_SPACE[12]} className="generic-showroom-topbar-actions">
        <Text><CompanyIcon type="icon-anquandanao" /> 360全网安全大脑高效赋能 328 天</Text>
        <Tooltip title="站内信"><Button type="text" aria-label="站内信" icon={<CompanyIcon type={companyIcons.message} />} /></Tooltip>
        <Tooltip title="帮助"><Button type="text" aria-label="帮助" icon={<CompanyIcon type={companyIcons.aiOverview} />} /></Tooltip>
        <Dropdown menu={{ items: [{ key: 'profile', label: '个人资料' }, { key: 'logout', label: '退出登录' }] }}>
          <Button type="text" icon={<CompanyIcon type={companyIcons.user} />}>超级管理员 <CompanyIcon type={companyIcons.down} /></Button>
        </Dropdown>
      </Space>
    </Header>
    <CompanyBusinessLayout
      className="generic-showroom-layout"
      navigation={navigation}
      header={<CompanyPageHeader className="generic-showroom-page-header" breadcrumbItems={[{ title: '基础列表页' }]} />}
    >
      <CompanySurface className="generic-list-surface" tone="business">
        <Form
          form={form}
          onFinish={() => appMessage.success('已按当前条件完成搜索')}
        >
          <CompanySearchPanel renderAs="div" columns={3} onSearch={() => form.submit()} onReset={resetSearch} resetText="重置">
            <CompanySearchField label="标题内容"><Form.Item name="type" noStyle><Select placeholder="请选择" options={[{ value: 'default', label: '默认选项' }]} /></Form.Item></CompanySearchField>
            <CompanySearchField label="标题内容"><Form.Item name="keyword" noStyle><Input placeholder="请输入..." /></Form.Item></CompanySearchField>
            <CompanySearchField label="标题内容"><Form.Item name="owner" noStyle><Input placeholder="请输入..." /></Form.Item></CompanySearchField>
            <CompanySearchField label="标题内容"><Form.Item name="createdAt" noStyle><DatePicker.RangePicker placeholder={['开始日期', '结束日期']} /></Form.Item></CompanySearchField>
            <CompanySearchField label="标题内容"><Form.Item name="updatedAt" noStyle><DatePicker.RangePicker placeholder={['开始日期', '结束日期']} /></Form.Item></CompanySearchField>
          </CompanySearchPanel>
        </Form>
        <div className="generic-list-toolbar">
          <Space size={COMPANY_SPACE[8]}>
            <CompanyButton variant="primary" icon={<CompanyIcon type={companyIcons.add} />} onClick={() => appMessage.success('新建操作已触发')}>新建</CompanyButton>
            <Text type="secondary">已选 {selectedRowKeys.length} 项</Text>
          </Space>
        </div>
        <Table<GenericListRecord>
          className="generic-list-table"
          rowKey="key"
          columns={columns}
          dataSource={genericListData}
          pagination={false}
          size="small"
          rowSelection={{ selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys) }}
          scroll={{ x: 1110, y: 9999 }}
        />
        <div className="generic-list-pagination">
          <Pagination
            current={currentPage}
            total={4568}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={[10, 20]}
            showTotal={(total) => `共计 ${total} 条`}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
          />
        </div>
      </CompanySurface>
    </CompanyBusinessLayout>
  </div>;
}

type TerminalEventRecord = {
  key: number;
  name: string;
  level: '高危' | '中危' | '低危';
  source: string;
  devices: string;
  status: string;
  time: string;
};

function TerminalFramework({ onExit }: { onExit?: () => void }) {
  const { message: appMessage, modal: appModal } = AntdApp.useApp();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState(() => {
    const requestedPage = new URLSearchParams(window.location.search).get('terminal');
    return requestedPage && ['overview', 'ransomware', 'events', 'assets', 'policies'].includes(requestedPage) ? requestedPage : 'overview';
  });
  const [strategyOpen, setStrategyOpen] = useState(false);
  const [strategySaving, setStrategySaving] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TerminalEventRecord>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string | number>>([]);
  const [strategyForm] = Form.useForm();
  const navItems = [
    { key: 'overview', iconClass: companyIcons.visualization, label: '场景总览' },
    { key: 'ransomware', iconClass: companyIcons.vulnerability, label: '勒索专项分析', ai: true },
    { key: 'events', iconClass: companyIcons.securityEvent, label: '安全事件', ai: true },
    { key: 'assets', iconClass: companyIcons.terminal, label: '终端资产' },
    { key: 'policies', iconClass: companyIcons.securityPolicy, label: '防护策略' },
  ];
  const eventData: TerminalEventRecord[] = [
    { key: 1, name: '外联异常进程检测', level: '高危', source: '行为检测', devices: '12 台', status: '待处置', time: '2026-08-07 10:24:18' },
    { key: 2, name: '可疑横向移动行为', level: '中危', source: '流量分析', devices: '8 台', status: '处理中', time: '2026-08-07 09:48:32' },
    { key: 3, name: '策略未覆盖终端', level: '中危', source: '策略审计', devices: '23 台', status: '待处置', time: '2026-08-06 18:32:16' },
    { key: 4, name: '恶意文档执行行为', level: '高危', source: '文件防护', devices: '3 台', status: '已阻断', time: '2026-08-06 16:05:44' },
    { key: 5, name: '终端弱口令登录', level: '低危', source: '账号审计', devices: '5 台', status: '已处置', time: '2026-08-05 14:20:09' },
  ];
  const eventColumns: TableProps<TerminalEventRecord>['columns'] = [
    { title: '事件名称', dataIndex: 'name', width: 240, fixed: 'left', ellipsis: true, render: (value, record) => <Button type="link" className="terminal-table-link" onClick={() => setSelectedEvent(record)}>{value}</Button> },
    { title: '风险等级', dataIndex: 'level', width: 140, filters: ['高危', '中危', '低危'].map((value) => ({ text: value, value })), onFilter: (value, record) => record.level === value, render: (value) => <CompanyTag tone={value === '高危' ? 'high' : value === '中危' ? 'warning' : 'low'} variant="light">{value}</CompanyTag> },
    { title: '检测来源', dataIndex: 'source', width: 160 },
    { title: '影响终端', dataIndex: 'devices', width: 120, sorter: (a, b) => Number.parseInt(a.devices, 10) - Number.parseInt(b.devices, 10) },
    { title: '处置状态', dataIndex: 'status', width: 140, filters: ['待处置', '处理中', '已处置', '已阻断'].map((value) => ({ text: value, value })), onFilter: (value, record) => record.status === value, render: (value) => <CompanyTag tone={value === '已处置' || value === '已阻断' ? 'success' : value === '处理中' ? 'info' : 'warning'} variant="dot">{value}</CompanyTag> },
    { title: '发现时间', dataIndex: 'time', width: 190, sorter: (a, b) => a.time.localeCompare(b.time) },
  ];
  const assetData = [
    { key: 1, name: 'DESKTOP-A021', ip: '10.16.8.21', group: '研发中心', system: 'Windows 11', status: '在线', risk: '低风险', update: '2026-08-07 10:22:16' },
    { key: 2, name: 'DESKTOP-F104', ip: '10.16.12.104', group: '财务中心', system: 'Windows 10', status: '在线', risk: '高风险', update: '2026-08-07 10:19:08' },
    { key: 3, name: 'SERVER-OPS-08', ip: '10.20.4.8', group: '运维中心', system: 'Windows Server', status: '在线', risk: '中风险', update: '2026-08-07 10:16:42' },
    { key: 4, name: 'MAC-MKT-016', ip: '10.18.2.16', group: '市场中心', system: 'macOS 15', status: '离线', risk: '低风险', update: '2026-08-07 07:24:30' },
    { key: 5, name: 'DESKTOP-HR32', ip: '10.19.1.32', group: '人力资源部', system: 'Windows 11', status: '在线', risk: '无风险', update: '2026-08-07 10:24:02' },
  ];
  const assetColumns: TableProps<(typeof assetData)[number]>['columns'] = [
    { title: '终端名称', dataIndex: 'name', width: 220, fixed: 'left', render: (value) => <Button type="link" className="terminal-table-link">{value}</Button> },
    { title: 'IP 地址', dataIndex: 'ip', width: 130 },
    { title: '所属分组', dataIndex: 'group', width: 180, filters: ['研发中心', '财务中心', '运维中心', '市场中心', '人力资源部'].map((value) => ({ text: value, value })), onFilter: (value, record) => record.group === value },
    { title: '操作系统', dataIndex: 'system', width: 180 },
    { title: '在线状态', dataIndex: 'status', width: 140, render: (value) => <CompanyTag tone={value === '在线' ? 'success' : 'neutral'} variant="dot">{value}</CompanyTag> },
    { title: '安全状态', dataIndex: 'risk', width: 140, render: (value) => <CompanyTag tone={value === '高风险' ? 'danger' : value === '中风险' ? 'warning' : value === '低风险' ? 'low' : 'success'} variant="light">{value}</CompanyTag> },
    { title: '最后上报', dataIndex: 'update', width: 190, sorter: (a, b) => a.update.localeCompare(b.update) },
  ];
  const policyData = [
    { key: 1, name: '办公终端基线防护', range: '办公终端', type: '基线防护', coverage: '486 台', status: '已启用', update: '2026-08-07 09:30:16' },
    { key: 2, name: '服务器高危漏洞阻断', range: '服务器终端', type: '漏洞防护', coverage: '128 台', status: '已启用', update: '2026-08-06 17:42:08' },
    { key: 3, name: '研发终端外联审计', range: '研发中心', type: '行为审计', coverage: '312 台', status: '已启用', update: '2026-08-04 16:10:42' },
    { key: 4, name: '移动存储设备管控', range: '全部受管终端', type: '外设管控', coverage: '1,248 台', status: '未启用', update: '2026-08-01 11:24:30' },
  ];
  const policyColumns: TableProps<(typeof policyData)[number]>['columns'] = [
    { title: '策略名称', dataIndex: 'name', width: 240, fixed: 'left', render: (value) => <Button type="link" className="terminal-table-link">{value}</Button> },
    { title: '作用范围', dataIndex: 'range', width: 180 },
    { title: '策略类型', dataIndex: 'type', width: 160, filters: ['基线防护', '漏洞防护', '行为审计', '外设管控'].map((value) => ({ text: value, value })), onFilter: (value, record) => record.type === value },
    { title: '覆盖终端', dataIndex: 'coverage', width: 140, sorter: (a, b) => Number.parseInt(a.coverage.replaceAll(',', ''), 10) - Number.parseInt(b.coverage.replaceAll(',', ''), 10) },
    { title: '状态', dataIndex: 'status', width: 140, render: (value) => <Switch size="small" checked={value === '已启用'} onChange={(checked) => appMessage.success(`策略已${checked ? '启用' : '停用'}`)} /> },
    { title: '更新时间', dataIndex: 'update', width: 190, sorter: (a, b) => a.update.localeCompare(b.update) },
    { title: '操作', key: 'action', width: 120, fixed: 'right', render: () => <Button type="link" size="small">编辑</Button> },
  ];
  const overviewMetrics: TerminalMetric[] = [
    { key: 'managed', title: '受管终端', value: '1,248', unit: '台', note: '较昨日 +2.4%', image: '/assets/visual/3d-terminal-discovery.png', target: 'assets' },
    { key: 'online', title: '在线终端', value: '1,182', unit: '台', note: '在线率 94.7%', image: '/assets/visual/3d-risk-asset.png', target: 'assets' },
    { key: 'events', title: '待处理事件', value: '19', unit: '条', note: '其中高危 7 条', image: '/assets/visual/3d-security-event.png', tone: 'danger', target: 'events' },
    { key: 'coverage', title: '策略覆盖率', value: '92.6', unit: '%', note: '仍有 92 台待覆盖', image: '/assets/visual/3d-smart-qa.png', target: 'policies' },
  ];
  const pageTitle = navItems.find((item) => item.key === activeNav)?.label ?? '场景总览';
  const changeTerminalPage = (nextPage: string) => {
    setActiveNav(nextPage);
    setSelectedRowKeys([]);
    const url = new URL(window.location.href);
    url.searchParams.set('terminal', nextPage);
    window.history.replaceState(null, '', url);
  };
  const closeStrategy = () => {
    if (!strategyForm.isFieldsTouched()) {
      setStrategyOpen(false);
      return;
    }
    appModal.confirm({
      title: '确认放弃当前修改？',
      content: '已填写的策略内容不会被保存。',
      okText: '放弃修改',
      cancelText: '继续编辑',
      onOk: () => {
        strategyForm.resetFields();
        setStrategyOpen(false);
      },
    });
  };
  const submitStrategy = async () => {
    try {
      await strategyForm.validateFields();
      setStrategySaving(true);
      window.setTimeout(() => {
        setStrategySaving(false);
        setStrategyOpen(false);
        strategyForm.resetFields();
        appMessage.success('安全策略已创建');
      }, 600);
    } catch {
      // Validation errors are rendered by Form.Item.
    }
  };
  const accountItems: MenuProps['items'] = [
    { key: 'profile', label: '个人资料' },
    { key: 'logout', label: '退出登录' },
    ...(onExit ? [{ type: 'divider' as const }, { key: 'preview', label: '返回组件资源' }] : []),
  ];
  return <div className="terminal-frame">
    <header className="terminal-topbar">
      <div className="terminal-topbar-left">
        <div className="terminal-brand-lockup" aria-label="360终端安全管理系统">
          <img className="terminal-brand-logo" src={terminalBrandAssets.logo} alt="360终端安全管理系统" />
          <img className="terminal-logo-ai" src={terminalBrandAssets.aiBadge} alt="AI" />
        </div>
        <Dropdown menu={{ items: [{ key: 'local', label: '本级中心' }, { key: 'group', label: '集团中心' }], onClick: ({ key }) => appMessage.info(`已切换至${key === 'local' ? '本级中心' : '集团中心'}`) }} trigger={['click']}>
          <Button type="text" className="terminal-center-switch" icon={<CompanyIcon type={companyIcons.center} />}>本级中心 <CompanyIcon type={companyIcons.expand} /></Button>
        </Dropdown>
      </div>
      <div className="terminal-topbar-right">
        <div className="terminal-cloud"><CompanyIcon type="icon-anquandanao" /><span>360全网安全大脑持续守护 328 天，共 8 项订阅服务</span></div>
        <Dropdown menu={{ items: [{ key: 'overview', label: '安全总览' }, { key: 'topology', label: '终端拓扑' }, { key: 'trend', label: '风险趋势' }], onClick: () => appMessage.info('可视化视图已切换') }} trigger={['click']}>
          <Button type="text" className="terminal-visual-button" icon={<CompanyIcon type={companyIcons.visualization} />}>可视化 <CompanyIcon type={companyIcons.expand} /></Button>
        </Dropdown>
        <Divider orientation="vertical" className="terminal-divider" />
        <Space size={COMPANY_SPACE[8]} className="terminal-actions">
          <Tooltip title="系统设置"><Button type="text" aria-label="系统设置" icon={<CompanyIcon type={companyIcons.setting} />} onClick={() => appMessage.info('系统设置暂使用本地预览配置')} /></Tooltip>
          <Tooltip title="应用信息"><Button type="text" aria-label="应用信息" icon={<CompanyIcon type={companyIcons.applicationInfo} />} onClick={() => appMessage.info('应用信息暂使用本地预览配置')} /></Tooltip>
          <Tooltip title="授权管理"><Button type="text" aria-label="授权管理" icon={<CompanyIcon type={companyIcons.authorization} />} onClick={() => appMessage.info('授权管理暂使用本地预览配置')} /></Tooltip>
          <Tooltip title="维护组织"><Button type="text" aria-label="维护组织" icon={<CompanyIcon type={companyIcons.maintenanceOrganization} />} onClick={() => appMessage.info('维护组织暂使用本地预览配置')} /></Tooltip>
          <Tooltip title="站内信"><Button type="text" aria-label="站内信" icon={<CompanyIcon type={companyIcons.message} />} onClick={() => appMessage.info('暂无新的站内信')} /></Tooltip>
          <Dropdown menu={{ items: accountItems, onClick: ({ key }) => {
            if (key === 'preview') {
              onExit?.();
              return;
            }
            appMessage.info(key === 'profile' ? '个人资料面板已打开' : '本地预览不执行退出登录');
          } }} trigger={['click']}>
            <Button type="text" className="terminal-account"><span className="terminal-user">admin</span><CompanyIcon type={companyIcons.expand} /></Button>
          </Dropdown>
        </Space>
      </div>
      </header>
    <div className="terminal-body">
      <aside className={`terminal-nav ${navCollapsed ? 'terminal-nav-collapsed' : ''}`}>
        <div className="terminal-nav-list">{navItems.map((item) => <button type="button" className={`terminal-nav-item ${activeNav === item.key ? 'active' : ''}`} key={item.key} onClick={() => changeTerminalPage(item.key)} title={navCollapsed ? item.label : undefined}><span className="terminal-nav-icon"><CompanyIcon type={item.iconClass} /></span>{!navCollapsed && <><span className="terminal-nav-text">{item.label}</span>{item.ai && <img className="terminal-nav-ai" src={terminalBrandAssets.navAiBadge} alt="AI" />}</>}</button>)}</div>
        <div className="terminal-nav-footer"><Button type="text" aria-label={navCollapsed ? '展开导航' : '收起导航'} icon={<CompanyIcon type={navCollapsed ? 'icon-xiangyouzhankai' : companyIcons.collapse} />} onClick={() => setNavCollapsed(!navCollapsed)} /><Text>V10.0</Text></div>
      </aside>
      <main className="terminal-content">
        <div className="terminal-page-heading">
          <Text className="terminal-page-title">{pageTitle}</Text>
          <Space size={COMPANY_SPACE[8]}>
            {activeNav === 'overview' && <Segmented size="small" options={['近7天', '近30天']} defaultValue="近7天" onChange={() => appMessage.info('安全态势数据已更新')} />}
            {activeNav === 'events' && <Button icon={<CompanyIcon type={companyIcons.export} />} onClick={() => appMessage.success('导出任务已创建')}>导出</Button>}
          </Space>
        </div>
        <div className={`terminal-page-scroll ${activeNav === 'overview' || activeNav === 'ransomware' ? '' : 'is-list'}`}>
          {activeNav === 'overview' && <div className="terminal-dashboard-page">
            <TerminalMetricGroup items={overviewMetrics} onNavigate={changeTerminalPage} />
            <Row gutter={[COMPANY_SPACE[16], COMPANY_SPACE[16]]}>
              <Col span={16}><TerminalBusinessContainer title="安全事件趋势" extra={<Button type="link" size="small" onClick={() => changeTerminalPage('events')}>查看详情</Button>} className="terminal-chart-panel"><TerminalTrendChart /></TerminalBusinessContainer></Col>
              <Col span={8}><TerminalBusinessContainer title="风险分布" extra={<Button type="link" size="small" onClick={() => changeTerminalPage('events')}>全部风险</Button>} className="terminal-chart-panel"><TerminalRiskDistribution /></TerminalBusinessContainer></Col>
            </Row>
            <Row gutter={[COMPANY_SPACE[16], COMPANY_SPACE[16]]}>
              <Col span={16}><TerminalBusinessContainer title="最新安全事件" extra={<Button type="link" size="small" onClick={() => changeTerminalPage('events')}>查看全部</Button>} className="terminal-event-panel"><Table columns={eventColumns} dataSource={eventData.slice(0, 4)} pagination={false} size="middle" scroll={{ x: 990 }} /></TerminalBusinessContainer></Col>
              <Col span={8}><TerminalBusinessContainer title="终端状态" extra={<Button type="link" size="small" onClick={() => changeTerminalPage('assets')}>终端列表</Button>} className="terminal-status-panel"><div className="terminal-status-list"><div><CompanyTag tone="success" variant="dot">在线终端</CompanyTag><strong>1,182</strong></div><div><CompanyTag tone="neutral" variant="dot">离线终端</CompanyTag><strong>44</strong></div><div><CompanyTag tone="danger" variant="dot">隔离终端</CompanyTag><strong>15</strong></div><div><CompanyTag tone="warning" variant="dot">待升级终端</CompanyTag><strong>7</strong></div></div><Divider /><Timeline items={[{ color: 'green', content: '终端基线策略已完成同步' }, { color: 'blue', content: '新增 3 条网络行为告警' }]} /></TerminalBusinessContainer></Col>
            </Row>
          </div>}

          {activeNav === 'ransomware' && <TerminalRansomwarePage onNotify={(message) => appMessage.info(message)} />}

          {activeNav === 'events' && <div className="terminal-list-page">
            <TerminalMetricGroup items={[
              { key: 'pending', title: '待处置事件', value: '19', unit: '条', note: '较昨日减少 3 条', image: '/assets/visual/3d-security-event.png', tone: 'danger' },
              { key: 'high', title: '高危事件', value: '7', unit: '条', note: '涉及 15 台终端', image: '/assets/visual/3d-risk-asset.png', tone: 'warning' },
              { key: 'handled', title: '今日已处置', value: '46', unit: '条', note: '平均处置 18 分钟', image: '/assets/visual/3d-smart-qa.png' },
            ]} />
            <TerminalBusinessContainer className="terminal-list-panel">
              <div className="terminal-search-form">
                <TerminalSearchField label="事件名称"><Input allowClear placeholder="请输入事件名称" /></TerminalSearchField>
                <TerminalSearchField label="风险等级"><Select allowClear placeholder="请选择风险等级" options={['高危', '中危', '低危'].map((value) => ({ value, label: value }))} /></TerminalSearchField>
                <TerminalSearchField label="处置状态"><Select allowClear placeholder="请选择处置状态" options={['待处置', '处理中', '已处置'].map((value) => ({ value, label: value }))} /></TerminalSearchField>
                <TerminalSearchField label="发现时间"><DatePicker.RangePicker placeholder={['请选择开始日期', '请选择结束日期']} /></TerminalSearchField>
                <Space className="terminal-search-actions"><Button type="primary" icon={<CompanyIcon type={companyIcons.search} />} onClick={() => appMessage.success('搜索结果已更新')}>搜索</Button><Button>清空</Button></Space>
              </div>
              <div className="terminal-list-toolbar"><div className="terminal-list-toolbar-primary"><Tooltip title={selectedRowKeys.length ? undefined : '请先勾选需要处置的事件'}><Button disabled={!selectedRowKeys.length}>处置</Button></Tooltip>{selectedRowKeys.length > 0 && <Text type="secondary">已选 {selectedRowKeys.length} 项</Text>}</div><Space><Button>导出全部</Button><Tooltip title="刷新列表"><Button aria-label="刷新列表" icon={<CompanyIcon type="icon-a-shuaxingengxinzhongzhi" />} /></Tooltip><Tooltip title="配置表格字段"><Button aria-label="配置表格字段" icon={<CompanyIcon type={companyIcons.setting} />} /></Tooltip></Space></div>
              <Table rowSelection={{ fixed: true, selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys as Array<string | number>) }} columns={eventColumns} dataSource={eventData} pagination={false} size="middle" scroll={{ x: 1080, y: 180 }} />
              <div className="terminal-pagination"><Pagination current={1} total={28} pageSize={20} showSizeChanger showQuickJumper showTotal={(total) => `共计 ${total} 条`} pageSizeOptions={[10, 20, 50, 100]} /></div>
            </TerminalBusinessContainer>
          </div>}

          {activeNav === 'assets' && <div className="terminal-list-page">
            <TerminalMetricGroup items={[
              { key: 'total', title: '受管终端', value: '1,248', unit: '台', note: '覆盖 8 个组织', image: '/assets/visual/3d-terminal-discovery.png' },
              { key: 'online', title: '在线终端', value: '1,182', unit: '台', note: '在线率 94.7%', image: '/assets/visual/3d-risk-asset.png' },
              { key: 'risk', title: '风险终端', value: '36', unit: '台', note: '高风险 12 台', image: '/assets/visual/3d-security-event.png', tone: 'danger' },
              { key: 'uncovered', title: '未覆盖终端', value: '92', unit: '台', note: '待完成策略同步', image: '/assets/visual/3d-smart-qa.png', tone: 'warning' },
            ]} />
            <TerminalBusinessContainer className="terminal-list-panel">
              <div className="terminal-search-form">
                <TerminalSearchField label="终端信息"><Input allowClear placeholder="请输入终端名称或 IP" /></TerminalSearchField>
                <TerminalSearchField label="所属分组"><Select allowClear placeholder="请选择所属分组" options={['研发中心', '财务中心', '运维中心', '市场中心'].map((value) => ({ value, label: value }))} /></TerminalSearchField>
                <TerminalSearchField label="在线状态"><Select allowClear placeholder="请选择在线状态" options={['在线', '离线'].map((value) => ({ value, label: value }))} /></TerminalSearchField>
                <TerminalSearchField label="安全状态"><Select allowClear placeholder="请选择安全状态" options={['高风险', '中风险', '低风险', '无风险'].map((value) => ({ value, label: value }))} /></TerminalSearchField>
                <Space className="terminal-search-actions"><Button type="primary" icon={<CompanyIcon type={companyIcons.search} />} onClick={() => appMessage.success('搜索结果已更新')}>搜索</Button><Button>清空</Button></Space>
              </div>
              <div className="terminal-list-toolbar"><div className="terminal-list-toolbar-primary"><Button type="primary" icon={<CompanyIcon type={companyIcons.add} />} onClick={() => appMessage.info('新建终端')}>新建</Button><Tooltip title={selectedRowKeys.length ? undefined : '请先勾选需要移动的终端'}><Button disabled={!selectedRowKeys.length}>移动分组</Button></Tooltip>{selectedRowKeys.length > 0 && <Text type="secondary">已选 {selectedRowKeys.length} 项</Text>}</div><Space><Button>导出全部</Button><Tooltip title="刷新列表"><Button aria-label="刷新列表" icon={<CompanyIcon type="icon-a-shuaxingengxinzhongzhi" />} /></Tooltip><Tooltip title="配置表格字段"><Button aria-label="配置表格字段" icon={<CompanyIcon type={companyIcons.setting} />} /></Tooltip></Space></div>
              <Table rowSelection={{ fixed: true, selectedRowKeys, onChange: (keys) => setSelectedRowKeys(keys as Array<string | number>) }} columns={assetColumns} dataSource={assetData} pagination={false} size="middle" scroll={{ x: 1200, y: 180 }} />
              <div className="terminal-pagination"><Pagination current={1} total={1248} pageSize={20} showSizeChanger showQuickJumper showTotal={(total) => `共计 ${total} 条`} pageSizeOptions={[10, 20, 50, 100]} /></div>
            </TerminalBusinessContainer>
          </div>}

          {activeNav === 'policies' && <div className="terminal-list-page terminal-list-page-simple">
            <TerminalBusinessContainer className="terminal-list-panel">
              <div className="terminal-search-form terminal-search-form-compact">
                <TerminalSearchField label="策略名称"><Input allowClear placeholder="请输入策略名称" /></TerminalSearchField>
                <TerminalSearchField label="策略类型"><Select allowClear placeholder="请选择策略类型" options={['基线防护', '漏洞防护', '行为审计', '外设管控'].map((value) => ({ value, label: value }))} /></TerminalSearchField>
                <TerminalSearchField label="启用状态"><Select allowClear placeholder="请选择启用状态" options={['已启用', '未启用'].map((value) => ({ value, label: value }))} /></TerminalSearchField>
                <Space className="terminal-search-actions"><Button type="primary" icon={<CompanyIcon type={companyIcons.search} />} onClick={() => appMessage.success('搜索结果已更新')}>搜索</Button><Button>清空</Button></Space>
              </div>
              <div className="terminal-list-toolbar"><div className="terminal-list-toolbar-primary"><Button type="primary" icon={<CompanyIcon type={companyIcons.add} />} onClick={() => setStrategyOpen(true)}>新建</Button></div><Space><Button>导出全部</Button><Tooltip title="刷新列表"><Button aria-label="刷新列表" icon={<CompanyIcon type="icon-a-shuaxingengxinzhongzhi" />} /></Tooltip><Tooltip title="配置表格字段"><Button aria-label="配置表格字段" icon={<CompanyIcon type={companyIcons.setting} />} /></Tooltip></Space></div>
              <Table columns={policyColumns} dataSource={policyData} pagination={false} size="middle" scroll={{ x: 1170, y: 310 }} />
              <div className="terminal-pagination"><Pagination current={1} total={16} pageSize={20} showSizeChanger showQuickJumper showTotal={(total) => `共计 ${total} 条`} pageSizeOptions={[10, 20, 50, 100]} /></div>
            </TerminalBusinessContainer>
          </div>}
        </div>
      </main>
    </div>
    <Modal title="新建安全策略" width={560} open={strategyOpen} onCancel={closeStrategy} onOk={submitStrategy} confirmLoading={strategySaving} okText="创建策略" cancelText="取消" maskClosable={false}>
      <Form form={strategyForm} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} initialValues={{ range: '全部受管终端', level: '中危' }}>
        <Form.Item label="策略名称" name="name" rules={[{ required: true, message: '请输入策略名称' }, { max: 30, message: '最多输入 30 个字符' }]}><Input placeholder="请输入策略名称" /></Form.Item>
        <Form.Item label="作用范围" name="range" rules={[{ required: true, message: '请选择作用范围' }]}><Select style={{ width: '100%' }} options={[{ value: '全部受管终端', label: '全部受管终端' }, { value: '办公终端', label: '办公终端' }, { value: '服务器终端', label: '服务器终端' }]} /></Form.Item>
        <Form.Item label="风险等级" name="level" rules={[{ required: true, message: '请选择风险等级' }]}><Radio.Group options={['高危', '中危', '低危']} /></Form.Item>
      </Form>
    </Modal>
    <Drawer title="安全事件详情" width={560} open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(undefined)} extra={<Button type="primary" onClick={() => { appMessage.success('事件已标记为处理中'); setSelectedEvent(undefined); }}>开始处置</Button>}>
      {selectedEvent && <div className="terminal-event-detail"><div className="terminal-event-summary"><CompanyTag tone={selectedEvent.level === '高危' ? 'high' : selectedEvent.level === '中危' ? 'warning' : 'low'} variant="light">{selectedEvent.level}</CompanyTag><Text strong>{selectedEvent.name}</Text></div><Descriptions column={1} bordered size="small" items={[{ key: 'status', label: '处置状态', children: selectedEvent.status }, { key: 'source', label: '检测来源', children: selectedEvent.source }, { key: 'device', label: '影响终端', children: selectedEvent.devices }, { key: 'time', label: '发现时间', children: selectedEvent.time }, { key: 'description', label: '事件说明', children: '检测到终端存在异常行为，请结合终端进程、网络连接和账号活动完成研判。' }]} /><Divider>处置建议</Divider><Timeline items={[{ color: 'red', content: '优先隔离存在持续外联行为的终端' }, { color: 'blue', content: '核查相关进程和账号登录记录' }, { color: 'gray', content: '完成处置后同步更新事件状态' }]} /></div>}
    </Drawer>
  </div>;
}

const workspacePrompts = [
  '了解一下今天的告警降噪情况',
  '请帮我生成最近一周的告警降噪报告',
  '请对告警【测试ID】 进行完整威胁溯源，确认攻击是否成功、影响范围和后续处置建议',
  '最近24小时高危告警统计',
  '生成值班交接报告',
  '帮我识别并接入这份日志',
  '生成本周安全运营周报',
].map((label, index) => ({ key: String(index + 1), label }));

const workspaceConversationSeed = [
  ['today-1', '分析这条暴力破解告警是否存在真实入侵行为', '6/8 步', '758.7K tokens', 'today'],
  ['today-2', '梳理该漏洞对应的受影响资产与临时防护手段', '8 步', '758.7K tokens', 'today'],
  ['history-1', '汇总本周所有高危漏洞整改逾期资产清单', '12 步', '658.2K tokens'],
  ['history-2', '整理今日安全告警分级处置执行台账', '4 步', '21.8K tokens'],
  ['history-3', '溯源该外联异常告警对应的主机行为日志', '6 步', '146.4K tokens'],
  ['history-4', '对比同类告警样本区分误报与真实攻击事件', '5 步', '80.2K tokens'],
  ['history-5', '输出漏洞扫描报告里重点风险整改建议', '9 步', '280.9K tokens'],
] as const;

const workspaceConversations: AIWorkspaceConversation[] = workspaceConversationSeed.map(([id, title, steps, tokens, group], index) => ({
  id,
  title,
  steps,
  tokens,
  group,
  messages: [
    { id: `${id}-user`, role: 'user', content: title },
    {
      id: `${id}-assistant`,
      role: 'assistant',
      status: 'ready',
      output: {
        title: '历史任务分析结果',
        lead: `该任务已完成，共执行 ${steps}`,
        content: index % 2 === 0
          ? '已完成风险资产归并、责任人匹配和整改时限核验，结果可继续用于生成处置台账。'
          : '已完成告警去重、级别校正和处置状态核验，当前结果可继续补充或重新生成。',
        annotation: '历史会话数据用于工作台交互演示。',
        thought: { title: '已完成思考', content: '已按任务目标完成数据检索、关联分析与结果校验。', status: 'complete' },
        media: {
          type: 'task',
          tasks: [
            { id: `${id}-task-1`, title: '确认任务目标与范围', status: 'done' },
            { id: `${id}-task-2`, title: '关联安全数据与处置记录', status: 'done' },
            { id: `${id}-task-3`, title: '整理可执行结果', status: 'done' },
          ],
        },
        summary: {
          title: '历史任务摘要',
          description: '任务结果已恢复，可继续追问。',
          items: [
            { key: 'steps', label: '执行步骤', value: steps, tone: 'success' },
            { key: 'tokens', label: '上下文用量', value: tokens },
          ],
        },
      },
    },
  ],
}));

function AIWorkspace() {
  const { message: appMessage } = AntdApp.useApp();
  return <CompanyAIWorkspace
    conversations={workspaceConversations}
    prompts={workspacePrompts}
    senderProps={{
      ...sharedSuperSenderProps,
      placeholder: '请输入...',
      onAction: (action, enabled) => appMessage.info(`${action}${enabled === undefined ? '' : enabled ? '已启用' : '已关闭'}`),
      onSearchEngineChange: (key) => appMessage.info(`已切换搜索引擎：${superSenderSearchEngines.find((item) => item.key === key)?.label ?? key}`),
      onAgentChange: (key) => appMessage.info(`已切换智能体：${superSenderAgents.find((item) => item.key === key)?.label ?? key}`),
      onMcpChange: (keys) => appMessage.info(keys.length > 0 ? `已选择 ${keys.length} 个 MCP` : '已清空 MCP'),
      onDeepThinkingChange: (enabled) => appMessage.info(`深度思考${enabled ? '已启用' : '已关闭'}`),
      onWebSearchChange: (enabled) => appMessage.info(`联网搜索${enabled ? '已启用' : '已关闭'}`),
      onUpload: async (file) => {
        await simulateAttachmentRequest();
        appMessage.success(`已添加文件：${file.name}`);
      },
    }}
    onGenerationError={() => appMessage.error('任务生成失败，请重试')}
  />;
}

function SDKPage() {
  const markdown = `## 工程扩展能力\n\n底层源码包只提供运行能力，不作为视觉样式来源：\n\n- **会话能力**：请求、流式数据与会话状态\n- **内容渲染**：Markdown、代码和图表内容\n- **动态卡片**：协议驱动的业务卡片\n- **开发工具**：组件能力与工程集成\n\n所有可见颜色、图标、图片、字号、圆角和状态均以公司规范资源为准。`;
  return <div className="page-stack"><div><Title level={2}>工程能力</Title><Paragraph type="secondary">底层组件库仅作为工程实现基础，不作为视觉规范来源。</Paragraph></div><Card><XMarkdown content={markdown} /></Card><Row gutter={[COMPANY_SPACE[16], COMPANY_SPACE[16]]}>{[['会话能力', '模型请求、流处理、会话状态'], ['内容渲染', 'Markdown、代码与图表'], ['动态卡片', '协议驱动的业务卡片'], ['开发工具', '组件能力与工程集成']].map(([name, desc]) => <Col xs={24} md={12} key={name}><Card size="small" title={name}><Text>{desc}</Text></Card></Col>)}</Row></div>;
}

type AppProps = {
  themeMode: ThemeMode;
  densityMode: DensityMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  onDensityModeChange: (mode: DensityMode) => void;
};

export default function App({ themeMode, densityMode, onThemeModeChange, onDensityModeChange }: AppProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState(() => {
    const requestedPage = new URLSearchParams(window.location.search).get('page');
    return requestedPage && ['overview', 'showroom', 'antd', 'charts', 'x', 'workspace', 'sdk'].includes(requestedPage) ? requestedPage : 'overview';
  });
  const { token } = theme.useToken();
  const chartPaletteMode: ChartPaletteMode = themeMode.includes('蓝') ? 'blue' : 'green';
  const title = useMemo(() => ({ overview: '资源总览', showroom: '产品样板间', antd: '基础组件', charts: '可视化组件', x: 'AI 组件', workspace: 'AI 工作台示例', sdk: '工程能力' })[page], [page]);
  const content = {
    overview: <Overview />,
    showroom: <ProductShowroom />,
    antd: <Suspense fallback={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="正在加载组件目录" />}><ComponentShowcasePage /></Suspense>,
    charts: <ChartComponents paletteMode={chartPaletteMode} />,
    x: <XComponents />,
    workspace: <AIWorkspace />,
    sdk: <SDKPage />,
  }[page];
  const changePage = (nextPage: string) => {
    setPage(nextPage);
    const url = new URL(window.location.href);
    url.searchParams.set('page', nextPage);
    window.history.replaceState(null, '', url);
  };
  return <Layout className="app-layout">
    <Sider width={224} collapsedWidth={72} collapsed={collapsed} theme="light" className="app-sider">
      <div className="brand"><div className="brand-mark"><CompanyIcon type={companyIcons.component} /></div>{!collapsed && <div><Text strong>安全 + AI 组件</Text><Text type="secondary" className="brand-subtitle">公司规范预览</Text></div>}</div>
      <Menu mode="inline" selectedKeys={[page]} items={menuItems} onClick={({ key }) => changePage(key)} />
      {!collapsed && <div className="version-info"><Text type="secondary">主题 {themeMode}</Text><Text type="secondary">{DENSITY_LABELS[densityMode]}模式 · Iconfont 5177816</Text></div>}
    </Sider>
    <Layout>
      <Header className="app-header" style={{ background: token.colorBgContainer }}>
        <Button type="text" aria-label={collapsed ? '展开导航' : '收起导航'} icon={<CompanyIcon type={collapsed ? 'icon-xiangyouzhankai' : companyIcons.collapse} />} onClick={() => setCollapsed(!collapsed)} />
        <Breadcrumb items={[{ title: '组件资源' }, { title }]} />
        <div className="header-actions">
          <div className="preview-settings" aria-label="预览设置">
            <Text type="secondary" className="preview-setting-label">密度</Text>
            <Segmented
              aria-label="组件密度"
              value={densityMode}
              options={DENSITY_MODES.map((mode) => ({ label: DENSITY_LABELS[mode], value: mode }))}
              onChange={(value) => onDensityModeChange(value as DensityMode)}
            />
            <Text type="secondary" className="preview-setting-label">主题</Text>
            <Select
              aria-label="主题模式"
              className="theme-mode-select"
              value={themeMode}
              options={THEME_MODES.map((mode) => ({ label: mode, value: mode }))}
              onChange={(value) => onThemeModeChange(value as ThemeMode)}
              popupMatchSelectWidth={false}
            />
          </div>
          <Space className="preview-status"><Badge status="success" text="本地预览" /><Avatar size="small" icon={<CompanyIcon type={companyIcons.user} />} /></Space>
        </div>
      </Header>
      <Content className={page === 'workspace' ? 'content-workspace' : 'app-content'}>{content}</Content>
    </Layout>
  </Layout>;
}
