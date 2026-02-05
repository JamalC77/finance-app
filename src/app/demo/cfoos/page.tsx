'use client';

import { useState, useEffect, useRef } from 'react';
import { tokens } from '@/lib/assemblyTokens';
import type { AssemblyConfig } from '@/lib/types/assemblyConfig';
import { InteractiveCFOOS } from '@/components/assembly/InteractiveCFOOS';
import { AssemblyLoader } from '@/components/assembly/AssemblyLoader';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const MIN_LOADING_MS = 3000;

export default function CFOOSPage() {
  const [config, setConfig] = useState<AssemblyConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startTime = useRef(Date.now());

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    startTime.current = Date.now();

    try {
      const res = await fetch(`${API_URL}/api/assembly/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: 'summit-ridge-demo',
          industry: 'residential_construction',
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      if (!data.success || !data.data) throw new Error('Invalid response');

      // Enforce minimum loading time for UX
      const elapsed = Date.now() - startTime.current;
      if (elapsed < MIN_LOADING_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS - elapsed));
      }

      setConfig(data.data);
    } catch (err: any) {
      console.error('Failed to fetch assembly config:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  if (loading) {
    return <AssemblyLoader />;
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: tokens.colors.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: tokens.fonts.body,
          color: tokens.colors.text,
        }}
      >
        <div
          style={{
            background: tokens.colors.surface,
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: tokens.radii.lg,
            padding: tokens.spacing.xl,
            textAlign: 'center',
            maxWidth: '420px',
          }}
        >
          <div style={{ fontSize: '15px', color: tokens.colors.red, marginBottom: tokens.spacing.md, fontWeight: 600 }}>
            Unable to load dashboard
          </div>
          <div style={{ fontSize: '13px', color: tokens.colors.muted, marginBottom: tokens.spacing.lg, lineHeight: 1.5 }}>
            {error}
          </div>
          <button
            onClick={fetchConfig}
            style={{
              fontFamily: tokens.fonts.body,
              fontSize: '13px',
              fontWeight: 600,
              color: tokens.colors.bg,
              background: tokens.colors.gold,
              border: 'none',
              borderRadius: tokens.radii.md,
              padding: '10px 24px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!config) return null;

  return <InteractiveCFOOS config={config} />;
}
