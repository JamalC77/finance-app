'use client';

import { tokens } from '@/lib/assemblyTokens';

interface SectionHeaderProps {
  title: string;
  badge?: string;
}

export function SectionHeader({ title, badge }: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
      <div style={{ width: '3px', height: '20px', background: tokens.colors.gold, borderRadius: '2px' }} />
      <h3
        style={{
          fontFamily: tokens.fonts.body,
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: tokens.colors.text,
          margin: 0,
        }}
      >
        {title}
      </h3>
      {badge && (
        <span
          style={{
            fontFamily: tokens.fonts.mono,
            fontSize: '11px',
            color: tokens.colors.gold,
            background: tokens.colors.goldDim,
            padding: '2px 8px',
            borderRadius: tokens.radii.sm,
            fontWeight: 500,
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
