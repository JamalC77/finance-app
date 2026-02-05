'use client';

import { tokens, fmt, pct, statusColor } from '@/lib/assemblyTokens';

interface FlashPNLProps {
  period: string;
  revenue: number;
  gross_profit: number;
  gross_margin: number;
  ebitda: number;
  ebitda_margin: number;
  net_income: number;
  net_margin: number;
  ytd_revenue: number;
  ytd_net_income: number;
  budget_variance: number;
  revenue_growth_yoy: number;
}

function MetricRow({ label, value, sub, status }: { label: string; value: string; sub?: string; status?: 'green' | 'yellow' | 'red' }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${tokens.spacing.sm} 0`,
        borderBottom: `1px solid ${tokens.colors.border}`,
      }}
    >
      <span style={{ fontFamily: tokens.fonts.body, fontSize: '13px', color: tokens.colors.muted }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
        {status && (
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: statusColor(status),
            }}
          />
        )}
        <span style={{ fontFamily: tokens.fonts.mono, fontSize: '14px', color: tokens.colors.text, fontWeight: 600 }}>
          {value}
        </span>
        {sub && (
          <span style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.dim }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

export function FlashPNL(props: FlashPNLProps) {
  const ebitdaStatus = props.ebitda_margin >= 0.18 ? 'green' : props.ebitda_margin >= 0.12 ? 'yellow' : 'red';

  return (
    <div
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radii.lg,
        padding: tokens.spacing.lg,
      }}
    >
      {/* Top KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
        <div>
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.dim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Revenue</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '22px', fontWeight: 700, color: tokens.colors.text }}>{fmt(props.revenue)}</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.green }}>+{pct(props.revenue_growth_yoy)} YoY</div>
        </div>
        <div>
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.dim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Gross Margin</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '22px', fontWeight: 700, color: tokens.colors.text }}>{pct(props.gross_margin)}</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.muted }}>{fmt(props.gross_profit)}</div>
        </div>
        <div>
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.dim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>EBITDA</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '22px', fontWeight: 700, color: statusColor(ebitdaStatus) }}>{pct(props.ebitda_margin)}</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.muted }}>{fmt(props.ebitda)}</div>
        </div>
        <div>
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.dim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Net Margin</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '22px', fontWeight: 700, color: tokens.colors.text }}>{pct(props.net_margin)}</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.muted }}>{fmt(props.net_income)}</div>
        </div>
      </div>

      {/* Detail rows */}
      <MetricRow label="YTD Revenue" value={fmt(props.ytd_revenue)} />
      <MetricRow label="YTD Net Income" value={fmt(props.ytd_net_income)} />
      <MetricRow
        label="Budget Variance"
        value={`${props.budget_variance >= 0 ? '+' : ''}${pct(props.budget_variance)}`}
        status={props.budget_variance >= 0 ? 'green' : props.budget_variance >= -0.05 ? 'yellow' : 'red'}
      />
    </div>
  );
}
