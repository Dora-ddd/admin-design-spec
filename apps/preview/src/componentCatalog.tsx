import { useState } from 'react';
import type { ReactNode } from 'react';
import { App as AntdApp, Button, Input, Segmented, Select, Space, Tooltip, Typography } from 'antd';
import { CompanyIcon, companyIconSemanticResources, companyIconfontProject, companyIcons } from '@company/ui/icons';
import { COMPANY_SPACE } from '@company/theme';
import { AntdVariantPreview } from './componentDemos';
import { CompanyBusinessLayout } from '@company/ui/business-layout';
import { CompanyButton } from '@company/ui/button';
import type { CompanyButtonVariant } from '@company/ui/button';
import { CompanyLoadingRing } from '@company/ui/loading';
import { CompanyPageHeader } from '@company/ui/page-header';
import { CompanySearchField, CompanySearchPanel } from '@company/ui/search-panel';
import { CompanyDataLoadingState, CompanyExceptionState } from '@company/ui/status-state';
import { CompanySurface } from '@company/ui/surface';
import {
  CompanyTag,
  CornerBadge,
  EditableTag,
  EditableTagGroup,
  EditionTag,
  getBusinessTagTone,
  LicenseStateTag,
  StampTag,
} from '@company/ui/tags';
import type { TagTone } from '@company/ui/tags';
import { CompanyVisualAssetGallery } from '@company/ui/visual-asset';
import {
  DashboardPatternPreview,
  DetailPagePatternPreview,
  FormPagePatternPreview,
  ListPagePatternPreview,
} from './pagePatterns';

const { Text } = Typography;

export type ComponentCatalogEntry = {
  key: string;
  title: string;
  name: string;
  description: string;
  docRef: string;
  codeRef: string;
  code: string;
  preview: ReactNode;
};

export type ComponentCatalogGroup = {
  key: string;
  title: string;
  children: Array<ComponentCatalogGroup | ComponentCatalogEntry>;
};

const commonSource = 'packages/theme/src/index.ts';
const appSource = 'apps/preview/src/App.tsx';
const patternSource = 'apps/preview/src/pagePatterns.tsx';

function themeCode(component: string, lines: string) {
  return `${component}: {
${lines}
}`;
}

function cssCode(lines: string) {
  return lines;
}

const buttonShowcaseTypes = [
  { key: 'primary' as CompanyButtonVariant, title: '主按钮', description: '核心操作' },
  { key: 'secondary' as CompanyButtonVariant, title: '次要按钮', description: '次级操作' },
  { key: 'auxiliary' as CompanyButtonVariant, title: '辅助按钮', description: '工具操作' },
  { key: 'text' as CompanyButtonVariant, title: '文字按钮', description: '轻量操作' },
];

const iconCategoryLabels = {
  button: '按钮图标',
  tag: '标签图标',
  status: '状态类图标',
  common: '其他图标',
} as const;

const iconSemanticDistinctions = [
  { name: '导入 / 上传', icons: [companyIcons.importData, companyIcons.upload], rule: '导入强调外部数据批量写入系统；上传强调提交文件或附件。', usage: '导入 icon-daoru；上传 icon-shangchuan' },
  { name: '搜索 / 筛选', icons: [companyIcons.search, companyIcons.filter], rule: '搜索强调关键词查找；筛选强调按条件过滤结果集。', usage: '搜索 icon-a-sousuofangdajing；筛选 icon-shaixuan' },
  { name: '设置 / 系统设置', icons: [companyIcons.setting], rule: '设置用于局部配置；系统设置用于全局、平台级配置。', usage: '均可用 icon-a-shezhixitong，文案语义优先区分' },
  { name: '停用 / 失败 / 异常', icons: [companyIcons.failed, companyIcons.warning], rule: '停用是主动关闭能力；失败是执行结果未成功；异常是系统、状态或数据错误提示。', usage: '停用/失败 icon-a-cuowushibai；异常 icon-a-zhuyitishi' },
  { name: '告警级别 / 安全事件', icons: [companyIcons.alertLevel, companyIcons.securityEvent], rule: '告警级别是等级或严重度标签；安全事件是具体事件对象。', usage: '告警级别 icon-a-biaoqianjingbaojingshibaojing；安全事件 icon-gaojing' },
  { name: '威胁等级 / 漏洞等级', icons: [companyIcons.threatLevel, companyIcons.vulnerability], rule: '威胁等级描述攻击、威胁或恶意行为强度；漏洞等级描述漏洞或缺陷严重度。', usage: '威胁等级 icon-eyilanjie；漏洞等级 icon-loudong' },
  { name: '成功 / 高置信度', icons: [companyIcons.success, companyIcons.highConfidence], rule: '成功表示任务或流程结果；高置信度表示判断可信程度。', usage: '成功 icon-a-tongguochenggong；高置信度 icon-gaozhixin' },
  { name: '待处置 / 处置中', icons: [companyIcons.waiting, companyIcons.inProgress], rule: '待处置表示尚未开始处理；处置中表示流程正在进行。', usage: '待处置 icon-shalou；处置中 icon-lishijilu' },
  { name: '隐藏 / 显示', icons: [companyIcons.hidden, companyIcons.visible], rule: '隐藏表示内容不可见或关闭展示；显示表示内容可见或开启展示。', usage: '隐藏 icon-a-bukejianbiyan；显示 icon-a-kejianyanjing' },
  { name: '消息 / 告警', icons: [companyIcons.message, companyIcons.alertLevel], rule: '消息用于普通通知、提醒、公告；告警用于安全、风险、异常类提示。', usage: '消息 icon-a-tixinglingdang；告警类按标签或状态语义匹配' },
];

function getCompanyIconKey(icon: string) {
  return Object.entries(companyIcons).find(([, value]) => value === icon)?.[0];
}

function ButtonShowcase() {
  const [buttonState, setButtonState] = useState('normal');

  return <div className="catalog-button-showcase">
    <div className="catalog-variant-toolbar catalog-button-state-toolbar">
      <Text type="secondary">状态</Text>
      <Segmented size="small" value={buttonState} options={[{ label: '默认', value: 'normal' }, { label: '加载', value: 'loading' }, { label: '禁用', value: 'disabled' }, { label: '危险', value: 'danger' }]} onChange={(value) => setButtonState(String(value))} />
    </div>
    {buttonShowcaseTypes.map((item) => {
      const stateProps = { loading: buttonState === 'loading', disabled: buttonState === 'disabled', danger: buttonState === 'danger' };

      return <section className="catalog-button-row" key={item.key} aria-label={item.title}>
        <div className="catalog-button-kind">
          <Text strong>{item.title}</Text>
          <Text type="secondary">{item.description}</Text>
        </div>
        <div className="catalog-button-forms">
          <div className="catalog-button-form"><Text type="secondary">无图标</Text><CompanyButton variant={item.key} {...stateProps}>按钮文本</CompanyButton></div>
          <div className="catalog-button-form"><Text type="secondary">前置图标</Text><CompanyButton variant={item.key} icon={<CompanyIcon type={companyIcons.add} />} {...stateProps}>按钮文本</CompanyButton></div>
          <div className="catalog-button-form"><Text type="secondary">后置图标</Text><CompanyButton variant={item.key} trailingIcon={<CompanyIcon type={companyIcons.down} />} {...stateProps}>按钮文本</CompanyButton></div>
          <div className="catalog-button-form"><Text type="secondary">前置 + 后置</Text><CompanyButton variant={item.key} icon={<CompanyIcon type={companyIcons.add} />} trailingIcon={<CompanyIcon type={companyIcons.down} />} {...stateProps}>按钮文本</CompanyButton></div>
          <div className="catalog-button-form"><Text type="secondary">仅图标</Text><div className="catalog-button-form-actions">
            <Tooltip title={`${item.title}前置图标操作`}><CompanyButton variant={item.key} icon={<CompanyIcon type={companyIcons.add} />} aria-label={`${item.title}前置图标操作`} {...stateProps} /></Tooltip>
            <Tooltip title={`${item.title}后置图标操作`}><CompanyButton variant={item.key} icon={<CompanyIcon type={companyIcons.down} />} aria-label={`${item.title}后置图标操作`} {...stateProps} /></Tooltip>
          </div></div>
        </div>
      </section>;
    })}
  </div>;
}

