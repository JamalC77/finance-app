'use client';

import { useState, useMemo } from 'react';
import { tokens, fmt, pct } from '@/lib/assemblyTokens';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ForecastPoint {
  week: string;
  balance: number;
}

interface ScenarioEngineProps {
  base_revenue: number;
  base_margin: number;
  base_forecast: ForecastPoint[];
  defaults: {
    revenue_change: number;
    margin_change: number;
    delay_weeks: number;
  };
}

function Slider({ label, value, min, max, step, unit, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const displayVal = unit === '%' ? `${value >= 0 ? '+' : ''}${value}%` : `${value} ${unit}`;

  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: tokens.spacing.sm }}>
        <span style={{ fontFamily: tokens.fonts.body, fontSize: '13px', color: tokens.colors.muted }}>{label}</span>
        <span
          style={{
            fontFamily: tokens.fonts.mono,
            fontSize: '13px',
            fontWeight: 600,
            color: value === 0 ? tokens.colors.dim : value > 0 && unit !== 'weeks' ? tokens.colors.green : tokens.colors.yellow,
          }}
        >
          {displayVal}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: tokens.colors.gold,
          height: '4px',
          cursor: 'pointer',
        }}
      />
    </div>
  );
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

export function ScenarioEngine({ base_revenue, base_margin, base_forecast, defaults }: ScenarioEngineProps) {
  const [revenueChange, setRevenueChange] = useState(defaults.revenue_change);
  const [marginChange, setMarginChange] = useState(defaults.margin_change);
  const [delayWeeks, setDelayWeeks] = useState(defaults.delay_weeks);

  const scenarioData = useMemo(() => {
    const revMultiplier = 1 + revenueChange / 100;
    const marginDelta = marginChange / 100;

    return base_forecast.map((point, i) => {
      const adjustedBalance = point.balance * revMultiplier * (1 + marginDelta);
      const delayedBalance = i >= delayWeeks
        ? adjustedBalance
        : point.balance * 0.85; // Cash impact from delayed draws

      return {
        week: point.week,
        baseline: point.balance,
        scenario: Math.round(delayWeeks > 0 ? delayedBalance : adjustedBalance),
      };
    });
  }, [base_forecast, revenueChange, marginChange, delayWeeks]);

  const scenarioRevenue = base_revenue * (1 + revenueChange / 100);
  const scenarioMargin = base_margin + marginChange / 100;
  const minScenarioBalance = Math.min(...scenarioData.map((d) => d.scenario));

  return (
    <div
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radii.lg,
        padding: tokens.spacing.lg,
      }}
    >
      {/* Sliders */}
      <div style={{ marginBottom: tokens.spacing.lg }}>
        <Slider
          label="Revenue Change"
          value={revenueChange}
          min={-30}
          max={30}
          step={5}
          unit="%"
          onChange={setRevenueChange}
        />
        <Slider
          label="Margin Change"
          value={marginChange}
          min={-10}
          max={10}
          step={1}
          unit="%"
          onChange={setMarginChange}
        />
        <Slider
          label="Draw Delay"
          value={delayWeeks}
          min={0}
          max={6}
          step={1}
          unit="weeks"
          onChange={setDelayWeeks}
        />
      </div>

      {/* Impact KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: tokens.spacing.md, marginBottom: tokens.spacing.lg, padding: tokens.spacing.md, background: tokens.colors.bg, borderRadius: tokens.radii.md }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '10px', color: tokens.colors.dim, textTransform: 'uppercase', marginBottom: '2px' }}>Scenario Revenue</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '18px', fontWeight: 700, color: scenarioRevenue >= base_revenue ? tokens.colors.green : tokens.colors.red }}>
            {fmt(scenarioRevenue)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '10px', color: tokens.colors.dim, textTransform: 'uppercase', marginBottom: '2px' }}>Scenario Margin</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '18px', fontWeight: 700, color: scenarioMargin >= base_margin ? tokens.colors.green : tokens.colors.red }}>
            {pct(scenarioMargin)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '10px', color: tokens.colors.dim, textTransform: 'uppercase', marginBottom: '2px' }}>Min Cash Balance</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '18px', fontWeight: 700, color: minScenarioBalance >= 300000 ? tokens.colors.green : minScenarioBalance >= 150000 ? tokens.colors.yellow : tokens.colors.red }}>
            {fmt(minScenarioBalance)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={scenarioData}>
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
            stroke={tokens.colors.dim}
            fontSize={11}
            fontFamily={tokens.fonts.mono}
            tickFormatter={(v) => fmt(v)}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="baseline"
            name="Baseline"
            stroke={tokens.colors.dim}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="scenario"
            name="Scenario"
            stroke={tokens.colors.gold}
            strokeWidth={2.5}
            dot={{ r: 3, fill: tokens.colors.gold, stroke: tokens.colors.surface, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', gap: tokens.spacing.lg, justifyContent: 'center', marginTop: tokens.spacing.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '16px', height: '2px', background: tokens.colors.dim, borderTop: '1px dashed' }} />
          <span style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.muted }}>Baseline</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '16px', height: '2px', background: tokens.colors.gold }} />
          <span style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.muted }}>Scenario</span>
        </div>
      </div>

      {/* Reset button */}
      {(revenueChange !== 0 || marginChange !== 0 || delayWeeks !== 0) && (
        <div style={{ textAlign: 'center', marginTop: tokens.spacing.md }}>
          <button
            onClick={() => { setRevenueChange(0); setMarginChange(0); setDelayWeeks(0); }}
            style={{
              fontFamily: tokens.fonts.body,
              fontSize: '12px',
              color: tokens.colors.muted,
              background: 'none',
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radii.sm,
              padding: '4px 12px',
              cursor: 'pointer',
            }}
          >
            Reset to baseline
          </button>
        </div>
      )}
    </div>
  );
}
