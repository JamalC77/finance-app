import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CFO OS — Summit Ridge Builders',
  description: 'AI-assembled financial dashboard for Summit Ridge Builders',
};

export default function CFOOSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
