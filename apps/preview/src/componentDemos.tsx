import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import dayjs from 'dayjs';
import {
  Alert,
  App as AntdApp,
  Breadcrumb,
  Button,
  Drawer,
  Dropdown,
  Empty,
  Menu,
  Pagination,
  Popconfirm,
  Progress,
  Segmented,
  Slider,
  Space,
  Steps,
  Tabs,
  Typography,
} from 'antd';
import { CompanyIcon, companyIcons } from '@company/ui/icons';
import { CompanyInput } from '@company/ui/input';
import { CompanyButton } from '@company/ui/button';
import { CompanyInputNumber } from '@company/ui/input-number';
import { CompanyDatePicker, CompanyDateRangePicker } from '@company/ui/date-picker';
import { CompanyCascader } from '@company/ui/cascader';
import { CompanyCheckbox, CompanyCheckboxGroup } from '@company/ui/checkbox';
import { CompanyRadio, CompanyRadioCard, CompanyRadioGroup, CompanyRadioPillGroup } from '@company/ui/radio';
import { CompanySelect } from '@company/ui/select';
import { CompanyTimePicker, CompanyTimeRangePicker } from '@company/ui/time-picker';
import { CompanyTransfer } from '@company/ui/transfer';
import { CompanyTreeSelect } from '@company/ui/tree-select';
import {
  CompanyImportProgress,
  CompanyPictureUpload,
  CompanyUpload,
  CompanyUploadDialog,
  CompanyUploadDragger,
} from '@company/ui/upload';
import type { CompanyPictureUploadItem, CompanyUploadFileItem } from '@company/ui/upload';
import { CompanySlider } from '@company/ui/slider';
import { CompanySwitch } from '@company/ui/switch';
import { CompanyCard } from '@company/ui/card';
import { CompanyPopover } from '@company/ui/popover';
import { CompanyStatistic } from '@company/ui/statistic';
import type { CompanyStatisticVariant } from '@company/ui/statistic';
import { CompanyTooltip } from '@company/ui/tooltip';
import type { CompanyTooltipPlacement } from '@company/ui/tooltip';
import { CompanyBadge } from '@company/ui/badge';
import { CompanyCollapse } from '@company/ui/collapse';
import { CompanyDescriptions } from '@company/ui/descriptions';
import { CompanyTable, CompanyTableActions, CompanyTableLink, CompanyTableProgress, CompanyTableTwoLine } from '@company/ui/table';
import { CompanyTag } from '@company/ui/tags';
import { CompanyTimeline } from '@company/ui/timeline';
import { CompanyTree } from '@company/ui/tree';
import {
  CompanyCategorizedForm,
  CompanyDynamicForm,
  CompanyFilterField,
  CompanyFilterForm,
  CompanyForm,
  CompanyFormItem,
  CompanyFormSection,
  CompanyFormTable,
  CompanySearchBar,
  useCompanyForm,
} from '@company/ui/form';

const { Text } = Typography;

export type AntdDemoKind =
  | 'input'
  | 'input-number'
  | 'date-picker'
  | 'cascader'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'time-picker'
  | 'transfer'
  | 'tree-select'
  | 'upload'
  | 'form'
  | 'slider'
  | 'switch'
  | 'dropdown'
  | 'pagination'
  | 'steps'
  | 'breadcrumb'
  | 'menu'
  | 'tabs'
  | 'card'
  | 'popover'
  | 'statistic'
  | 'tooltip'
  | 'badge'
  | 'collapse'
  | 'descriptions'
  | 'table'
  | 'timeline'
  | 'tree'
  | 'alert'
  | 'message'
  | 'notification'
  | 'modal'
  | 'popconfirm'
  | 'drawer'
  | 'progress'
  | 'empty';

type VariantOption = { label: string; value: string };