function IconShowcase() {
  const { message } = AntdApp.useApp();
  const [size, setSize] = useState('medium');
  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const copyIconCode = async (icon: string) => {
    const iconKey = getCompanyIconKey(icon);
    const code = iconKey ? `<CompanyIcon type={companyIcons.${iconKey}} />` : `<CompanyIcon type="${icon}" />`;

    try {
      await navigator.clipboard.writeText(code);
      message.success('图标代码已复制');
    } catch {
      message.error('复制失败，请手动选择代码');
    }
  };

  return <div className="catalog-variant-preview">
    <div className="catalog-variant-toolbar"><Text type="secondary">图标尺寸</Text><Segmented size="small" value={size} options={[{ label: '16px', value: 'small' }, { label: '20px', value: 'medium' }, { label: '24px', value: 'large' }]} onChange={(value) => setSize(String(value))} /></div>
    <div className="catalog-variant-surface catalog-icon-mapping-showcase">
      {Object.entries(iconCategoryLabels).map(([category, label]) => {
        const items = companyIconSemanticResources.filter((item) => item.category === category);

        return <section className="catalog-icon-category" key={category} aria-label={label}>
          <div className="catalog-icon-category-heading"><Text strong>{label}</Text><Text type="secondary">{items.length} 项</Text></div>
          <div className="catalog-icon-grid">
            {items.map((item) => {
              const iconKey = getCompanyIconKey(item.icon);
              const codeLabel = iconKey ? `companyIcons.${iconKey}` : item.icon;

              return <div className="catalog-icon-card" key={`${category}-${item.name}`}>
                <div className="catalog-icon-card-main">
                  <span className="catalog-icon-glyph"><CompanyIcon type={item.icon} style={{ fontSize: iconSize }} /></span>
                  <div className="catalog-icon-copy">
                    <Text strong>{item.name}</Text>
                    <Text type="secondary">{item.synonyms.join('、')}</Text>
                    <code>{item.icon}</code>
                  </div>
                </div>
                <Tooltip title={codeLabel}>
                  <Button size="small" aria-label={`复制${item.name}图标代码`} icon={<CompanyIcon type={companyIcons.copy} />} onClick={() => void copyIconCode(item.icon)} />
                </Tooltip>
              </div>;
            })}
          </div>
        </section>;
      })}
      <section className="catalog-icon-category" aria-label="相似语义区分">
        <div className="catalog-icon-category-heading"><Text strong>相似语义区分</Text><Text type="secondary">{iconSemanticDistinctions.length} 项</Text></div>
        <div className="catalog-icon-distinction-list">
          {iconSemanticDistinctions.map((item) => <div className="catalog-icon-distinction" key={item.name}>
            <div className="catalog-icon-distinction-head">
              <Text strong>{item.name}</Text>
              <div className="catalog-icon-distinction-icons" aria-hidden="true">
                {item.icons.map((icon) => <span className="catalog-icon-glyph catalog-icon-glyph--compact" key={`${item.name}-${icon}`}><CompanyIcon type={icon} style={{ fontSize: iconSize }} /></span>)}
              </div>
            </div>
            <Text type="secondary">{item.rule}</Text>
            <code>{item.usage}</code>
          </div>)}
        </div>
      </section>
    </div>
  </div>;
}

function LoadingRingShowcase() {
  const [size, setSize] = useState('16');
  const diameter = Number(size);

  return <div className="catalog-variant-preview">
    <div className="catalog-variant-toolbar">
      <Text type="secondary">圆环尺寸</Text>
      <Segmented size="small" value={size} options={[{ label: '16px', value: '16' }, { label: '20px', value: '20' }, { label: '24px', value: '24' }]} onChange={(value) => setSize(String(value))} />
    </div>
    <div className="catalog-variant-surface">
      <Space size={COMPANY_SPACE[12]}><CompanyLoadingRing size={diameter} ariaLabel="数据加载中" /><Text type="secondary">数据加载中</Text></Space>
    </div>
  </div>;
}

function SearchPanelShowcase() {
  const [keyword, setKeyword] = useState('');
  const [level, setLevel] = useState<string>();

  return (
    <CompanySearchPanel
      onSearch={() => undefined}
      onReset={() => { setKeyword(''); setLevel(undefined); }}
    >
      <CompanySearchField label="事件名称">
        <Input value={keyword} placeholder="请输入事件名称、资产或 IP" allowClear onChange={(event) => setKeyword(event.target.value)} />
      </CompanySearchField>
      <CompanySearchField label="风险等级">
        <Select value={level} placeholder="请选择风险等级" allowClear options={[{ value: '严重', label: '严重' }, { value: '高危', label: '高危' }, { value: '中危', label: '中危' }]} onChange={setLevel} />
      </CompanySearchField>
    </CompanySearchPanel>
  );
}

const semanticTagItems: Array<{ label: string; tone: TagTone }> = [
  { label: '深红(紧急)', tone: 'urgent' },
  { label: '红(严重)', tone: 'danger' },
  { label: '深橙(高危)', tone: 'high' },
  { label: '橙(中危)', tone: 'warning' },
  { label: '黄(低危)', tone: 'low' },
  { label: '绿(安全)', tone: 'success' },
  { label: '蓝(信息)', tone: 'info' },
  { label: '深灰(未知)', tone: 'neutral' },
];

const dotTagItems: Array<{ label: string; tone: TagTone }> = [
  { label: '红色', tone: 'danger' },
  { label: '橙色', tone: 'warning' },
  { label: '蓝色', tone: 'info' },
  { label: '绿色', tone: 'success' },
  { label: '灰色', tone: 'neutral' },
  { label: '进行中', tone: 'info' },
];

const businessLevelGroups = [
  { title: '漏洞等级', icon: companyIcons.vulnerability, labels: ['超危', '高危', '中危', '低危', '信息'] },
  { title: '脆弱性-威胁等级', icon: companyIcons.threatLevel, labels: ['超危', '高危', '中危', '低危', '信息'] },
  { title: '攻击者-威胁等级', icon: companyIcons.threatLevel, labels: ['紧急', '高危', '中危', '低危', '无风险', '未知'] },
  { title: '风险资产-风险等级', icon: companyIcons.riskAsset, labels: ['已失陷', '高风险', '中风险', '低风险', '无风险'] },
  { title: '事件级别', icon: companyIcons.securityEvent, labels: ['紧急', '严重', '警告', '提醒'] },
  { title: '告警级别', icon: companyIcons.alertLevel, labels: ['紧急', '严重', '警告', '提醒'] },
];

const businessStatusGroups = [
  { title: '研判结果', items: [{ label: '攻击成功', icon: companyIcons.success, tone: 'success' }, { label: '误报', icon: companyIcons.ignore, tone: 'info' }, { label: '攻击失败', icon: companyIcons.failed, tone: 'danger' }, { label: '未知', icon: companyIcons.warning, tone: 'neutral' }, { label: '未研判', icon: companyIcons.message, tone: 'neutral' }] },
  { title: '处置状态', items: [{ label: '待处置', icon: companyIcons.waiting, tone: 'warning' }, { label: '处置中', icon: companyIcons.inProgress, tone: 'info' }, { label: '处置完成', icon: companyIcons.success, tone: 'success' }, { label: '忽略', icon: companyIcons.ignore, tone: 'neutral' }, { label: '处置失败', icon: companyIcons.failed, tone: 'danger' }] },
  { title: '置信度', items: [{ label: '高置信', icon: companyIcons.highConfidence, tone: 'danger' }, { label: '中置信', icon: companyIcons.mediumConfidence, tone: 'warning' }, { label: '低置信', icon: companyIcons.lowConfidence, tone: 'low' }, { label: '未知', icon: companyIcons.warning, tone: 'neutral' }] },
] as const;

const cornerBadgeItems: Array<{ label: string; tone: TagTone }> = [
  { label: '绿色', tone: 'success' },
  { label: '蓝色', tone: 'info' },
  { label: '红色', tone: 'danger' },
  { label: '橙色', tone: 'warning' },
  { label: '黄色', tone: 'low' },
  { label: '灰色', tone: 'neutral' },
];

