export type Status = 'green' | 'yellow' | 'red';

export type ComponentType =
  | 'KPICard'
  | 'FlashPNL'
  | 'JobMarginTracker'
  | 'CashFlowTiming'
  | 'WIPSnapshot'
  | 'BacklogPipeline'
  | 'MonthlyTrend'
  | 'ScenarioEngine'
  | 'Commentary';

export interface KPIConfig {
  label: string;
  value: string;
  status: Status;
  trend?: string;
  sub_text?: string;
}

export interface AlertConfig {
  severity: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
}

export interface CommentaryConfig {
  date: string;
  author: string;
  note: string;
}

export interface ScenarioDefaults {
  revenue_change: number;
  margin_change: number;
  delay_weeks: number;
}

export interface SectionConfig {
  id: string;
  title: string;
  component: ComponentType;
  priority: number;
  badge?: string;
  props: Record<string, any>;
}

export interface ExecutiveSummary {
  headline: string;
  kpis: KPIConfig[];
}

export interface AssemblyConfig {
  executive_summary: ExecutiveSummary;
  alerts: AlertConfig[];
  sections: SectionConfig[];
  commentary: CommentaryConfig[];
  scenario_defaults?: ScenarioDefaults;
}
