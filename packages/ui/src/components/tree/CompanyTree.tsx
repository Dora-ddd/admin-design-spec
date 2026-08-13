import { Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import { CompanyIcon, companyIcons } from '../../iconResources';
import './company-tree.css';

export type CompanyTreeVariant = 'basic' | 'checkbox';

export type CompanyTreeProps = Omit<TreeProps<TreeDataNode>, 'checkable' | 'switcherIcon'> & {
  variant?: CompanyTreeVariant;
};

export function CompanyTree({
  variant = 'basic',
  className = '',
  blockNode = true,
  ...treeProps
}: CompanyTreeProps) {
  return <Tree
    {...treeProps}
    className={`company-tree company-tree--${variant} ${className}`.trim()}
    blockNode={blockNode}
    checkable={variant === 'checkbox'}
    switcherIcon={<CompanyIcon className="company-tree__switcher-icon" type={companyIcons.down} />}
  />;
}
