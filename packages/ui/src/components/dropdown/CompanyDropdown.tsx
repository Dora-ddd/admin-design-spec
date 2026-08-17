import { Dropdown } from 'antd';
import type { DropdownProps } from 'antd';
import './company-dropdown.css';

export type CompanyDropdownVariant = 'menu' | 'custom';

export type CompanyDropdownProps = Omit<DropdownProps, 'classNames'> & {
  variant?: CompanyDropdownVariant;
  popupClassName?: string;
};

export function CompanyDropdown({
  variant = 'menu',
  popupClassName,
  ...dropdownProps
}: CompanyDropdownProps) {
  const rootClassName = [
    'company-dropdown',
    `company-dropdown--${variant}`,
    popupClassName,
  ].filter(Boolean).join(' ');

  return <Dropdown {...dropdownProps} classNames={{ root: rootClassName }} />;
}
