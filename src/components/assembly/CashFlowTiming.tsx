'use client';

import { tokens, fmt } from '@/lib/assemblyTokens';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface ForecastWeek {
  week: string;
  draws: number;
  commitments: number;
  net: number;
  balance: number;
}

interface CashFlowTimingProps {
  forecast: ForecastWeek[];
  min_balance: number;
  avg_balance: number;
  highlight?: string;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.95)',
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radii.sm,
        padding: '10px 14px',
        fontFamily: tokens.fonts.mono,
        fontSize: '12px',
      }}
    >
      <div style={{ color: tokens.colors.muted, marginBottom: '6px' }}>{label}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ color: entry.color, marginBottom: '2px' }}>
          {entry.name}: {fmt(entry.value)}
        </div>
      ))}
    </div>
  );
}

export function CashFlowTiming({ forecast, min_balance, avg_balance, highlight }: CashFlowTimingProps) {
  const minBalStatus = min_balance >= 300000 ? 'green' : min_balance >= 150000 ? 'yellow' : 'red';

  return (
    <div
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radii.lg,
        padding: tokens.spacing.lg,
      }}
    >
      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
        <div>
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.dim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Min Balance</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '20px', fontWeight: 700, color: tokens.colors[minBalStatus] }}>{fmt(min_balance)}</div>
        </div>
        <div>
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.dim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Avg Balance</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '20px', fontWeight: 700, color: tokens.colors.text }}>{fmt(avg_balance)}</div>
        </div>
        <div>
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.dim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Neg. Cash Weeks</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '20px', fontWeight: 700, color: tokens.colors.yellow }}>
            {forecast.filter((w) => w.net < 0).length} of {forecast.length}
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={forecast} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke={tokens.colors.border} />
          <XAxis
            dataKey="week"
            stroke={tokens.colors.dim}
            fontSize={10}
            fontFamily={tokens.fonts.mono}
            tickLine={false}
            angle={-30}
            textAnchor="end"
            height={50}
          />
          <YAxis
            yAxisId="left"
            stroke={tokens.colors.dim}
            fontSize={11}
            fontFamily={tokens.fonts.mono}
            tickFormatter={(v) => fmt(v)}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={tokens.colors.dim}
            fontSize={11}
            fontFamily={tokens.fonts.mono}
            tickFormatter={(v) => fmt(v)}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine yAxisId="right" y={150000} stroke={tokens.colors.red} strokeDasharray="4 4" strokeOpacity={0.5} />

          <Bar yAxisId="left" dataKey="draws" name="Draws" radius={[3, 3, 0, 0]} barSize={14}>
            {forecast.map((w, i) => (
              <Cell key={i} fill={highlight && w.week.includes(highlight) ? tokens.colors.green : `${tokens.colors.green}70`} />
            ))}
          </Bar>
          <Bar yAxisId="left" dataKey="commitments" name="Commitments" radius={[3, 3, 0, 0]} barSize={14}>
            {forecast.map((w, i) => (
              <Cell key={i} fill={highlight && w.week.includes(highlight) ? tokens.colors.red : `${tokens.colors.red}50`} />
            ))}
          </Bar>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke={tokens.colors.gold}
            strokeWidth={2.5}
            dot={{ r: 3, fill: tokens.colors.gold, stroke: tokens.colors.surface, strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: tokens.spacing.lg, justifyContent: 'center', marginTop: tokens.spacing.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: `${tokens.colors.green}70` }} />
          <span style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.muted }}>Draws (In)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: `${tokens.colors.red}50` }} />
          <span style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.muted }}>Commitments (Out)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '2px', background: tokens.colors.gold }} />
          <span style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.muted }}>Balance</span>
        </div>
      </div>
    </div>
  );
}
