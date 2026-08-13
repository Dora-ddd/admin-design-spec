import type { HTMLAttributes, ReactNode } from 'react';
import './company-business-layout.css';

export type CompanyBusinessLayoutProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  navigation: ReactNode;
  header: ReactNode;
  children: ReactNode;
};

export function CompanyBusinessLayout({
  navigation,
  header,
  children,
  className,
  ...layoutProps
}: CompanyBusinessLayoutProps) {
  const classes = ['company-business-layout', className].filter(Boolean).join(' ');

  return (
    <div {...layoutProps} className={classes}>
      <aside className="company-business-layout__navigation">{navigation}</aside>
      <main className="company-business-layout__main">
        <header className="company-business-layout__header">{header}</header>
        <section className="company-business-layout__content">{children}</section>
      </main>
    </div>
  );
}
