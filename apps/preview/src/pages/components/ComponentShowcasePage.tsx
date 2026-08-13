import { useState } from 'react';
import { App as AntdApp, Button, Space, Tag, Typography } from 'antd';
import { CompanyIcon, companyIcons } from '@company/ui/icons';
import { COMPANY_SPACE } from '@company/theme';
import {
  componentCatalogByKey,
  componentGroups,
  defaultComponentKey,
  getComponentSourceInfo,
  type ComponentCatalogEntry,
  type ComponentCatalogGroup,
} from '../../componentCatalog';

const { Paragraph, Text, Title } = Typography;

function isCatalogGroup(item: ComponentCatalogGroup | ComponentCatalogEntry): item is ComponentCatalogGroup {
  return 'children' in item;
}

function hasCatalogNameInTitle(item: ComponentCatalogEntry) {
  const normalize = (value: string) => value
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
  const title = ` ${normalize(item.title)} `;
  const name = normalize(item.name);

  return name.length > 0 && title.includes(` ${name} `);
}

function CatalogTree({
  items,
  activeKey,
  onSelect,
  depth = 0,
}: {
  items: Array<ComponentCatalogGroup | ComponentCatalogEntry>;
  activeKey: string;
  onSelect: (key: string) => void;
  depth?: number;
}) {
  return <div className="component-catalog-level">
    {items.map((item) => {
      if (isCatalogGroup(item)) {
        return <details className="component-catalog-group" open key={item.key}>
          <summary style={{ paddingLeft: `calc(${depth} * var(--company-space-18px))` }}>
            <CompanyIcon type={companyIcons.down} />
            <span>{item.title}</span>
          </summary>
          <CatalogTree items={item.children} activeKey={activeKey} onSelect={onSelect} depth={depth + 1} />
        </details>;
      }

      return <button
        type="button"
        key={item.key}
        className={`component-catalog-leaf ${activeKey === item.key ? 'active' : ''}`}
        style={{ paddingLeft: `calc(${depth} * var(--company-space-18px) + var(--company-space-24px))` }}
        onClick={() => onSelect(item.key)}
      >
        {item.title} {!hasCatalogNameInTitle(item) && <span>{item.name}</span>}
      </button>;
    })}
  </div>;
}

export default function ComponentShowcasePage() {
  const { message } = AntdApp.useApp();
  const [activeKey, setActiveKey] = useState(defaultComponentKey);
  const activeComponent = componentCatalogByKey[activeKey] ?? componentCatalogByKey[defaultComponentKey];
  const showComponentName = !hasCatalogNameInTitle(activeComponent);
  const sourceInfo = getComponentSourceInfo(activeComponent.key);
  const sourceColor = { company: 'green', antd: 'blue', composed: 'gold', asset: 'cyan', static: 'orange' }[sourceInfo.kind];

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeComponent.code);
      message.success('代码片段已复制');
    } catch {
      message.error('复制失败，请手动选择代码');
    }
  };

  return <div className="component-showcase-page">
    <div className="component-showcase-shell">
      <aside className="component-catalog-panel">
        <CatalogTree items={componentGroups} activeKey={activeKey} onSelect={setActiveKey} />
      </aside>
      <section className="component-detail-panel">
        <div className="component-detail-heading">
          <div>
            <Space size={COMPANY_SPACE[8]}>
              {showComponentName && <Text type="secondary">{activeComponent.name}</Text>}
              <Tag color={sourceColor}>{sourceInfo.label}</Tag>
              <Tag>{sourceInfo.standalone ? '可直接调用' : '组合示例'}</Tag>
            </Space>
            <Title level={3}>{activeComponent.title}</Title>
          </div>
        </div>
        <Paragraph>{activeComponent.description}</Paragraph>
        <section className="component-preview-section">
          <div className="component-section-title"><Text strong>规范样式</Text></div>
          <div className="component-preview-surface">{activeComponent.preview}</div>
        </section>
        <section className="component-development-section">
          <div className="component-section-title">
            <Text strong>开发关联</Text>
            <Button type="text" size="small" icon={<CompanyIcon type={companyIcons.copy} />} onClick={copyCode}>复制代码</Button>
          </div>
          <dl className="component-reference-list">
            <div><dt>规范文档</dt><dd><code>{activeComponent.docRef}</code></dd></div>
            <div><dt>工程源码</dt><dd><code>{activeComponent.codeRef}</code></dd></div>
          </dl>
          <pre className="component-code-snippet"><code>{activeComponent.code}</code></pre>
        </section>
      </section>
    </div>
  </div>;
}
