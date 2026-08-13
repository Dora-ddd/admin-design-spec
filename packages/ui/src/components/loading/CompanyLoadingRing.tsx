import type { CSSProperties } from 'react';
import './company-loading-ring.css';

export type CompanyLoadingRingProps = {
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  duration?: number;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

type LoadingRingStyle = CSSProperties & {
  '--company-loading-ring-size': string;
  '--company-loading-ring-stroke': string;
  '--company-loading-ring-color': string;
  '--company-loading-ring-track': string;
  '--company-loading-ring-duration': string;
  '--company-loading-ring-reduced-duration': string;
};

export function CompanyLoadingRing({
  size = 16,
  strokeWidth = 2,
  color = '#0e78ff',
  trackColor = 'var(--company-border, #dfe1e6)',
  duration = 800,
  ariaLabel = '加载中',
  className = '',
  style,
}: CompanyLoadingRingProps) {
  const diameter = Math.max(8, size);
  const stroke = Math.min(Math.max(1, strokeWidth), diameter / 3);
  const animationDuration = Math.max(300, duration);
  const componentStyle = {
    ...style,
    '--company-loading-ring-size': `${diameter}px`,
    '--company-loading-ring-stroke': `${stroke}px`,
    '--company-loading-ring-color': color,
    '--company-loading-ring-track': trackColor,
    '--company-loading-ring-duration': `${animationDuration}ms`,
    '--company-loading-ring-reduced-duration': `${animationDuration * 2}ms`,
  } as LoadingRingStyle;

  return <span
    className={`company-loading-ring ${className}`.trim()}
    role="status"
    aria-label={ariaLabel}
    style={componentStyle}
  />;
}
