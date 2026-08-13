import type { HTMLAttributes, ReactNode } from 'react';
import './company-surface.css';

export type CompanySurfaceTone = 'page' | 'content' | 'business';

export type CompanySurfaceProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CompanySurfaceTone;
  indicator?: boolean;
  children?: ReactNode;
};

export function CompanySurface({
  tone = 'business',
  indicator = false,
  className,
  children,
  ...surfaceProps
}: CompanySurfaceProps) {
  const classes = [
    'company-surface',
    `company-surface-${tone}`,
    indicator ? 'company-surface-with-indicator' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div {...surfaceProps} className={classes}>
      {indicator && <span className="company-surface__indicator" aria-hidden="true" />}
      {children && <div className="company-surface__content">{children}</div>}
    </div>
  );
}
