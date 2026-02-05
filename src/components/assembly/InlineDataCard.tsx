'use client';

import { tokens, fmt, pct, statusColor } from '@/lib/assemblyTokens';
import type { AssemblyConfig } from '@/lib/types/assemblyConfig';

interface InlineDataCardProps {
  component: string;
  detail: string | null;
  config: AssemblyConfig;
  onViewDashboard?: () => void;
}

const cardStyle: React.CSSProperties = {
  background: tokens.colors.surface,
  border: `1px solid ${tokens.colors.border}`,
  borderLeft: `3px solid ${tokens.colors.gold}`,
  borderRadius: tokens.radii.md,
  padding: tokens.spacing.md,
  marginTop: tokens.spacing.sm,
  fontSize: '13px',
  fontFamily: tokens.fonts.body,
};

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: tokens.colors.dim,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '2px',
};

const valueStyle: React.CSSProperties = {
  fontFamily: tokens.fonts.mono,
  fontSize: '15px',
  fontWeight: 600,
  color: tokens.colors.text,
};

function MetricCell({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <div style={{ ...valueStyle, color: color || tokens.colors.text }}>{value}</div>
    </div>
  );
}

function ViewLink({ onViewDashboard }: { onViewDashboard?: () => void }) {
  if (!onViewDashboard) return null;
  return (
    <div style={{ marginTop: tokens.spacing.sm, paddingTop: tokens.spacing.sm, borderTop: `1px solid ${tokens.colors.border}` }}>
      <button
        onClick={onViewDashboard}
        style={{
          background: 'none',
          border: 'none',
          color: tokens.colors.gold,
          fontFamily: tokens.fonts.body,
          fontSize: '12px',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        View on Dashboard &rarr;
      </button>
    </div>
  );
}

function findSection(config: AssemblyConfig, componentName: string) {
  return config.sections.find((s) => s.component === componentName);
}

// --- Per-component card renderers ---

function JobCard({ config, detail, onViewDashboard }: { config: AssemblyConfig; detail: string | null; onViewDashboard?: () => void }) {
  const section = findSection(config, 'JobMarginTracker');
  const jobs = (section?.props?.jobs || []) as Array<{
    id: string; name: string; contract_value: number; percent_complete: number;
    original_margin: number; current_margin: number; variance: number; status: 'green' | 'yellow' | 'red';
    change_orders: number;
  }>;

  if (detail) {
    const job = jobs.find((j) => j.id === detail);
    if (!job) return null;
    const varianceColor = job.variance > 0 ? tokens.colors.green : job.variance < -0.03 ? tokens.colors.red : job.variance < -0.01 ? tokens.colors.yellow : tokens.colors.muted;
    return (
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: tokens.spacing.sm }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor(job.status) }} />
          <span style={{ fontWeight: 600, color: tokens.colors.text }}>{job.name}</span>
          <span style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.dim }}>{job.id}</span>
          <span style={{ marginLeft: 'auto', fontFamily: tokens.fonts.mono, fontSize: '13px', color: tokens.colors.text }}>{fmt(job.contract_value)}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: tokens.spacing.sm }}>
          <MetricCell label="Bid" value={pct(job.original_margin)} color={tokens.colors.muted} />
          <MetricCell label="Current" value={pct(job.current_margin)} color={statusColor(job.status)} />
          <MetricCell label="Variance" value={`${job.variance >= 0 ? '+' : ''}${pct(job.variance)}`} color={varianceColor} />
          <MetricCell label="Complete" value={pct(job.percent_complete)} />
        </div>
        {job.change_orders > 0 && (
          <div style={{ marginTop: tokens.spacing.sm, fontSize: '12px', color: tokens.colors.yellow }}>
            {fmt(job.change_orders)} in change orders
          </div>
        )}
        <ViewLink onViewDashboard={onViewDashboard} />
      </div>
    );
  }

  // Summary: no specific job
  const byStatus = { green: 0, yellow: 0, red: 0 };
  jobs.forEach((j) => { byStatus[j.status]++; });
  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600, color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>{jobs.length} Active Jobs</div>
      <div style={{ display: 'flex', gap: tokens.spacing.md, fontSize: '12px' }}>
        {byStatus.green > 0 && <span style={{ color: tokens.colors.green }}>{byStatus.green} on track</span>}
        {byStatus.yellow > 0 && <span style={{ color: tokens.colors.yellow }}>{byStatus.yellow} watch</span>}
        {byStatus.red > 0 && <span style={{ color: tokens.colors.red }}>{byStatus.red} at risk</span>}
      </div>
      <ViewLink onViewDashboard={onViewDashboard} />
    </div>
  );
}

