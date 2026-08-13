import { cloneElement, createContext, isValidElement, useContext } from 'react';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { Form, Tooltip } from 'antd';
import type { FormInstance, FormItemProps, FormProps } from 'antd';
import { CompanyIcon, companyIcons } from '../../iconResources';
import { CompanyButton } from '../button';
import './company-form.css';

export type CompanyFormAlignment = 'left' | 'right' | 'top';

type CompanyFormContextValue = {
  alignment: CompanyFormAlignment;
  labelWidth: number;
  disabled: boolean;
};

const CompanyFormContext = createContext<CompanyFormContextValue>({
  alignment: 'right',
  labelWidth: 172,
  disabled: false,
});

export type CompanyFormProps<Values = Record<string, unknown>> = Omit<FormProps<Values>, 'children' | 'layout'> & {
  alignment?: CompanyFormAlignment;
  labelWidth?: number;
  children?: ReactNode;
};

export function CompanyForm<Values = Record<string, unknown>>({
  alignment = 'right',
  labelWidth = 172,
  className,
  children,
  ...formProps
}: CompanyFormProps<Values>) {
  const classes = ['company-form', `company-form--${alignment}`, className].filter(Boolean).join(' ');
  const style = {
    '--company-form-label-width': `${labelWidth}px`,
    ...formProps.style,
  } as CSSProperties;

  return (
    <CompanyFormContext.Provider value={{ alignment, labelWidth, disabled: Boolean(formProps.disabled) }}>
      <Form<Values>
        {...formProps}
        className={classes}
        style={style}
        layout={alignment === 'top' ? 'vertical' : 'horizontal'}
        requiredMark={false}
      >
        {children}
      </Form>
    </CompanyFormContext.Provider>
  );
}

export type CompanyFormItemProps = Omit<FormItemProps, 'children' | 'label' | 'required' | 'tooltip'> & {
  label: ReactNode;
  children: ReactNode;
  required?: boolean;
  helpText?: ReactNode;
  requiredMessage?: string;
};

export function CompanyFormItem({
  label,
  required = false,
  helpText,
  requiredMessage,
  rules,
  className,
  children,
  ...itemProps
}: CompanyFormItemProps) {
  const { alignment, disabled } = useContext(CompanyFormContext);
  const resolvedRules = required
    ? [{ required: true, message: requiredMessage ?? `请输入${typeof label === 'string' ? label : '该字段'}` }, ...(rules ?? [])]
    : rules;
  const labelNode = (
    <span className="company-form-item__label-content">
      {required ? <span className="company-form-item__required" aria-hidden="true">*</span> : null}
      <span className="company-form-item__label-text">{label}</span>
      {helpText ? (
        <Tooltip title={helpText}>
          <span className="company-form-item__help" aria-label="字段说明">
            <CompanyIcon type={companyIcons.help} />
          </span>
        </Tooltip>
      ) : null}
    </span>
  );
  const resolvedChild = disabled && isValidElement(children)
    ? cloneElement(children as ReactElement<{ disabled?: boolean }>, { disabled: true })
    : children;

  return (
    <Form.Item
      {...itemProps}
      className={['company-form-item', `company-form-item--${alignment}`, className].filter(Boolean).join(' ')}
      label={labelNode}
      rules={resolvedRules}
    >
      {resolvedChild}
    </Form.Item>
  );
}

export type CompanyFormSectionProps = {
  title: ReactNode;
  description?: ReactNode;
  level?: 1 | 2;
  children: ReactNode;
  className?: string;
};

export function CompanyFormSection({ title, description, level = 1, children, className }: CompanyFormSectionProps) {
  return (
    <section className={['company-form-section', `company-form-section--level-${level}`, className].filter(Boolean).join(' ')}>
      <header className="company-form-section__heading">
        {level === 1 ? <h3>{title}</h3> : <h4>{title}</h4>}
        {description ? <p>{description}</p> : null}
      </header>
      <div className="company-form-section__content">{children}</div>
    </section>
  );
}

export type CompanyCategorizedFormProps<Values = Record<string, unknown>> = CompanyFormProps<Values> & {
  submitText?: ReactNode;
  resetText?: ReactNode;
  showActions?: boolean;
  form?: FormInstance<Values>;
};

export function CompanyCategorizedForm<Values = Record<string, unknown>>({
  submitText = '保存',
  resetText = '重置',
  showActions = true,
  children,
  ...formProps
}: CompanyCategorizedFormProps<Values>) {
  return (
    <CompanyForm<Values> {...formProps} className={['company-categorized-form', formProps.className].filter(Boolean).join(' ')}>
      {children}
      {showActions ? (
        <div className="company-categorized-form__actions">
          <CompanyButton variant="primary" htmlType="submit">{submitText}</CompanyButton>
          <CompanyButton variant="auxiliary" htmlType="reset">{resetText}</CompanyButton>
        </div>
      ) : null}
    </CompanyForm>
  );
}

export const useCompanyForm = Form.useForm;
