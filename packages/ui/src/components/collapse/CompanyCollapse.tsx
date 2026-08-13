import type { ReactNode } from 'react';
import { Collapse } from 'antd';
import type { CollapseProps } from 'antd';
import { CompanyIcon, companyIcons } from '../../iconResources';
import './company-collapse.css';

export type CompanyCollapseArrowPosition = 'left' | 'right';

export type CompanyCollapseItem = {
  key: string;
  label: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
};

export type CompanyCollapseProps = {
  items: CompanyCollapseItem[];
  arrowPosition?: CompanyCollapseArrowPosition;
  activeKey?: CollapseProps['activeKey'];
  defaultActiveKey?: CollapseProps['defaultActiveKey'];
  accordion?: boolean;
  className?: string;
  onChange?: CollapseProps['onChange'];
};

export function CompanyCollapse({
  items,
  arrowPosition = 'left',
  activeKey,
  defaultActiveKey,
  accordion = false,
  className = '',
  onChange,
}: CompanyCollapseProps) {
  const collapseItems: CollapseProps['items'] = items.map((item) => ({
    key: item.key,
    label: item.label,
    children: item.children,
    extra: item.extra,
    collapsible: item.disabled ? 'disabled' : undefined,
  }));

  return <Collapse
    className={`company-collapse company-collapse--arrow-${arrowPosition} ${className}`.trim()}
    items={collapseItems}
    activeKey={activeKey}
    defaultActiveKey={defaultActiveKey}
    accordion={accordion}
    expandIconPosition={arrowPosition === 'left' ? 'start' : 'end'}
    expandIcon={({ isActive }) => <CompanyIcon
      type={companyIcons.down}
      className={`company-collapse__arrow ${isActive ? 'is-active' : ''}`}
    />}
    onChange={onChange}
  />;
}
