import { DatePicker } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import { CompanyIcon, companyIcons } from '../../iconResources';
import './company-date-picker.css';

export type CompanyDatePickerSize = 'compact' | 'regular' | 'loose';
export type CompanyDatePickerVisualState = 'default' | 'hover' | 'focused' | 'filled' | 'disabled';
export type CompanyRangePickerProps = GetProps<typeof DatePicker.RangePicker>;

type CompanyPickerCommonProps = {
  companySize?: CompanyDatePickerSize;
  visualState?: CompanyDatePickerVisualState;
};

export type CompanyDatePickerProps = Omit<DatePickerProps, 'size'> & CompanyPickerCommonProps;
export type CompanyDateRangePickerProps = Omit<CompanyRangePickerProps, 'size'> & CompanyPickerCommonProps;

const antSizeByCompanySize: Record<CompanyDatePickerSize, DatePickerProps['size']> = {
  compact: 'small',
  regular: 'middle',
  loose: 'large',
};

function pickerClasses(kind: 'single' | 'range', size: CompanyDatePickerSize | undefined, visualState: CompanyDatePickerVisualState, className?: string) {
  return [
    'company-date-picker',
    `company-date-picker--${kind}`,
    size ? `company-date-picker--${size}` : 'company-date-picker--density',
    `is-${visualState}`,
    className,
  ].filter(Boolean).join(' ');
}

const pickerSuffix = <CompanyIcon type={companyIcons.down} />;

export function CompanyDatePicker({
  companySize,
  visualState = 'default',
  className,
  disabled,
  placeholder = '请选择日期',
  ...pickerProps
}: CompanyDatePickerProps) {
  return <DatePicker
    {...pickerProps}
    className={pickerClasses('single', companySize, visualState, className)}
    size={companySize ? antSizeByCompanySize[companySize] : undefined}
    disabled={disabled || visualState === 'disabled'}
    placeholder={placeholder}
    suffixIcon={pickerSuffix}
    classNames={{ popup: { root: 'company-date-picker-dropdown' } }}
  />;
}

export function CompanyDateRangePicker({
  companySize,
  visualState = 'default',
  className,
  disabled,
  placeholder = ['开始日期', '结束日期'],
  ...pickerProps
}: CompanyDateRangePickerProps) {
  return <DatePicker.RangePicker
    {...pickerProps}
    className={pickerClasses('range', companySize, visualState, className)}
    size={companySize ? antSizeByCompanySize[companySize] : undefined}
    disabled={disabled || visualState === 'disabled'}
    placeholder={placeholder}
    separator={<CompanyIcon type={companyIcons.down} />}
    suffixIcon={pickerSuffix}
    classNames={{ popup: { root: 'company-date-picker-dropdown' } }}
  />;
}
