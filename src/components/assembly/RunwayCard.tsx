'use client';

import { useMemo } from 'react';
import { tokens, fmt, statusColor } from '@/lib/assemblyTokens';
import type { Status, RunwayWeek } from '@/lib/types/assemblyConfig';

interface RunwayCardProps {
  runway_weeks: number;
  runway_label: string;
  status: Status;
  safety_threshold: number;
  monthly_burn: number;
  min_balance: number;
  min_balance_week: string;
  danger_weeks: string[];
  forecast: RunwayWeek[];
  scenarioForecast?: RunwayWeek[];
}

export function RunwayCard({
  runway_weeks,
  runway_label,
  status,
  safety_threshold,
  monthly_burn,
  min_balance,
  min_balance_week,
  danger_weeks,
  forecast,
  scenarioForecast,
}: RunwayCardProps) {
  const activeForecast = scenarioForecast && scenarioForecast.length > 0 ? scenarioForecast : forecast;
  const activeMinBalance = Math.min(...activeForecast.map(w => w.balance));
  const activeRunwayWeeks = scenarioForecast && scenarioForecast.length > 0
    ? Math.floor(activeForecast[0].balance / (monthly_burn / 4.33))
    : runway_weeks;
  const activeRunwayLabel = scenarioForecast && scenarioForecast.length > 0
    ? (activeRunwayWeeks > 12 ? `${Math.round(activeRunwayWeeks / 4.33)} months` : `~${activeRunwayWeeks} weeks`)
    : runway_label;
  const activeStatus: Status = scenarioForecast && scenarioForecast.length > 0
    ? (activeMinBalance < safety_threshold ? 'red' : activeMinBalance < safety_threshold * 2 ? 'yellow' : 'green')
    : status;

  const activeDangerWeeks = scenarioForecast && scenarioForecast.length > 0
    ? activeForecast.filter(w => w.is_danger).map(w => w.week)
    : danger_weeks;

  return (
    <div
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radii.lg,
        padding: tokens.spacing.lg,
      }}
    >
      {/* Top row: Metrics + Chart */}
      <div style={{ display: 'flex', gap: tokens.spacing.xl, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left: Runway Number */}
        <div style={{ minWidth: '140px' }}>
          <div
            style={{
              fontFamily: tokens.fonts.mono,
              fontSize: '36px',
              fontWeight: 700,
              color: statusColor(activeStatus),
              lineHeight: 1,
              marginBottom: '4px',
            }}
          >
            {activeRunwayLabel}
          </div>
          <div style={{ fontSize: '12px', color: tokens.colors.muted, fontFamily: tokens.fonts.body, marginBottom: tokens.spacing.md }}>
            at current burn rate
          </div>
          <div style={{ display: 'flex', gap: tokens.spacing.lg }}>
            <MetricItem label="Monthly Burn" value={fmt(monthly_burn)} />
            <MetricItem label="Safety Floor" value={fmt(safety_threshold)} />
            <MetricItem label="Cash Low" value={fmt(activeMinBalance)} color={activeMinBalance < safety_threshold ? tokens.colors.red : tokens.colors.yellow} />
          </div>
        </div>

        {/* Right: Sawtooth Chart */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <SawtoothChart
            forecast={forecast}
            scenarioForecast={scenarioForecast}
            safetyThreshold={safety_threshold}
          />
        </div>
      </div>

      {/* Danger Weeks */}
      {activeDangerWeeks.length > 0 && (
        <div style={{ marginTop: tokens.spacing.md, display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: tokens.colors.muted, fontFamily: tokens.fonts.body }}>
            Danger weeks:
          </span>
          {activeDangerWeeks.map((week) => (
            <span
              key={week}
              style={{
                fontFamily: tokens.fonts.mono,
                fontSize: '11px',
                color: tokens.colors.red,
                background: `${tokens.colors.red}18`,
                padding: '3px 8px',
                borderRadius: tokens.radii.sm,
                fontWeight: 500,
              }}
            >
              {week}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: tokens.colors.dim, fontFamily: tokens.fonts.body, marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ fontFamily: tokens.fonts.mono, fontSize: '14px', fontWeight: 600, color: color || tokens.colors.textSecondary }}>
        {value}
      </div>
    </div>
  );
}

function SawtoothChart({
  forecast,
  scenarioForecast,
  safetyThreshold,
}: {
  forecast: RunwayWeek[];
  scenarioForecast?: RunwayWeek[];
  safetyThreshold: number;
}) {
  const { baselinePath, baselineArea, scenarioPath, scenarioArea, thresholdY, viewBox, dangerRects } = useMemo(() => {
    const W = 400;
    const H = 100;
    const PAD_TOP = 10;
    const PAD_BOTTOM = 20;
    const PAD_LEFT = 0;
    const PAD_RIGHT = 0;
    const chartW = W - PAD_LEFT - PAD_RIGHT;
    const chartH = H - PAD_TOP - PAD_BOTTOM;

    const allBalances = [
      ...forecast.map(w => w.balance),
      ...(scenarioForecast || []).map(w => w.balance),
      safetyThreshold,
    ];
    const maxBalance = Math.max(...allBalances) * 1.1;
    const minB = 0;

    const xScale = (i: number) => PAD_LEFT + (i / (forecast.length - 1)) * chartW;
    const yScale = (v: number) => PAD_TOP + chartH - ((v - minB) / (maxBalance - minB)) * chartH;

    // Build baseline path
    const baselinePoints = forecast.map((w, i) => `${xScale(i)},${yScale(w.balance)}`);
    const bPath = `M ${baselinePoints.join(' L ')}`;
    const bArea = `${bPath} L ${xScale(forecast.length - 1)},${yScale(0)} L ${xScale(0)},${yScale(0)} Z`;

    // Build scenario path
    let sPath = '';
    let sArea = '';
    if (scenarioForecast && scenarioForecast.length > 0) {
      const scenarioPoints = scenarioForecast.map((w, i) => `${xScale(i)},${yScale(w.balance)}`);
      sPath = `M ${scenarioPoints.join(' L ')}`;
      sArea = `${sPath} L ${xScale(scenarioForecast.length - 1)},${yScale(0)} L ${xScale(0)},${yScale(0)} Z`;
    }

    // Threshold line Y
    const tY = yScale(safetyThreshold);

    // Danger week background rects
    const colW = chartW / forecast.length;
    const dRects = forecast
      .map((w, i) => ({ x: PAD_LEFT + i * colW, is_danger: w.is_danger }))
      .filter(r => r.is_danger)
      .map(r => ({ x: r.x, width: colW }));

    return {
      baselinePath: bPath,
      baselineArea: bArea,
      scenarioPath: sPath,
      scenarioArea: sArea,
      thresholdY: tY,
      viewBox: `0 0 ${W} ${H}`,
      dangerRects: dRects,
    };
  }, [forecast, scenarioForecast, safetyThreshold]);

  const hasScenario = scenarioForecast && scenarioForecast.length > 0;

  return (
    <div>
      <svg
        viewBox={viewBox}
        style={{ width: '100%', height: 'auto', maxHeight: '100px' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Danger week backgrounds */}
        {dangerRects.map((r, i) => (
          <rect
            key={i}
            x={r.x}
            y={10}
            width={r.width}
            height={70}
            fill={`${tokens.colors.red}10`}
          />
        ))}

        {/* Safety threshold line */}
        <line
          x1={0}
          y1={thresholdY}
          x2={400}
          y2={thresholdY}
          stroke={tokens.colors.red}
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0.5}
        />
        <text
          x={400}
          y={thresholdY - 4}
          textAnchor="end"
          fill={tokens.colors.red}
          fontSize={9}
          fontFamily={tokens.fonts.mono}
          opacity={0.6}
        >
          {fmt(safetyThreshold)}
        </text>

        {/* Baseline area fill */}
        <path
          d={baselineArea}
          fill={hasScenario ? `${tokens.colors.muted}10` : `${tokens.colors.gold}15`}
        />

        {/* Baseline line */}
        <path
          d={baselinePath}
          fill="none"
          stroke={hasScenario ? tokens.colors.muted : tokens.colors.gold}
          strokeWidth={hasScenario ? 1.5 : 2}
          strokeDasharray={hasScenario ? '4 3' : 'none'}
          opacity={hasScenario ? 0.5 : 1}
        />

        {/* Scenario area + line */}
        {hasScenario && (
          <>
            <path d={scenarioArea} fill={`${tokens.colors.gold}15`} />
            <path d={scenarioPath} fill="none" stroke={tokens.colors.gold} strokeWidth={2} />
          </>
        )}

        {/* Week labels */}
        {forecast.map((w, i) => {
          if (i % 2 !== 0) return null;
          const x = (i / (forecast.length - 1)) * 400;
          return (
            <text
              key={w.week}
              x={x}
              y={96}
              textAnchor="middle"
              fill={tokens.colors.dim}
              fontSize={8}
              fontFamily={tokens.fonts.mono}
            >
              {w.week}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      {hasScenario && (
        <div style={{ display: 'flex', gap: tokens.spacing.md, marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '16px', height: '2px', background: tokens.colors.muted, opacity: 0.5 }} />
            <span style={{ fontSize: '10px', color: tokens.colors.dim, fontFamily: tokens.fonts.body }}>Baseline</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '16px', height: '2px', background: tokens.colors.gold }} />
            <span style={{ fontSize: '10px', color: tokens.colors.dim, fontFamily: tokens.fonts.body }}>Scenario</span>
          </div>
        </div>
      )}
    </div>
  );
}