function TagShowcase() {
  const [showClosableTag, setShowClosableTag] = useState(true);
  const [editableValue, setEditableValue] = useState('文案编辑中');
  const [selectableValue, setSelectableValue] = useState('待处置');

  return <div className="catalog-tag-showcase">
    <section className="catalog-tag-section" aria-label="基础标签">
      <div className="catalog-tag-section-heading"><Text strong>基础标签</Text><Text type="secondary">默认、选中、可关闭、编辑</Text></div>
      <div className="catalog-tag-row">
        <CompanyTag>标签 1</CompanyTag>
        <CompanyTag selected>标签 1</CompanyTag>
        {showClosableTag
          ? <CompanyTag closable onClose={() => setShowClosableTag(false)}>标签 1</CompanyTag>
          : <Button type="link" size="small" onClick={() => setShowClosableTag(true)}>恢复可关闭标签</Button>}
        <EditableTag defaultValue="一二三" state="editing" />
      </div>
    </section>

    <section className="catalog-tag-section" aria-label="可编辑标签">
      <div className="catalog-tag-section-heading"><Text strong>可编辑标签</Text><Text type="secondary">默认、Hover、下拉切换、输入编辑、失焦校验</Text></div>
      <div className="catalog-editable-tag-grid">
        <div><Text type="secondary">默认</Text><EditableTag defaultValue="输入完成" /></div>
        <div><Text type="secondary">Hover</Text><EditableTag defaultValue="文字 hover" state="hover" /></div>
        <div><Text type="secondary">下拉切换</Text><EditableTag mode="select" value={selectableValue} options={[{ label: '待处置', value: '待处置' }, { label: '处置中', value: '处置中' }, { label: '处置完成', value: '处置完成' }]} onChange={setSelectableValue} /></div>
        <div><Text type="secondary">输入编辑</Text><EditableTag value={editableValue} state="editing" onChange={setEditableValue} /></div>
        <div><Text type="secondary">报错</Text><EditableTag defaultValue="输入报错" state="error" errorText="说明信息错误原因" /></div>
      </div>
      <div className="catalog-editable-tag-add-demo">
        <Text type="secondary">动态新增</Text>
        <EditableTagGroup />
        <Text type="secondary">点击添加后直接输入；空内容失焦时显示错误。</Text>
      </div>
    </section>

    <section className="catalog-tag-section" aria-label="标签语义形式">
      <div className="catalog-tag-section-heading"><Text strong>标签语义形式</Text><Text type="secondary">状态点、浅色、实色、图标</Text></div>
      <div className="catalog-tag-type-row"><Text type="secondary">状态点</Text><div className="catalog-tag-row">{dotTagItems.map((item) => <CompanyTag key={item.label} tone={item.tone} variant="dot">{item.label}</CompanyTag>)}</div></div>
      <div className="catalog-tag-type-row"><Text type="secondary">浅色语义</Text><div className="catalog-tag-row">{semanticTagItems.map((item) => <CompanyTag key={item.label} tone={item.tone} variant="light">{item.label}</CompanyTag>)}</div></div>
      <div className="catalog-tag-type-row"><Text type="secondary">实色语义</Text><div className="catalog-tag-row">{semanticTagItems.map((item) => <CompanyTag key={item.label} tone={item.tone} variant="solid">{item.label}</CompanyTag>)}</div></div>
      <div className="catalog-tag-type-row"><Text type="secondary">图标语义</Text><div className="catalog-tag-row">{semanticTagItems.map((item) => <CompanyTag key={item.label} tone={item.tone} variant="icon">{item.label}</CompanyTag>)}</div></div>
    </section>

    <section className="catalog-tag-section" aria-label="等级和状态标签">
      <div className="catalog-tag-section-heading"><Text strong>等级和状态标签</Text><Text type="secondary">9 类业务语义，浅色 / 实色 / 图标状态</Text></div>
      <div className="catalog-business-tag-list">
        {businessLevelGroups.map((group) => <div className="catalog-business-tag-group" key={group.title}>
          <div className="catalog-business-tag-title"><CompanyIcon type={group.icon} /><Text>{group.title}</Text></div>
          <div className="catalog-business-tag-variants">
            <div><Text type="secondary">浅色</Text><div className="catalog-tag-row">{group.labels.map((label) => <CompanyTag key={label} tone={getBusinessTagTone(label)} variant="light">{label}</CompanyTag>)}</div></div>
            <div><Text type="secondary">实色</Text><div className="catalog-tag-row">{group.labels.map((label) => <CompanyTag key={label} tone={getBusinessTagTone(label)} variant="solid">{label}</CompanyTag>)}</div></div>
          </div>
        </div>)}
        {businessStatusGroups.map((group) => <div className="catalog-business-tag-group" key={group.title}>
          <div className="catalog-business-tag-title"><CompanyIcon type={group.items[0].icon} /><Text>{group.title}</Text></div>
          <div className="catalog-business-tag-variants"><div><Text type="secondary">图标状态</Text><div className="catalog-tag-row">{group.items.map((item) => <CompanyTag key={item.label} tone={item.tone} variant="icon" icon={item.icon}>{item.label}</CompanyTag>)}</div></div></div>
        </div>)}
      </div>
    </section>

    <section className="catalog-tag-section" aria-label="印章">
      <div className="catalog-tag-section-heading"><Text strong>印章</Text><Text type="secondary">正向、负向、中性</Text></div>
      <div className="catalog-stamp-row"><StampTag /><StampTag variant="negative" /><StampTag variant="neutral" /></div>
    </section>

    <section className="catalog-tag-section" aria-label="角标">
      <div className="catalog-tag-section-heading"><Text strong>角标</Text><Text type="secondary">6 种语义色，左向 / 右向</Text></div>
      <div className="catalog-corner-badge-grid">{cornerBadgeItems.map((item) => <div key={item.label}><CornerBadge tone={item.tone}>{item.label}</CornerBadge><CornerBadge direction="right" tone={item.tone}>{item.label}</CornerBadge></div>)}</div>
    </section>

    <section className="catalog-tag-section" aria-label="版权状态">
      <div className="catalog-tag-section-heading"><Text strong>版权状态</Text><Text type="secondary">正式授权、试用授权</Text></div>
      <div className="catalog-tag-row"><LicenseStateTag /><LicenseStateTag variant="trial" /></div>
    </section>

    <section className="catalog-tag-section" aria-label="版权信息">
      <div className="catalog-tag-section-heading"><Text strong>版权信息</Text><Text type="secondary">5 种产品版本标识</Text></div>
      <div className="catalog-tag-row"><EditionTag /><EditionTag variant="professional" /><EditionTag variant="innovation" /><EditionTag variant="portable" /><EditionTag variant="enhanced" /></div>
    </section>
  </div>;
}

const sourceTheme = (component: string) => `${commonSource} / getCompanyTheme().components.${component}`;

