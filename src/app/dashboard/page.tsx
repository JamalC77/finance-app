"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, TrendingUp, BarChart, Eye, ChevronRight, CalendarDays, FileText, Receipt, AlertTriangle, CheckCircle2, BellRing, Lightbulb, PiggyBank, Settings, Sliders, BrainCircuit, BarChart3, ChevronDown, ChevronUp, X, Activity, Users, TrendingDown, Scale, Clock, Briefcase, Target, LineChart, AreaChart as AreaChartIcon, Gauge
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // Keep for simple visuals
import { Tooltip as ShadTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Shadcn Tooltip
import { ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid, Legend, Area, Line, ComposedChart, Bar as RechartsBar, AreaChart as RechartsAreaChart, PieChart, Pie, Cell } from "recharts"; // Recharts
import { useApi } from "@/lib/contexts/ApiContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { quickbooksApi } from "@/lib/services/apiService"; // Assuming this wraps fetch calls

// --------------------------------------------------------------------------------
// TYPES - Match the NEW API Payload Structure
// --------------------------------------------------------------------------------

type MetricChange = {
  mtd?: number; // Only for top-level income/expense/profit
  balance?: number; // Only for cash
  changePercentage?: number;
};

type Margins = {
  netProfitPercent?: number;
  grossProfitPercent?: number;
  operatingProfitPercent?: number;
};

type Liquidity = {
  currentRatio?: number | null;
  quickRatio?: number | null;
  workingCapital?: number;
};

type Solvency = {
  debtToEquity?: number | null;
};

type Efficiency = {
  dso?: number;
  dpo?: number;
};

type AgingBucket = {
  "0-30": number;
  "31-60": number;
  "61-90": number;
  "90+": number;
  total: number;
};

type CashFlowHistoryItem = {
  month: string; // e.g., "Jan 2024"
  income: number;
  expenses: number;
  profit: number;
  // Could add gross profit here if needed
};

type CashFlowForecastItem = {
  month: string; // e.g., "Apr 2025"
  projected_income: number;
  projected_expenses: number;
  projected_balance: number; // Could be cash balance or net profit forecast
};

type BusinessInsight = {
  id: string;
  type: "critical" | "warning" | "info" | "success" | "tip"; // Added 'critical'
  title: string;
  description: string;
  priority: number; // 1-10, 10 is highest
  actionLink?: string;
  actionText?: string;
  relatedMetric?: string; // e.g., "runwayMonths", "dso"
};

type IndustryBenchmark = {
  metric: string; // e.g., "netProfitMargin", "dso"
  average: number;
  percentile_25?: number;
  percentile_75?: number;
};

type RecentActivity = {
  id: string;
  type: string; // e.g., "INVOICE_PAID", "BILL_CREATED" etc. (refine based on helper)
  description: string;
  date: Date; // Ensure conversion from string
  amount: number;
};

type CustomerItem = {
  id: string;
  name: string;
  revenue: number; // Or other relevant metric
};

type CategoryItem = {
  category: string;
  amount: number;
};

// AdvancedMetrics might still be useful for specific raw values not covered elsewhere
type AdvancedMetrics = {
  accountsReceivable?: number;
  accountsPayable?: number;
  yoyIncomeChange?: number;
  yoyProfitChange?: number;
  yoyCashBalance?: number;
  // Add others if the main structure doesn't cover a needed raw value
};

// The main state type
type DashboardData = {
  cash: MetricChange;
  income: MetricChange;
  expenses: MetricChange;
  profitLoss: MetricChange;
  margins: Margins;
  liquidity: Liquidity;
  solvency: Solvency;
  efficiency: Efficiency;
  agingAR: AgingBucket;
  agingAP: AgingBucket;
  runwayMonths?: number | null; // Can be null/infinity if profitable
  cashFlowHistory: CashFlowHistoryItem[]; // 12-24 months
  cashFlowForecast: CashFlowForecastItem[]; // 3-12 months
  businessInsights: BusinessInsight[];
  industryBenchmarks?: IndustryBenchmark[];
  recentActivity: RecentActivity[];
  topCustomers: CustomerItem[];
  topExpenseCategories: CategoryItem[];
  advancedMetrics?: AdvancedMetrics; // Keep for specific overrides or details
  dataSource: "standard" | "quickbooks";
  accountingMethod?: "Cash" | "Accrual";
  lastRefreshed?: string;
};

// Scenario Types
type Scenario = {
  id: string;
  name: string;
  // Define parameters based on what API accepts
  revenueMultiplier?: number;
  expenseMultiplier?: number;
  newRecurringRevenue?: number;
  newRecurringExpense?: number;
  // ... other potential scenario inputs
};

type ScenarioResult = {
    scenarioName: string;
    forecast: CashFlowForecastItem[];
    // Other key result metrics if API returns them
}

// --------------------------------------------------------------------------------
// Utility Functions, Placeholders & Components
// --------------------------------------------------------------------------------

const formatCurrency = (amount?: number | null,compact=false): string => {
  if (amount == null) return "N/A";
   if (compact) {
        return new Intl.NumberFormat("en-US", {
            style: "currency", currency: "USD", notation: "compact",
            minimumFractionDigits: 0, maximumFractionDigits: 1
        }).format(amount);
    }
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (amount?: number | null, decimals = 1): string => {
  if (amount == null) return "N/A";
  return amount.toFixed(decimals);
};

const formatPercentage = (value?: number | null): string => {
  if (value == null) return "N/A";
  return `${value.toFixed(1)}%`;
};

const formatDate = (date?: string | Date): string => {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
  } catch {
    return String(date); // Fallback if date is invalid
  }
};

// Map insight type to icon and color
const getInsightPresentation = (type: BusinessInsight["type"]) => {
  switch (type) {
    case "critical": return { Icon: AlertTriangle, color: "text-red-600 dark:text-red-500", bgColor: "bg-red-100 dark:bg-red-900/30" };
    case "warning": return { Icon: AlertTriangle, color: "text-amber-600 dark:text-amber-500", bgColor: "bg-amber-100 dark:bg-amber-900/30" };
    case "success": return { Icon: CheckCircle2, color: "text-green-600 dark:text-green-500", bgColor: "bg-green-100 dark:bg-green-900/30" };
    case "info": return { Icon: FileText, color: "text-blue-600 dark:text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/30" };
    case "tip": return { Icon: Lightbulb, color: "text-purple-600 dark:text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-900/30" };
    default: return { Icon: Eye, color: "text-gray-600 dark:text-gray-400", bgColor: "bg-gray-100 dark:bg-gray-800" };
  }
};

// Map activity type to icon
const getActivityIcon = (type: string) => {
   switch (type.toUpperCase()) {
        case "INVOICE_PAID": return <DollarSign className="h-4 w-4 text-green-500" />;
        case "INVOICE_SENT": case "INVOICE_CREATED": return <FileText className="h-4 w-4 text-blue-500" />;
        case "EXPENSE_PAID": case "BILL_PAID": return <CreditCard className="h-4 w-4 text-red-500" />;
        case "EXPENSE_RECORDED": case "BILL_CREATED": return <Receipt className="h-4 w-4 text-yellow-600" />;
        case "CUSTOMER_PAYMENT": return <Users className="h-4 w-4 text-teal-500" />
        // Add more types as defined in your `buildRecentActivity` helper
        default: return <Activity className="h-4 w-4" />;
    }
}

// Generic component for displaying a metric with tooltip explanation
const MetricDisplay: React.FC<{ label: string; value: string; tooltip?: string; change?: number; changeDescription?: string; icon?: React.ElementType; isLoading?: boolean }> =
  ({ label, value, tooltip, change, changeDescription = "vs prev period", icon: Icon, isLoading }) => {
    const changeColor = change == null ? "" : change >= 0 ? "text-green-500" : "text-red-500";
    const ChangeIcon = change == null ? null : change >= 0 ? ArrowUpRight : ArrowDownRight;

    if (isLoading) {
       return (
           <Card>
                <CardHeader className="flex flex-row items-center justify-between py-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="h-7 w-20 bg-muted animate-pulse rounded-md mb-2"></div>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded-md"></div>
                </CardContent>
           </Card>
       )
    }

    const content = (
      <>
        <div className="text-2xl font-bold">{value}</div>
        {change != null && ChangeIcon && (
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            <ChangeIcon className={`mr-1 h-4 w-4 ${changeColor}`} />
            <span className={changeColor}>{change >= 0 ? "+" : ""}{formatPercentage(change)}</span>
            <span className="ml-1">{changeDescription}</span>
          </div>
        )}
      </>
    );

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-2">
             <CardTitle className="text-sm font-medium text-muted-foreground">
                {tooltip ? (
                     <TooltipProvider>
                        <ShadTooltip>
                            <TooltipTrigger className="cursor-help underline decoration-dotted">{label}</TooltipTrigger>
                            <TooltipContent><p>{tooltip}</p></TooltipContent>
                        </ShadTooltip>
                    </TooltipProvider>
                ) : label}
            </CardTitle>
           {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent className="pt-0">{content}</CardContent>
      </Card>
    );
  };

// --- NEW Components for Enhanced Data ---

// Card to display key financial ratios
const FinancialRatiosCard: React.FC<{ data: DashboardData; isLoading?: boolean }> = ({ data, isLoading }) => {
   const { margins, liquidity, solvency, efficiency } = data;

   const getRatioColor = (value: number | null | undefined, thresholds: [number, number]) => {
       if (value == null) return "text-muted-foreground";
       if (value >= thresholds[1]) return "text-green-500";
       if (value >= thresholds[0]) return "text-amber-500";
       return "text-red-500";
   }

    if (isLoading) {
        return <Card><CardHeader><CardTitle>Key Ratios</CardTitle></CardHeader><CardContent className="space-y-2"><div className="h-5 w-full bg-muted animate-pulse rounded"></div><div className="h-5 w-full bg-muted animate-pulse rounded"></div><div className="h-5 w-full bg-muted animate-pulse rounded"></div></CardContent></Card>;
    }

   return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Key Financial Ratios</CardTitle>
                <CardDescription>Health indicators at a glance</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {/* Margins */}
                 <div className="flex justify-between items-center"><span className="text-muted-foreground">Gross Profit</span> <span className={getRatioColor(margins.grossProfitPercent, [15, 30])}>{formatPercentage(margins.grossProfitPercent)}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Operating Profit</span> <span className={getRatioColor(margins.operatingProfitPercent, [10, 20])}>{formatPercentage(margins.operatingProfitPercent)}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Net Profit</span> <span className={getRatioColor(margins.netProfitPercent, [5, 15])}>{formatPercentage(margins.netProfitPercent)}</span></div>

                 {/* Liquidity */}
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Current Ratio</span> <span className={getRatioColor(liquidity.currentRatio, [1.0, 1.5])}>{formatNumber(liquidity.currentRatio, 2) ?? "N/A"}</span></div>
                 <div className="flex justify-between items-center"><span className="text-muted-foreground">Quick Ratio</span> <span className={getRatioColor(liquidity.quickRatio, [0.8, 1.0])}>{formatNumber(liquidity.quickRatio, 2) ?? "N/A"}</span></div>
                 <div className="flex justify-between items-center"><span className="text-muted-foreground">Working Capital</span> <span>{formatCurrency(liquidity.workingCapital)}</span></div>

                 {/* Efficiency */}
                 <div className="flex justify-between items-center"><span className="text-muted-foreground">DSO</span> <span className={getRatioColor(efficiency.dso ? -efficiency.dso : null, [-60, -45])}>{efficiency.dso ?? "N/A"} days</span></div>
                 <div className="flex justify-between items-center"><span className="text-muted-foreground">DPO</span> <span>{efficiency.dpo ?? "N/A"} days</span></div>

                {/* Solvency - More relevant for larger companies */}
                {/* <div className="flex justify-between items-center"><span className="text-muted-foreground">Debt/Equity</span> <span>{formatNumber(solvency.debtToEquity, 2)}</span></div> */}

            </CardContent>
        </Card>
   )
}

