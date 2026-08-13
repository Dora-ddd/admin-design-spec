import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { CompanyButton } from '../button';
import { CompanyCheckbox } from '../checkbox';
import { CompanyInput } from '../input';
import { CompanyIcon, companyIcons } from '../../iconResources';
import './company-transfer.css';

export type CompanyTransferItem = {
  key: string;
  title: string;
  disabled?: boolean;
};

export type CompanyTransferProps = {
  dataSource: CompanyTransferItem[];
  targetKeys?: string[];
  defaultTargetKeys?: string[];
  onChange?: (targetKeys: string[]) => void;
  showSearch?: boolean;
  disabled?: boolean;
  leftTitle?: string;
  rightTitle?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
};

type CompanyTransferPanelProps = {
  title: string;
  items: CompanyTransferItem[];
  selectedKeys: string[];
  onSelectedKeysChange: (keys: string[]) => void;
  showSearch?: boolean;
  disabled?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
};

export function CompanyTransferPanel({
  title,
  items,
  selectedKeys,
  onSelectedKeysChange,
  showSearch = false,
  disabled = false,
  searchPlaceholder = '请输入搜索内容',
  emptyText = '暂无数据',
}: CompanyTransferPanelProps) {
  const [keyword, setKeyword] = useState('');
  const visibleItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase();
    return normalizedKeyword
      ? items.filter(({ title: itemTitle }) => itemTitle.toLocaleLowerCase().includes(normalizedKeyword))
      : items;
  }, [items, keyword]);
  const selectableKeys = visibleItems.filter((item) => !item.disabled).map((item) => item.key);
  const selectedVisibleKeys = selectableKeys.filter((key) => selectedKeys.includes(key));
  const allChecked = selectableKeys.length > 0 && selectedVisibleKeys.length === selectableKeys.length;
  const indeterminate = selectedVisibleKeys.length > 0 && !allChecked;

  const toggleAll = () => {
    if (disabled || selectableKeys.length === 0) return;
    if (allChecked) {
      onSelectedKeysChange(selectedKeys.filter((key) => !selectableKeys.includes(key)));
      return;
    }
    onSelectedKeysChange([...new Set([...selectedKeys, ...selectableKeys])]);
  };

  const toggleItem = (key: string) => {
    if (selectedKeys.includes(key)) {
      onSelectedKeysChange(selectedKeys.filter((selectedKey) => selectedKey !== key));
      return;
    }
    onSelectedKeysChange([...selectedKeys, key]);
  };

  return (
    <section className={[
      'company-transfer-panel',
      showSearch ? 'has-search' : '',
      visibleItems.length === 0 ? 'is-empty' : '',
      disabled ? 'is-disabled' : '',
    ].filter(Boolean).join(' ')}>
      <header className="company-transfer-panel__header">
        <CompanyCheckbox
          checked={allChecked}
          indeterminate={indeterminate}
          disabled={disabled || selectableKeys.length === 0}
          onChange={toggleAll}
        >
          <strong>{title} ({items.length} 项)</strong>
        </CompanyCheckbox>
      </header>

      {showSearch ? (
        <div className="company-transfer-panel__search">
          <CompanyInput
            aria-label={`${title}搜索`}
            value={keyword}
            disabled={disabled}
            placeholder={searchPlaceholder}
            suffixIcon={<CompanyIcon type={companyIcons.search} />}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setKeyword(event.target.value)}
          />
        </div>
      ) : null}

      {visibleItems.length > 0 ? (
        <div className="company-transfer-panel__list">
          {visibleItems.map((item) => (
            <label key={item.key} className={['company-transfer-panel__item', item.disabled ? 'is-disabled' : ''].filter(Boolean).join(' ')}>
              <CompanyCheckbox
                checked={selectedKeys.includes(item.key)}
                disabled={disabled || item.disabled}
                onChange={() => toggleItem(item.key)}
              >
                {item.title}
              </CompanyCheckbox>
            </label>
          ))}
        </div>
      ) : (
        <div className="company-transfer-panel__empty">
          <img src="/assets/visual/empty-general.svg" alt="" />
          <span>{emptyText}</span>
        </div>
      )}
    </section>
  );
}

export function CompanyTransfer({
  dataSource,
  targetKeys,
  defaultTargetKeys = [],
  onChange,
  showSearch = false,
  disabled = false,
  leftTitle = '选项合集',
  rightTitle = '选项合集',
  searchPlaceholder,
  emptyText,
  className,
}: CompanyTransferProps) {
  const [innerTargetKeys, setInnerTargetKeys] = useState(defaultTargetKeys);
  const [leftSelectedKeys, setLeftSelectedKeys] = useState<string[]>([]);
  const [rightSelectedKeys, setRightSelectedKeys] = useState<string[]>([]);
  const currentTargetKeys = targetKeys ?? innerTargetKeys;
  const targetKeySet = useMemo(() => new Set(currentTargetKeys), [currentTargetKeys]);
  const leftItems = dataSource.filter(({ key }) => !targetKeySet.has(key));
  const rightItems = dataSource.filter(({ key }) => targetKeySet.has(key));

  const updateTargetKeys = (nextTargetKeys: string[]) => {
    if (targetKeys === undefined) setInnerTargetKeys(nextTargetKeys);
    onChange?.(nextTargetKeys);
  };

  const moveRight = () => {
    if (disabled || leftSelectedKeys.length === 0) return;
    updateTargetKeys([...currentTargetKeys, ...leftSelectedKeys]);
    setLeftSelectedKeys([]);
  };

  const moveLeft = () => {
    if (disabled || rightSelectedKeys.length === 0) return;
    updateTargetKeys(currentTargetKeys.filter((key) => !rightSelectedKeys.includes(key)));
    setRightSelectedKeys([]);
  };

  return (
    <div className={['company-transfer', showSearch ? 'has-search' : '', className].filter(Boolean).join(' ')}>
      <CompanyTransferPanel
        title={leftTitle}
        items={leftItems}
        selectedKeys={leftSelectedKeys}
        onSelectedKeysChange={setLeftSelectedKeys}
        showSearch={showSearch}
        disabled={disabled}
        searchPlaceholder={searchPlaceholder}
        emptyText={emptyText}
      />
      <div className="company-transfer__operations">
        <CompanyButton
          variant={leftSelectedKeys.length > 0 ? 'primary' : 'auxiliary'}
          icon={<CompanyIcon className="company-transfer__arrow is-right" type={companyIcons.down} />}
          aria-label="移至右侧"
          disabled={disabled || leftSelectedKeys.length === 0}
          onClick={moveRight}
        />
        <CompanyButton
          variant={rightSelectedKeys.length > 0 ? 'primary' : 'auxiliary'}
          icon={<CompanyIcon className="company-transfer__arrow is-left" type={companyIcons.down} />}
          aria-label="移至左侧"
          disabled={disabled || rightSelectedKeys.length === 0}
          onClick={moveLeft}
        />
      </div>
      <CompanyTransferPanel
        title={rightTitle}
        items={rightItems}
        selectedKeys={rightSelectedKeys}
        onSelectedKeysChange={setRightSelectedKeys}
        showSearch={showSearch}
        disabled={disabled}
        searchPlaceholder={searchPlaceholder}
        emptyText={emptyText}
      />
    </div>
  );
}
