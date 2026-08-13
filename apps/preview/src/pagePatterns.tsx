import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  App as AntdApp,
  Button,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  Pagination,
  Progress,
  Segmented,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { TableProps } from 'antd';
import { CompanySearchField, CompanySearchPanel } from '@company/ui/search-panel';
import { CompanyIcon, companyIcons } from '@company/ui/icons';
import { COMPANY_SPACE } from '@company/theme';

const { Text, Title } = Typography;

type ListState = 'normal' | 'loading' | 'empty' | 'error';

type EventRecord = {
  key: number;
  name: string;
  level: '严重' | '高危' | '中危';
  asset: string;
  ip: string;
  status: '待处置' | '处置中' | '已完成';
  time: string;
};

const eventData: EventRecord[] = [
  { key: 1, name: '勒索软件横向传播行为', level: '严重', asset: '财务终端-023', ip: '10.16.8.23', status: '待处置', time: '2026-08-07 10:24:18' },
  { key: 2, name: '可疑脚本下载并执行', level: '高危', asset: '研发终端-117', ip: '10.18.4.117', status: '处置中', time: '2026-08-07 09:48:32' },
  { key: 3, name: '异常外联地址访问', level: '中危', asset: '办公终端-056', ip: '10.20.2.56', status: '已完成', time: '2026-08-06 18:35:04' },
];

const eventColumns: TableProps<EventRecord>['columns'] = [
  { title: '事件名称', dataIndex: 'name', width: 220, fixed: 'left', ellipsis: { showTitle: false }, render: (value) => <Tooltip title={value}>{value}</Tooltip> },
  { title: '风险等级', dataIndex: 'level', width: 140, filters: [{ text: '严重', value: '严重' }, { text: '高危', value: '高危' }, { text: '中危', value: '中危' }], render: (value: EventRecord['level']) => <Tag color={value === '严重' ? 'red' : value === '高危' ? 'orange' : 'blue'}>{value}</Tag> },
  { title: '资产名称', dataIndex: 'asset', width: 180, ellipsis: true },
  { title: 'IP 地址', dataIndex: 'ip', width: 140 },
  { title: '处置状态', dataIndex: 'status', width: 140, render: (value: EventRecord['status']) => <BadgeStatus value={value} /> },
  { title: '发现时间', dataIndex: 'time', width: 190, sorter: true },
  { title: '操作', key: 'action', width: 150, fixed: 'right', render: () => <Space size={COMPANY_SPACE[12]}><Button type="link" size="small">详情</Button><Button type="link" size="small">处置</Button></Space> },
];

function BadgeStatus({ value }: { value: EventRecord['status'] }) {
  const color = value === '已完成' ? 'success' : value === '处置中' ? 'processing' : 'warning';
  return <Tag color={color}>{value}</Tag>;
}

export function ListPagePatternPreview() {
  const { message } = AntdApp.useApp();
  const timerRef = useRef<number | undefined>(undefined);
  const [state, setState] = useState<ListState>('normal');
  const [keyword, setKeyword] = useState('');
  const [level, setLevel] = useState<string>();
  const [page, setPage] = useState(1);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const filteredData = useMemo(() => eventData.filter((item) => {
    const keywordMatched = !keyword || item.name.includes(keyword) || item.asset.includes(keyword) || item.ip.includes(keyword);
    return keywordMatched && (!level || item.level === level);
  }), [keyword, level]);

  const refresh = (successText: string) => {
    window.clearTimeout(timerRef.current);
    setState('loading');
    timerRef.current = window.setTimeout(() => {
      setState('normal');
      message.success(successText);
    }, 520);
  };

  const visibleData = state === 'normal' ? filteredData : [];
  const emptyText = state === 'error'
    ? <div className="pattern-table-state"><Alert type="error" showIcon title="数据加载失败" description="网络异常，请检查后重试" /><Button onClick={() => refresh('数据加载成功')}>重新加载</Button></div>
    : <Empty image="/assets/visual/empty-general.svg" description={state === 'empty' ? '暂无匹配数据，请调整筛选条件' : '暂无数据'} />;

  return <div className="pattern-page pattern-list-page">
    <div className="pattern-state-switch">
      <Text strong>页面状态</Text>
      <Segmented
        size="small"
        value={state}
        options={[
          { label: '正常', value: 'normal' },
          { label: '加载', value: 'loading' },
          { label: '空状态', value: 'empty' },
          { label: '异常', value: 'error' },
        ]}
        onChange={(value) => setState(value as ListState)}
      />
    </div>
    <CompanySearchPanel
      onSearch={() => { setPage(1); refresh('查询成功'); }}
      onReset={() => { setKeyword(''); setLevel(undefined); }}
    >
      <CompanySearchField label="事件名称"><Input value={keyword} placeholder="请输入事件名称、资产或 IP" allowClear onChange={(event) => setKeyword(event.target.value)} /></CompanySearchField>
      <CompanySearchField label="风险等级"><Select value={level} placeholder="请选择风险等级" allowClear options={[{ value: '严重', label: '严重' }, { value: '高危', label: '高危' }, { value: '中危', label: '中危' }]} onChange={setLevel} /></CompanySearchField>
    </CompanySearchPanel>
    <div className="pattern-table-toolbar">
      <Space><Button type="primary" icon={<CompanyIcon type={companyIcons.add} />}>新建</Button><Button icon={<CompanyIcon type={companyIcons.export} />}>导出</Button></Space>
      <Space>
        <Tooltip title="刷新列表"><Button aria-label="刷新列表" icon={<CompanyIcon type="icon-a-shuaxingengxinzhongzhi" />} onClick={() => refresh('刷新成功')} /></Tooltip>
        <Tooltip title="配置表格字段"><Button aria-label="配置表格字段" icon={<CompanyIcon type={companyIcons.setting} />} /></Tooltip>
      </Space>
    </div>
    <Table<EventRecord>
      className="pattern-table"
      rowSelection={{ fixed: true }}
      columns={eventColumns}
      dataSource={visibleData}
      pagination={false}
      loading={state === 'loading'}
      locale={{ emptyText }}
      scroll={{ x: 1160, y: 218 }}
      onChange={() => { setPage(1); refresh('表格数据已更新'); }}
    />
    {state === 'normal' && visibleData.length > 0 && <div className="pattern-pagination"><Text type="secondary">共计 63 条</Text><Pagination current={page} total={63} pageSize={20} showSizeChanger showQuickJumper pageSizeOptions={[10, 20, 50, 100]} onChange={(nextPage) => { setPage(nextPage); refresh('分页数据加载成功'); }} /></div>}
  </div>;
}

