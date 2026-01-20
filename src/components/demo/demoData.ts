// ============================================
// DATA MODEL - Glow Aesthetics Med Spa
// ============================================

export const monthlyPnL = [
  { month: 'Jul', revenue: 287000, cogs: 57400, labor: 114800, overhead: 43050, netIncome: 71750 },
  { month: 'Aug', revenue: 312000, cogs: 62400, labor: 124800, overhead: 46800, netIncome: 78000 },
  { month: 'Sep', revenue: 298000, cogs: 59600, labor: 119200, overhead: 44700, netIncome: 74500 },
  { month: 'Oct', revenue: 325000, cogs: 65000, labor: 130000, overhead: 48750, netIncome: 81250 },
  { month: 'Nov', revenue: 341000, cogs: 68200, labor: 136400, overhead: 51150, netIncome: 85250 },
  { month: 'Dec', revenue: 289000, cogs: 57800, labor: 115600, overhead: 43350, netIncome: 72250 },
  { month: 'Jan', revenue: 267000, cogs: 53400, labor: 106800, overhead: 40050, netIncome: 66750 },
  { month: 'Feb', revenue: 298000, cogs: 59600, labor: 119200, overhead: 44700, netIncome: 74500 },
  { month: 'Mar', revenue: 334000, cogs: 66800, labor: 133600, overhead: 50100, netIncome: 83500 },
  { month: 'Apr', revenue: 356000, cogs: 71200, labor: 142400, overhead: 53400, netIncome: 89000 },
  { month: 'May', revenue: 378000, cogs: 75600, labor: 151200, overhead: 56700, netIncome: 94500 },
  { month: 'Jun', revenue: 392000, cogs: 78400, labor: 156800, overhead: 58800, netIncome: 98000 },
];

export const cashFlow = [
  { month: 'Jul', operating: 71750, collections: 258300, payables: -52000, netCash: 42050, balance: 145000 },
  { month: 'Aug', operating: 78000, collections: 274000, payables: -58000, netCash: 38000, balance: 183000 },
  { month: 'Sep', operating: 74500, collections: 289000, payables: -61000, netCash: 28500, balance: 211500 },
  { month: 'Oct', operating: 81250, collections: 278000, payables: -63000, netCash: 15250, balance: 226750 },
  { month: 'Nov', operating: 85250, collections: 312000, payables: -67000, netCash: 33250, balance: 260000 },
  { month: 'Dec', operating: 72250, collections: 298000, payables: -71000, netCash: -700, balance: 259300 },
  { month: 'Jan', operating: 66750, collections: 245000, payables: -54000, netCash: -42250, balance: 217050 },
  { month: 'Feb', operating: 74500, collections: 254000, payables: -58000, netCash: -29500, balance: 187550 },
  { month: 'Mar', operating: 83500, collections: 278000, payables: -64000, netCash: -2500, balance: 185050 },
  { month: 'Apr', operating: 89000, collections: 321000, payables: -69000, netCash: 27000, balance: 212050 },
  { month: 'May', operating: 94500, collections: 348000, payables: -73000, netCash: 40500, balance: 252550 },
  { month: 'Jun', operating: 98000, collections: 371000, payables: -76000, netCash: 57000, balance: 309550 },
];

export const arAging = [
  { bucket: 'Current', amount: 67000, percentage: 54, color: '#22c55e' },
  { bucket: '1-30', amount: 31000, percentage: 25, color: '#84cc16' },
  { bucket: '31-60', amount: 15000, percentage: 12, color: '#eab308' },
  { bucket: '61-90', amount: 7400, percentage: 6, color: '#f97316' },
  { bucket: '90+', amount: 3700, percentage: 3, color: '#ef4444' },
];

export const providerMetrics = [
  { name: 'Dr. Sarah Chen', role: 'Medical Director', revenue: 156000, sessions: 312, avgTicket: 500, utilization: 87, margin: 62 },
  { name: 'Jessica Moore', role: 'NP', revenue: 134000, sessions: 402, avgTicket: 333, utilization: 92, margin: 58 },
  { name: 'Amanda Torres', role: 'Aesthetician', revenue: 89000, sessions: 534, avgTicket: 167, utilization: 78, margin: 71 },
  { name: 'Dr. Michael Park', role: 'MD (PT)', revenue: 67000, sessions: 134, avgTicket: 500, utilization: 45, margin: 54 },
  { name: 'Rachel Kim', role: 'Aesthetician', revenue: 54000, sessions: 324, avgTicket: 167, utilization: 65, margin: 68 },
];

export const serviceBreakdown = [
  { service: 'Injectables', revenue: 189000, margin: 64 },
  { service: 'Laser', revenue: 98000, margin: 71 },
  { service: 'Facials', revenue: 67000, margin: 68 },
  { service: 'Body', revenue: 54000, margin: 58 },
  { service: 'Retail', revenue: 34000, margin: 42 },
];

export type PanelType = 'cashflow' | 'pnl' | 'ar' | 'providers' | null;
export type HighlightType = 'janfeb' | 'conversion' | 'metrics' | 'margin' | 'services' | 'aging' | 'utilization' | 'drpark' | null;