// Card for AR/AP Aging
const AgingSummaryCard: React.FC<{ ar: AgingBucket; ap: AgingBucket; isLoading?: boolean }> = ({ ar, ap, isLoading }) => {
    const agingData = [
        { name: '0-30', AR: ar?.["0-30"] ?? 0, AP: ap?.["0-30"] ?? 0 },
        { name: '31-60', AR: ar?.["31-60"] ?? 0, AP: ap?.["31-60"] ?? 0 },
        { name: '61-90', AR: ar?.["61-90"] ?? 0, AP: ap?.["61-90"] ?? 0 },
        { name: '90+', AR: ar?.["90+"] ?? 0, AP: ap?.["90+"] ?? 0 },
    ];
    const totalAR = ar?.total ?? 0;
    const totalAP = ap?.total ?? 0;
    const overdueAR = totalAR - (ar?.["0-30"] ?? 0);

     if (isLoading) {
        return <Card><CardHeader><CardTitle>AR / AP Aging</CardTitle></CardHeader><CardContent><div className="h-40 w-full bg-muted animate-pulse rounded"></div></CardContent></Card>;
    }

    return (
        <Card>
             <CardHeader>
                <CardTitle className="text-lg">AR / AP Aging</CardTitle>
                <CardDescription>Receivables vs. Payables by age</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="mb-3 space-y-1 text-sm">
                    <div className="flex justify-between"><span>Total Receivables:</span> <span className="font-medium">{formatCurrency(totalAR)}</span></div>
                    <div className="flex justify-between"><span>Total Payables:</span> <span className="font-medium">{formatCurrency(totalAP)}</span></div>
                     <div className="flex justify-between"><span className="text-red-500">Overdue AR (>30d):</span> <span className="font-medium text-red-500">{formatCurrency(overdueAR)}</span></div>
                 </div>
                 <div className="h-[150px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={agingData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" fontSize={10} tickFormatter={(val) => formatCurrency(val, true)} />
                            <YAxis dataKey="name" type="category" fontSize={10} />
                            <RechartsTooltip formatter={(value: number, name: string) => [formatCurrency(value), name === 'AR' ? 'Receivable' : 'Payable']} />
                            <Legend wrapperStyle={{ fontSize: '10px' }}/>
                            <RechartsBar dataKey="AR" name="Receivable" fill="#3b82f6" barSize={15} />
                             <RechartsBar dataKey="AP" name="Payable" fill="#f43f5e" barSize={15} />
                        </ComposedChart>
                    </ResponsiveContainer>
                 </div>
            </CardContent>
        </Card>
    )
}

