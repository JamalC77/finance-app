'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { tokens, fmt } from '@/lib/assemblyTokens';
import type { AssemblyConfig } from '@/lib/types/assemblyConfig';

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
import { InlineDataCard } from './InlineDataCard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  KPICard, FlashPNL, JobMarginTracker, CashFlowTiming,
  WIPSnapshot, BacklogPipeline, MonthlyTrend, ScenarioEngine, Commentary,
};

const VIEW_FILTER: Record<string, string[]> = {
  executive: ['FlashPNL', 'WIPSnapshot', 'BacklogPipeline', 'MonthlyTrend', 'Commentary'],
  margins: ['JobMarginTracker'],
  cash: ['CashFlowTiming'],
  whatif: ['ScenarioEngine'],
  all: Object.keys(COMPONENT_MAP),
};

const INITIAL_PROMPTS = [
  'Give me the CFO summary',
  'Why is Memorial Renovation bleeding margin?',
  'Show me the cash danger zones',
  'Which jobs are actually on track?',
  'Run a worst-case scenario',
];

const GREETING = "You're growing at 14.7% year-over-year and profitable, but two jobs are bleeding margin and your cash gets tight three times in the next 12 weeks.\n\nThe big one: Memorial Renovation is down to 6.5% margin on a 10% bid — $68K in change orders the client hasn't signed. That needs a meeting this week.\n\nYou've also done $165K of work across 5 jobs that you haven't billed for yet. That's your cash sitting in someone else's pocket.\n\nWhat do you want to dig into?";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  showComponent?: string | null;
  showDetail?: string | null;
}

interface InteractiveCFOOSProps {
  config: AssemblyConfig;
}