const entries: ComponentCatalogEntry[] = [
  {
    key: 'global-style',
    title: '全局样式',
    name: 'Global Style',
    description: '页面字体、背景、滚动条、基础字号和品牌色 CSS 变量的统一入口。',
    docRef: 'docs/specs/design-system-spec.md / 2. 内容区域结构规范、3. 间距与布局规范、4. 字体与排版规范',
    codeRef: 'packages/ui/src/components/surface/CompanySurface.tsx',
    code: cssCode(`body { background: var(--company-page-bg); color: var(--company-text); font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; }
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-thumb { background: rgba(138, 144, 153, .15); }`),
    preview: <CompanySurface tone="page" indicator>内容容器背景 gray-3，业务容器背景 gray-1，滚动条 4px。</CompanySurface>,
  },
  {
    key: 'layout',
    title: '业务页面架构',
    name: 'Business Layout',
    description: '内容容器承载业务容器，业务容器内组织搜索、工具栏、表格、分页和状态内容。',
    docRef: 'docs/specs/design-system-spec.md / 2.1 标准业务内容区、3.4 容器布局、7.1 列表页',
    codeRef: 'packages/ui/src/components/business-layout/CompanyBusinessLayout.tsx',
    code: `<Layout className="app-layout">
  <Sider width={224} theme="light" />
  <Layout>
    <Header className="app-header" />
    <Content className="app-content">{content}</Content>
  </Layout>
</Layout>`,
    preview: <CompanyBusinessLayout navigation={null} header={null}><CompanySurface /><CompanySurface /></CompanyBusinessLayout>,
  },
  {
    key: 'list-page-pattern',
    title: '列表页样板',
    name: 'List Page',
    description: '搜索、工具栏、表格和分页形成稳定区域，数据滚动由表格主体承接，并覆盖正常、加载、空和异常状态。',
    docRef: 'docs/specs/design-system-spec.md / 页面选型决策表、3.5 滚动策略、7.1 列表页、8.2-8.5 状态反馈',
    codeRef: `${patternSource} / ListPagePatternPreview`,
    code: `function ListPagePatternPreview() {
  const [state, setState] = useState<'normal' | 'loading' | 'empty' | 'error'>('normal');
  const [page, setPage] = useState(1);

  const search = () => {
    setPage(1);
    setState('loading');
    loadTableData().finally(() => setState('normal'));
  };

  return <ListContainer>
    <CompanySearchPanel onSearch={search} onReset={clearConditionsOnly}>
      <CompanySearchField label="事件名称"><Input /></CompanySearchField>
      <CompanySearchField label="风险等级"><Select /></CompanySearchField>
    </CompanySearchPanel>
    <Toolbar />
    <Table scroll={{ x: 1160, y: 218 }} loading={state === 'loading'} />
    {state === 'normal' && <Pagination current={page} />}
  </ListContainer>;
}`,
    preview: <ListPagePatternPreview />,
  },
  {
    key: 'search-panel',
    title: '搜索区',
    name: 'Search Panel',
    description: '统一承载搜索字段、搜索与清空操作；业务页面只传入字段、受控值和查询回调。',
    docRef: 'docs/specs/design-system-spec.md / 7.1 列表页搜索区',
    codeRef: 'packages/ui/src/components/search-panel/CompanySearchPanel.tsx',
    code: `<CompanySearchPanel onSearch={loadData} onReset={resetFilters}>
  <CompanySearchField label="事件名称"><Input /></CompanySearchField>
  <CompanySearchField label="风险等级"><Select /></CompanySearchField>
</CompanySearchPanel>`,
    preview: <SearchPanelShowcase />,
  },
  {
    key: 'form-page-pattern',
    title: '表单页样板',
    name: 'Form Drawer',
    description: '6 个常规录入项使用 560px 单列抽屉，标题和底部操作区固定，内容区滚动，并拦截未保存离开操作。',
    docRef: 'docs/specs/design-system-spec.md / 页面选型决策表、2.3 对话框与抽屉、7.2 表单页、8.6 Confirm',
    codeRef: `${patternSource} / FormPagePatternPreview`,
    code: `<Drawer
  title="新建终端防护策略"
  size={560}
  open={open}
  onClose={requestClose}
  footer={<FormActions loading={submitting} />}
>
  <Form
    layout="horizontal"
    colon={false}
    labelCol={{ flex: '112px' }}
    wrapperCol={{ flex: 1 }}
    onValuesChange={markAsDirty}
  />
</Drawer>`,
    preview: <FormPagePatternPreview />,
  },
  {
    key: 'detail-page-pattern',
    title: '详情页样板',
    name: 'Detail Drawer',
    description: '详情抽屉包含标题浏览控制、摘要和按业务顺序组织的信息分组，不设置底部操作区。',
    docRef: 'docs/specs/design-system-spec.md / 2.3 对话框与抽屉、3.5 滚动策略、7.3 详情页',
    codeRef: `${patternSource} / DetailPagePatternPreview`,
    code: `<Drawer
  title="安全事件详情"
  size={880}
  open={open}
  extra={<BrowseControls />}
>
  <DetailSummary actions={<BusinessActions />} />
  <Descriptions title="基础信息" />
  <RelatedRecords />
</Drawer>`,
    preview: <DetailPagePatternPreview />,
  },
  {
    key: 'dashboard-page-pattern',
    title: 'Dashboard 样板',
    name: 'Dashboard',
    description: '核心指标、趋势和风险分布按 12 栅格向下延展，指标卡使用工程内三维图标并作为业务入口。',
    docRef: 'docs/specs/design-system-spec.md / 6.7 基础数据统计卡片、7.4 工作台 / Dashboard',
    codeRef: `${patternSource} / DashboardPatternPreview`,
    code: `<div className="pattern-metric-group">
  {metrics.map((metric) => (
    <button className="pattern-metric" onClick={() => openBusinessList(metric.key)}>
      <img src={metric.image} alt="" />
      <span>{metric.title}</span>
      <strong>{metric.value} <small>{metric.unit}</small></strong>
    </button>
  ))}
</div>`,
    preview: <DashboardPatternPreview />,
  },
  {
    key: 'icon',
    title: '图标 Icon',
    name: 'Icon',
    description: '图标用于稳定语义识别，纯图标按钮需要 Tooltip 或 aria-label。',
    docRef: 'docs/specs/icon-resources.md / 4. 图标 class 使用规则；docs/specs/design-system-spec.md / 7.7 图标密集页',
    codeRef: 'docs/specs/icon-resources.md / Iconfont 项目 5177816',
    code: `// ${companyIconfontProject.provider} / Iconfont ${companyIconfontProject.projectId}
<CompanyIcon type={companyIcons.search} />
<CompanyIcon type={companyIcons.importData} />
<CompanyIcon type={companyIcons.delete} />`,
    preview: <IconShowcase />,
  },
  {
    key: 'button',
    title: '按钮 Button',
    name: 'Button',
    description: '基础按钮分为主按钮、次要按钮、辅助按钮和文字按钮，统一支持无图标、前置图标、后置图标、前后图标组合与仅图标形式。',
    docRef: 'MasterGo / 基础按钮（12496:092285）',
    codeRef: 'packages/ui/src/components/button/CompanyButton.tsx',
    code: `<CompanyButton variant="primary" icon={<CompanyIcon type={companyIcons.add} />}>按钮文本</CompanyButton>
<CompanyButton variant="secondary" trailingIcon={<CompanyIcon type={companyIcons.down} />}>按钮文本</CompanyButton>
<CompanyButton variant="auxiliary">按钮文本</CompanyButton>
<CompanyButton variant="text">按钮文本</CompanyButton>`,
    preview: <ButtonShowcase />,
  },
  {
    key: 'icon-3d',
    title: '三维图标 3D icon',
    name: '3D Icon',
    description: '使用公司视觉资源包中的原始 3D 图标，不使用渐变块或临时图形替代。',
    docRef: '视觉资源 / 3Dicon',
    codeRef: 'packages/ui/src/components/visual-asset/CompanyVisualAsset.tsx',
    code: `<img src="/assets/visual/3d-security-event.png" alt="安全事件" />`,
    preview: <CompanyVisualAssetGallery items={[
      { src: '/assets/visual/3d-security-event.png', alt: '安全事件', label: '安全事件' },
      { src: '/assets/visual/3d-risk-asset.png', alt: '风险资产', label: '风险资产' },
      { src: '/assets/visual/3d-terminal-discovery.png', alt: '终端发现', label: '终端发现' },
      { src: '/assets/visual/3d-smart-qa.png', alt: '智能问答', label: '智能问答' },
    ]} />,
  },
  {
    key: 'input',
    title: '输入框 Input',
    name: 'Input',
    description: '工程组件覆盖默认、悬停、激活、输入完成、报错、禁用，以及前后标签和前后图标组合。',
    docRef: 'MasterGo / 输入框-控件（12508:106815）',
    codeRef: 'packages/ui/src/components/input/CompanyInput.tsx',
    code: `<CompanyInput placeholder="请输入..." />
<CompanyInput prefixIcon={<CompanyIcon type={companyIcons.search} />} placeholder="请输入关键词" />
<CompanyInput trailingLabel="GB" placeholder="请输入容量" />`,
    preview: <AntdVariantPreview kind="input" />,
  },
  {
    key: 'input-number',
    title: '数字输入框 InputNumber',
    name: 'InputNumber',
    description: '工程组件覆盖小、中、大三种尺寸，以及默认、悬停、键入、输入中、增减图标、输入完成、报错和禁用状态。',
    docRef: 'MasterGo / 数字输入框（1763:40421）',
    codeRef: 'packages/ui/src/components/input-number/CompanyInputNumber.tsx',
    code: `<CompanyInputNumber min={0} max={100} placeholder="0-100" />
<CompanyInputNumber visualState="error" errorMessage="请输入0-100之间的数值" />`,
    preview: <AntdVariantPreview kind="input-number" />,
  },
  {
    key: 'date-picker',
    title: '日期选择器 DatePicker',
    name: 'DatePicker',
    description: '工程组件覆盖单日期、日期范围，小/中/大尺寸及默认、悬停、聚焦、输入完成和禁用状态，并统一日期下拉面板。',
    docRef: 'MasterGo / datePicker 日期选择器（1830:47606）、dateDropdown 日期选择下拉（2762:44352）',
    codeRef: 'packages/ui/src/components/date-picker/CompanyDatePicker.tsx',
    code: `<CompanyDatePicker placeholder="请选择日期" />
<CompanyDateRangePicker placeholder={['开始日期', '结束日期']} />`,
    preview: <AntdVariantPreview kind="date-picker" />,
  },
  {
    key: 'cascader',
    title: '级联选择 Cascader',
    name: 'Cascader',
    description: '工程组件覆盖单选、多选三级级联，以及默认、悬停、聚焦、报错和禁用状态；三级面板固定为 120px 列宽与 160px 高度。',
    docRef: 'MasterGo / 级联下拉（1361:045587）',
    codeRef: 'packages/ui/src/components/cascader/CompanyCascader.tsx',
    code: `<CompanyCascader placeholder="请选择组织" options={options} />
<CompanyCascader multiple placeholder="请选择组织" options={options} />
<CompanyCascader visualState="error" errorMessage="请选择组织" options={options} />`,
    preview: <AntdVariantPreview kind="cascader" />,
  },
  {
    key: 'checkbox',
    title: '多选框 Checkbox',
    name: 'Checkbox',
    description: '工程组件覆盖默认、悬停、选中、半选及三种失效状态，并提供可交互的全选与多选项组合。',
    docRef: 'MasterGo / 多选框 checkbox（1318:52707）',
    codeRef: 'packages/ui/src/components/checkbox/CompanyCheckbox.tsx',
    code: `<CompanyCheckbox>未选中项</CompanyCheckbox>
<CompanyCheckbox checked>已选中项</CompanyCheckbox>
<CompanyCheckbox indeterminate>部分选中</CompanyCheckbox>
<CompanyCheckboxGroup value={value} onChange={setValue}>...</CompanyCheckboxGroup>`,
    preview: <AntdVariantPreview kind="checkbox" />,
  },
  {
    key: 'radio',
    title: '单选框 Radio',
    name: 'Radio',
    description: '工程组件覆盖基础圆形单选、可交互组、胶囊单选和卡片单选，并包含悬停、选中及禁用状态。',
    docRef: 'MasterGo / 单选框基础控件（1763:45539）、胶囊单选（1763:45939）、卡片单选（1763:45971）',
    codeRef: 'packages/ui/src/components/radio/CompanyRadio.tsx',
    code: `<CompanyRadio value="enabled">启用</CompanyRadio>
<CompanyRadioPillGroup value={value} options={options} />
<CompanyRadioGroup value={value} onChange={onChange}>
  <CompanyRadioCard value="terminal" title="终端安全策略" description="策略说明" />
  <CompanyRadioCard value="custom" title="自定义防护策略" description="策略说明" />
</CompanyRadioGroup>`,
    preview: <AntdVariantPreview kind="radio" />,
  },
  {
    key: 'select',
    title: '选择器 Select',
    name: 'Select',
    description: '工程组件覆盖小、中、大三种尺寸，单选、多选、展开、加载、完成、悬停、激活、报错与禁用状态。',
    docRef: 'MasterGo / Select 选择器（105:33663）',
    codeRef: 'packages/ui/src/components/select/CompanySelect.tsx',
    code: `<CompanySelect companySize="regular" options={options} />
<CompanySelect mode="multiple" value={values} onChange={setValues} options={options} />
<CompanySelect visualState="loading" value="code" options={options} />`,
    preview: <AntdVariantPreview kind="select" />,
  },
  {
    key: 'time-picker',
    title: '时间选择框 TimePicker',
    name: 'TimePicker',
    description: '工程组件覆盖单时间、时间区间、小中大尺寸、填写状态、悬停、聚焦、输入、清空和禁用，并内置规范时间面板。',
    docRef: 'MasterGo / 时间选择器（2762:49080）、时间选择下拉（2803:46939）',
    codeRef: 'packages/ui/src/components/time-picker/CompanyTimePicker.tsx',
    code: `<CompanyTimePicker companySize="regular" />
<CompanyTimeRangePicker value={rangeValue} onChange={setRangeValue} />
<CompanyTimePicker visualState="focused" open />`,
    preview: <AntdVariantPreview kind="time-picker" />,
  },
  {
    key: 'transfer',
    title: '穿梭框 Transfer',
    name: 'Transfer',
    description: '工程组件覆盖默认、搜索、空状态、禁用与左右迁移状态，面板、复选项、搜索框和操作按钮均复用底层公司组件。',
    docRef: 'MasterGo / Transfer 穿梭框（2803:95018）、独立穿梭框（2803:92518）',
    codeRef: 'packages/ui/src/components/transfer/CompanyTransfer.tsx',
    code: `<CompanyTransfer
  dataSource={items}
  targetKeys={targetKeys}
  onChange={setTargetKeys}
  showSearch
/>`,
    preview: <AntdVariantPreview kind="transfer" />,
  },
  {
    key: 'tree-select',
    title: '树选择 TreeSelect',
    name: 'TreeSelect',
    description: '工程组件覆盖基本树、多选框树、展开收起、悬停、选中与禁用节点；面板行高、缩进、内边距和圆角来自 MasterGo 组件实例。',
    docRef: 'MasterGo / 树选择组件集（2841:51417），基本样式（2841:51352），多选框样式（2841:51309）',
    codeRef: 'packages/ui/src/components/tree-select/CompanyTreeSelect.tsx',
    code: `<CompanyTreeSelect
  value={value}
  onChange={setValue}
  treeData={treeData}
  treeDefaultExpandedKeys={['root']}
  multiple
/>`,
    preview: <AntdVariantPreview kind="tree-select" />,
  },
  {
    key: 'upload',
    title: '上传 Upload',
    name: 'Upload',
    description: '工程组件覆盖文件上传、拖拽上传、图片上传、上传对话框和导入进度，包含完成、上传中、暂停、失败、悬停和禁用状态。',
    docRef: 'MasterGo / 导入文件（10048:98487）、上传对话框（10257:84211）、拖拽上传（2471:68284）、图片上传（2471:68228）、文件上传（2471:68153）',
    codeRef: 'packages/ui/src/components/upload/',
    code: `<CompanyUpload defaultFiles={files} />
<CompanyUploadDragger visualState="hover" />
<CompanyPictureUpload defaultValue={pictures} />
<CompanyUploadDialog state="uploading" />
<CompanyImportProgress percent={65} />`,
    preview: <AntdVariantPreview kind="upload" />,
  },
  {
    key: 'form',
    title: '表单 Form',
    name: 'Form',
    description: '工程组件覆盖左对齐、右对齐、顶对齐、筛选组合、搜索条、分类表单、动态添加、表格有数据与空状态，并提供真实校验、增删和选择交互。',
    docRef: 'MasterGo / 筛选项组合场景（11998:091117）、分类表单（11998:096422）、添加（sa1584:66013）、表格（sa1584:58957）、表单组件集（147:25598）',
    codeRef: 'packages/ui/src/components/form/',
    code: `<CompanyForm alignment="right" onFinish={save}>
  <CompanyFormItem label="策略名称" name="name" required>
    <CompanyInput placeholder="请输入策略名称" />
  </CompanyFormItem>
</CompanyForm>

<CompanyFilterForm variant="section" onSearch={search} onReset={reset}>
  <CompanyFilterField label="事件名称"><CompanyInput /></CompanyFilterField>
</CompanyFilterForm>

<CompanyDynamicForm variant="table" />`,
    preview: <AntdVariantPreview kind="form" />,
  },
  {
    key: 'slider',
    title: '滑动输入条 Slider',
    name: 'Slider',
    description: '工程组件覆盖单值、范围、刻度标签、自定义数字、自定义范围、悬停和禁用状态，数值输入与滑块双向联动。',
    docRef: 'MasterGo / 滑动输入条组件集（2888:50576）、数值区间（2888:48316）',
    codeRef: 'packages/ui/src/components/slider/CompanySlider.tsx',
    code: `<CompanySlider defaultValue={32} />
<CompanySlider range defaultValue={[16, 32]} />
<CompanySlider min={10} max={50} showMarks markValues={[10, 20, 30, 40, 50]} />
<CompanySlider range showInput defaultValue={[16, 32]} />`,
    preview: <AntdVariantPreview kind="slider" />,
  },
  {
    key: 'switch',
    title: '开关 Switch',
    name: 'Switch',
    description: '工程组件覆盖大号、小号的开关与失效状态，启用实例支持直接切换。',
    docRef: 'MasterGo / 开关组件集（90:30339）',
    codeRef: 'packages/ui/src/components/switch/CompanySwitch.tsx',
    code: `<CompanySwitch size="large" defaultChecked />
<CompanySwitch size="small" />
<CompanySwitch size="large" checked disabled />`,
    preview: <AntdVariantPreview kind="switch" />,
  },
  {
    key: 'dropdown',
    title: '下拉菜单 Dropdown',
    name: 'Dropdown',
    description: '工程组件覆盖 MasterGo 自定义多选下拉和选择器式通用菜单，并统一默认、悬停、选中与失效状态。',
    docRef: 'MasterGo / 自定义下拉（1318:28334）；Select 下拉菜单规范',
    codeRef: 'packages/ui/src/components/dropdown/CompanyDropdown.tsx',
    code: `<CompanyDropdown variant="custom" popupRender={() => <CustomPanel />}>
  <Button>自定义下拉菜单</Button>
</CompanyDropdown>
<CompanyDropdown variant="menu" menu={{ items, selectable: true }}>
  <Button>通用下拉菜单</Button>
</CompanyDropdown>`,
    preview: <AntdVariantPreview kind="dropdown" />,
  },
  {
    key: 'pagination',
    title: '分页 Pagination',
    name: 'Pagination',
    description: '完整分页按总数、每页条数、页码轨道和跳页顺序展示；位于表格底部右侧，Loading/empty/error 隐藏。',
    docRef: 'docs/specs/design-system-spec.md / 6.5 分页（Pagination）',
    codeRef: 'packages/ui/src/components/pagination/CompanyPagination.tsx',
    code: `<CompanyPagination
  current={page}
  total={4568}
  pageSize={10}
  pageSizeOptions={[10, 20, 50, 100]}
  showTotal
  showSizeChanger
  showQuickJumper
  onChange={setPage}
/>`,
    preview: <AntdVariantPreview kind="pagination" />,
  },
  {
    key: 'steps',
    title: '步骤条 Steps',
    name: 'Steps',
    description: '用于有明确先后依赖的流程，当前步骤与完成状态需要稳定表达。',
    docRef: 'docs/specs/design-system-spec.md / 7.5 分步流程页',
    codeRef: sourceTheme('Steps'),
    code: themeCode('Steps', `  iconSize: 32,
  iconFontSize: 16,
  iconSizeSM: 24,
  navArrowColor: token.colorTextTertiary,`),
    preview: <AntdVariantPreview kind="steps" />,
  },
  {
    key: 'breadcrumb',
    title: '面包屑 Breadcrumb',
    name: 'Breadcrumb',
    description: '用于表达当前位置，末级文字使用正文色，前级链接使用次要文字色。',
    docRef: 'docs/specs/design-system-spec.md / 7. 页面类型设计规范、9. 设计输出要求',
    codeRef: sourceTheme('Breadcrumb'),
    code: themeCode('Breadcrumb', `  itemColor: token.colorTextTertiary,
  linkColor: token.colorTextSecondary,
  linkHoverColor: token.colorPrimary,
  lastItemColor: token.colorText,`),
    preview: <AntdVariantPreview kind="breadcrumb" />,
  },
  {
    key: 'menu',
    title: '导航菜单 Menu',
    name: 'Menu',
    description: '导航选中态使用品牌浅色背景和主色文字，保证当前页面位置明确。',
    docRef: 'docs/specs/design-system-spec.md / 7. 页面类型设计规范',
    codeRef: sourceTheme('Menu'),
    code: themeCode('Menu', `  itemSelectedColor: token.colorPrimary,
  itemSelectedBg: token.colorPrimaryBg,
  itemHeight: 40,
  itemMarginBlock: COMPANY_SPACE[4],`),
    preview: <AntdVariantPreview kind="menu" />,
  },
  {
    key: 'page-header',
    title: '页头 PageHeader',
    name: 'PageHeader',
    description: '页头承载标题、面包屑和页面级操作，操作区与标题区保持稳定。',
    docRef: 'docs/specs/design-system-spec.md / 7. 页面类型设计规范',
    codeRef: 'packages/ui/src/components/page-header/CompanyPageHeader.tsx',
    code: `<Header className="app-header">
  <Breadcrumb items={[{ title: '组件资源' }, { title }]} />
  <Space className="header-actions">...</Space>
</Header>`,
    preview: <CompanyPageHeader
      breadcrumbItems={[{ title: '组件资源' }, { title: '页头' }]}
      actions={<><CompanyButton variant="auxiliary">取消</CompanyButton><CompanyButton variant="primary">保存</CompanyButton></>}
    />,
  },
  {
    key: 'tabs',
    title: '标签页 Tabs',
    name: 'Tabs',
    description: '用于同级内容切换，选中态使用品牌主色和底部指示线。',
    docRef: 'docs/specs/design-system-spec.md / 7.2 表单页、Tabs 切换',
    codeRef: sourceTheme('Tabs'),
    code: themeCode('Tabs', `  inkBarColor: token.colorPrimary,
  itemColor: token.colorTextSecondary,
  itemSelectedColor: color('Brand 品牌/p6', mode),
  horizontalItemPadding: \`\${COMPANY_SPACE[12]}px 0\`,`),
    preview: <AntdVariantPreview kind="tabs" />,
  },
  {
    key: 'card',
    title: '卡片 Card',
    name: 'Card',
    description: '工程卡片覆盖带边框与无边框两种实例，标题、分割线和正文间距均来自 MasterGo 组件。',
    docRef: 'MasterGo / Card 卡片组件集（1361:070541）',
    codeRef: 'packages/ui/src/components/card/CompanyCard.tsx',
    code: `<CompanyCard title="卡片标题" bordered>
  卡片内容文字
</CompanyCard>
<CompanyCard title="卡片标题" bordered={false}>
  卡片内容文字
</CompanyCard>`,
    preview: <AntdVariantPreview kind="card" />,
  },
  {
    key: 'popover',
    title: '气泡卡片 Popover',
    name: 'Popover',
    description: '工程气泡卡片覆盖 12 个方位、带链接与无链接实例，并支持点击、悬停等触发方式。',
    docRef: 'MasterGo / Popover 气泡卡片组件集（1354:34178）',
    codeRef: 'packages/ui/src/components/popover/CompanyPopover.tsx',
    code: `<CompanyPopover
  title="这是一个标题"
  content="气泡式卡片浮层"
  placement="topLeft"
  withLink
>
  <CompanyButton>查看说明</CompanyButton>
</CompanyPopover>`,
    preview: <AntdVariantPreview kind="popover" />,
  },
  {
    key: 'tag',
    title: '标签 Tag',
    name: 'Tag',
    description: '标签体系包含基础、可编辑、语义、等级与状态、印章、角标和版权标识，并按业务语义选择对应形式。',
    docRef: 'MasterGo / 标签、可编辑标签、等级和状态标签、印章、角标、版权状态、版权信息',
    codeRef: 'packages/ui/src/components/tags/CompanyTags.tsx',
    code: `import { CompanyTag, EditableTag, EditableTagGroup, CornerBadge } from '@company/ui/tags';

<CompanyTag tone="danger" variant="light" closable onClose={handleClose}>严重</CompanyTag>
<CompanyTag tone="success" variant="icon" icon={companyIcons.success}>处置完成</CompanyTag>
<EditableTag value={name} onChange={setName} onConfirm={saveName} />
<EditableTag mode="select" value={status} options={statusOptions} onChange={setStatus} />
<EditableTagGroup onChange={setTags} />
<CornerBadge direction="right" tone="warning">橙色</CornerBadge>`,
    preview: <TagShowcase />,
  },
  {
    key: 'statistic',
    title: '统计数值 Statistic',
    name: 'Statistic',
    description: '工程统计数组件覆盖升降趋势、对齐、比率拆分、工单状态、汇总、矩阵与图标概览实例。',
    docRef: 'MasterGo / .统计数值组件集（sa1861:57498）',
    codeRef: 'packages/ui/src/components/statistic/CompanyStatistic.tsx',
    code: `<CompanyStatistic variant="trend-up" title="请求次数(次)" value={12346} />
<CompanyStatistic variant="rate" title="阻断率" value={84} suffix="%" items={rateItems} />
<CompanyStatistic variant="ticket-selected" title="待处置工单" value={25} onClick={selectMetric} />`,
    preview: <AntdVariantPreview kind="statistic" />,
  },
  {
    key: 'tooltip',
    title: '文字提示 Tooltip',
    name: 'Tooltip',
    description: '工程文字提示覆盖上、下、左、右共 12 个方向，并支持悬停、聚焦与点击触发。',
    docRef: 'MasterGo / 4.数据展示文字提示组件集（1298:42641）',
    codeRef: 'packages/ui/src/components/tooltip/CompanyTooltip.tsx',
    code: `<CompanyTooltip title="文字提示内容" placement="topLeft">
  <CompanyButton icon={<CompanyIcon type={companyIcons.help} />} aria-label="查看提示" />
</CompanyTooltip>`,
    preview: <AntdVariantPreview kind="tooltip" />,
  },
  {
    key: 'badge',
    title: '徽标数 Badge',
    name: 'Badge',
    description: '工程徽标数组件包含数字和圆点两个真实实例，数字支持动态计数、清零和溢出上限。',
    docRef: 'MasterGo / 徽标数组件集（2483:57250）',
    codeRef: 'packages/ui/src/components/badge/CompanyBadge.tsx',
    code: `<CompanyBadge count={messageCount} overflowCount={999}>
  <CompanyButton icon={<CompanyIcon type={companyIcons.message} />} aria-label="消息" />
</CompanyBadge>
<CompanyBadge dot><span>新消息</span></CompanyBadge>`,
    preview: <AntdVariantPreview kind="badge" />,
  },
  {
    key: 'collapse',
    title: '折叠面板 Collapse',
    name: 'Collapse',
    description: '工程折叠面板覆盖箭头左/右、默认、悬停、禁用和展开状态，并使用统一下箭头图标。',
    docRef: 'MasterGo / 折叠面板组件集（1763:46443）',
    codeRef: 'packages/ui/src/components/collapse/CompanyCollapse.tsx',
    code: `<CompanyCollapse
  arrowPosition="left"
  defaultActiveKey={['security-policy']}
  items={[{ key: 'security-policy', label: '折叠面板标题', children: '配置内容' }]}
/>`,
    preview: <AntdVariantPreview kind="collapse" />,
  },
  {
    key: 'descriptions',
    title: '描述列表 Descriptions',
    name: 'Descriptions',
    description: '工程描述列表覆盖固定间距、左对齐、标签右对齐和四列表格式详情。',
    docRef: 'MasterGo / Description 描述文本（2803:95726）、DescriptionChart-描述列表（sa1639:52521）',
    codeRef: 'packages/ui/src/components/descriptions/CompanyDescriptions.tsx',
    code: `<CompanyDescriptions
  title="这里展示标题"
  variant="aligned"
  items={[{ key: 'ip', label: '被攻击者IP', children: '192.168.100.123' }]}
/>`,
    preview: <AntdVariantPreview kind="descriptions" />,
  },
  {
    key: 'table',
    title: '表格 Table',
    name: 'Table',
    description: '工程表格覆盖 11 类列数据、大/小尺寸、选择、斑马纹、加载和空状态，滚动限定在表格主体。',
    docRef: 'MasterGo / 列表列 Table Column 组件集（12836:030861）',
    codeRef: 'packages/ui/src/components/table/CompanyTable.tsx',
    code: `<CompanyTable
  size="small"
  sticky
  rowSelection={{}}
  columns={columns}
  dataSource={dataSource}
  scroll={{ x: 1180, y: 240 }}
/>`,
    preview: <AntdVariantPreview kind="table" />,
  },
  {
    key: 'timeline',
    title: '时间轴 Timeline',
    name: 'Timeline',
    description: '工程时间轴覆盖默认左/右、图标左/右、居中交错和倒序，状态圆点统一为 10px。',
    docRef: 'MasterGo / 圆点（2471:70079）、时间轴（2471:70290）、示例（2841:020485）',
    codeRef: 'packages/ui/src/components/timeline/CompanyTimeline.tsx',
    code: `<CompanyTimeline
  placement="alternate"
  marker="dot"
  items={[{ key: 'created', date: '2026-08-12', children: '创建策略', color: 'blue' }]}
/>`,
    preview: <AntdVariantPreview kind="timeline" />,
  },
  {
    key: 'tree',
    title: '树形控件 Tree',
    name: 'Tree',
    description: '工程树覆盖基本、多选框、展开收起、悬停、选中与禁用状态；节点高度、层级缩进、箭头和复选框尺寸均来自 MasterGo 实例。',
    docRef: 'MasterGo / 树形控件-基本控件（1763:38586）、树形控件（2713:62191）',
    codeRef: 'packages/ui/src/components/tree/CompanyTree.tsx',
    code: `<CompanyTree
  variant="checkbox"
  treeData={treeData}
  defaultExpandedKeys={['root', 'branch-open']}
  defaultCheckedKeys={['selected-node']}
/>`,
    preview: <AntdVariantPreview kind="tree" />,
  },
  {
    key: 'alert',
    title: '警告提示 Alert',
    name: 'Alert',
    description: '用于页面内可见提示和风险说明，语义色根据 success/warning/error/info 映射。',
    docRef: 'docs/specs/design-system-spec.md / 8. 交互状态与反馈规范',
    codeRef: sourceTheme('Alert'),
    code: themeCode('Alert', `  defaultPadding: \`\${COMPANY_SPACE[9]}px \${COMPANY_SPACE[12]}px\`,
  withDescriptionPadding: \`\${COMPANY_SPACE[16]}px\`,
  withDescriptionIconSize: 20,`),
    preview: <AntdVariantPreview kind="alert" />,
  },
  {
    key: 'message',
    title: '全局提示 Message',
    name: 'Message',
    description: '用于操作结果的轻量反馈，文案需说明成功、失败或处理中状态。',
    docRef: 'docs/specs/design-system-spec.md / 8.5 Success / Failure',
    codeRef: `${appSource} / AntdApp.useApp().message`,
    code: `const { message: appMessage } = AntdApp.useApp();
appMessage.success('安全策略已创建');`,
    preview: <AntdVariantPreview kind="message" />,
  },
  {
    key: 'notification',
    title: '通知提醒框 Notification',
    name: 'Notification',
    description: '用于更完整的系统级提醒，需要标题、正文和明确状态。',
    docRef: 'docs/specs/design-system-spec.md / 8. 交互状态与反馈规范',
    codeRef: `${appSource} / Antd App context`,
    code: `<AntApp>
  <App />
</AntApp>`,
    preview: <AntdVariantPreview kind="notification" />,
  },
  {
    key: 'modal',
    title: '对话框 Modal',
    name: 'Modal',
    description: '对话框用于少量确认或轻量补充信息，标题、内容和底部操作区清晰分离。',
    docRef: 'docs/specs/design-system-spec.md / 2.3 对话框与抽屉、6.8 对话框',
    codeRef: sourceTheme('Modal'),
    code: themeCode('Modal', `  headerBg: token.colorBgContainer,
  contentBg: token.colorBgContainer,
  footerBg: token.colorBgContainer,
  titleFontSize: 16,`),
    preview: <AntdVariantPreview kind="modal" />,
  },
  {
    key: 'popconfirm',
    title: '气泡确认框 Popconfirm',
    name: 'Popconfirm',
    description: '用于局部轻量确认；删除、禁用等高风险操作仍需明确影响说明。',
    docRef: 'docs/specs/design-system-spec.md / 8.6 Confirm',
    codeRef: `${appSource} / Popconfirm usage pattern`,
    code: `<Popconfirm title="确认删除该项？" okText="确定" cancelText="取消">
  <Button danger>删除</Button>
</Popconfirm>`,
    preview: <AntdVariantPreview kind="popconfirm" />,
  },
  {
    key: 'drawer',
    title: '抽屉 Drawer',
    name: 'Drawer',
    description: '抽屉用于详情查看、复杂编辑和上下文连续操作，宽度按复杂度选择 560/880/80%。',
    docRef: 'docs/specs/design-system-spec.md / 2.3 对话框与抽屉、7.2 抽屉表单要求',
    codeRef: sourceTheme('Drawer'),
    code: themeCode('Drawer', `  zIndexPopup: 1050,
  footerPaddingBlock: COMPANY_SPACE[12],
  footerPaddingInline: COMPANY_SPACE[24],`),
    preview: <AntdVariantPreview kind="drawer" />,
  },
  {
    key: 'progress',
    title: '进度 Progress',
    name: 'Progress',
    description: '用于进度、覆盖率和完成度表达，轨道色使用分割线灰阶。',
    docRef: 'docs/specs/design-system-spec.md / 8.2 Loading、7.4 工作台 / Dashboard',
    codeRef: sourceTheme('Progress'),
    code: themeCode('Progress', `  defaultColor: token.colorPrimary,
  remainingColor: token.colorBorderSecondary,
  lineBorderRadius: radius('圆角 4px', mode),`),
    preview: <AntdVariantPreview kind="progress" />,
  },
  {
    key: 'spin',
    title: '加载动效 Loading Ring',
    name: 'CompanyLoadingRing',
    description: '蓝色圆弧沿灰色底环持续旋转，用于发送、请求和内容加载状态。',
    docRef: 'docs/specs/design-system-spec.md / 8.2 Loading',
    codeRef: 'packages/ui/src/components/loading/CompanyLoadingRing.tsx',
    code: `<CompanyLoadingRing size={16} ariaLabel="数据加载中" />`,
    preview: <LoadingRingShowcase />,
  },
  {
    key: 'exception',
    title: '异常界面',
    name: 'Exception',
    description: '异常状态应说明原因并提供可恢复操作，例如重试或返回。',
    docRef: 'docs/specs/design-system-spec.md / 8.4 Error、7.6 异常页',
    codeRef: 'packages/ui/src/components/status-state/CompanyStatusState.tsx',
    code: `<img src="/assets/visual/error-server.svg" alt="服务器连接失败" />`,
    preview: <CompanyExceptionState image="/assets/visual/error-server.svg" title="服务器连接失败" actionLabel="重新连接" />,
  },
  {
    key: 'empty',
    title: '空状态 Empty',
    name: 'Empty',
    description: '列表空状态保留表头，内容区展示明确提示，分页隐藏。',
    docRef: 'docs/specs/design-system-spec.md / 8.3 Empty',
    codeRef: '视觉资源 / 缺省图 / 通用类暂无数据.svg',
    code: `<Empty image="/assets/visual/empty-general.svg" description="暂无更多数据" />`,
    preview: <AntdVariantPreview kind="empty" />,
  },
  {
    key: 'data-loading',
    title: '数据加载',
    name: 'Data Loading',
    description: '用于表格刷新、筛选、排序和分页期间的数据加载反馈。',
    docRef: 'docs/specs/design-system-spec.md / 8.2 Loading、7.1 列表页状态要求',
    codeRef: 'packages/ui/src/components/status-state/CompanyStatusState.tsx',
    code: `<div className="data-loading"><img src="/assets/visual/loading.gif" alt="数据加载中" /></div>`,
    preview: <CompanyDataLoadingState columns={['字段', '状态', '更新时间']} image="/assets/visual/loading.gif" />,
  },
];

