import type { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

/** Centred content wrapper — max-width constraint applied here. */
export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="page-layout">
      <div className="container">{children}</div>
    </div>
  );
}
