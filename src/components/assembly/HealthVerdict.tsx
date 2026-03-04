'use client';

import { tokens, statusColor } from '@/lib/assemblyTokens';
import type { Status, PriorityAction } from '@/lib/types/assemblyConfig';

interface HealthVerdictProps {
  status: Status;
  headline: string;
  sub_line: string;
  priority_actions: PriorityAction[];
  onNavigateToSection?: (component: string, detail?: string) => void;
  onSendChatPrompt?: (prompt: string) => void;
}

const STATUS_LABELS: Record<Status, string> = {
  green: 'HEALTHY',
  yellow: 'WATCH',
  red: 'ACT NOW',
};

export function HealthVerdict({
  status,
  headline,
  sub_line,
  priority_actions,
  onNavigateToSection,
  onSendChatPrompt,
}: HealthVerdictProps) {
  const color = statusColor(status);

  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      {/* Status Banner */}
      <div
        style={{
          background: tokens.colors.surface,
          border: `1px solid ${tokens.colors.border}`,
          borderLeft: `3px solid ${color}`,
          borderRadius: tokens.radii.md,
          padding: `${tokens.spacing.lg} ${tokens.spacing.lg}`,
          marginBottom: tokens.spacing.md,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 8px ${color}60`,
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: tokens.fonts.body,
            }}
          >
            {STATUS_LABELS[status]}
          </span>
        </div>
        <div
          style={{
            fontSize: '17px',
            fontWeight: 600,
            color: tokens.colors.text,
            fontFamily: tokens.fonts.body,
            lineHeight: 1.4,
            marginBottom: '6px',
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: tokens.colors.muted,
            fontFamily: tokens.fonts.body,
            lineHeight: 1.5,
          }}
        >
          {sub_line}
        </div>
      </div>

      {/* Priority Action Cards */}
      {priority_actions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
          {priority_actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onNavigateToSection={onNavigateToSection}
              onSendChatPrompt={onSendChatPrompt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ActionCard({
  action,
  onNavigateToSection,
  onSendChatPrompt,
}: {
  action: PriorityAction;
  onNavigateToSection?: (component: string, detail?: string) => void;
  onSendChatPrompt?: (prompt: string) => void;
}) {
  const severityColor = action.severity === 'critical' ? tokens.colors.red : tokens.colors.yellow;

  return (
    <div
      style={{
        background: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderLeft: `3px solid ${severityColor}`,
        borderRadius: tokens.radii.md,
        padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: tokens.spacing.md }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: tokens.colors.text,
              fontFamily: tokens.fonts.body,
              marginBottom: '4px',
            }}
          >
            {action.headline}
          </div>
          <div
            style={{
              fontSize: '13px',
              color: tokens.colors.textSecondary,
              fontFamily: tokens.fonts.body,
              lineHeight: 1.5,
              marginBottom: '6px',
            }}
          >
            {action.detail}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: tokens.colors.muted,
              fontFamily: tokens.fonts.body,
              fontStyle: 'italic',
            }}
          >
            {action.action}
          </div>
        </div>
        <div
          style={{
            fontFamily: tokens.fonts.mono,
            fontSize: '12px',
            fontWeight: 600,
            color: tokens.colors.gold,
            background: tokens.colors.goldDim,
            padding: '4px 10px',
            borderRadius: tokens.radii.sm,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {action.dollar_impact}
        </div>
      </div>

      {/* Action Links */}
      <div style={{ display: 'flex', gap: tokens.spacing.md, marginTop: tokens.spacing.sm }}>
        {action.linked_section && onNavigateToSection && (
          <button
            onClick={() => onNavigateToSection(action.linked_section!, action.linked_detail)}
            style={{
              background: 'none',
              border: 'none',
              color: tokens.colors.gold,
              fontSize: '12px',
              fontFamily: tokens.fonts.body,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            View \u2192
          </button>
        )}
        {action.chat_prompt && onSendChatPrompt && (
          <button
            onClick={() => onSendChatPrompt(action.chat_prompt!)}
            style={{
              background: 'none',
              border: 'none',
              color: tokens.colors.muted,
              fontSize: '12px',
              fontFamily: tokens.fonts.body,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Ask about this \u2192
          </button>
        )}
      </div>
    </div>
  );
}