function CashCard({ config, detail, onViewDashboard }: { config: AssemblyConfig; detail: string | null; onViewDashboard?: () => void }) {
  const section = findSection(config, 'CashFlowTiming');
  const forecast = (section?.props?.forecast || []) as Array<{ week: string; draws: number; commitments: number; net: number; balance: number }>;
  const minBal = (section?.props?.min_balance || 0) as number;
  const avgBal = (section?.props?.avg_balance || 0) as number;

  if (detail) {
    const matches = forecast.filter((w) => w.week.includes(detail));
    if (matches.length === 0) return null;
    return (
      <div style={cardStyle}>
        <div style={{ fontWeight: 600, color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>Cash Flow — {detail} Weeks</div>
        {matches.map((w, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: tokens.spacing.sm, marginBottom: i < matches.length - 1 ? tokens.spacing.sm : 0 }}>
            <MetricCell label={w.week} value="" />
            <MetricCell label="In" value={fmt(w.draws)} color={tokens.colors.green} />
            <MetricCell label="Out" value={fmt(w.commitments)} color={tokens.colors.red} />
            <MetricCell label="Balance" value={fmt(w.balance)} color={w.balance < 150000 ? tokens.colors.red : w.balance < 300000 ? tokens.colors.yellow : tokens.colors.text} />
          </div>
        ))}
        <ViewLink onViewDashboard={onViewDashboard} />
      </div>
    );
  }

  const negWeeks = forecast.filter((w) => w.net < 0).length;
  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600, color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>12-Week Cash Forecast</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: tokens.spacing.sm }}>
        <MetricCell label="Min Balance" value={fmt(minBal)} color={minBal < 150000 ? tokens.colors.red : minBal < 300000 ? tokens.colors.yellow : tokens.colors.green} />
        <MetricCell label="Avg Balance" value={fmt(avgBal)} />
        <MetricCell label="Neg. Weeks" value={`${negWeeks} of ${forecast.length}`} color={tokens.colors.yellow} />
      </div>
      <ViewLink onViewDashboard={onViewDashboard} />
    </div>
  );
}

function PNLCard({ config, onViewDashboard }: { config: AssemblyConfig; onViewDashboard?: () => void }) {
  const section = findSection(config, 'FlashPNL');
  if (!section?.props) return null;
  const p = section.props as { revenue: number; gross_margin: number; ebitda_margin: number; net_margin: number; revenue_growth_yoy: number; budget_variance: number };
  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600, color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>Flash P&L</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing.sm }}>
        <MetricCell label="Revenue" value={fmt(p.revenue)} />
        <MetricCell label="Gross Margin" value={pct(p.gross_margin)} color={p.gross_margin >= 0.25 ? tokens.colors.green : tokens.colors.yellow} />
        <MetricCell label="EBITDA Margin" value={pct(p.ebitda_margin)} color={p.ebitda_margin >= 0.12 ? tokens.colors.green : tokens.colors.red} />
        <MetricCell label="Net Margin" value={pct(p.net_margin)} />
      </div>
      <div style={{ marginTop: tokens.spacing.sm, fontSize: '12px', color: tokens.colors.muted }}>
        YoY growth: +{pct(p.revenue_growth_yoy)} &middot; Budget: {p.budget_variance >= 0 ? '+' : ''}{pct(p.budget_variance)}
      </div>
      <ViewLink onViewDashboard={onViewDashboard} />
    </div>
  );
}

function WIPCard({ config, detail, onViewDashboard }: { config: AssemblyConfig; detail: string | null; onViewDashboard?: () => void }) {
  const section = findSection(config, 'WIPSnapshot');
  if (!section?.props) return null;
  const p = section.props as { costs_in_excess: number; billings_in_excess: number; net_position: number; net_position_label: string; jobs_underbilled: number; jobs_overbilled: number };
  const netStatus = p.net_position > 200000 ? 'red' : p.net_position > 100000 ? 'yellow' : 'green';
  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600, color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>WIP Position</div>
      <div style={{ textAlign: 'center', marginBottom: tokens.spacing.sm }}>
        <div style={{ fontFamily: tokens.fonts.mono, fontSize: '22px', fontWeight: 700, color: statusColor(netStatus as 'green' | 'yellow' | 'red') }}>{fmt(p.net_position)}</div>
        <div style={{ fontSize: '12px', color: statusColor(netStatus as 'green' | 'yellow' | 'red') }}>{p.net_position_label}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing.sm }}>
        <MetricCell
          label="Under-billed"
          value={fmt(p.costs_in_excess)}
          color={detail === 'underbilled' ? tokens.colors.gold : tokens.colors.text}
        />
        <MetricCell
          label="Over-billed"
          value={fmt(p.billings_in_excess)}
          color={detail === 'overbilled' ? tokens.colors.gold : tokens.colors.text}
        />
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.muted, marginTop: '4px', textAlign: 'center' }}>
        {p.jobs_underbilled} under-billed &middot; {p.jobs_overbilled} over-billed
      </div>
      <ViewLink onViewDashboard={onViewDashboard} />
    </div>
  );
}