// Card for Cash Runway
const RunwayCard: React.FC<{ months?: number | null; isLoading?: boolean }> = ({ months, isLoading }) => {
    let text = "N/A";
    let description = "Runway not calculated";
    let color = "text-muted-foreground";
    let Icon = Clock;

    if (isLoading) {
        return <Card><CardHeader><CardTitle>Cash Runway</CardTitle></CardHeader><CardContent><div className="h-10 w-24 bg-muted animate-pulse rounded"></div></CardContent></Card>;
    }

    if (months === null || months === undefined) {
        // Handle N/A or error state
    } else if (months < 0) { // Indicates profitability / positive cash flow
        text = "Profitable";
        description = "Currently cash flow positive";
        color = "text-green-500";
        Icon = TrendingUp;
    } else {
        text = `${months.toFixed(1)} months`;
        description = `Estimated runway at current burn rate`;
        if (months < 3) { color = "text-red-500"; Icon = AlertTriangle; }
        else if (months < 6) { color = "text-amber-500"; Icon = Clock; }
        else { color = "text-green-500"; Icon = CheckCircle2; }
    }

    return (
         <Card>
            <CardHeader className="pb-2">
                 <CardTitle className="text-lg flex items-center"><Icon className={`mr-2 h-5 w-5 ${color}`} />Cash Runway</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className={`text-3xl font-bold ${color}`}>{text}</div>
                <p className="text-xs text-muted-foreground pt-1">{description}</p>
            </CardContent>
        </Card>
    )
}

