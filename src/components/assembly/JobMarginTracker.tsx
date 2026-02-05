'use client';

import { tokens, fmt, pct, statusColor } from '@/lib/assemblyTokens';
import type { Status } from '@/lib/types/assemblyConfig';

interface Job {
  id: string;
  name: string;
  contract_value: number;
  percent_complete: number;
  original_margin: number;
  current_margin: number;
  variance: number;
  status: Status;
  change_orders: number;
  completion_date: string;
}

interface JobMarginTrackerProps {
  jobs: Job[];
  highlight?: string;
}

function ProgressBar({ pct: value, color }: { pct: number; color: string }) {
  return (
    <div style={{ width: '100%', height: '6px', background: tokens.colors.bg, borderRadius: '3px', overflow: 'hidden' }}>
      <div
        style={{
          width: `${value * 100}%`,
          height: '100%',
          background: color,
          borderRadius: '3px',
          transition: 'width 0.6s ease',
        }}
      />
    </div>
  );
}

export function JobMarginTracker({ jobs, highlight }: JobMarginTrackerProps) {
  const sorted = [...jobs].sort((a, b) => {
    const order = { red: 0, yellow: 1, green: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
      {sorted.map((job) => {
        const varianceColor = job.variance > 0 ? tokens.colors.green : job.variance < -0.03 ? tokens.colors.red : job.variance < -0.01 ? tokens.colors.yellow : tokens.colors.muted;
        const variancePrefix = job.variance >= 0 ? '+' : '';

        return (
          <div
            key={job.id}
            style={{
              background: tokens.colors.surface,
              border: highlight === job.id
                ? `1px solid ${tokens.colors.gold}60`
                : `1px solid ${job.status === 'red' ? `${tokens.colors.red}30` : tokens.colors.border}`,
              borderRadius: tokens.radii.lg,
              padding: tokens.spacing.lg,
              ...(highlight === job.id ? {
                boxShadow: `0 0 20px rgba(201, 168, 76, 0.2)`,
                transition: 'all 0.4s ease',
              } : {}),
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: tokens.spacing.md }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: statusColor(job.status),
                    boxShadow: `0 0 8px ${statusColor(job.status)}40`,
                  }}
                />
                <span style={{ fontFamily: tokens.fonts.body, fontSize: '14px', fontWeight: 600, color: tokens.colors.text }}>
                  {job.name}
                </span>
                <span style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.dim }}>{job.id}</span>
              </div>
              <span style={{ fontFamily: tokens.fonts.mono, fontSize: '14px', fontWeight: 600, color: tokens.colors.text }}>
                {fmt(job.contract_value)}
              </span>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: tokens.spacing.md }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.dim }}>Completion</span>
                <span style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.text }}>{pct(job.percent_complete)}</span>
              </div>
              <ProgressBar pct={job.percent_complete} color={statusColor(job.status)} />
            </div>

            {/* Margin comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: tokens.spacing.md }}>
              <div>
                <div style={{ fontFamily: tokens.fonts.body, fontSize: '10px', color: tokens.colors.dim, textTransform: 'uppercase', marginBottom: '2px' }}>Bid Margin</div>
                <div style={{ fontFamily: tokens.fonts.mono, fontSize: '15px', fontWeight: 600, color: tokens.colors.muted }}>{pct(job.original_margin)}</div>
              </div>
              <div>
                <div style={{ fontFamily: tokens.fonts.body, fontSize: '10px', color: tokens.colors.dim, textTransform: 'uppercase', marginBottom: '2px' }}>Current</div>
                <div style={{ fontFamily: tokens.fonts.mono, fontSize: '15px', fontWeight: 600, color: statusColor(job.status) }}>{pct(job.current_margin)}</div>
              </div>
              <div>
                <div style={{ fontFamily: tokens.fonts.body, fontSize: '10px', color: tokens.colors.dim, textTransform: 'uppercase', marginBottom: '2px' }}>Variance</div>
                <div style={{ fontFamily: tokens.fonts.mono, fontSize: '15px', fontWeight: 600, color: varianceColor }}>
                  {variancePrefix}{pct(job.variance)}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: tokens.fonts.body, fontSize: '10px', color: tokens.colors.dim, textTransform: 'uppercase', marginBottom: '2px' }}>Change Orders</div>
                <div style={{ fontFamily: tokens.fonts.mono, fontSize: '15px', fontWeight: 600, color: job.change_orders > 0 ? tokens.colors.yellow : tokens.colors.muted }}>
                  {job.change_orders > 0 ? fmt(job.change_orders) : '—'}
                </div>
              </div>
            </div>

            {/* Completion date */}
            <div style={{ marginTop: tokens.spacing.sm, textAlign: 'right' }}>
              <span style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.dim }}>
                Est. {job.completion_date}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
