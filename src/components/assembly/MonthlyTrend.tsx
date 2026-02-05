'use client';

import { tokens, fmt } from '@/lib/assemblyTokens';
import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendData {
  month: string;
  revenue: number;
  gross_margin: number;
  net_margin: number;
}

interface MonthlyTrendProps {
  data: TrendData[];
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
          {entry.name}: {entry.name === 'Revenue' ? fmt(entry.value) : `${(entry.value * 100).toFixed(1)}%`}
        </div>
      ))}
    </div>
  );
}

export function MonthlyTrend({ data }: MonthlyTrendProps) {
  return (
    <div
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radii.lg,
        padding: tokens.spacing.lg,
      }}
    >
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${tokens.colors.border}`} />
          <XAxis
            dataKey="month"
            stroke={tokens.colors.dim}
            fontSize={11}
            fontFamily={tokens.fonts.mono}
            tickLine={false}
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
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="Revenue"
            fill={`${tokens.colors.green}60`}
            radius={[4, 4, 0, 0]}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="gross_margin"
            name="Gross Margin"
            stroke={tokens.colors.gold}
            fill={`${tokens.colors.gold}15`}
            strokeWidth={2}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="net_margin"
            name="Net Margin"
            stroke={tokens.colors.muted}
            fill="none"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: tokens.spacing.lg, justifyContent: 'center', marginTop: tokens.spacing.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: `${tokens.colors.green}60` }} />
          <span style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.muted }}>Revenue</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '2px', background: tokens.colors.gold }} />
          <span style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.muted }}>Gross Margin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '2px', background: tokens.colors.muted, borderTop: '1px dashed' }} />
          <span style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.muted }}>Net Margin</span>
        </div>
      </div>
    </div>
  );
}