export function InteractiveCFOOS({ config }: InteractiveCFOOSProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [focusView, setFocusView] = useState('all');
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [highlightedDetail, setHighlightedDetail] = useState<string | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(INITIAL_PROMPTS);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Mobile detection
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handleChange(mql);
    mql.addEventListener('change', handleChange as (e: MediaQueryListEvent) => void);
    return () => mql.removeEventListener('change', handleChange as (e: MediaQueryListEvent) => void);
  }, []);

  const handleDashboardDirectives = useCallback((data: {
    showComponent: string | null;
    showDetail: string | null;
    focusView: string | null;
  }) => {
    if (data.focusView) {
      setFocusView(data.focusView);
    }

    // On mobile chat tab: skip scroll/highlight (inline card handles it)
    if (data.showComponent && (!isMobile || activeTab === 'dashboard')) {
      setHighlightedSection(data.showComponent);
      setHighlightedDetail(data.showDetail);

      setTimeout(() => {
        const ref = sectionRefs.current[data.showComponent!];
        if (ref) {
          ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 600);

      setTimeout(() => {
        setHighlightedSection(null);
        setHighlightedDetail(null);
      }, 5000);
    }
  }, [isMobile, activeTab]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setSuggestedPrompts([]);
    setIsTyping(true);

    try {
      const history = messages.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`${API_URL}/api/cfoos/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          userMessage: text.trim(),
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();

      if (data.success && data.response) {
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: data.response,
          showComponent: data.showComponent,
          showDetail: data.showDetail,
        }]);

        handleDashboardDirectives({
          showComponent: data.showComponent,
          showDetail: data.showDetail,
          focusView: data.focusView,
        });

        if (data.suggestedPrompts?.length > 0) {
          setSuggestedPrompts(data.suggestedPrompts);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Try again.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, handleDashboardDirectives]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const sortedSections = [...config.sections].sort((a, b) => a.priority - b.priority);
  const allowedComponents = VIEW_FILTER[focusView] || VIEW_FILTER.all;
  const visibleSections = sortedSections.filter((s) => allowedComponents.includes(s.component));

  const showChat = !isMobile || activeTab === 'chat';
  const showDashboard = !isMobile || activeTab === 'dashboard';

  // --- Shared sub-components ---

  const MobileTabBar = () => (
    <div
      style={{
        display: 'flex',
        borderBottom: `1px solid ${tokens.colors.border}`,
        background: tokens.colors.bg,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {(['chat', 'dashboard'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={{
            flex: 1,
            padding: `${tokens.spacing.md} 0`,
            background: 'none',
            border: 'none',
            borderBottom: `2px solid ${activeTab === tab ? tokens.colors.gold : 'transparent'}`,
            color: activeTab === tab ? tokens.colors.gold : tokens.colors.muted,
            fontFamily: tokens.fonts.body,
            fontSize: '14px',
            fontWeight: activeTab === tab ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {tab === 'chat' ? 'Chat' : 'Dashboard'}
        </button>
      ))}
    </div>
  );

  // --- Chat Panel ---
  const chatPanel = (
    <div
      style={{
        width: isMobile ? '100%' : '40%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: isMobile ? 'none' : `1px solid ${tokens.colors.border}`,
        height: isMobile ? 'calc(100dvh - 50px)' : '100vh',
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          padding: `${tokens.spacing.lg} ${isMobile ? tokens.spacing.lg : tokens.spacing.xl}`,
          borderBottom: `1px solid ${tokens.colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: 700, color: tokens.colors.text }}>
            Summit Ridge Builders
          </div>
          <div style={{ fontSize: '12px', color: tokens.colors.muted, marginTop: '2px' }}>
            AI CFO &middot; Feb 2026
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: tokens.colors.goldDim,
            padding: '4px 10px',
            borderRadius: tokens.radii.sm,
          }}
        >
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: tokens.colors.green, animation: 'pulse 2s infinite' }} />
          <span style={{ fontFamily: tokens.fonts.mono, fontSize: '11px', color: tokens.colors.gold, fontWeight: 600 }}>Live</span>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? tokens.spacing.lg : tokens.spacing.xl,
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing.md,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeSlideIn 0.3s ease both',
            }}
          >
            <div
              style={{
                maxWidth: isMobile ? '95%' : '85%',
                fontSize: isMobile ? '13px' : '14px',
                lineHeight: 1.6,
                ...(msg.role === 'user'
                  ? {
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: '16px 16px 4px 16px',
                      padding: '10px 16px',
                      color: 'rgba(255,255,255,0.9)',
                    }
                  : {
                      color: 'rgba(255,255,255,0.8)',
                    }),
              }}
            >
              {msg.content.split('\n').map((line, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {line}
                </span>
              ))}
              {/* Inline data card on mobile */}
              {isMobile && msg.role === 'assistant' && msg.showComponent && (
                <InlineDataCard
                  component={msg.showComponent}
                  detail={msg.showDetail ?? null}
                  config={config}
                  onViewDashboard={() => {
                    setActiveTab('dashboard');
                    setTimeout(() => {
                      handleDashboardDirectives({
                        showComponent: msg.showComponent!,
                        showDetail: msg.showDetail ?? null,
                        focusView: null,
                      });
                    }, 100);
                  }}
                />
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', gap: '4px', padding: '8px 0', animation: 'fadeSlideIn 0.3s ease both' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.4)',
                  animation: `bounce 1.2s ease-in-out ${i * 150}ms infinite`,
                }}
              />
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {suggestedPrompts.length > 0 && !isTyping && (
        <div
          style={{
            padding: `0 ${isMobile ? tokens.spacing.lg : tokens.spacing.xl} ${tokens.spacing.md}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: tokens.spacing.sm,
          }}
        >
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              style={{
                background: 'transparent',
                border: `1px solid ${tokens.colors.border}`,
                color: tokens.colors.muted,
                padding: isMobile ? '6px 12px' : '8px 14px',
                borderRadius: '20px',
                fontSize: isMobile ? '11px' : '12px',
                fontFamily: tokens.fonts.body,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${tokens.colors.gold}60`;
                e.currentTarget.style.color = tokens.colors.gold;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.border;
                e.currentTarget.style.color = tokens.colors.muted;
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: `${tokens.spacing.md} ${isMobile ? tokens.spacing.lg : tokens.spacing.xl} ${tokens.spacing.xl}` }}>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              gap: tokens.spacing.sm,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radii.lg,
              padding: '4px 4px 4px 16px',
            }}
          >
            <input
              type="text"
              placeholder="Ask about your numbers..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: tokens.colors.text,
                fontFamily: tokens.fonts.body,
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: tokens.radii.md,
                border: 'none',
                background: inputValue.trim() ? tokens.colors.gold : 'rgba(255,255,255,0.1)',
                color: inputValue.trim() ? tokens.colors.bg : 'rgba(255,255,255,0.3)',
                cursor: inputValue.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              &#x2191;
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // --- Dashboard Panel ---
  const dashboardPanel = (
    <div
      ref={dashboardRef}
      style={{
        width: isMobile ? '100%' : '60%',
        height: isMobile ? 'calc(100dvh - 50px)' : '100vh',
        overflowY: 'auto',
        background: tokens.colors.bg,
      }}
    >
      {/* Dashboard Header */}
      <div
        style={{
          padding: `${tokens.spacing.lg} ${isMobile ? tokens.spacing.lg : tokens.spacing.xl}`,
          borderBottom: `1px solid ${tokens.colors.border}`,
        }}
      >
        <div style={{ fontSize: '10px', color: tokens.colors.dim, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
          CFO OS Dashboard
        </div>
        <div style={{ fontSize: '13px', color: tokens.colors.muted }}>
          Houston, TX &middot; Residential Construction &middot; {fmt(8400000)} TTM
        </div>
      </div>

      {/* Dashboard Content */}
      <div style={{ padding: isMobile ? tokens.spacing.lg : tokens.spacing.xl }}>
        {/* Executive Summary */}
        <div
          ref={(el) => { sectionRefs.current['KPIs'] = el; }}
          style={{
            marginBottom: tokens.spacing.xl,
            transition: 'all 0.4s ease',
            ...(highlightedSection === 'KPIs' ? highlightStyle : {}),
          }}
        >
          <p
            style={{
              fontSize: isMobile ? '13px' : '14px',
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

        {/* Alerts */}
        {config.alerts.length > 0 && (
          <div
            ref={(el) => { sectionRefs.current['alerts'] = el; }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.spacing.sm,
              marginBottom: tokens.spacing.xl,
              transition: 'all 0.4s ease',
              ...(highlightedSection === 'alerts' ? highlightStyle : {}),
            }}
          >
            {config.alerts.map((alert, i) => (
              <AlertBanner key={i} {...alert} />
            ))}
          </div>
        )}

        {/* Sections */}
        {visibleSections.map((section, i) => {
          const Component = COMPONENT_MAP[section.component];
          if (!Component) return null;

          const isHighlighted = highlightedSection === section.component;
          const props = { ...section.props };
          if (isHighlighted && highlightedDetail) {
            props.highlight = highlightedDetail;
          }

          return (
            <div
              key={section.id}
              ref={(el) => { sectionRefs.current[section.component] = el; }}
              style={{
                marginBottom: tokens.spacing.xl,
                animation: `fadeSlideIn 0.4s ease ${i * 0.08}s both`,
                transition: 'all 0.4s ease',
                borderRadius: tokens.radii.lg,
                ...(isHighlighted ? highlightStyle : {}),
              }}
            >
              <SectionHeader title={section.title} badge={section.badge} />
              <Component {...props} />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: `1px solid ${tokens.colors.border}`,
          padding: `${tokens.spacing.lg} ${tokens.spacing.xl}`,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '12px', color: tokens.colors.dim }}>
          CFO OS &middot; The CFO Line
        </span>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        height: '100dvh',
        background: tokens.colors.bg,
        fontFamily: tokens.fonts.body,
      }}
    >
      {isMobile && <MobileTabBar />}
      {showChat && chatPanel}
      {showDashboard && dashboardPanel}

      {/* Animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(201, 168, 76, 0.15); }
          50% { box-shadow: 0 0 30px rgba(201, 168, 76, 0.3); }
        }
        input::placeholder {
          color: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}

const highlightStyle: React.CSSProperties = {
  outline: `1px solid rgba(201, 168, 76, 0.35)`,
  outlineOffset: '4px',
  boxShadow: `0 0 20px rgba(201, 168, 76, 0.15)`,
  borderRadius: tokens.radii.lg,
  animation: 'glowPulse 2s ease-in-out infinite',
};
