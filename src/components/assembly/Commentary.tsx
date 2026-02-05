'use client';

import { tokens } from '@/lib/assemblyTokens';
import type { CommentaryConfig } from '@/lib/types/assemblyConfig';

interface CommentaryProps {
  notes: CommentaryConfig[];
}

export function Commentary({ notes }: CommentaryProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
      {notes.map((note, i) => (
        <div
          key={i}
          style={{
            background: tokens.colors.surface,
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: tokens.radii.md,
            padding: tokens.spacing.lg,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md, marginBottom: tokens.spacing.sm }}>
            <span
              style={{
                fontFamily: tokens.fonts.mono,
                fontSize: '11px',
                color: tokens.colors.gold,
                fontWeight: 500,
              }}
            >
              {note.date}
            </span>
            <span style={{ fontFamily: tokens.fonts.body, fontSize: '12px', color: tokens.colors.dim }}>
              {note.author}
            </span>
          </div>
          <div
            style={{
              fontFamily: tokens.fonts.body,
              fontSize: '14px',
              color: tokens.colors.textSecondary,
              lineHeight: 1.6,
            }}
          >
            {note.note}
          </div>
        </div>
      ))}
    </div>
  );
}
