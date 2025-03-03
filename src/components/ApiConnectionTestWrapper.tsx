'use client';

import dynamic from 'next/dynamic';

// Import the ApiConnectionTest component with no SSR since it uses browser-only features
const ApiConnectionTest = dynamic(() => import('./ApiConnectionTest'), { ssr: false });

export default function ApiConnectionTestWrapper() {
  return <ApiConnectionTest />;
} 