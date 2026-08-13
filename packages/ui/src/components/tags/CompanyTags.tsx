import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEventHandler, ReactNode } from 'react';
import { CompanyIcon, companyIcons } from '../../iconResources';
import './company-tags.css';

export type TagTone = 'urgent' | 'danger' | 'high' | 'warning' | 'low' | 'success' | 'info' | 'neutral';
export type CompanyTagVariant = 'basic' | 'light' | 'solid' | 'icon' | 'dot';

export type CompanyTagProps = {
  children: ReactNode;
  tone?: TagTone;
  variant?: CompanyTagVariant;
  icon?: string;
  selected?: boolean;
  closable?: boolean;
  disabled?: boolean;
  className?: string;
  onClose?: MouseEventHandler<HTMLButtonElement>;
};

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function CompanyTag({
  children,
  tone = 'neutral',
  variant = 'basic',
  icon,
  selected = false,
  closable = false,
  disabled = false,
  className,
  onClose,
}: CompanyTagProps) {
  return <span className={classes('company-tag', `company-tag-${variant}`, `tone-${tone}`, selected && 'selected', disabled && 'disabled', className)}>
    {variant === 'dot' && <i className="company-tag-status-dot" aria-hidden="true" />}
    {variant === 'icon' && <CompanyIcon type={icon ?? companyIcons.alertLevel} />}
    <span className="company-tag-label">{children}</span>
    {closable && <button type="button" className="company-tag-close" disabled={disabled} onClick={onClose} aria-label={`关闭${typeof children === 'string' ? children : '标签'}`}>
      <CompanyIcon type={companyIcons.close} />
    </button>}
  </span>;
}

export type EditableTagState = 'default' | 'hover' | 'error' | 'editing';
export type EditableTagMode = 'input' | 'select';
export type EditableTagOption = { label: string; value: string };

export type EditableTagProps = {
  value?: string;
  defaultValue?: string;
  state?: EditableTagState;
  mode?: EditableTagMode;
  options?: EditableTagOption[];
  maxLength?: number;
  errorText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  onBlur?: (value: string) => void;
  onValidationChange?: (valid: boolean) => void;
};

