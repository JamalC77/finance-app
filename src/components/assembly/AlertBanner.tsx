'use client';

import { tokens } from '@/lib/assemblyTokens';

interface AlertBannerProps {
  severity: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
}

const severityColors: Record<string, string> = {
  critical: tokens.colors.red,
  warning: tokens.colors.yellow,
  info: tokens.colors.info,
};

export function AlertBanner({ severity, title, message }: AlertBannerProps) {
  const color = severityColors[severity] || tokens.colors.yellow;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: tokens.spacing.md,
        background: `${color}08`,
        border: `1px solid ${color}30`,
        borderLeft: `3px solid ${color}`,
        borderRadius: tokens.radii.md,
        padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: '13px',
            fontWeight: 600,
            color,
            marginBottom: '4px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: '13px',
            color: tokens.colors.textSecondary,
            lineHeight: 1.5,
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
}
