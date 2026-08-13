import type { ReactNode } from 'react';
import './company-descriptions.css';

export type CompanyDescriptionsVariant = 'fixed' | 'left' | 'aligned' | 'table';

export type CompanyDescriptionItem = {
  key: string;
  label: ReactNode;
  children: ReactNode;
};

export type CompanyDescriptionsProps = {
  title?: ReactNode;
  items: CompanyDescriptionItem[];
  variant?: CompanyDescriptionsVariant;
  className?: string;
};

export function CompanyDescriptions({
  title,
  items,
  variant = 'left',
  className = '',
}: CompanyDescriptionsProps) {
  const classes = `company-descriptions company-descriptions--${variant} ${className}`.trim();

  if (variant === 'table') {
    return <section className={classes} aria-label={typeof title === 'string' ? title : '描述列表'}>
      {title && <h3 className="company-descriptions__title">{title}</h3>}
      <dl className="company-descriptions__table">
        {items.map((item) => <div className="company-descriptions__table-pair" key={item.key}>
          <dt>{item.label}</dt>
          <dd>{item.children}</dd>
        </div>)}
      </dl>
    </section>;
  }

  return <section className={classes} aria-label={typeof title === 'string' ? title : '描述列表'}>
    {title && <h3 className="company-descriptions__title">{title}</h3>}
    <dl className="company-descriptions__list">
      {items.map((item) => <div className="company-descriptions__item" key={item.key}>
        <dt>{item.label}</dt>
        <dd>{item.children}</dd>
      </div>)}
    </dl>
  </section>;
}