export function EditableTag({
  value,
  defaultValue = '',
  state = 'default',
  mode = 'input',
  options = [],
  maxLength = 10,
  errorText,
  required = false,
  disabled = false,
  className,
  onChange,
  onConfirm,
  onCancel,
  onBlur,
  onValidationChange,
}: EditableTagProps) {
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const [editing, setEditing] = useState(mode === 'input' && state === 'editing');
  const [internalError, setInternalError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentValue = controlled ? value : internalValue;
  const visualState: EditableTagState = internalError ? 'error' : editing ? 'editing' : state === 'editing' ? 'default' : state;

  useEffect(() => {
    setEditing(mode === 'input' && state === 'editing');
  }, [mode, state]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const updateValue = (nextValue: string) => {
    if (!controlled) setInternalValue(nextValue);
    if (nextValue.trim()) {
      setInternalError(false);
      if (mode === 'input' && state === 'editing') setEditing(true);
      onValidationChange?.(true);
    }
    onChange?.(nextValue);
  };

  const validate = (nextValue: string) => {
    const valid = !required || Boolean(nextValue.trim());
    setInternalError(!valid);
    onValidationChange?.(valid);
    return valid;
  };

  const confirm = (nextValue = currentValue) => {
    if (!validate(nextValue)) {
      setEditing(false);
      return;
    }
    setEditing(false);
    onConfirm?.(nextValue);
  };

  const cancel = () => {
    if (!controlled) setInternalValue(defaultValue);
    setInternalError(false);
    setEditing(false);
    onCancel?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') confirm();
    if (event.key === 'Escape') cancel();
  };

  const handleInputBlur = () => {
    confirm();
    onBlur?.(currentValue);
  };

  const handleSelectChange = (nextValue: string) => {
    updateValue(nextValue);
    confirm(nextValue);
  };

  return <span className={classes('company-editable-tag-wrap', className)}>
    <span className={classes('company-editable-tag', `mode-${mode}`, `state-${visualState}`, disabled && 'disabled')}>
      {mode === 'select'
        ? <>
          <select
            value={currentValue}
            disabled={disabled}
            aria-label="切换标签"
            onChange={(event) => handleSelectChange(event.target.value)}
            onBlur={() => onBlur?.(currentValue)}
          >
            {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <CompanyIcon type={companyIcons.down} />
        </>
        : visualState === 'editing' || visualState === 'error'
        ? <input
          ref={inputRef}
          value={currentValue}
          maxLength={maxLength}
          disabled={disabled}
          aria-label="编辑标签"
          aria-invalid={visualState === 'error'}
          onChange={(event) => updateValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
        />
        : <button type="button" className="company-editable-tag-trigger" disabled={disabled} onClick={() => setEditing(true)}>{currentValue}</button>}
      {mode === 'input' && visualState === 'hover' && <CompanyIcon type={companyIcons.down} />}
      {mode === 'input' && (visualState === 'editing' || visualState === 'error') && <span className="company-editable-tag-count">{currentValue.length}/{maxLength}</span>}
      {mode === 'input' && visualState === 'editing' && <>
        <button type="button" className="company-editable-tag-action confirm" onMouseDown={(event) => event.preventDefault()} onClick={() => confirm()} aria-label="确认标签"><CompanyIcon type={companyIcons.confirm} /></button>
        <button type="button" className="company-editable-tag-action" onMouseDown={(event) => event.preventDefault()} onClick={cancel} aria-label="取消编辑"><CompanyIcon type={companyIcons.close} /></button>
      </>}
    </span>
    {visualState === 'error' && (errorText || required) && <small className="company-editable-tag-error">{errorText ?? '标签内容不能为空'}</small>}
  </span>;
}

export type EditableTagItem = { id: string; value: string };

export type EditableTagGroupProps = {
  value?: EditableTagItem[];
  defaultValue?: EditableTagItem[];
  addText?: string;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  onChange?: (items: EditableTagItem[]) => void;
  onAdd?: (item: EditableTagItem) => void;
};

export function EditableTagGroup({
  value,
  defaultValue = [],
  addText = '添加标签',
  maxLength = 10,
  disabled = false,
  className,
  onChange,
  onAdd,
}: EditableTagGroupProps) {
  const controlled = value !== undefined;
  const [internalItems, setInternalItems] = useState(defaultValue);
  const [activeId, setActiveId] = useState<string>();
  const sequence = useRef(0);
  const items = controlled ? value : internalItems;

  const updateItems = (nextItems: EditableTagItem[]) => {
    if (!controlled) setInternalItems(nextItems);
    onChange?.(nextItems);
  };

  const addTag = () => {
    const item = { id: `editable-tag-${Date.now()}-${sequence.current++}`, value: '' };
    updateItems([...items, item]);
    setActiveId(item.id);
    onAdd?.(item);
  };

  const updateTag = (id: string, nextValue: string) => {
    updateItems(items.map((item) => item.id === id ? { ...item, value: nextValue } : item));
  };

  return <div className={classes('company-editable-tag-group', className)}>
    {items.map((item) => <EditableTag
      key={item.id}
      value={item.value}
      state={activeId === item.id ? 'editing' : 'default'}
      maxLength={maxLength}
      required
      disabled={disabled}
      errorText="请输入标签内容"
      onChange={(nextValue) => updateTag(item.id, nextValue)}
      onConfirm={() => setActiveId(undefined)}
    />)}
    <button type="button" className="company-editable-tag-add" disabled={disabled} onClick={addTag}>
      <CompanyIcon type={companyIcons.add} />
      <span>{addText}</span>
    </button>
  </div>;
}

export type StampTagVariant = 'positive' | 'negative' | 'neutral';

export function StampTag({ variant = 'positive', children }: { variant?: StampTagVariant; children?: ReactNode }) {
  const fallback = variant === 'positive' ? '绿 色' : variant === 'negative' ? '红 色' : '灰 色';
  return <span className={`company-stamp-tag ${variant}`}><b>{children ?? fallback}</b></span>;
}

export function CornerBadge({
  children,
  direction = 'left',
  tone = 'neutral',
}: {
  children: ReactNode;
  direction?: 'left' | 'right';
  tone?: TagTone;
}) {
  return <span className={`company-corner-badge ${direction} tone-${tone}`}>{children}</span>;
}

export function LicenseStateTag({ variant = 'formal' }: { variant?: 'formal' | 'trial' }) {
  return <span className={`company-license-state-tag ${variant}`}>{variant === 'formal' ? '正式授权' : '试用授权'}</span>;
}

export type EditionTagVariant = 'enterprise' | 'professional' | 'innovation' | 'portable' | 'enhanced';

const editionLabels: Record<EditionTagVariant, string> = {
  enterprise: '企业版',
  professional: '专业版',
  innovation: '信创版',
  portable: '便携版',
  enhanced: '增强版',
};

export function EditionTag({ variant = 'enterprise', children }: { variant?: EditionTagVariant; children?: ReactNode }) {
  return <span className={`company-edition-tag ${variant}`}>{children ?? editionLabels[variant]}</span>;
}

export function getBusinessTagTone(label: string): TagTone {
  if (['超危', '紧急', '已失陷'].includes(label)) return 'urgent';
  if (['高危', '严重', '高风险'].includes(label)) return 'danger';
  if (['中危', '警告', '中风险'].includes(label)) return 'warning';
  if (['低危', '提醒', '低风险'].includes(label)) return 'low';
  if (label === '信息') return 'info';
  if (label === '无风险') return 'success';
  return 'neutral';
}
