'use client';

import { tokens, fmt, statusColor } from '@/lib/assemblyTokens';

interface WIPSnapshotProps {
  costs_in_excess: number;
  billings_in_excess: number;
  net_position: number;
  net_position_label: string;
  jobs_overbilled: number;
  jobs_underbilled: number;
  highlight?: string;
}

export function WIPSnapshot(props: WIPSnapshotProps) {
  const netStatus = props.net_position > 200000 ? 'red' : props.net_position > 100000 ? 'yellow' : 'green';

  return (
    <div
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radii.lg,
        padding: tokens.spacing.lg,
      }}
    >
      {/* Net position header */}
      <div style={{ textAlign: 'center', marginBottom: tokens.spacing.lg, paddingBottom: tokens.spacing.lg, borderBottom: `1px solid ${tokens.colors.border}` }}>
        <div style={{ fontFamily: tokens.fonts.body, fontSize: '12px', color: tokens.colors.muted, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Net WIP Position
        </div>
        <div style={{ fontFamily: tokens.fonts.mono, fontSize: '32px', fontWeight: 700, color: statusColor(netStatus) }}>
          {fmt(props.net_position)}
        </div>
        <div style={{ fontFamily: tokens.fonts.body, fontSize: '13px', color: statusColor(netStatus), marginTop: '4px' }}>
          {props.net_position_label}
        </div>
      </div>

      {/* Detail grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing.lg }}>
        <div
          style={{
            textAlign: 'center',
            padding: tokens.spacing.md,
            borderRadius: tokens.radii.md,
            ...(props.highlight === 'underbilled' ? {
              border: `1px solid ${tokens.colors.gold}40`,
              boxShadow: `0 0 15px rgba(201, 168, 76, 0.15)`,
            } : {}),
          }}
        >
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.dim, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Costs in Excess
          </div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '20px', fontWeight: 600, color: props.highlight === 'underbilled' ? tokens.colors.gold : tokens.colors.text }}>
            {fmt(props.costs_in_excess)}
          </div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.muted, marginTop: '2px' }}>
            {props.jobs_underbilled} jobs under-billed
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            padding: tokens.spacing.md,
            borderRadius: tokens.radii.md,
            ...(props.highlight === 'overbilled' ? {
              border: `1px solid ${tokens.colors.gold}40`,
              boxShadow: `0 0 15px rgba(201, 168, 76, 0.15)`,
            } : {}),
          }}
        >
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.dim, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Billings in Excess
          </div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '20px', fontWeight: 600, color: props.highlight === 'overbilled' ? tokens.colors.gold : tokens.colors.text }}>
            {fmt(props.billings_in_excess)}
          </div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.muted, marginTop: '2px' }}>
            {props.jobs_overbilled} jobs over-billed
          </div>
        </div>
      </div>
    </div>
  );
}
