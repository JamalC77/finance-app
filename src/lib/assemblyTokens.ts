export const tokens = {
  colors: {
    bg: '#09090b',
    surface: '#111113',
    surfaceHover: '#18181b',
    border: '#1e1e22',
    borderSubtle: '#27272a',
    text: '#fafafa',
    textSecondary: '#a1a1aa',
    muted: '#71717a',
    dim: '#3f3f46',
    accent: '#10b981',
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    gold: '#c9a84c',
    goldDim: 'rgba(201, 168, 76, 0.15)',
    info: '#3b82f6',
  },
  fonts: {
    body: "'DM Sans', -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', monospace",
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
} as const;

export function fmt(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export function statusColor(status: 'green' | 'yellow' | 'red'): string {
  return tokens.colors[status];
}
