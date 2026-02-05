'use client';

import { useState } from 'react';
import { tokens, fmt } from '@/lib/assemblyTokens';
import type { AssemblyConfig, SectionConfig } from '@/lib/types/assemblyConfig';

import { KPICard } from './KPICard';
import { AlertBanner } from './AlertBanner';
import { SectionHeader } from './SectionHeader';
import { FlashPNL } from './FlashPNL';
import { JobMarginTracker } from './JobMarginTracker';
import { CashFlowTiming } from './CashFlowTiming';
import { WIPSnapshot } from './WIPSnapshot';
import { BacklogPipeline } from './BacklogPipeline';
import { MonthlyTrend } from './MonthlyTrend';
import { ScenarioEngine } from './ScenarioEngine';
import { Commentary } from './Commentary';

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  KPICard,
  FlashPNL,
  JobMarginTracker,
  CashFlowTiming,
  WIPSnapshot,
  BacklogPipeline,
  MonthlyTrend,
  ScenarioEngine,
  Commentary,
};

const TABS = [
  { id: 'executive', label: 'Executive View' },
  { id: 'margins', label: 'Job Margins' },
  { id: 'cash', label: 'Cash Timing' },
  { id: 'whatif', label: 'What-If' },
];

const TAB_SECTION_MAP: Record<string, string[]> = {
  executive: ['FlashPNL', 'WIPSnapshot', 'BacklogPipeline', 'MonthlyTrend', 'Commentary'],
  margins: ['JobMarginTracker'],
  cash: ['CashFlowTiming'],
  whatif: ['ScenarioEngine'],
};

interface AssemblyRendererProps {
  config: AssemblyConfig;
  source?: 'ai' | 'fallback' | null;
}

export function AssemblyRenderer({ config, source }: AssemblyRendererProps) {
  const [activeTab, setActiveTab] = useState('executive');

  const sortedSections = [...config.sections].sort((a, b) => a.priority - b.priority);

  const visibleSections = sortedSections.filter((section) => {
    const allowed = TAB_SECTION_MAP[activeTab];
    return allowed ? allowed.includes(section.component) : true;
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: tokens.colors.bg,
        color: tokens.colors.text,
        fontFamily: tokens.fonts.body,
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: `1px solid ${tokens.colors.border}`,
          padding: `${tokens.spacing.lg} ${tokens.spacing.xl}`,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1
              style={{
                fontFamily: tokens.fonts.body,
                fontSize: '22px',
                fontWeight: 700,
                color: tokens.colors.text,
                margin: 0,
              }}
            >
              Summit Ridge Builders
            </h1>
            <div style={{ fontFamily: tokens.fonts.body, fontSize: '13px', color: tokens.colors.muted, marginTop: '4px' }}>
              Houston, TX &middot; Residential Construction &middot; {fmt(8400000)} TTM
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing.sm,
              background: tokens.colors.goldDim,
              padding: '6px 14px',
              borderRadius: tokens.radii.md,
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: tokens.colors.green, animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: tokens.fonts.mono, fontSize: '12px', color: tokens.colors.gold, fontWeight: 600 }}>
              {source === 'ai' ? 'AI-Assembled' : 'Live'} &mdash; Feb 2026
            </span>
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <nav
        style={{
          borderBottom: `1px solid ${tokens.colors.border}`,
          padding: `0 ${tokens.spacing.xl}`,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '0' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontFamily: tokens.fonts.body,
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 600 : 400,
                color: activeTab === tab.id ? tokens.colors.gold : tokens.colors.muted,
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? tokens.colors.gold : 'transparent'}`,
                padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: tokens.spacing.xl }}>
        {/* Executive Summary */}
        {activeTab === 'executive' && (
          <div style={{ marginBottom: tokens.spacing.xl }}>
            <p
              style={{
                fontFamily: tokens.fonts.body,
                fontSize: '15px',
                color: tokens.colors.textSecondary,
                lineHeight: 1.6,
                marginBottom: tokens.spacing.lg,
                padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
                background: tokens.colors.surface,
                border: `1px solid ${tokens.colors.border}`,
                borderLeft: `3px solid ${tokens.colors.gold}`,
                borderRadius: tokens.radii.md,
              }}
            >
              {config.executive_summary.headline}
            </p>
            <div style={{ display: 'flex', gap: tokens.spacing.md, flexWrap: 'wrap' }}>
              {config.executive_summary.kpis.map((kpi, i) => (
                <KPICard key={i} {...kpi} />
              ))}
            </div>
          </div>
        )}

        {/* Alerts */}
        {activeTab === 'executive' && config.alerts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm, marginBottom: tokens.spacing.xl }}>
            {config.alerts.map((alert, i) => (
              <AlertBanner key={i} {...alert} />
            ))}
          </div>
        )}

        {/* Sections */}
        {visibleSections.map((section, i) => {
          const Component = COMPONENT_MAP[section.component];
          if (!Component) return null;

          return (
            <div
              key={section.id}
              style={{
                marginBottom: tokens.spacing.xl,
                opacity: 1,
                animation: `fadeSlideIn 0.4s ease ${i * 0.1}s both`,
              }}
            >
              <SectionHeader title={section.title} badge={section.badge} />
              <Component {...section.props} />
            </div>
          );
        })}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${tokens.colors.border}`,
          padding: `${tokens.spacing.lg} ${tokens.spacing.xl}`,
          textAlign: 'center',
        }}
      >
        <span style={{ fontFamily: tokens.fonts.body, fontSize: '12px', color: tokens.colors.dim }}>
          CFO OS &middot; Assembled by AI &middot; The CFO Line
        </span>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
