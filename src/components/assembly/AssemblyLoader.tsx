'use client';

import { useState, useEffect } from 'react';
import { tokens } from '@/lib/assemblyTokens';

const LOADING_STAGES = [
  { delay: 0, message: '' },
  { delay: 500, message: 'Pulling latest financials...' },
  { delay: 2000, message: 'Analyzing your data...' },
  { delay: 3000, message: 'Assembling your dashboard...' },
];

export function AssemblyLoader() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = LOADING_STAGES.map((s, i) => {
      if (i === 0) return null;
      return setTimeout(() => setStage(i), s.delay);
    });

    return () => {
      timers.forEach((t) => t && clearTimeout(t));
    };
  }, []);

  const message = LOADING_STAGES[stage]?.message || '';

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
      }}
    >
      {/* Skeleton */}
      <div style={{ width: '100%', maxWidth: '1200px', padding: tokens.spacing.xl }}>
        {/* Header skeleton */}
        <div style={{ marginBottom: tokens.spacing.xl, paddingBottom: tokens.spacing.lg, borderBottom: `1px solid ${tokens.colors.border}` }}>
          <div style={{ width: '260px', height: '24px', background: tokens.colors.surface, borderRadius: tokens.radii.sm, marginBottom: tokens.spacing.sm }} className="shimmer" />
          <div style={{ width: '180px', height: '14px', background: tokens.colors.surface, borderRadius: tokens.radii.sm }} className="shimmer" />
        </div>

        {/* KPI skeleton row */}
        <div style={{ display: 'flex', gap: tokens.spacing.md, marginBottom: tokens.spacing.xl }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '100px',
                background: tokens.colors.surface,
                border: `1px solid ${tokens.colors.border}`,
                borderRadius: tokens.radii.lg,
              }}
              className="shimmer"
            />
          ))}
        </div>

        {/* Section skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ marginBottom: tokens.spacing.xl }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md, marginBottom: tokens.spacing.md }}>
              <div style={{ width: '3px', height: '16px', background: `${tokens.colors.gold}30`, borderRadius: '2px' }} />
              <div style={{ width: '120px', height: '14px', background: tokens.colors.surface, borderRadius: tokens.radii.sm }} className="shimmer" />
            </div>
            <div
              style={{
                height: i === 2 ? '260px' : '180px',
                background: tokens.colors.surface,
                border: `1px solid ${tokens.colors.border}`,
                borderRadius: tokens.radii.lg,
              }}
              className="shimmer"
            />
          </div>
        ))}
      </div>

      {/* Loading message */}
      <div
        style={{
          position: 'fixed',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.md,
        }}
      >
        <div className="spinner" />
        <span
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: '14px',
            color: tokens.colors.muted,
            transition: 'opacity 0.3s ease',
            opacity: message ? 1 : 0,
          }}
        >
          {message}
        </span>
      </div>

      <style>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            ${tokens.colors.surface} 0%,
            ${tokens.colors.surfaceHover} 50%,
            ${tokens.colors.surface} 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid ${tokens.colors.border};
          border-top-color: ${tokens.colors.gold};
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