function VariantPreview({ options, value, onChange, children }: { options: VariantOption[]; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return <div className="catalog-variant-preview">
    <div className="catalog-variant-toolbar">
      <Text type="secondary">变体 / 状态</Text>
      <Segmented size="small" value={value} options={options} onChange={(nextValue) => onChange(String(nextValue))} />
    </div>
    <div className="catalog-variant-surface">{children}</div>
  </div>;
}

const modeDefaults: Record<AntdDemoKind, string> = {
  input: 'default',
  'input-number': 'default',
  'date-picker': 'single',
  cascader: 'single',
  checkbox: 'normal',
  radio: 'normal',
  select: 'single',
  'time-picker': 'single',
  transfer: 'normal',
  'tree-select': 'single',
  upload: 'file',
  form: 'align-right',
  slider: 'single',
  switch: 'large-on',
  dropdown: 'click',
  pagination: 'full',
  steps: 'process',
  breadcrumb: 'slash',
  menu: 'inline',
  tabs: 'line',
  card: 'bordered',
  popover: 'top',
  statistic: 'trend-up',
  tooltip: 'top',
  badge: 'count',
  collapse: 'left-default',
  descriptions: 'fixed',
  table: 'large',
  timeline: 'left',
  tree: 'basic',
  alert: 'info',
  message: 'success',
  notification: 'info',
  modal: 'info',
  popconfirm: 'top',
  drawer: 'standard',
  progress: 'line',
  empty: 'default',
};

const selectOptions = [
  { value: 'design', label: '设计系统' },
  { value: 'code', label: '工程组件' },
  { value: 'business', label: '业务模板' },
];

const treeData = [
  {
    title: '树形控件父级默认',
    value: 'root',
    key: 'root',
    children: [
      {
        title: '树形控件父级默认',
        value: 'branch-closed',
        key: 'branch-closed',
        children: [{ title: '树形控件子级默认', value: 'closed-child', key: 'closed-child' }],
      },
      {
        title: '树形控件父级默认',
        value: 'branch-open',
        key: 'branch-open',
        children: [
          { title: '树形控件子级悬浮', value: 'hover-node', key: 'hover-node' },
          { title: '树形控件子级选中', value: 'selected-node', key: 'selected-node' },
          { title: '树形控件子级默认', value: 'default-node', key: 'default-node' },
        ],
      },
      { title: '树形控件子级默认', value: 'child-a', key: 'child-a' },
    ],
  },
  { title: '树形控件父级禁用', value: 'disabled-root', key: 'disabled-root', disabled: true },
];
const tableData = [
  { key: '1', index: 1, name: '勒索软件横向传播行为', threat: '高危', status: '处理中', progress: 78, amount: 1256, time: '2026-08-12 10:24', asset: '财务终端-023', ip: '10.16.8.23' },
  { key: '2', index: 2, name: '可疑脚本下载并执行', threat: '中危', status: '已完成', progress: 100, amount: 843, time: '2026-08-12 09:48', asset: '研发终端-117', ip: '10.18.4.117' },
  { key: '3', index: 3, name: '异常外联地址访问', threat: '低危', status: '待处置', progress: 36, amount: 286, time: '2026-08-11 18:32', asset: '办公终端-056', ip: '10.20.2.56' },
];

const uploadProcessFiles: CompanyUploadFileItem[] = [
  { id: 'upload-done', name: '文件1234567890.jpg', status: 'done' },
  { id: 'uploading', name: '终端安全策略.xlsx', status: 'uploading', percent: 65 },
  { id: 'paused', name: '终端基线配置.xlsx', status: 'paused', percent: 48 },
  { id: 'upload-error', name: '202310131601480300.xls', status: 'error', percent: 35, errorText: '上传失败！失败原因xxx' },
];

const pictureUploadItems: CompanyPictureUploadItem[] = [
  { id: 'picture-done', name: '终端状态图', src: '/assets/visual/3d-terminal-discovery.png', status: 'done' },
  { id: 'picture-uploading', name: '风险资产图', src: '/assets/visual/3d-risk-asset.png', status: 'uploading', percent: 45 },
  { id: 'picture-error', name: '安全事件图', src: '/assets/visual/3d-security-event.png', status: 'error' },
];

export function AntdVariantPreview({ kind }: { kind: AntdDemoKind }) {
  const { message, notification, modal } = AntdApp.useApp();
  const [mode, setMode] = useState(modeDefaults[kind]);
  const [checked, setChecked] = useState(true);
  const [checkboxValues, setCheckboxValues] = useState<string[]>(['terminal']);
  const [selected, setSelected] = useState<string | string[]>('design');
  const [targetKeys, setTargetKeys] = useState<string[]>(['2']);
  const [treeValue, setTreeValue] = useState<unknown>('selected-node');
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(1);
  const [menuKey, setMenuKey] = useState('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [percent, setPercent] = useState(68);
  const [badgeCount, setBadgeCount] = useState(6);
  const [form] = useCompanyForm();
  const [formTableSelection, setFormTableSelection] = useState<string[]>([]);

  useEffect(() => {
    setMode(modeDefaults[kind]);
  }, [kind]);

  if (kind === 'input') {
    const options = [{ label: '默认', value: 'default' }, { label: '悬停', value: 'hover' }, { label: '激活', value: 'focused' }, { label: '输入完成', value: 'completed' }, { label: '报错', value: 'error' }, { label: '禁用', value: 'disabled' }];
    const visualState = mode as 'default' | 'hover' | 'focused' | 'completed' | 'error' | 'disabled';
    const completedProps = mode === 'completed' ? { value: '输入完成' } : {};
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-input-demo-grid">
        <CompanyInput visualState={visualState} placeholder="请输入..." {...completedProps} />
        <CompanyInput visualState={visualState} prefixIcon={<CompanyIcon type={companyIcons.search} />} placeholder="请输入关键词" {...completedProps} />
        <CompanyInput visualState={visualState} trailingLabel="GB" placeholder="请输入容量" {...completedProps} />
        <CompanyInput visualState={visualState} leadingLabel="https://" suffixIcon={<CompanyIcon type={companyIcons.down} />} placeholder="请输入地址" {...completedProps} />
      </div>
    </VariantPreview>;
  }

  if (kind === 'input-number') {
    const options = [{ label: '默认', value: 'default' }, { label: '悬停', value: 'hover' }, { label: '键入', value: 'focused' }, { label: '输入中', value: 'typing' }, { label: '增减', value: 'stepper' }, { label: '输入完成', value: 'completed' }, { label: '报错', value: 'error' }, { label: '禁用', value: 'disabled' }];
    const visualState = mode as 'default' | 'hover' | 'focused' | 'typing' | 'stepper' | 'completed' | 'error' | 'disabled';
    const stateValue = mode === 'completed' ? 100 : mode === 'typing' || mode === 'stepper' ? 2 : undefined;
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-input-number-demo">
        <CompanyInputNumber size="compact" visualState={visualState} min={0} max={100} value={stateValue} placeholder="0-100" />
        <CompanyInputNumber size="regular" visualState={visualState} min={0} max={100} value={stateValue} placeholder="0-100" />
        <CompanyInputNumber size="loose" visualState={visualState} min={0} max={100} value={stateValue} placeholder="0-100" />
      </div>
    </VariantPreview>;
  }

  if (kind === 'date-picker') {
    const options = [{ label: '单日期', value: 'single' }, { label: '日期范围', value: 'range' }, { label: '悬停', value: 'hover' }, { label: '聚焦', value: 'focused' }, { label: '禁用', value: 'disabled' }];
    const visualState = mode === 'hover' || mode === 'focused' || mode === 'disabled' ? mode : 'default';
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-date-picker-demo">
        {mode === 'range'
          ? <CompanyDateRangePicker visualState={visualState} />
          : <CompanyDatePicker visualState={visualState} />}
      </div>
    </VariantPreview>;
  }

  if (kind === 'cascader') {
    const options = [{ label: '单选三级', value: 'single' }, { label: '多选三级', value: 'multiple' }, { label: '悬停', value: 'hover' }, { label: '聚焦', value: 'focused' }, { label: '报错', value: 'error' }, { label: '禁用', value: 'disabled' }];
    const visualState = mode === 'hover' || mode === 'focused' || mode === 'error' || mode === 'disabled' ? mode : 'default';
    const cascaderOptions = [{
      value: 'security',
      label: '安全中心',
      children: [
        {
          value: 'terminal',
          label: '终端组',
          children: [
            { value: 'windows', label: 'Windows终端' },
            { value: 'linux', label: 'Linux终端' },
          ],
        },
        {
          value: 'server',
          label: '服务器组',
          children: [
            { value: 'production', label: '生产服务器' },
            { value: 'test', label: '测试服务器' },
          ],
        },
      ],
    }];
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <CompanyCascader
        placeholder="请选择组织"
        options={cascaderOptions}
        multiple={mode === 'multiple'}
        visualState={visualState}
      />
    </VariantPreview>;
  }

  if (kind === 'checkbox') {
    const options = [{ label: '全部状态', value: 'normal' }, { label: '可交互组', value: 'interactive' }, { label: '失效状态', value: 'disabled' }];
    const values = ['terminal', 'server', 'network'];
    const allChecked = checkboxValues.length === values.length;
    const partiallyChecked = checkboxValues.length > 0 && !allChecked;
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      {mode === 'normal' && <div className="catalog-checkbox-state-grid">
        <CompanyCheckbox>未选中项</CompanyCheckbox>
        <CompanyCheckbox visualState="hover">hover样式</CompanyCheckbox>
        <CompanyCheckbox checked onChange={() => undefined}>已选中项</CompanyCheckbox>
        <CompanyCheckbox indeterminate>部分选中</CompanyCheckbox>
        <CompanyCheckbox disabled>未选失效项</CompanyCheckbox>
        <CompanyCheckbox checked disabled>已选失效项</CompanyCheckbox>
        <CompanyCheckbox indeterminate disabled>部分失效项</CompanyCheckbox>
      </div>}
      {mode === 'interactive' && <div className="catalog-checkbox-group-demo">
        <CompanyCheckbox
          checked={allChecked}
          indeterminate={partiallyChecked}
          onChange={(event) => setCheckboxValues(event.target.checked ? values : [])}
        >全选</CompanyCheckbox>
        <CompanyCheckboxGroup value={checkboxValues} onChange={(nextValues) => setCheckboxValues(nextValues as string[])}>
          <CompanyCheckbox value="terminal">终端</CompanyCheckbox>
          <CompanyCheckbox value="server">服务器</CompanyCheckbox>
          <CompanyCheckbox value="network">网络设备</CompanyCheckbox>
        </CompanyCheckboxGroup>
      </div>}
      {mode === 'disabled' && <div className="catalog-checkbox-state-grid">
        <CompanyCheckbox disabled>未选失效项</CompanyCheckbox>
        <CompanyCheckbox checked disabled>已选失效项</CompanyCheckbox>
        <CompanyCheckbox indeterminate disabled>部分失效项</CompanyCheckbox>
      </div>}
    </VariantPreview>;
  }

  if (kind === 'radio') {
    const options = [{ label: '基础状态', value: 'normal' }, { label: '可交互组', value: 'interactive' }, { label: '胶囊单选', value: 'pill' }, { label: '卡片单选', value: 'card' }, { label: '禁用', value: 'disabled' }];
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      {mode === 'normal' && <div className="catalog-radio-state-grid">
        <CompanyRadio>可选</CompanyRadio>
        <CompanyRadio checked onChange={() => undefined}>已选</CompanyRadio>
        <CompanyRadio visualState="hover">悬浮</CompanyRadio>
        <CompanyRadio disabled>未选失效项</CompanyRadio>
        <CompanyRadio checked disabled>已选失效项</CompanyRadio>
      </div>}
      {mode === 'interactive' && <CompanyRadioGroup defaultValue="enabled">
        <CompanyRadio value="enabled">启用</CompanyRadio>
        <CompanyRadio value="disabled">停用</CompanyRadio>
        <CompanyRadio value="inherit">继承策略</CompanyRadio>
      </CompanyRadioGroup>}
      {mode === 'pill' && <CompanyRadioPillGroup
        defaultValue="one"
        options={[
          { label: '选项一', value: 'one' },
          { label: '选项二', value: 'two' },
          { label: '选项三', value: 'three' },
        ]}
      />}
      {mode === 'card' && <div className="catalog-radio-card-list">
        <CompanyRadioCard
          checked
          title="终端安全策略"
          description="面向受管终端启用统一基线、实时防护与异常处置策略。"
          onChange={() => undefined}
        />
        <CompanyRadioCard
          visualState="hover"
          title="自定义防护策略"
          description="根据业务分组和资产类型配置差异化安全能力。"
        />
      </div>}
      {mode === 'disabled' && <div className="catalog-radio-state-grid">
        <CompanyRadio disabled>未选失效项</CompanyRadio>
        <CompanyRadio checked disabled>已选失效项</CompanyRadio>
        <CompanyRadioCard disabled title="禁用策略" description="当前策略不可选择。" />
      </div>}
    </VariantPreview>;
  }

  if (kind === 'select') {
    const options = [{ label: '尺寸', value: 'sizes' }, { label: '基础状态', value: 'single' }, { label: '展开下拉', value: 'open' }, { label: '加载', value: 'loading' }, { label: '多选', value: 'multiple' }, { label: '报错', value: 'error' }, { label: '禁用', value: 'disabled' }];
    const multipleOptions = [
      { value: 'tag-1', label: '标签 1' },
      { value: 'tag-2', label: '标签 2' },
      { value: 'tag-3', label: '标签 3' },
      { value: 'tag-4', label: '标签 4' },
      { value: 'tag-5', label: '标签 5' },
    ];
    return <VariantPreview options={options} value={mode} onChange={(nextMode) => {
      setMode(nextMode);
      setSelected(nextMode === 'multiple' ? ['tag-1', 'tag-2', 'tag-3', 'tag-4', 'tag-5'] : nextMode === 'single' ? 'design' : '');
    }}>
      <div className="catalog-select-demo">
        {mode === 'sizes' && <>
          <CompanySelect companySize="compact" placeholder="请选择" options={selectOptions} />
          <CompanySelect companySize="regular" placeholder="请选择" options={selectOptions} />
          <CompanySelect companySize="loose" placeholder="请选择" options={selectOptions} />
        </>}
        {mode === 'single' && <>
          <CompanySelect value={typeof selected === 'string' ? selected : 'design'} onChange={setSelected} options={selectOptions} />
          <CompanySelect visualState="hover" placeholder="悬浮状态" options={selectOptions} />
          <CompanySelect visualState="focused" placeholder="激活状态" options={selectOptions} />
        </>}
        {mode === 'open' && <CompanySelect
          open
          visualState="focused"
          placeholder="请选择"
          options={[
            { value: 'hover', label: '下拉菜单选项-悬浮' },
            { value: 'default-1', label: '下拉菜单选项-默认' },
            { value: 'default-2', label: '下拉菜单选项-默认' },
            { value: 'default-3', label: '下拉菜单选项-默认' },
            { value: 'disabled', label: '下拉菜单选项-失效', disabled: true },
          ]}
        />}
        {mode === 'loading' && <CompanySelect visualState="loading" value="code" options={selectOptions} />}
        {mode === 'multiple' && <CompanySelect<string[]>
          mode="multiple"
          value={Array.isArray(selected) ? selected : ['design']}
          onChange={setSelected}
          options={multipleOptions}
          style={{ width: 260 }}
        />}
        {mode === 'error' && <CompanySelect visualState="error" placeholder="请选择" options={selectOptions} />}
        {mode === 'disabled' && <CompanySelect visualState="disabled" placeholder="禁止选择" options={selectOptions} />}
      </div>
    </VariantPreview>;
  }

  if (kind === 'time-picker') {
    const options = [{ label: '尺寸', value: 'sizes' }, { label: '基础状态', value: 'single' }, { label: '时间区间', value: 'range' }, { label: '展开面板', value: 'open' }, { label: '禁用', value: 'disabled' }];
    const completedTime = dayjs().hour(0).minute(0).second(3);
    const completedRange: [ReturnType<typeof dayjs>, ReturnType<typeof dayjs>] = [
      dayjs().hour(0).minute(0).second(1),
      dayjs().hour(0).minute(0).second(2),
    ];
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-time-picker-demo">
        {mode === 'sizes' && <>
          <CompanyTimePicker companySize="compact" />
          <CompanyTimePicker companySize="regular" />
          <CompanyTimePicker companySize="loose" />
        </>}
        {mode === 'single' && <>
          <CompanyTimePicker />
          <CompanyTimePicker visualState="hover" />
          <CompanyTimePicker visualState="focused" />
          <CompanyTimePicker visualState="clear" value={completedTime} />
        </>}
        {mode === 'range' && <>
          <CompanyTimeRangePicker />
          <CompanyTimeRangePicker visualState="hover" value={completedRange} />
          <CompanyTimeRangePicker visualState="focused" />
        </>}
        {mode === 'open' && <CompanyTimePicker open defaultValue={completedTime} />}
        {mode === 'disabled' && <>
          <CompanyTimePicker value={completedTime} disabled />
          <CompanyTimeRangePicker value={completedRange} disabled />
        </>}
      </div>
    </VariantPreview>;
  }

  if (kind === 'transfer') {
    const options = [{ label: '常规', value: 'normal' }, { label: '带搜索', value: 'search' }, { label: '空状态', value: 'empty' }, { label: '禁用', value: 'disabled' }];
    const transferItems = Array.from({ length: 20 }, (_, index) => ({ key: String(index + 1), title: `选项 ${index + 1}` }));
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <CompanyTransfer
        dataSource={mode === 'empty' ? [] : transferItems}
        targetKeys={mode === 'empty' ? [] : targetKeys}
        onChange={setTargetKeys}
        showSearch={mode === 'search'}
        disabled={mode === 'disabled'}
      />
    </VariantPreview>;
  }

  if (kind === 'tree-select') {
    const options = [{ label: '基本样式', value: 'single' }, { label: '多选框样式', value: 'multiple' }, { label: '禁用', value: 'disabled' }];
    const multiple = mode === 'multiple';
    const resolvedValue = multiple
      ? (Array.isArray(treeValue) ? treeValue : [{ value: 'selected-node', label: '树形控件子级选中' }])
      : (typeof treeValue === 'string' ? treeValue : 'selected-node');
    return <VariantPreview options={options} value={mode} onChange={(nextMode) => {
      setMode(nextMode);
      setTreeValue(nextMode === 'multiple'
        ? [{ value: 'selected-node', label: '树形控件子级选中' }]
        : 'selected-node');
    }}>
      <div className="catalog-tree-select-demo">
        <CompanyTreeSelect
          value={resolvedValue}
          onChange={(value) => setTreeValue(value)}
          placeholder="请选择节点"
          treeData={treeData}
          treeDefaultExpandedKeys={['root', 'branch']}
          multiple={multiple}
          open={mode !== 'disabled'}
          disabled={mode === 'disabled'}
          getPopupContainer={(triggerNode) => triggerNode.parentElement ?? document.body}
        />
      </div>
    </VariantPreview>;
  }

  if (kind === 'upload') {
    const options = [
      { label: '文件过程', value: 'file' },
      { label: '拖拽默认', value: 'drag' },
      { label: '拖拽悬停', value: 'drag-hover' },
      { label: '拖拽上传中', value: 'drag-uploading' },
      { label: '图片状态', value: 'picture' },
      { label: '对话框默认', value: 'dialog' },
      { label: '格式错误', value: 'dialog-format' },
      { label: '大小错误', value: 'dialog-size' },
      { label: '对话框上传中', value: 'dialog-uploading' },
      { label: '上传成功悬停', value: 'dialog-success-hover' },
      { label: '导入失败', value: 'dialog-failure' },
      { label: '导入进度', value: 'import' },
      { label: '禁用', value: 'disabled' },
    ];
    let preview: ReactNode;

    if (mode === 'file') {
      preview = <CompanyUpload defaultFiles={uploadProcessFiles} />;
    } else if (mode === 'drag' || mode === 'drag-hover' || mode === 'drag-uploading') {
      preview = (
        <CompanyUploadDragger
          visualState={mode === 'drag-hover' ? 'hover' : mode === 'drag-uploading' ? 'uploading' : 'default'}
          defaultFiles={mode === 'drag-uploading' ? uploadProcessFiles.filter((file) => file.status !== 'paused') : []}
        />
      );
    } else if (mode === 'picture') {
      preview = (
        <CompanyPictureUpload
          defaultValue={pictureUploadItems}
          forceHoverId="picture-done"
        />
      );
    } else if (mode === 'import') {
      preview = (
        <CompanyImportProgress
          onCancel={() => message.info('已取消导入')}
          onClose={() => message.info('已关闭导入进度')}
        />
      );
    } else if (mode === 'disabled') {
      preview = <CompanyUploadDragger visualState="disabled" disabled />;
    } else {
      const dialogState = mode === 'dialog-format'
        ? 'format-error'
        : mode === 'dialog-size'
          ? 'size-error'
          : mode === 'dialog-uploading'
            ? 'uploading'
            : mode === 'dialog-success-hover'
              ? 'success-hover'
              : mode === 'dialog-failure'
                ? 'failure'
                : 'default';
      preview = (
        <CompanyUploadDialog
          state={dialogState}
          onCancel={() => message.info('已取消上传')}
          onConfirm={() => message.success('上传配置已确认')}
          onDownloadTemplate={() => message.success('已下载导入模版')}
        />
      );
    }

    return (
      <VariantPreview options={options} value={mode} onChange={setMode}>
        <div className="catalog-upload-demo">{preview}</div>
      </VariantPreview>
    );
  }

  if (kind === 'form') {
    const options = [
      { label: '右对齐', value: 'align-right' },
      { label: '左对齐', value: 'align-left' },
      { label: '顶对齐', value: 'align-top' },
      { label: '筛选无标题', value: 'filter-inline' },
      { label: '筛选有标题', value: 'filter-labeled' },
      { label: '筛选区', value: 'filter-section' },
      { label: '搜索条', value: 'search-bar' },
      { label: '分类表单', value: 'categorized' },
      { label: '动态表格', value: 'dynamic-table' },
      { label: '动态标签', value: 'dynamic-tags' },
      { label: '表格有数据', value: 'table-data' },
      { label: '表格空状态', value: 'table-empty' },
      { label: '校验错误', value: 'error' },
      { label: '禁用', value: 'disabled' },
    ];
    const formTableRows = Array.from({ length: 5 }, (_, index) => ({ id: String(index + 1), name: '单元格', value: '单元格' }));
    const renderAlignedForm = (alignment: 'left' | 'right' | 'top', disabled = false) => (
      <CompanyForm
        form={form}
        alignment={alignment}
        disabled={disabled}
        initialValues={{ strategy: '', owner: '', scope: '', note: '' }}
        onFinish={() => message.success('表单校验通过')}
      >
        <CompanyFormItem label="标题需不超过十个字符" name="strategy" required helpText="填写策略名称">
          <CompanyInput placeholder="请输入内容" disabled={disabled} />
        </CompanyFormItem>
        <CompanyFormItem label="标题需不超过十个字符" name="owner">
          <CompanyInput placeholder="请输入内容" disabled={disabled} />
        </CompanyFormItem>
        <CompanyFormItem label="标题需不超过十个字符" name="scope" required>
          <CompanyInput placeholder="请输入内容" disabled={disabled} />
        </CompanyFormItem>
        <CompanyFormItem label="标题需不超过十个字符" name="note" helpText="补充说明">
          <CompanyInput placeholder="请输入内容" disabled={disabled} />
        </CompanyFormItem>
        <div className="catalog-form-actions">
          <CompanyButton variant="primary" htmlType="submit" disabled={disabled}>提交校验</CompanyButton>
        </div>
      </CompanyForm>
    );

    let preview: ReactNode;
    if (mode === 'filter-inline' || mode === 'filter-labeled' || mode === 'filter-section') {
      const variant = mode === 'filter-inline' ? 'inline' : mode === 'filter-labeled' ? 'labeled' : 'section';
      preview = (
        <CompanyFilterForm variant={variant} onSearch={() => message.success('已执行查询')} onReset={() => message.info('已重置条件')}>
          <CompanyFilterField label={variant === 'inline' ? undefined : '字段名称1'}><CompanySelect options={selectOptions} placeholder="请选择" /></CompanyFilterField>
          <CompanyFilterField label={variant === 'inline' ? undefined : '字段名称2'}><CompanyInput placeholder="请输入内容" /></CompanyFilterField>
          <CompanyFilterField label={variant === 'inline' ? undefined : '字段名称3'}><CompanyInput placeholder="请输入内容" /></CompanyFilterField>
          {variant === 'section' ? <>
            <CompanyFilterField label="字段名称4"><CompanyInput placeholder="请输入内容" /></CompanyFilterField>
            <CompanyFilterField label="字段名称5"><CompanySelect options={selectOptions} placeholder="请选择" /></CompanyFilterField>
          </> : null}
        </CompanyFilterForm>
      );
    } else if (mode === 'search-bar') {
      preview = <CompanySearchBar onSearch={(value, scope) => message.success(`搜索 ${scope}: ${value || '全部内容'}`)} />;
    } else if (mode === 'categorized') {
      preview = (
        <CompanyCategorizedForm alignment="left" onFinish={() => message.success('分类表单已保存')}>
          <CompanyFormSection title="一级分类标题" description="按业务分类组织复杂配置项。">
            <CompanyFormItem label="策略名称" name="category-name" required><CompanyInput placeholder="请输入策略名称" /></CompanyFormItem>
            <CompanyFormItem label="策略类型" name="category-type"><CompanySelect options={selectOptions} placeholder="请选择" /></CompanyFormItem>
            <CompanyFormSection title="二级分类标题" level={2}>
              <CompanyFormItem label="生效范围" name="category-scope" required><CompanyCheckbox checked={checked} onChange={(event) => setChecked(event.target.checked)}>启用全网范围</CompanyCheckbox></CompanyFormItem>
              <CompanyFormItem label="补充说明" name="category-note"><CompanyInput disabled={!checked} placeholder="勾选后可配置" /></CompanyFormItem>
            </CompanyFormSection>
          </CompanyFormSection>
        </CompanyCategorizedForm>
      );
    } else if (mode === 'dynamic-table' || mode === 'dynamic-tags') {
      preview = <CompanyDynamicForm variant={mode === 'dynamic-table' ? 'table' : 'tags'} />;
    } else if (mode === 'table-data' || mode === 'table-empty') {
      preview = (
        <CompanyFormTable
          rows={mode === 'table-data' ? formTableRows : []}
          selectedRowIds={formTableSelection}
          onSelectionChange={setFormTableSelection}
          onEdit={() => message.info('已进入编辑状态')}
        />
      );
    } else {
      const alignment = mode === 'align-left' ? 'left' : mode === 'align-top' ? 'top' : 'right';
      preview = renderAlignedForm(alignment, mode === 'disabled');
    }

    return (
      <VariantPreview
        options={options}
        value={mode}
        onChange={(nextMode) => {
          setMode(nextMode);
          form.resetFields();
          if (nextMode === 'error') {
            window.setTimeout(() => form.setFields([{ name: 'strategy', errors: ['请输入策略名称'] }]), 0);
          }
        }}
      >
        <div className={`catalog-form-demo catalog-form-demo--${mode}`}>{preview}</div>
      </VariantPreview>
    );
  }

  if (kind === 'slider') {
    const options = [
      { label: '单值', value: 'single' },
      { label: '范围', value: 'range' },
      { label: '单值刻度', value: 'single-marks' },
      { label: '范围刻度', value: 'range-marks' },
      { label: '自定义数字', value: 'single-input' },
      { label: '自定义范围', value: 'range-input' },
      { label: '悬停', value: 'hover' },
      { label: '禁用', value: 'disabled' },
    ];
    const markValues = [10, 20, 30, 40, 50];
    const commonProps = { min: 10, max: 50, markValues, markFormatter: (value: number) => `${value}岁` };
    return (
      <VariantPreview options={options} value={mode} onChange={setMode}>
        <div className="catalog-slider-demo">
          {mode === 'single' && <CompanySlider defaultValue={32} />}
          {mode === 'range' && <CompanySlider range defaultValue={[16, 32]} />}
          {mode === 'single-marks' && <CompanySlider {...commonProps} showMarks defaultValue={30} />}
          {mode === 'range-marks' && <CompanySlider {...commonProps} range showMarks defaultValue={[20, 30]} />}
          {mode === 'single-input' && <CompanySlider showInput defaultValue={16} />}
          {mode === 'range-input' && <CompanySlider range showInput defaultValue={[16, 32]} />}
          {mode === 'hover' && <CompanySlider visualState="hover" defaultValue={32} />}
          {mode === 'disabled' && <CompanySlider visualState="disabled" defaultValue={32} />}
        </div>
      </VariantPreview>
    );
  }

  if (kind === 'switch') {
    const options = [
      { label: '大号开', value: 'large-on' },
      { label: '大号关', value: 'large-off' },
      { label: '小号开', value: 'small-on' },
      { label: '小号关', value: 'small-off' },
      { label: '大号开失效', value: 'large-on-disabled' },
      { label: '大号关失效', value: 'large-off-disabled' },
      { label: '小号开失效', value: 'small-on-disabled' },
      { label: '小号关失效', value: 'small-off-disabled' },
    ];
    const switchSize = mode.startsWith('small') ? 'small' : 'large';
    const switchDisabled = mode.endsWith('disabled');
    return <VariantPreview
      options={options}
      value={mode}
      onChange={(nextMode) => {
        setMode(nextMode);
        setChecked(nextMode.includes('-on'));
      }}
    >
      <div className="catalog-switch-demo">
        <CompanySwitch
          aria-label="防护策略开关"
          size={switchSize}
          checked={checked}
          disabled={switchDisabled}
          onChange={setChecked}
        />
        <Text>{checked ? '已启用防护策略' : '已停用防护策略'}</Text>
      </div>
    </VariantPreview>;
  }

  if (kind === 'dropdown') {
    const options = [{ label: '点击触发', value: 'click' }, { label: '悬停触发', value: 'hover' }, { label: '禁用', value: 'disabled' }];
    return <VariantPreview options={options} value={mode} onChange={setMode}><Dropdown trigger={mode === 'hover' ? ['hover'] : ['click']} disabled={mode === 'disabled'} menu={{ items: [{ key: 'edit', label: '编辑' }, { key: 'copy', label: '复制' }, { type: 'divider' }, { key: 'delete', label: '删除', danger: true }] }}><Button disabled={mode === 'disabled'}>更多 <CompanyIcon type={companyIcons.expand} /></Button></Dropdown></VariantPreview>;
  }

  if (kind === 'pagination') {
    const options = [{ label: '完整', value: 'full' }, { label: '简洁', value: 'simple' }, { label: '禁用', value: 'disabled' }];
    return <VariantPreview options={options} value={mode} onChange={setMode}><Pagination current={page} total={86} simple={mode === 'simple'} disabled={mode === 'disabled'} showSizeChanger={mode === 'full'} showQuickJumper={mode === 'full'} onChange={setPage} /></VariantPreview>;
  }

  if (kind === 'steps') {
    const options = [{ label: '进行中', value: 'process' }, { label: '错误', value: 'error' }, { label: '完成', value: 'finish' }];
    const current = mode === 'finish' ? 3 : step;
    return <VariantPreview options={options} value={mode} onChange={setMode}><div style={{ width: '100%' }}><Steps current={current} status={mode === 'error' ? 'error' : 'process'} items={[{ title: '配置' }, { title: '确认' }, { title: '执行' }, { title: '完成' }]} /><Space style={{ marginTop: 'var(--company-space-20px)' }}><Button disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>上一步</Button><Button type="primary" disabled={step === 3} onClick={() => setStep((value) => Math.min(3, value + 1))}>下一步</Button></Space></div></VariantPreview>;
  }

  if (kind === 'breadcrumb') {
    const options = [{ label: '斜线分隔', value: 'slash' }, { label: '箭头分隔', value: 'arrow' }, { label: '可点击', value: 'link' }];
    const items = mode === 'link' ? [{ title: <a onClick={() => message.info('返回组件资源')}>组件资源</a> }, { title: <a onClick={() => message.info('返回基础组件')}>基础组件</a> }, { title: '面包屑' }] : [{ title: '组件资源' }, { title: '基础组件' }, { title: '面包屑' }];
    return <VariantPreview options={options} value={mode} onChange={setMode}><Breadcrumb separator={mode === 'arrow' ? '>' : '/'} items={items} /></VariantPreview>;
  }

  if (kind === 'menu') {
    const options = [{ label: '纵向', value: 'inline' }, { label: '横向', value: 'horizontal' }, { label: '含禁用项', value: 'disabled' }];
    const items = [{ key: 'overview', icon: <CompanyIcon type={companyIcons.visualization} />, label: '场景总览' }, { key: 'setting', icon: <CompanyIcon type={companyIcons.setting} />, label: '系统设置', disabled: mode === 'disabled' }];
    return <VariantPreview options={options} value={mode} onChange={setMode}><Menu style={{ width: mode === 'horizontal' ? '100%' : 260 }} mode={mode === 'horizontal' ? 'horizontal' : 'inline'} selectedKeys={[menuKey]} onClick={({ key }) => setMenuKey(key)} items={items} /></VariantPreview>;
  }

  if (kind === 'tabs') {
    const options = [{ label: '线型', value: 'line' }, { label: '卡片型', value: 'card' }, { label: '含禁用项', value: 'disabled' }];
    const items = [{ key: '1', label: '基础信息', children: '基础信息内容' }, { key: '2', label: '操作记录', children: '操作记录内容', disabled: mode === 'disabled' }];
    return <VariantPreview options={options} value={mode} onChange={setMode}><Tabs style={{ width: '100%' }} type={mode === 'card' ? 'card' : 'line'} items={items} /></VariantPreview>;
  }

  if (kind === 'card') {
    const options = [{ label: '带边框', value: 'bordered' }, { label: '无边框', value: 'borderless' }];
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-card-demo">
        <CompanyCard title="卡片标题" bordered={mode === 'bordered'}>
          卡片内容文字卡片内容文字卡片内容文字卡片内容文字卡片内容文字卡片内容文字卡片内容文字卡片内容文字卡片内容文字卡片内容文字卡片内容文字卡片内容文字
        </CompanyCard>
      </div>
    </VariantPreview>;
  }

  if (kind === 'popover') {
    const options = [
      { label: '顶部', value: 'top' },
      { label: '底部', value: 'bottom' },
      { label: '左侧', value: 'left' },
      { label: '右侧', value: 'right' },
      { label: '带链接', value: 'linked' },
      { label: '悬停触发', value: 'hover' },
    ];
    const placement = ['top', 'bottom', 'left', 'right'].includes(mode) ? mode : 'top';
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-popover-demo">
        <CompanyPopover
          key={mode}
          title="这是一个标题"
          content="点击/鼠标移入，弹出气泡式的卡片浮层。点击/鼠标移入"
          placement={placement as 'top' | 'bottom' | 'left' | 'right'}
          trigger={mode === 'hover' ? 'hover' : 'click'}
          withLink={mode === 'linked'}
          defaultOpen
          onLinkClick={() => message.info('已触发气泡卡片链接')}
        >
          <CompanyButton variant="secondary">查看说明</CompanyButton>
        </CompanyPopover>
      </div>
    </VariantPreview>;
  }

  if (kind === 'statistic') {
    const options = [
      { label: '上升', value: 'trend-up' },
      { label: '下降', value: 'trend-down' },
      { label: '居中', value: 'center' },
      { label: '居左', value: 'left' },
      { label: '比率', value: 'rate' },
      { label: '工单', value: 'ticket' },
      { label: '工单选中', value: 'ticket-selected' },
      { label: '汇总', value: 'summary' },
      { label: '矩阵', value: 'matrix' },
      { label: '图标概览', value: 'icon' },
    ];
    const items = [
      { label: '新增待确认', value: 23, tone: 'warning' as const },
      { label: '变更待确认', value: 12, tone: 'warning' as const },
      { label: '已完成', value: 120, tone: 'success' as const },
      { label: '执行中', value: 59, tone: 'info' as const },
    ];
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-statistic-demo">
        <CompanyStatistic
          variant={mode as CompanyStatisticVariant}
          title={mode === 'rate' ? '阻断率' : mode.startsWith('ticket') || mode === 'icon' ? '待处置工单' : mode === 'matrix' ? '评估任务统计' : mode === 'summary' ? '设备' : '请求次数(次)'}
          value={mode === 'rate' ? 84 : mode.startsWith('ticket') ? 25 : mode === 'summary' ? 130 : mode === 'matrix' ? 28 : mode === 'icon' ? 45 : 12346}
          items={items}
          metaLabel={mode === 'icon' ? '总数' : '工单数'}
          metaValue={mode === 'icon' ? 100 : 50}
          icon={mode === 'summary' ? companyIcons.terminal : mode === 'matrix' ? companyIcons.setting : companyIcons.applicationInfo}
          onClick={mode.startsWith('ticket') ? () => message.info('已切换工单统计项') : undefined}
        />
      </div>
    </VariantPreview>;
  }

  if (kind === 'tooltip') {
    const options = [
      { label: '上左', value: 'topLeft' },
      { label: '上中', value: 'top' },
      { label: '上右', value: 'topRight' },
      { label: '下左', value: 'bottomLeft' },
      { label: '下中', value: 'bottom' },
      { label: '下右', value: 'bottomRight' },
      { label: '左上', value: 'leftTop' },
      { label: '左中', value: 'left' },
      { label: '左下', value: 'leftBottom' },
      { label: '右上', value: 'rightTop' },
      { label: '右中', value: 'right' },
      { label: '右下', value: 'rightBottom' },
    ];
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-tooltip-demo">
        <CompanyTooltip key={mode} placement={mode as CompanyTooltipPlacement} trigger="click" title="文字提示内容" defaultOpen>
          <CompanyButton className="catalog-tooltip-trigger" variant="auxiliary" icon={<CompanyIcon type={companyIcons.warning} />} aria-label="查看文字提示" />
        </CompanyTooltip>
      </div>
    </VariantPreview>;
  }

  if (kind === 'badge') {
    const options = [{ label: '数字', value: 'count' }, { label: '圆点', value: 'dot' }];
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-badge-demo">
        <CompanyBadge count={badgeCount} dot={mode === 'dot'}>
          <CompanyButton className="catalog-badge-target" variant="auxiliary" icon={<CompanyIcon type={companyIcons.message} />} aria-label="增加消息数" onClick={() => setBadgeCount((current) => current + 1)} />
        </CompanyBadge>
        {mode === 'count' && <CompanyButton variant="text" onClick={() => setBadgeCount(0)}>清零</CompanyButton>}
      </div>
    </VariantPreview>;
  }

  if (kind === 'collapse') {
    const options = [
      { label: '左侧默认', value: 'left-default' },
      { label: '左侧展开', value: 'left-expanded' },
      { label: '左侧禁用', value: 'left-disabled' },
      { label: '右侧默认', value: 'right-default' },
      { label: '右侧展开', value: 'right-expanded' },
      { label: '右侧禁用', value: 'right-disabled' },
    ];
    const arrowPosition = mode.startsWith('right') ? 'right' : 'left';
    const isExpanded = mode.endsWith('expanded');
    const isDisabled = mode.endsWith('disabled');
    const items = [{
      key: 'security-policy',
      label: `折叠面板标题-${isDisabled ? '禁用' : isExpanded ? '展开' : '默认'}`,
      disabled: isDisabled,
      children: '终端安全策略支持按资产组配置检测范围、处置方式和例外规则。展开后可查看低频配置项，收起后保持页面信息层级清晰。',
    }];
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-collapse-demo">
        <CompanyCollapse
          key={mode}
          arrowPosition={arrowPosition}
          defaultActiveKey={isExpanded ? ['security-policy'] : []}
          items={items}
        />
      </div>
    </VariantPreview>;
  }

  if (kind === 'descriptions') {
    const options = [
      { label: '固定间距', value: 'fixed' },
      { label: '左对齐', value: 'left' },
      { label: '标签右对齐', value: 'aligned' },
      { label: '表格式', value: 'table' },
    ];
    const detailItems = [
      { key: 'type', label: '证书类型', children: '试用版' },
      { key: 'ip', label: '被攻击者IP', children: '192.168.100.123' },
      { key: 'validity', label: '证书有效期', children: '2020-12-30 至 2021-12-30' },
      { key: 'sn', label: '产品SN号', children: '1A2389123C2321A100348934893' },
      { key: 'version', label: '软件版本', children: 'v2.0.5.0' },
      { key: 'uptime', label: '系统运行时间', children: '21天7小时31分30秒' },
    ];
    const tableItems = [
      { key: 'name', label: '设备名称', children: '边界防火墙' },
      { key: 'version', label: '软件版本', children: 'V2.1.4.6.7' },
      { key: 'manage-ip', label: '管理IP地址', children: '192.168.100.123' },
      { key: 'created-at', label: '创建时间', children: '2026年8月12日 10:19:31' },
      { key: 'business-ip', label: '业务IP地址', children: '192.168.100.123' },
      { key: 'updated-at', label: '更新时间', children: '2026年8月12日 10:19:31' },
    ];
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-descriptions-demo">
        <CompanyDescriptions
          title={mode === 'table' ? undefined : '这里展示标题'}
          variant={mode as 'fixed' | 'left' | 'aligned' | 'table'}
          items={mode === 'fixed' ? detailItems.slice(0, 2) : mode === 'table' ? tableItems : detailItems}
        />
      </div>
    </VariantPreview>;
  }

  if (kind === 'table') {
    const options = [
      { label: '大尺寸', value: 'large' },
      { label: '小尺寸', value: 'small' },
      { label: '可选择', value: 'selection' },
      { label: '列类型', value: 'columns' },
      { label: '斑马纹', value: 'zebra' },
      { label: '加载', value: 'loading' },
      { label: '空状态', value: 'empty' },
    ];
    const columns = [
      { title: '编号', dataIndex: 'index', width: 84, sorter: (a: typeof tableData[number], b: typeof tableData[number]) => a.index - b.index },
      { title: '业务文案', dataIndex: 'name', width: 200, render: (value: string, record: typeof tableData[number]) => mode === 'columns' ? <CompanyTableTwoLine primary={value} secondary={`${record.asset} · ${record.ip}`} /> : value },
      { title: '威胁等级', dataIndex: 'threat', width: 116, filters: ['高危', '中危', '低危'].map((value) => ({ text: value, value })), onFilter: (value: boolean | React.Key, record: typeof tableData[number]) => record.threat === value, render: (value: string) => <CompanyTag variant="light" tone={value === '高危' ? 'danger' : value === '中危' ? 'warning' : 'low'}>{value}</CompanyTag> },
      { title: '状态', dataIndex: 'status', width: 116, render: (value: string) => <CompanyTag variant="dot" tone={value === '已完成' ? 'success' : value === '处理中' ? 'info' : 'neutral'}>{value}</CompanyTag> },
      { title: '进度', dataIndex: 'progress', width: 140, render: (value: number) => <CompanyTableProgress value={value} /> },
      { title: '金额数量', dataIndex: 'amount', width: 116, align: 'right' as const, render: (value: number) => value.toLocaleString('zh-CN') },
      { title: '时间日期', dataIndex: 'time', width: 176 },
      { title: '链接', key: 'link', width: 112, render: () => <CompanyTableLink onClick={() => message.info('打开报告链接')}>查看报告</CompanyTableLink> },
      { title: '操作', key: 'actions', width: 120, fixed: 'right' as const, render: () => <CompanyTableActions actions={[{ key: 'detail', label: '详情', onClick: () => message.info('打开事件详情') }, { key: 'handle', label: '处置', onClick: () => message.success('已进入处置流程') }]} /> },
    ];
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-table-demo">
        <CompanyTable
          key={mode}
          size={mode === 'small' ? 'small' : 'large'}
          zebra={mode === 'zebra'}
          pagination={false}
          sticky
          loading={mode === 'loading'}
          rowSelection={mode === 'selection' || mode === 'columns' ? { defaultSelectedRowKeys: ['1'] } : undefined}
          columns={columns}
          dataSource={mode === 'empty' ? [] : tableData}
          scroll={{ x: 1180, y: 240 }}
        />
      </div>
    </VariantPreview>;
  }

  if (kind === 'timeline') {
    const options = [
      { label: '默认-左', value: 'left' },
      { label: '默认-右', value: 'right' },
      { label: '图标-左', value: 'icon-left' },
      { label: '图标-右', value: 'icon-right' },
      { label: '居中交错', value: 'alternate' },
      { label: '倒序', value: 'reverse' },
    ];
    const items = [
      { key: 'created', date: '2026-08-12 09:12', children: '创建终端安全策略', color: 'gray' as const },
      { key: 'alert', date: '2026-08-12 10:24', children: '检测到勒索软件横向传播行为', color: 'red' as const, icon: companyIcons.warning },
      { key: 'handled', date: '2026-08-12 10:31', children: '隔离受影响终端并同步处置结果', color: 'green' as const, icon: companyIcons.success },
    ];
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-timeline-demo">
        <CompanyTimeline
          placement={mode === 'alternate' ? 'alternate' : mode.includes('right') ? 'right' : 'left'}
          marker={mode.startsWith('icon') ? 'icon' : 'dot'}
          reverse={mode === 'reverse'}
          items={items}
        />
      </div>
    </VariantPreview>;
  }

  if (kind === 'tree') {
    const options = [
      { label: '基本样式', value: 'basic' },
      { label: '多选框样式', value: 'checkbox' },
      { label: '收起状态', value: 'collapsed' },
      { label: '禁用状态', value: 'disabled' },
    ];
    return <VariantPreview options={options} value={mode} onChange={setMode}>
      <div className="catalog-tree-demo">
        <CompanyTree
          key={mode}
          variant={mode === 'checkbox' ? 'checkbox' : 'basic'}
          disabled={mode === 'disabled'}
          treeData={treeData}
          defaultExpandedKeys={mode === 'collapsed' ? [] : ['root', 'branch-open']}
          defaultSelectedKeys={mode === 'checkbox' ? [] : ['selected-node']}
          defaultCheckedKeys={mode === 'checkbox' ? ['selected-node'] : []}
          onSelect={(_, info) => message.info(`已选择：${String(info.node.title)}`)}
          onCheck={(_, info) => message.info(`${info.checked ? '已勾选' : '已取消'}：${String(info.node.title)}`)}
        />
      </div>
    </VariantPreview>;
  }

  if (kind === 'alert') {
    const options = [{ label: '信息', value: 'info' }, { label: '成功', value: 'success' }, { label: '警告', value: 'warning' }, { label: '错误', value: 'error' }];
    const titles = { info: '系统将在今晚执行策略同步', success: '策略保存成功', warning: '当前策略存在未保存变更', error: '策略保存失败' } as const;
    return <VariantPreview options={options} value={mode} onChange={setMode}><Alert style={{ width: '100%' }} showIcon closable type={mode as keyof typeof titles} title={titles[mode as keyof typeof titles]} description={mode === 'error' ? '请检查必填项后重试。' : undefined} /></VariantPreview>;
  }

  if (kind === 'message') {
    const options = [{ label: '成功', value: 'success' }, { label: '警告', value: 'warning' }, { label: '错误', value: 'error' }, { label: '加载', value: 'loading' }];
    const trigger = () => mode === 'loading' ? message.loading('正在提交安全策略', 1) : message[mode as 'success' | 'warning' | 'error'](mode === 'success' ? '安全策略已创建' : mode === 'warning' ? '部分终端尚未同步' : '安全策略创建失败');
    return <VariantPreview options={options} value={mode} onChange={setMode}><Button type="primary" onClick={trigger}>触发全局提示</Button></VariantPreview>;
  }

  if (kind === 'notification') {
    const options = [{ label: '信息', value: 'info' }, { label: '成功', value: 'success' }, { label: '错误', value: 'error' }];
    const trigger = () => notification[mode as 'info' | 'success' | 'error']({ title: mode === 'error' ? '终端连接异常' : '策略同步通知', description: mode === 'error' ? '12 台终端暂时无法连接，请检查网络状态。' : '终端基线策略已同步至 1,248 台设备。' });
    return <VariantPreview options={options} value={mode} onChange={setMode}><Button type="primary" onClick={trigger}>触发通知提醒</Button></VariantPreview>;
  }

  if (kind === 'modal') {
    const options = [{ label: '信息', value: 'info' }, { label: '确认', value: 'confirm' }, { label: '危险操作', value: 'danger' }];
    const trigger = () => mode === 'info' ? modal.info({ title: '确认信息', content: '这是本地预览弹窗。' }) : modal.confirm({ title: mode === 'danger' ? '确认删除策略？' : '确认提交策略？', content: mode === 'danger' ? '删除后不可恢复，请谨慎操作。' : '提交后策略将立即生效。', okButtonProps: { danger: mode === 'danger' } });
    return <VariantPreview options={options} value={mode} onChange={setMode}><Button danger={mode === 'danger'} type="primary" onClick={trigger}>打开对话框</Button></VariantPreview>;
  }

  if (kind === 'popconfirm') {
    const options = [{ label: '上方', value: 'top' }, { label: '右侧', value: 'right' }, { label: '危险操作', value: 'danger' }];
    return <VariantPreview options={options} value={mode} onChange={setMode}><Popconfirm placement={mode === 'right' ? 'right' : 'top'} title="确认删除该项？" description="删除后无法恢复" okText="确定" cancelText="取消" okButtonProps={{ danger: mode === 'danger' }} onConfirm={() => message.success('删除成功')}><Button danger>删除</Button></Popconfirm></VariantPreview>;
  }

  if (kind === 'drawer') {
    const options = [{ label: '标准 560', value: 'standard' }, { label: '复杂 880', value: 'wide' }];
    return <VariantPreview options={options} value={mode} onChange={setMode}><Button type="primary" onClick={() => setDrawerOpen(true)}>打开抽屉</Button><Drawer title={mode === 'wide' ? '安全事件详情' : '新建终端策略'} size={mode === 'wide' ? 880 : 560} open={drawerOpen} onClose={() => setDrawerOpen(false)} footer={<Space><Button onClick={() => setDrawerOpen(false)}>取消</Button><Button type="primary" onClick={() => { setDrawerOpen(false); message.success('保存成功'); }}>保存</Button></Space>}><CompanyDescriptions variant="aligned" items={[{ key: '1', label: '策略名称', children: '办公终端基线策略' }, { key: '2', label: '生效范围', children: '办公终端' }]} /></Drawer></VariantPreview>;
  }

  if (kind === 'progress') {
    const options = [{ label: '线形', value: 'line' }, { label: '圆形', value: 'circle' }, { label: '成功', value: 'success' }, { label: '异常', value: 'exception' }];
    return <VariantPreview options={options} value={mode} onChange={setMode}><Space direction="vertical" style={{ width: 360 }}><Progress type={mode === 'circle' ? 'circle' : 'line'} percent={mode === 'success' ? 100 : percent} status={mode === 'exception' ? 'exception' : mode === 'success' ? 'success' : 'normal'} /><Slider value={percent} disabled={mode === 'success'} onChange={setPercent} /></Space></VariantPreview>;
  }

  const options = [{ label: '默认', value: 'default' }, { label: '搜索无结果', value: 'search' }, { label: '紧凑', value: 'compact' }];
  return <VariantPreview options={options} value={mode} onChange={setMode}><Empty image={mode === 'compact' ? Empty.PRESENTED_IMAGE_SIMPLE : '/assets/visual/empty-general.svg'} description={mode === 'search' ? '暂无匹配结果，请调整筛选条件' : '暂无更多数据'}><Button type="primary" size={mode === 'compact' ? 'small' : 'middle'}>新建数据</Button></Empty></VariantPreview>;
}