function BacklogCard({ config, onViewDashboard }: { config: AssemblyConfig; onViewDashboard?: () => void }) {
  const section = findSection(config, 'BacklogPipeline');
  if (!section?.props) return null;
  const p = section.props as { contracted_backlog: number; weighted_pipeline: number; total_visibility: number; months_of_revenue: number };
  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600, color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>Backlog & Pipeline</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing.sm }}>
        <MetricCell label="Contracted" value={fmt(p.contracted_backlog)} />
        <MetricCell label="Weighted Pipeline" value={fmt(p.weighted_pipeline)} />
        <MetricCell label="Total Visibility" value={fmt(p.total_visibility)} />
        <MetricCell label="Months of Revenue" value={`${p.months_of_revenue.toFixed(1)} mo`} color={p.months_of_revenue >= 6 ? tokens.colors.green : p.months_of_revenue >= 3 ? tokens.colors.yellow : tokens.colors.red} />
      </div>
      <ViewLink onViewDashboard={onViewDashboard} />
    </div>
  );
}

function TrendCard({ config, onViewDashboard }: { config: AssemblyConfig; onViewDashboard?: () => void }) {
  const section = findSection(config, 'MonthlyTrend');
  if (!section?.props) return null;
  const data = (section.props.data || []) as Array<{ month: string; revenue: number; gross_margin: number; net_margin: number }>;
  if (data.length === 0) return null;
  const latest = data[data.length - 1];
  const prev = data.length >= 2 ? data[data.length - 2] : null;
  const revTrend = prev ? (latest.revenue > prev.revenue ? 'up' : 'down') : null;
  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600, color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>Monthly Trend — {latest.month}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: tokens.spacing.sm }}>
        <MetricCell label="Revenue" value={fmt(latest.revenue)} color={revTrend === 'down' ? tokens.colors.yellow : tokens.colors.text} />
        <MetricCell label="Gross" value={pct(latest.gross_margin)} />
        <MetricCell label="Net" value={pct(latest.net_margin)} />
      </div>
      {prev && (
        <div style={{ fontSize: '11px', color: tokens.colors.muted, marginTop: '4px' }}>
          vs {prev.month}: {fmt(prev.revenue)} revenue, {pct(prev.gross_margin)} gross
        </div>
      )}
      <ViewLink onViewDashboard={onViewDashboard} />
    </div>
  );
}

function ScenarioCard({ onViewDashboard }: { onViewDashboard?: () => void }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600, color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>Scenario Engine</div>
      <div style={{ fontSize: '13px', color: tokens.colors.muted }}>
        The what-if scenario engine has interactive sliders — open it on the Dashboard tab to model revenue changes, margin shifts, and draw delays.
      </div>
      <ViewLink onViewDashboard={onViewDashboard} />
    </div>
  );
}

function KPIsCard({ config, onViewDashboard }: { config: AssemblyConfig; onViewDashboard?: () => void }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600, color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>Executive KPIs</div>
      {config.executive_summary.kpis.map((kpi, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: i < config.executive_summary.kpis.length - 1 ? `1px solid ${tokens.colors.border}` : 'none' }}>
          <span style={{ fontSize: '12px', color: tokens.colors.muted }}>{kpi.label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: tokens.fonts.mono, fontSize: '14px', fontWeight: 600, color: statusColor(kpi.status as 'green' | 'yellow' | 'red') }}>{kpi.value}</span>
            {kpi.trend && <span style={{ fontSize: '11px', color: tokens.colors.dim }}>{kpi.trend}</span>}
          </div>
        </div>
      ))}
      <ViewLink onViewDashboard={onViewDashboard} />
    </div>
  );
}

function AlertsCard({ config, onViewDashboard }: { config: AssemblyConfig; onViewDashboard?: () => void }) {
  if (config.alerts.length === 0) return null;
  const severityColor = { critical: tokens.colors.red, warning: tokens.colors.yellow, info: tokens.colors.info };
  return (
    <div style={cardStyle}>
      <div style={{ fontWeight: 600, color: tokens.colors.text, marginBottom: tokens.spacing.sm }}>Alerts</div>
      {config.alerts.map((a, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: severityColor[a.severity as keyof typeof severityColor] || tokens.colors.muted, flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: tokens.colors.text }}>{a.title}</span>
        </div>
      ))}
      <ViewLink onViewDashboard={onViewDashboard} />
    </div>
  );
}

// --- Main export ---

export function InlineDataCard({ component, detail, config, onViewDashboard }: InlineDataCardProps) {
  switch (component) {
    case 'JobMarginTracker':
      return <JobCard config={config} detail={detail} onViewDashboard={onViewDashboard} />;
    case 'CashFlowTiming':
      return <CashCard config={config} detail={detail} onViewDashboard={onViewDashboard} />;
    case 'FlashPNL':
      return <PNLCard config={config} onViewDashboard={onViewDashboard} />;
    case 'WIPSnapshot':
      return <WIPCard config={config} detail={detail} onViewDashboard={onViewDashboard} />;
    case 'BacklogPipeline':
      return <BacklogCard config={config} onViewDashboard={onViewDashboard} />;
    case 'MonthlyTrend':
      return <TrendCard config={config} onViewDashboard={onViewDashboard} />;
    case 'ScenarioEngine':
      return <ScenarioCard onViewDashboard={onViewDashboard} />;
    case 'KPIs':
      return <KPIsCard config={config} onViewDashboard={onViewDashboard} />;
    case 'alerts':
      return <AlertsCard config={config} onViewDashboard={onViewDashboard} />;
    default:
      return null;
  }
}