const byKey = Object.fromEntries(entries.map((entry) => [entry.key, entry])) as Record<string, ComponentCatalogEntry>;

export const defaultComponentKey = 'layout';

export const componentCatalogByKey = byKey;

export type ComponentSourceKind = 'company' | 'antd' | 'composed' | 'asset' | 'static';

const companyComponentKeys = new Set(['global-style', 'icon', 'button', 'search-panel', 'tag', 'spin']);
const composedPreviewKeys = new Set(['layout', 'list-page-pattern', 'form-page-pattern', 'detail-page-pattern', 'dashboard-page-pattern', 'page-header']);
const assetPreviewKeys = new Set(['icon-3d', 'exception', 'data-loading']);
const staticPreviewKeys = new Set<string>();

export function getComponentSourceInfo(key: string): { kind: ComponentSourceKind; label: string; standalone: boolean } {
  const entry = byKey[key];
  if (companyComponentKeys.has(key) || entry?.codeRef.startsWith('packages/ui/')) {
    return { kind: 'company', label: '工程封装组件', standalone: true };
  }
  if (composedPreviewKeys.has(key)) return { kind: 'composed', label: '工程组件组合示例', standalone: false };
  if (assetPreviewKeys.has(key)) return { kind: 'asset', label: '视觉资源库', standalone: false };
  if (staticPreviewKeys.has(key)) return { kind: 'static', label: '模拟示例', standalone: false };
  return { kind: 'antd', label: 'Ant Design 工程组件', standalone: true };
}