// Component for Trend Chart (12/24 months)
const TrendChart: React.FC<{ data: CashFlowHistoryItem[]; isLoading?: boolean }> = ({ data, isLoading }) => {
    if (isLoading) {
       return <Card><CardHeader><CardTitle>Financial Trends</CardTitle></CardHeader><CardContent><div className="h-80 w-full bg-muted animate-pulse rounded"></div></CardContent></Card>;
    }
     if (!data || data.length === 0) {
         return <Card><CardHeader><CardTitle>Financial Trends</CardTitle></CardHeader><CardContent><p className="text-center text-muted-foreground py-10">No historical data available.</p></CardContent></Card>;
     }

     // Show last 12 months if more data is available
    const chartData = data.slice(-12);

    return (
         <Card>
            <CardHeader>
                <CardTitle className="text-lg">Financial Trends (Last 12 Months)</CardTitle>
                <CardDescription>Income, Expenses, and Profit over time</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#888888" fontSize={10} angle={-30} textAnchor="end" height={40} interval={0}/>
                            <YAxis stroke="#888888" fontSize={10} tickFormatter={(value) => formatCurrency(value, true)} />
                            <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                             <RechartsBar dataKey="income" name="Income" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                             <RechartsBar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                             <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }}/>
                        </ComposedChart>
                     </ResponsiveContainer>
                 </div>
            </CardContent>
         </Card>
    );
};

// Component for Forecast Chart
const ForecastChart: React.FC<{ data: CashFlowForecastItem[]; isLoading?: boolean }> = ({ data, isLoading }) => {
     if (isLoading) {
       return <Card><CardHeader><CardTitle>Cash Flow Forecast</CardTitle></CardHeader><CardContent><div className="h-80 w-full bg-muted animate-pulse rounded"></div></CardContent></Card>;
    }
     if (!data || data.length === 0) {
         return <Card><CardHeader><CardTitle>Cash Flow Forecast</CardTitle></CardHeader><CardContent><p className="text-center text-muted-foreground py-10">No forecast data available.</p></CardContent></Card>;
     }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Cash Flow Forecast ({data.length} Months)</CardTitle>
                <CardDescription>Projected financial position</CardDescription>
            </CardHeader>
             <CardContent>
                <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <RechartsAreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#888888" fontSize={10} />
                            <YAxis stroke="#888888" fontSize={10} tickFormatter={(value) => formatCurrency(value, true)} />
                            <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend wrapperStyle={{ fontSize: '12px' }}/>
                            {/* Optional: Show Income/Expense areas */}
                            {/* <Area type="monotone" dataKey="projected_income" name="Proj. Income" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} /> */}
                            {/* <Area type="monotone" dataKey="projected_expenses" name="Proj. Expenses" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} /> */}
                            <Area type="monotone" dataKey="projected_balance" name="Proj. Cash Balance" stroke="#10b981" fillOpacity={1} fill="url(#colorBalance)" />
                            <Line type="monotone" dataKey="projected_balance" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                        </RechartsAreaChart>
                    </ResponsiveContainer>
                </div>
             </CardContent>
        </Card>
    );
};

