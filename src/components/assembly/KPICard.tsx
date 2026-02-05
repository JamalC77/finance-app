'use client';

import { tokens, statusColor } from '@/lib/assemblyTokens';
import type { Status } from '@/lib/types/assemblyConfig';

interface KPICardProps {
  label: string;
  value: string;
  status: Status;
  trend?: string;
  sub_text?: string;
}

export function KPICard({ label, value, status, trend, sub_text }: KPICardProps) {
  return (
    <div
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radii.lg,
        padding: tokens.spacing.lg,
        flex: 1,
        minWidth: '180px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: statusColor(status),
            boxShadow: `0 0 8px ${statusColor(status)}40`,
          }}
        />
        <span
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: '12px',
            color: tokens.colors.muted,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: tokens.fonts.mono,
          fontSize: '28px',
          fontWeight: 700,
          color: tokens.colors.text,
          lineHeight: 1.2,
          marginBottom: tokens.spacing.xs,
        }}
      >
        {value}
      </div>
      {(trend || sub_text) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
          {trend && (
            <span
              style={{
                fontFamily: tokens.fonts.mono,
                fontSize: '12px',
                color: trend.startsWith('+') ? tokens.colors.green : trend.startsWith('-') ? tokens.colors.red : tokens.colors.muted,
                fontWeight: 500,
              }}
            >
              {trend}
            </span>
          )}
          {sub_text && (
            <span style={{ fontFamily: tokens.fonts.body, fontSize: '12px', color: tokens.colors.dim }}>
              {sub_text}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