export function FormPagePatternPreview() {
  const { message, modal, notification } = AntdApp.useApp();
  const [form] = Form.useForm();
  const timerRef = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [canSave, setCanSave] = useState(true);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const closeDrawer = () => {
    setOpen(false);
    setDirty(false);
    setSubmitting(false);
    form.resetFields();
  };

  const requestClose = () => {
    if (!dirty) {
      closeDrawer();
      return;
    }
    modal.confirm({
      title: '确定离开当前页面么？',
      content: '离开后，数据将不会被保存，请谨慎操作',
      okText: '确定',
      cancelText: '取消',
      onOk: closeDrawer,
    });
  };

  const save = async () => {
    try {
      await form.validateFields();
      setSubmitting(true);
      timerRef.current = window.setTimeout(() => {
        setSubmitting(false);
        setDirty(false);
        message.success('策略保存成功');
        setOpen(false);
      }, 650);
    } catch {
      notification.error({ title: '策略保存失败', description: '请检查必填项和 IP 地址范围后重试', duration: 0 });
    }
  };

  return <div className="pattern-page pattern-form-launcher">
    <div><Title level={4}>终端防护策略</Title><Text type="secondary">6 个常规录入项使用 560px 单列抽屉。</Text></div>
    <Button type="primary" onClick={() => { setOpen(true); setDirty(false); setCanSave(true); }}>打开配置抽屉</Button>
    <Drawer
      title="新建终端防护策略"
      size={560}
      open={open}
      onClose={requestClose}
      footer={<div className="pattern-drawer-actions"><Button onClick={requestClose}>取消</Button><Button type="primary" loading={submitting} disabled={!canSave || submitting} onClick={save}>保存</Button></div>}
    >
      <Form
        form={form}
        layout="horizontal"
        colon={false}
        labelCol={{ flex: '112px' }}
        wrapperCol={{ flex: 1 }}
        initialValues={{ name: '办公终端基线策略', scope: 'office', protection: 'standard', action: 'block', notify: 'security', enabled: true }}
        onValuesChange={(_, values) => {
          setDirty(true);
          setCanSave(Boolean(values.name && values.scope && values.protection && values.action));
        }}
      >
        <Form.Item label="策略名称" name="name" rules={[{ required: true, message: '请输入策略名称，便于后续识别和管理' }]}><Input placeholder="请输入策略名称" maxLength={30} showCount /></Form.Item>
        <Form.Item label="生效范围" name="scope" rules={[{ required: true, message: '请选择策略需要覆盖的终端范围' }]}><Select placeholder="请选择生效范围" options={[{ value: 'office', label: '办公终端' }, { value: 'research', label: '研发终端' }, { value: 'server', label: '服务器终端' }]} /></Form.Item>
        <Form.Item label="防护强度" name="protection" rules={[{ required: true, message: '请选择防护强度' }]}><Select options={[{ value: 'standard', label: '标准防护' }, { value: 'strict', label: '严格防护' }]} /></Form.Item>
        <Form.Item label="命中动作" name="action" rules={[{ required: true, message: '请选择策略命中后的处置动作' }]}><Select options={[{ value: 'block', label: '自动阻断' }, { value: 'alert', label: '仅告警' }]} /></Form.Item>
        <Form.Item label="通知对象" name="notify"><Select options={[{ value: 'security', label: '安全管理员' }, { value: 'owner', label: '终端负责人' }]} /></Form.Item>
        <Form.Item label="策略编号"><Input value="POLICY-20260807-003" disabled /></Form.Item>
        <Alert type="warning" showIcon title="严格防护可能阻断未知程序，请确认生效范围后保存。" />
      </Form>
    </Drawer>
  </div>;
}

