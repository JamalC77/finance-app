'use client';

import { tokens, fmt } from '@/lib/assemblyTokens';

interface PipelineJob {
  name: string;
  value: number;
  probability: number;
  status: string;
}

interface BacklogPipelineProps {
  contracted_backlog: number;
  weighted_pipeline: number;
  total_visibility: number;
  months_of_revenue: number;
  pipeline_jobs: PipelineJob[];
}

export function BacklogPipeline(props: BacklogPipelineProps) {
  const backlogPct = (props.contracted_backlog / props.total_visibility) * 100;
  const pipelinePct = (props.weighted_pipeline / props.total_visibility) * 100;

  return (
    <div
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radii.lg,
        padding: tokens.spacing.lg,
      }}
    >
      {/* Revenue visibility header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: tokens.spacing.lg }}>
        <div>
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '12px', color: tokens.colors.muted, marginBottom: '4px' }}>Total Revenue Visibility</div>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '28px', fontWeight: 700, color: tokens.colors.text }}>{fmt(props.total_visibility)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: tokens.fonts.mono, fontSize: '22px', fontWeight: 700, color: tokens.colors.green }}>{props.months_of_revenue.toFixed(1)} mo</div>
          <div style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.dim }}>of revenue</div>
        </div>
      </div>

      {/* Stacked bar */}
      <div style={{ marginBottom: tokens.spacing.lg }}>
        <div style={{ display: 'flex', height: '28px', borderRadius: tokens.radii.sm, overflow: 'hidden', background: tokens.colors.bg }}>
          <div
            style={{
              width: `${backlogPct}%`,
              background: tokens.colors.green,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: '#fff', fontWeight: 600 }}>
              {fmt(props.contracted_backlog)}
            </span>
          </div>
          <div
            style={{
              width: `${pipelinePct}%`,
              background: `${tokens.colors.green}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.text, fontWeight: 600 }}>
              {fmt(props.weighted_pipeline)}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: tokens.spacing.xs }}>
          <span style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.muted }}>Contracted Backlog</span>
          <span style={{ fontFamily: tokens.fonts.body, fontSize: '11px', color: tokens.colors.muted }}>Weighted Pipeline</span>
        </div>
      </div>

      {/* Pipeline jobs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
        {props.pipeline_jobs.map((job, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              background: tokens.colors.bg,
              borderRadius: tokens.radii.sm,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
              <span style={{ fontFamily: tokens.fonts.body, fontSize: '13px', color: tokens.colors.text }}>{job.name}</span>
              <span
                style={{
                  fontFamily: tokens.fonts.mono,
                  fontSize: '10px',
                  color: tokens.colors.dim,
                  background: tokens.colors.surface,
                  padding: '1px 6px',
                  borderRadius: '3px',
                  textTransform: 'uppercase',
                }}
              >
                {job.status}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
              <span style={{ fontFamily: tokens.fonts.mono, fontSize: '13px', color: tokens.colors.text, fontWeight: 600 }}>{fmt(job.value)}</span>
              <span style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.muted }}>{(job.probability * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
