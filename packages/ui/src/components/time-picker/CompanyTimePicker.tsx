import { useEffect, useMemo, useRef, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { TimePicker } from 'antd';
import type { GetProps, TimePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { CompanyIcon, companyIcons } from '../../iconResources';
import './company-time-picker.css';

export type CompanyTimePickerSize = 'compact' | 'regular' | 'loose';
export type CompanyTimePickerVisualState = 'default' | 'hover' | 'focused' | 'typing' | 'completed' | 'clear' | 'disabled';
export type CompanyTimeRangePickerProps = GetProps<typeof TimePicker.RangePicker>;

type CompanyTimePickerCommonProps = {
  companySize?: CompanyTimePickerSize;
  visualState?: CompanyTimePickerVisualState;
};

export type CompanyTimePickerProps = Omit<TimePickerProps, 'size'> & CompanyTimePickerCommonProps;
export type CompanyTimeRangeProps = Omit<CompanyTimeRangePickerProps, 'size'> & CompanyTimePickerCommonProps;

const antSizeByCompanySize: Record<CompanyTimePickerSize, TimePickerProps['size']> = {
  compact: 'small',
  regular: 'middle',
  loose: 'large',
};

function pickerClasses(kind: 'single' | 'range', size: CompanyTimePickerSize | undefined, visualState: CompanyTimePickerVisualState, className?: string) {
  return [
    'company-time-picker',
    `company-time-picker--${kind}`,
    size ? `company-time-picker--${size}` : 'company-time-picker--density',
    `is-${visualState}`,
    className,
  ].filter(Boolean).join(' ');
}

const timeSuffix = <CompanyIcon type={companyIcons.time} />;
const rangeSeparator = <span className="company-time-picker__range-separator">~</span>;
const clearIcon = <CloseOutlined />;
const timeUnits = {
  hour: Array.from({ length: 24 }, (_, index) => index),
  minute: Array.from({ length: 60 }, (_, index) => index),
  second: Array.from({ length: 60 }, (_, index) => index),
} as const;

function toTimeRange(value: CompanyTimeRangeProps['value'] | CompanyTimeRangeProps['defaultValue']) {
  return Array.isArray(value) ? [value[0] ?? null, value[1] ?? null] as [Dayjs | null, Dayjs | null] : [null, null] as [Dayjs | null, Dayjs | null];
}

function buildTime(base: Dayjs | null, unit: keyof typeof timeUnits, amount: number) {
  const source = base ?? dayjs().hour(0).minute(0).second(0);

  if (unit === 'hour') return source.hour(amount);
  if (unit === 'minute') return source.minute(amount);
  return source.second(amount);
}

function formatTime(value: Dayjs | null, format: string) {
  return value ? value.format(format) : '';
}

export function CompanyTimePicker({
  companySize,
  visualState = 'default',
  className,
  disabled,
  placeholder = '请选择时间',
  format = 'HH:mm:ss',
  ...pickerProps
}: CompanyTimePickerProps) {
  return <TimePicker
    {...pickerProps}
    className={pickerClasses('single', companySize, visualState, className)}
    size={companySize ? antSizeByCompanySize[companySize] : undefined}
    disabled={disabled || visualState === 'disabled'}
    placeholder={placeholder}
    format={format}
    suffixIcon={timeSuffix}
    allowClear={{ clearIcon }}
    needConfirm
    classNames={{ popup: { root: 'company-time-picker-dropdown company-time-picker-dropdown--single' } }}
  />;
}

export function CompanyTimeRangePicker({
  companySize,
  visualState = 'default',
  className,
  disabled,
  placeholder = ['开始时间', '结束时间'],
  format = 'HH:mm:ss',
  value,
  defaultValue,
  onChange,
  open,
  onOpenChange,
}: CompanyTimeRangeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const formatText = String(format);
  const disabledValue = Array.isArray(disabled) ? disabled.some(Boolean) : Boolean(disabled);
  const isDisabled = disabledValue || visualState === 'disabled';
  const isValueControlled = value !== undefined;
  const isOpenControlled = open !== undefined;
  const [innerValue, setInnerValue] = useState(() => toTimeRange(defaultValue));
  const selectedValue = isValueControlled ? toTimeRange(value) : innerValue;
  const [draftValue, setDraftValue] = useState<[Dayjs | null, Dayjs | null]>(selectedValue);
  const [innerOpen, setInnerOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ left: 0, top: 0 });
  const mergedOpen = isOpenControlled ? Boolean(open) : innerOpen;
  const placeholderText = Array.isArray(placeholder) ? placeholder : ['开始时间', '结束时间'];
  const hasValue = Boolean(selectedValue[0] || selectedValue[1]);
  const rangeClassName = [
    pickerClasses('range', companySize, visualState, className),
    'ant-picker',
    'ant-picker-outlined',
    mergedOpen ? 'ant-picker-focused' : '',
    isDisabled ? 'ant-picker-disabled' : '',
    hasValue ? 'has-value' : '',
  ].filter(Boolean).join(' ');

  const displayValue = useMemo(() => [
    formatTime(selectedValue[0], formatText),
    formatTime(selectedValue[1], formatText),
  ], [formatText, selectedValue]);

  useEffect(() => {
    if (mergedOpen) {
      setDraftValue(selectedValue);
    }
  }, [mergedOpen, selectedValue]);

  useEffect(() => {
    if (!mergedOpen) return;

    const updatePanelPosition = () => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;

      const panelWidth = 560;
      const viewportGap = 16;
      const left = Math.max(viewportGap, Math.min(rect.left, window.innerWidth - panelWidth - viewportGap));
      setPanelPosition({ left, top: rect.bottom + 8 });
    };

    updatePanelPosition();
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);
    return () => {
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [mergedOpen]);

  useEffect(() => {
    if (!mergedOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        if (!isOpenControlled) setInnerOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpenControlled, mergedOpen, onOpenChange]);

  const setOpen = (nextOpen: boolean) => {
    if (isDisabled) return;
    if (!isOpenControlled) setInnerOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const updateDraft = (index: 0 | 1, unit: keyof typeof timeUnits, amount: number) => {
    setDraftValue((current) => {
      const next: [Dayjs | null, Dayjs | null] = [...current];
      next[index] = buildTime(next[index], unit, amount);
      return next;
    });
  };

  const commitDraft = () => {
    const nextValue = draftValue[0] && draftValue[1] ? draftValue as [Dayjs, Dayjs] : null;
    if (!isValueControlled) setInnerValue(toTimeRange(nextValue));
    onChange?.(nextValue, nextValue ? [nextValue[0].format(formatText), nextValue[1].format(formatText)] : ['', '']);
    setOpen(false);
  };

  const clearValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isValueControlled) setInnerValue([null, null]);
    setDraftValue([null, null]);
    onChange?.(null, ['', '']);
  };

  return <div className="company-time-range-field" ref={wrapperRef}>
    <div
      className={rangeClassName}
      role="group"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      onClick={() => setOpen(true)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setOpen(true);
        }
        if (event.key === 'Escape') {
          setOpen(false);
        }
      }}
    >
      <div className="ant-picker-input">
        <input readOnly disabled={isDisabled} placeholder={placeholderText[0]} value={displayValue[0]} />
      </div>
      <div className="ant-picker-separator">{rangeSeparator}</div>
      <div className="ant-picker-input">
        <input readOnly disabled={isDisabled} placeholder={placeholderText[1]} value={displayValue[1]} />
      </div>
      <span className="company-time-picker__range-action">
        {hasValue && !isDisabled && <button className="ant-picker-clear company-time-picker__clear" type="button" aria-label="清空时间区间" onClick={clearValue}>{clearIcon}</button>}
        <span className="ant-picker-suffix">{timeSuffix}</span>
      </span>
    </div>
    {mergedOpen && !isDisabled && <div className="company-time-picker-dropdown company-time-picker-dropdown--range company-time-range-panel" style={panelPosition}>
      <div className="company-time-range-panel__body">
        {(['开始时间', '结束时间'] as const).map((label, index) => <section className="company-time-range-panel__group" key={label}>
          <div className="company-time-range-panel__title">{label}</div>
          <div className="company-time-range-panel__columns">
            {(Object.keys(timeUnits) as Array<keyof typeof timeUnits>).map((unit) => <div className="company-time-range-panel__column" key={`${label}-${unit}`} role="listbox" aria-label={`${label}${unit}`}>
              {timeUnits[unit].map((amount) => {
                const activeValue = draftValue[index]?.[unit]();
                return <button
                  className={activeValue === amount ? 'is-selected' : ''}
                  type="button"
                  role="option"
                  aria-selected={activeValue === amount}
                  key={`${label}-${unit}-${amount}`}
                  onClick={() => updateDraft(index as 0 | 1, unit, amount)}
                >
                  {String(amount).padStart(2, '0')}
                </button>;
              })}
            </div>)}
          </div>
        </section>)}
      </div>
      <div className="company-time-range-panel__footer">
        <button className="company-time-range-panel__confirm" type="button" disabled={!draftValue[0] || !draftValue[1]} onClick={commitDraft}>确定</button>
      </div>
    </div>}
  </div>;
}
