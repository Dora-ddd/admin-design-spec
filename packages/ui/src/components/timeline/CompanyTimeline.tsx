import type { ReactNode } from 'react';
import { CompanyIcon, companyIcons } from '../../iconResources';
import './company-timeline.css';

export type CompanyTimelineColor = 'blue' | 'red' | 'green' | 'gray';
export type CompanyTimelinePlacement = 'left' | 'right' | 'alternate';
export type CompanyTimelineMarker = 'dot' | 'icon';

export type CompanyTimelineItem = {
  key: string;
  date: ReactNode;
  children: ReactNode;
  color?: CompanyTimelineColor;
  icon?: string;
};

export type CompanyTimelineProps = {
  items: CompanyTimelineItem[];
  placement?: CompanyTimelinePlacement;
  marker?: CompanyTimelineMarker;
  reverse?: boolean;
  className?: string;
};

export function CompanyTimeline({
  items,
  placement = 'left',
  marker = 'dot',
  reverse = false,
  className = '',
}: CompanyTimelineProps) {
  const renderedItems = reverse ? [...items].reverse() : items;

  return <ol className={`company-timeline company-timeline--${placement} company-timeline--${marker} ${className}`.trim()}>
    {renderedItems.map((item, index) => {
      const side = placement === 'alternate' ? (index % 2 === 0 ? 'right' : 'left') : placement;
      return <li className={`company-timeline__item company-timeline__item--${side}`} key={item.key}>
        <span className="company-timeline__axis" aria-hidden="true">
          {marker === 'icon'
            ? <CompanyIcon type={item.icon ?? companyIcons.time} className={`company-timeline__icon is-${item.color ?? 'blue'}`} />
            : <i className={`company-timeline__dot is-${item.color ?? 'blue'}`} />}
          {index < renderedItems.length - 1 && <i className="company-timeline__tail" />}
        </span>
        <span className="company-timeline__content">
          <time>{item.date}</time>
          <span className="company-timeline__text">{item.children}</span>
        </span>
      </li>;
    })}
  </ol>;
}