// Component for Virtual CFO / Insights Feed
const InsightsFeed: React.FC<{ insights: BusinessInsight[]; isLoading?: boolean }> = ({ insights, isLoading }) => {
     const [showAll, setShowAll] = useState(false);

     if (isLoading) {
         return <Card><CardHeader><CardTitle>Insights & Alerts</CardTitle></CardHeader><CardContent className="space-y-2"><div className="h-8 w-full bg-muted animate-pulse rounded"></div><div className="h-8 w-full bg-muted animate-pulse rounded"></div></CardContent></Card>;
     }

    const sortedInsights = [...insights].sort((a, b) => b.priority - a.priority); // Highest priority first
    const displayedInsights = showAll ? sortedInsights : sortedInsights.slice(0, 3); // Show top 3 initially

    if (!insights || insights.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center"><BrainCircuit className="mr-2 h-5 w-5 text-primary"/>Insights & Alerts</CardTitle>
                </CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">No specific insights generated at this time.</p></CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center"><BrainCircuit className="mr-2 h-5 w-5 text-primary"/>Insights & Alerts</CardTitle>
                <CardDescription>Actionable intelligence based on your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {displayedInsights.map((insight) => {
                    const { Icon, color, bgColor } = getInsightPresentation(insight.type);
                    return (
                        <div key={insight.id} className={`p-3 rounded-md border ${bgColor} border-opacity-30 dark:border-opacity-20`}>
                            <div className="flex items-start space-x-2">
                                <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${color}`} aria-hidden="true" />
                                <div>
                                    <h4 className={`text-sm font-semibold ${color}`}>{insight.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                                    {insight.actionLink && insight.actionText && (
                                        <Button variant="link" size="sm" asChild className="p-0 mt-1 h-auto text-blue-600 hover:text-blue-800">
                                            <Link href={insight.actionLink}>{insight.actionText} <ChevronRight className="ml-1 h-3 w-3"/></Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
             {sortedInsights.length > 3 && (
                 <CardFooter className="pt-0">
                     <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => setShowAll(!showAll)}>
                         {showAll ? 'Show Fewer Insights' : `Show All ${sortedInsights.length} Insights`}
                         {showAll ? <ChevronUp className="ml-1 h-4 w-4"/> : <ChevronDown className="ml-1 h-4 w-4"/>}
                     </Button>
                 </CardFooter>
             )}
        </Card>
    );
};

// --- Scenario Planner (Modal remains similar, but interaction changes) ---
function ScenarioPlanner({
  onClose,
  onRunScenario, // Changed from onAddScenario
}: {
  onClose: () => void;
  onRunScenario: (scenarioParams: Omit<Scenario, 'id'>) => void; // Pass params back for API call
}) {
  const [scenarioName, setScenarioName] = useState("New Scenario");
  const [revenueMultiplier, setRevenueMultiplier] = useState(1.0);
  const [expenseMultiplier, setExpenseMultiplier] = useState(1.0);
  // Add more state for other potential scenario parameters

  const handleRun = () => {
    const params: Omit<Scenario, 'id'> = {
      name: scenarioName,
      revenueMultiplier,
      expenseMultiplier,
      // Add other params
    };
    onRunScenario(params); // Trigger API call in parent
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
      <Card className="w-full max-w-md">
         <CardHeader className="relative">
             <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose}><X className="h-4 w-4" /></Button>
             <CardTitle>Create Scenario Forecast</CardTitle>
            <CardDescription>Model changes to revenue and expenses.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
             {/* Input fields for scenario name, multipliers, etc. */}
              <div className="space-y-2">
                 <label className="text-sm font-medium">Scenario Name</label>
                 <input type="text" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"/>
             </div>
             <div className="space-y-2">
                 <label className="text-sm font-medium">Revenue Multiplier (e.g., 1.1 for +10%)</label>
                 <input type="number" step="0.05" min="0" value={revenueMultiplier} onChange={(e) => setRevenueMultiplier(parseFloat(e.target.value) || 1.0)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"/>
             </div>
             <div className="space-y-2">
                 <label className="text-sm font-medium">Expense Multiplier (e.g., 0.9 for -10%)</label>
                 <input type="number" step="0.05" min="0" value={expenseMultiplier} onChange={(e) => setExpenseMultiplier(parseFloat(e.target.value) || 1.0)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"/>
             </div>
             {/* Add more input fields as needed */}
         </CardContent>
         <CardFooter className="flex justify-end space-x-2">
             <Button variant="outline" onClick={onClose}>Cancel</Button>
             <Button onClick={handleRun}>Run Scenario Forecast</Button>
         </CardFooter>
      </Card>
    </div>
  );
}


// --------------------------------------------------------------------------------
// MAIN DASHBOARD PAGE
// --------------------------------------------------------------------------------
export default function DashboardPage() {
  // --- State ---
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "error">("checking");
  const auth = useAuth();
  // const api = useApi(); // Use if needed for non-QB API calls

  // Scenario State
  const [showScenarioPlanner, setShowScenarioPlanner] = useState(false);
  const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([]);
   const [isScenarioRunning, setIsScenarioRunning] = useState(false);

  // --- Data Loading ---
  const loadDashboardData = useCallback(async (forceRefresh = false) => {
    if (auth.isLoading || !auth.isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    setApiStatus("checking");

    try {
      const token = auth.token || "";
      // TODO: Add logic to check cache status if implementing client-side caching on top
      // For now, always fetches from API

      // Check QB Connection first (optional, API handles this)
      // const connectionResponse = await quickbooksApi.getConnectionStatus(token);
      // if (!connectionResponse.data?.connected) { ... }

      const qbDashboardResponse = await quickbooksApi.getDashboardData(token); // Call the ENHANCED API

      if (qbDashboardResponse.success && qbDashboardResponse.data) {
        const data = qbDashboardResponse.data as DashboardData;
        // Convert date strings to Date objects if necessary (check API output format)
        const processedData: DashboardData = {
            ...data,
            recentActivity: data.recentActivity?.map(item => ({ ...item, date: new Date(item.date) })) ?? [],
            // Ensure other nested date fields are converted if needed
        };
        setDashboardData(processedData);
        setApiStatus("connected");
      } else {
         throw new Error(qbDashboardResponse.message || "Failed to fetch QuickBooks data.");
      }
    } catch (err: any) {
      console.error("Error loading dashboard data:", err);
      const errorMessage = err.response?.data?.message || err.message || "An unknown error occurred.";
      setError(errorMessage);
      toast({ title: "Dashboard Error", description: errorMessage, variant: "destructive" });
      setApiStatus("error");
      setDashboardData(null); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.token]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      loadDashboardData();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAuthenticated]); // Run only when auth status changes

    // --- Scenario Handling ---
   const handleRunScenario = async (scenarioParams: Omit<Scenario, 'id'>) => {
       if (!auth.token) return;
        setIsScenarioRunning(true);
       try {
           const response = await quickbooksApi.runScenario(auth.token, scenarioParams); // Call the new scenario endpoint
           if (response.success && response.data) {
               setScenarioResults(prev => [...prev, response.data as ScenarioResult]); // Add results
               toast({ title: "Scenario Forecast Generated", description: `Results for "${response.data.scenarioName}" added.`});
           } else {
               throw new Error(response.message || "Failed to run scenario.");
           }
       } catch (err: any) {
           console.error("Scenario run error:", err);
           toast({ title: "Scenario Error", description: err.message || "Could not generate scenario forecast.", variant: "destructive" });
       } finally {
           setIsScenarioRunning(false);
       }
   };

   const handleRemoveScenario = (scenarioName: string) => {
       setScenarioResults(prev => prev.filter(s => s.scenarioName !== scenarioName));
   };


  // --- Render Logic ---

  // Tooltip Formatters for Charts
  const tooltipCurrencyFormatter = (value: number) => formatCurrency(value);
  const tooltipLabelFormatter = (label: string) => label; // Keep simple month label


   // Loading / Auth States
   if (auth.isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Checking authentication...</div>;
  }
  if (!auth.isAuthenticated) {
    // Or redirect to login
    return <div className="p-6 text-center text-muted-foreground">Please log in to view the dashboard.</div>;
  }
   if (isLoading && !dashboardData) {
     // Initial loading skeleton for the whole page could go here
      return <div className="p-6 space-y-4 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="h-24 bg-muted rounded"></div>
             <div className="h-24 bg-muted rounded"></div>
             <div className="h-24 bg-muted rounded"></div>
             <div className="h-24 bg-muted rounded"></div>
          </div>
          <div className="h-60 bg-muted rounded"></div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
             <div className="h-96 bg-muted rounded"></div>
             <div className="h-96 bg-muted rounded"></div>
             <div className="h-96 bg-muted rounded"></div>
          </div>
      </div>;
   }
   if (error && !dashboardData) {
       return (
           <div className="p-6 space-y-4">
               <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                   <Button variant="outline" size="sm" onClick={() => loadDashboardData(true)} disabled={isLoading}>
                       {isLoading ? "Retrying..." : "Retry Load"}
                   </Button>
               </div>
                <Card className="border-destructive bg-destructive/10">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center"><AlertTriangle className="mr-2"/> Data Load Error</CardTitle>
                    </CardHeader>
                    <CardContent><p>{error}</p></CardContent>
                </Card>
                 {/* Optionally show fallback structure or link to integrations */}
           </div>
       );
   }
   // If data is loaded (or partially loaded after an error retry)
   const data = dashboardData!; // Assert data is not null here

  return (
    <div className="space-y-6 p-4 md:p-6 relative">
      {/* Scenario Planner Modal */}
      {showScenarioPlanner && (
        <ScenarioPlanner
          onClose={() => setShowScenarioPlanner(false)}
          onRunScenario={handleRunScenario}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          {data.dataSource === "quickbooks" && <Badge className="bg-blue-100 text-blue-800 border-blue-300">QuickBooks</Badge>}
           {data.accountingMethod && <Badge variant="outline">{data.accountingMethod} Basis</Badge>}
        </div>
        <div className="flex items-center space-x-2">
           {apiStatus === "error" && <Badge variant="destructive">API Error</Badge>}
           {apiStatus === "connected" && <Badge variant="outline" className="bg-green-100 text-green-800">Connected</Badge>}
           {apiStatus === "checking" && <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Checking...</Badge>}
          <span className="text-xs text-muted-foreground">
            {data.lastRefreshed ? `Refreshed: ${formatDate(data.lastRefreshed)}` : ''}
          </span>
          <Button variant="outline" size="sm" onClick={() => loadDashboardData(true)} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

       {/* --- Main Grid --- */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">

            {/* Col 1: Insights & Key Ratios */}
             <div className="col-span-12 lg:col-span-3 space-y-4 md:space-y-6">
                <InsightsFeed insights={data.businessInsights} isLoading={isLoading}/>
                <FinancialRatiosCard data={data} isLoading={isLoading} />
                 <RunwayCard months={data.runwayMonths} isLoading={isLoading} />
                 <AgingSummaryCard ar={data.agingAR} ap={data.agingAP} isLoading={isLoading} />
            </div>

            {/* Col 2: Core Metrics & Charts */}
            <div className="col-span-12 lg:col-span-9 space-y-4 md:space-y-6">
                 {/* Top Row Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <MetricDisplay label="Cash Balance" value={formatCurrency(data.cash.balance)} tooltip="Total cash across all bank accounts" change={data.cash.changePercentage} changeDescription="vs last month" icon={DollarSign} isLoading={isLoading}/>
                    <MetricDisplay label="MTD Income" value={formatCurrency(data.income.mtd)} tooltip="Month-to-date income (Cash Basis)" change={data.income.changePercentage} changeDescription="vs last month" icon={TrendingUp} isLoading={isLoading}/>
                    <MetricDisplay label="MTD Expenses" value={formatCurrency(data.expenses.mtd)} tooltip="Month-to-date expenses (Cash Basis)" change={data.expenses.changePercentage} changeDescription="vs last month" icon={TrendingDown} isLoading={isLoading}/>
                    <MetricDisplay label="MTD Profit/Loss" value={formatCurrency(data.profitLoss.mtd)} tooltip="Month-to-date net profit or loss (Cash Basis)" change={data.profitLoss.changePercentage} changeDescription="vs last month" icon={Scale} isLoading={isLoading}/>
                 </div>

                {/* Trend Chart */}
                 <TrendChart data={data.cashFlowHistory} isLoading={isLoading}/>

                {/* Forecast Chart */}
                 <ForecastChart data={data.cashFlowForecast} isLoading={isLoading}/>

                  {/* Scenario Section */}
                 <Card>
                     <CardHeader className="flex flex-row items-center justify-between">
                         <div>
                            <CardTitle className="text-lg">Scenario Planning</CardTitle>
                            <CardDescription>Model hypothetical financial futures</CardDescription>
                         </div>
                          <Button variant="outline" size="sm" onClick={() => setShowScenarioPlanner(true)} disabled={isScenarioRunning}>
                             <Sliders className="mr-2 h-4 w-4"/> {isScenarioRunning ? "Running..." : "New Scenario"}
                         </Button>
                     </CardHeader>
                      {scenarioResults.length > 0 && (
                          <CardContent className="space-y-4 pt-0">
                              {scenarioResults.map((result, index) => (
                                  <div key={index} className="border rounded-lg p-4 relative">
                                      <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => handleRemoveScenario(result.scenarioName)}>
                                          <X className="h-3 w-3"/>
                                      </Button>
                                       <h4 className="text-md font-semibold mb-2">{result.scenarioName}</h4>
                                       {/* TODO: Display key metrics from scenario result, or maybe a mini-chart */}
                                      <div className="h-[150px] w-full">
                                           <ResponsiveContainer width="100%" height="100%">
                                              <RechartsAreaChart data={result.forecast} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                  <XAxis dataKey="month" stroke="#888888" fontSize={9} />
                                                  <YAxis stroke="#888888" fontSize={9} tickFormatter={(value) => formatCurrency(value, true)} domain={['auto', 'auto']} />
                                                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                                                  <Area type="monotone" dataKey="projected_balance" name="Proj. Balance" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                              </RechartsAreaChart>
                                          </ResponsiveContainer>
                                      </div>
                                  </div>
                              ))}
                          </CardContent>
                      )}
                       {scenarioResults.length === 0 && !isScenarioRunning && (
                          <CardContent><p className="text-sm text-muted-foreground">Run scenarios to compare different forecasts.</p></CardContent>
                       )}
                       {isScenarioRunning && (
                            <CardContent><p className="text-sm text-muted-foreground">Generating scenario forecast...</p></CardContent>
                       )}
                 </Card>


                {/* Lists: Activity, Customers, Expenses */}
                 <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
                      {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading && <div className="space-y-3"><div className="h-10 w-full bg-muted animate-pulse rounded"></div><div className="h-10 w-full bg-muted animate-pulse rounded"></div></div>}
                            {!isLoading && data.recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {data.recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-start space-x-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted flex-shrink-0">
                                                {getActivityIcon(activity.type)}
                                            </div>
                                            <div className="flex-1 space-y-0.5">
                                                <p className="text-sm font-medium leading-tight">{activity.description}</p>
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <span>{formatDate(activity.date)}</span>
                                                     <span className="mx-1">•</span>
                                                    <span className={activity.amount > 0 ? "text-green-600" : activity.amount < 0 ? "text-red-600" : ""}>{formatCurrency(activity.amount)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                !isLoading && <p className="text-sm text-muted-foreground text-center py-4">No recent activity found.</p>
                            )}
                        </CardContent>
                         <CardFooter className="pt-0">
                           <Button variant="ghost" size="sm" className="w-full text-muted-foreground">View All Activity <ChevronRight className="ml-1 h-4 w-4"/></Button>
                         </CardFooter>
                    </Card>

                    {/* Top Customers */}
                    <Card>
                         <CardHeader><CardTitle className="text-lg">Top Customers</CardTitle></CardHeader>
                        <CardContent>
                            {isLoading && <div className="space-y-3"><div className="h-10 w-full bg-muted animate-pulse rounded"></div><div className="h-10 w-full bg-muted animate-pulse rounded"></div></div>}
                            {!isLoading && data.topCustomers.length > 0 ? (
                                <div className="space-y-4">
                                    {data.topCustomers.map((customer) => (
                                        <div key={customer.id} className="flex items-center justify-between space-x-2">
                                            <div className="flex items-center space-x-3 overflow-hidden">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                                                    <span className="font-medium text-primary text-xs">{customer.name.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <p className="text-sm font-medium truncate" title={customer.name}>{customer.name}</p>
                                            </div>
                                            <div className="text-sm font-medium text-right flex-shrink-0">{formatCurrency(customer.revenue)}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                               !isLoading && <p className="text-sm text-muted-foreground text-center py-4">No customer data available.</p>
                            )}
                        </CardContent>
                         <CardFooter className="pt-0">
                           <Button variant="ghost" size="sm" className="w-full text-muted-foreground" asChild><Link href="/dashboard/customers">View All Customers <ChevronRight className="ml-1 h-4 w-4"/></Link></Button>
                         </CardFooter>
                    </Card>

                    {/* Top Expense Categories */}
                    <Card>
                         <CardHeader><CardTitle className="text-lg">Top Expense Categories</CardTitle></CardHeader>
                        <CardContent>
                             {isLoading && <div className="space-y-3"><div className="h-10 w-full bg-muted animate-pulse rounded"></div><div className="h-10 w-full bg-muted animate-pulse rounded"></div></div>}
                            {!isLoading && data.topExpenseCategories.length > 0 ? (
                                <div className="space-y-4">
                                    {data.topExpenseCategories.map((category, index) => (
                                        <div key={index} className="flex items-center justify-between space-x-2">
                                             <div className="flex items-center space-x-3 overflow-hidden">
                                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted flex-shrink-0">
                                                        <Receipt className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                <p className="text-sm font-medium truncate" title={category.category}>{category.category}</p>
                                            </div>
                                            <div className="text-sm font-medium text-right flex-shrink-0">{formatCurrency(category.amount)}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                               !isLoading && <p className="text-sm text-muted-foreground text-center py-4">No expense data available.</p>
                            )}
                        </CardContent>
                         <CardFooter className="pt-0">
                            <Button variant="ghost" size="sm" className="w-full text-muted-foreground" asChild><Link href="/dashboard/expenses">View All Expenses <ChevronRight className="ml-1 h-4 w-4"/></Link></Button>
                         </CardFooter>
                    </Card>

                 </div> {/* End Lists Grid */}
            </div> {/* End Col 2 */}
        </div> {/* End Main Grid */}
    </div> // End Page Container
  );
}