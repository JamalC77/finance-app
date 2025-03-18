import React from 'react';

export const metadata = {
  title: 'API Connection Test',
  description: 'Test API connectivity and CORS configuration',
};

export default function ApiTestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="api-test-layout">
      {children}
    </div>
  );
} 