export const componentGroups: ComponentCatalogGroup[] = [
  { key: 'global', title: '全局样式', children: [byKey['global-style']] },
  {
    key: 'common',
    title: '通用',
    children: [
      {
        key: 'business-layout',
        title: '业务页面架构',
        children: [
          byKey.layout,
          byKey['list-page-pattern'],
          byKey['form-page-pattern'],
          byKey['detail-page-pattern'],
          byKey['dashboard-page-pattern'],
          byKey.icon,
          byKey.button,
          byKey['icon-3d'],
        ],
      },
      byKey['search-panel'],
    ],
  },
  {
    key: 'data-entry',
    title: '数据录入',
    children: [
      byKey.input,
      byKey['input-number'],
      byKey['date-picker'],
      byKey.cascader,
      byKey.checkbox,
      byKey.radio,
      byKey.select,
      byKey['time-picker'],
      byKey.transfer,
      byKey['tree-select'],
      byKey.upload,
      byKey.form,
      byKey.slider,
      byKey.switch,
    ],
  },
  {
    key: 'navigation',
    title: '导航',
    children: [byKey.dropdown, byKey.pagination, byKey.steps, byKey.breadcrumb, byKey.menu, byKey['page-header'], byKey.tabs],
  },
  {
    key: 'data-display',
    title: '数据展示',
    children: [byKey.card, byKey.popover, byKey.tag, byKey.statistic, byKey.tooltip, byKey.badge, byKey.collapse, byKey.descriptions, byKey.table, byKey.timeline, byKey.tree],
  },
  {
    key: 'feedback',
    title: '反馈',
    children: [byKey.alert, byKey.message, byKey.notification, byKey.modal, byKey.popconfirm, byKey.drawer, byKey.progress, byKey.spin, byKey.exception, byKey.empty, byKey['data-loading']],
  },
];
