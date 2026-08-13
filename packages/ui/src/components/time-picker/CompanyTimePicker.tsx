import { TimePicker } from 'antd';
import type { GetProps, TimePickerProps } from 'antd';
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
const rangeSeparator = <CompanyIcon className="company-time-picker__separator-icon" type={companyIcons.down} />;
const clearIcon = <CompanyIcon type={companyIcons.close} />;

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
    clearIcon={clearIcon}
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
  ...pickerProps
}: CompanyTimeRangeProps) {
  return <TimePicker.RangePicker
    {...pickerProps}
    className={pickerClasses('range', companySize, visualState, className)}
    size={companySize ? antSizeByCompanySize[companySize] : undefined}
    disabled={disabled || visualState === 'disabled'}
    placeholder={placeholder}
    format={format}
    suffixIcon={timeSuffix}
    separator={rangeSeparator}
    clearIcon={clearIcon}
    needConfirm
    classNames={{ popup: { root: 'company-time-picker-dropdown company-time-picker-dropdown--range' } }}
  />;
}