export function DetailPagePatternPreview() {
  const [open, setOpen] = useState(false);

  return <div className="pattern-page pattern-detail-launcher">
    <div><Title level={4}>安全事件详情</Title><Text type="secondary">摘要、信息分组和关联记录在详情抽屉内连续阅读。</Text></div>
    <Button type="primary" onClick={() => setOpen(true)}>打开详情抽屉</Button>
    <Drawer
      title="安全事件详情"
      size={880}
      open={open}
      onClose={() => setOpen(false)}
      extra={<Space><Button size="small">上一条</Button><Button size="small">下一条</Button></Space>}
    >
      <div className="pattern-detail-summary">
        <div><Space><Title level={4}>勒索软件横向传播行为</Title><Tag color="red">严重</Tag></Space><Text type="secondary">事件编号：EVT-20260807-1024</Text></div>
        <Space><Button>导出</Button><Button type="primary">立即处置</Button></Space>
      </div>
      <section className="pattern-detail-section">
        <Title level={5}>基础信息</Title>
        <Descriptions bordered size="small" column={2} items={[
          { key: '1', label: '受影响资产', children: '财务终端-023' },
          { key: '2', label: 'IP 地址', children: '10.16.8.23' },
          { key: '3', label: '发现时间', children: '2026-08-07 10:24:18' },
          { key: '4', label: '处置状态', children: <BadgeStatus value="待处置" /> },
        ]} />
      </section>
      <section className="pattern-detail-section">
        <Title level={5}>风险分析</Title>
        <Alert type="error" showIcon title="检测到 12 台终端存在横向传播路径" description="建议立即隔离源终端，并检查同网段终端的异常进程和文件写入行为。" />
      </section>
      <section className="pattern-detail-section">
        <Title level={5}>处置进度</Title>
        <Progress percent={42} status="active" />
      </section>
    </Drawer>
  </div>;
}

const metrics = [
  { key: 'event', title: '今日安全事件', value: 28, unit: '起', image: '/assets/visual/3d-security-event.png' },
  { key: 'asset', title: '风险资产', value: 136, unit: '台', image: '/assets/visual/3d-risk-asset.png' },
  { key: 'terminal', title: '在线终端', value: 3286, unit: '台', image: '/assets/visual/3d-terminal-discovery.png' },
  { key: 'qa', title: '智能研判任务', value: 17, unit: '项', image: '/assets/visual/3d-smart-qa.png' },
];

export function DashboardPatternPreview() {
  const { message } = AntdApp.useApp();
  const [range, setRange] = useState('今日');

  return <div className="pattern-page pattern-dashboard">
    <div className="pattern-dashboard-heading"><div><Title level={4}>安全运营概览</Title><Text type="secondary">核心指标作为业务入口，页面内容按栅格向下延展。</Text></div><Segmented value={range} options={['今日', '近 7 天', '近 30 天']} onChange={(value) => setRange(String(value))} /></div>
    <div className="pattern-metric-group">
      {metrics.map((item, index) => <div className="pattern-metric-wrap" key={item.key}>
        {index > 0 && <i className="pattern-metric-divider" />}
        <button type="button" className="pattern-metric" onClick={() => message.info(`打开${item.title}列表（${range}）`)}>
          <img src={item.image} alt="" />
          <span><Text>{item.title}</Text><strong>{item.value.toLocaleString()} <small>{item.unit}</small></strong></span>
        </button>
      </div>)}
    </div>
    <div className="pattern-dashboard-grid">
      <section><div className="pattern-panel-heading"><Text strong>风险处置趋势</Text><Tag color="green">持续下降</Tag></div><div className="pattern-mini-chart">{[46, 70, 58, 82, 64, 88, 54, 38].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></section>
      <section><div className="pattern-panel-heading"><Text strong>风险资产分布</Text><Text type="secondary">共 136 台</Text></div><div className="pattern-risk-bars"><span>严重<Progress percent={18} strokeColor="var(--company-danger)" /></span><span>高危<Progress percent={42} strokeColor="var(--company-warning)" /></span><span>中危<Progress percent={64} strokeColor="var(--company-info)" /></span></div></section>
    </div>
  </div>;
}
