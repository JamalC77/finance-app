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

export interface PriorityAction {
  id: string;
  headline: string;
  detail: string;
  dollar_impact: string;
  action: string;
  severity: 'critical' | 'warning' | 'info';
  linked_section?: string;
  linked_detail?: string;
  chat_prompt?: string;
}

export interface HealthVerdict {
  status: Status;
  headline: string;
  sub_line: string;
  priority_actions: PriorityAction[];
}

export interface RunwayWeek {
  week: string;
  balance: number;
  is_danger: boolean;
}

export interface RunwayConfig {
  runway_weeks: number;
  runway_label: string;
  status: Status;
  safety_threshold: number;
  monthly_burn: number;
  min_balance: number;
  min_balance_week: string;
  danger_weeks: string[];
  forecast: RunwayWeek[];
}

export interface AssemblyConfig {
  health_verdict?: HealthVerdict;
  runway?: RunwayConfig;
  executive_summary: ExecutiveSummary;
  alerts: AlertConfig[];
  sections: SectionConfig[];
  commentary: CommentaryConfig[];
  scenario_defaults?: ScenarioDefaults;
}
