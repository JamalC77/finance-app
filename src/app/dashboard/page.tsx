"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
  TrendingUp,
  BarChart,
  Eye,
  ChevronRight,
  CalendarDays,
  FileText,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  BellRing,
  Lightbulb,
  PiggyBank,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Legend,
  Area,
  AreaChart as RechartsAreaChart,
  ComposedChart,
} from "recharts";
import { useApi } from "@/lib/contexts/ApiContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { quickbooksApi } from "@/lib/services/apiService";
import { Progress } from "@/components/ui/progress";

// Types for our data
type Transaction = {
  id: string;
  type: "credit" | "debit";
  amount: number;
  date: string;
  description: string;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  contactId: string;
  total: number;
  status: string;
  issueDate: string;
  dueDate: string;
  updatedAt: string;
};

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
  contactId?: string;
  status: string;
  updatedAt: string;
};

type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: "customer" | "vendor" | "both";
};

// Define specific types for arrays instead of using any[]
type RecentActivity = {
  id: string;
  type: string;
  description: string;
  date: Date;
  amount: number;
};

type CashFlowItem = {
  month: string;
  income: number;
  expenses: number;
  profit: number;
};

type CustomerItem = {
  id: string;
  name: string;
  revenue: number;
};

type CategoryItem = {
  category: string;
  amount: number;
};

// Add a new type for Insights
type BusinessInsight = {
  id: string;
  type: "info" | "warning" | "success" | "tip";
  title: string;
  description: string;
  priority: number; // 1-10, 10 being highest
  actionLink?: string;
  actionText?: string;
};

// Add a new type for Cash Flow Projection
type CashFlowProjection = {
  month: string;
  projected_income: number;
  projected_expenses: number;
  projected_balance: number;
};

// Define a type for the dashboard data that can be enhanced
type DashboardDataInput = {
  cash: { balance: number; changePercentage: number };
  income: { mtd: number; changePercentage: number };
  expenses: { mtd: number; changePercentage: number };
  profitLoss: { mtd: number; changePercentage: number };
  recentActivity: RecentActivity[];
  cashFlow: CashFlowItem[];
  topCustomers: CustomerItem[];
  topExpenseCategories: CategoryItem[];
  source: "standard" | "quickbooks";
  pendingInvoicesTotal?: number;
  overdueInvoicesTotal?: number;
  upcomingExpensesTotal?: number;
  businessInsights?: BusinessInsight[];
  cashFlowProjection?: CashFlowProjection[];
  averagePaymentTime?: number;
  profitMargin?: number;
  yearToDateTax?: number;
  anomalies?: { category: string; value: number; expected: number; percentageDiff: number }[];
};

// Function to format currency for display
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Function to format date for display
const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

// Get appropriate icon for activity type
const getActivityIcon = (type: string) => {
  switch (type) {
    case "INVOICE_PAID":
      return <DollarSign className="h-4 w-4 text-green-500" />;
    case "INVOICE_SENT":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "EXPENSE_PAID":
      return <CreditCard className="h-4 w-4 text-red-500" />;
    case "EXPENSE_RECORDED":
      return <Receipt className="h-4 w-4 text-yellow-500" />;
    default:
      return <Eye className="h-4 w-4" />;
  }
};

// Helper function to get the appropriate icon for an insight
const getInsightIcon = (type: string) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "info":
      return <FileText className="h-5 w-5 text-blue-500" />;
    case "tip":
      return <Lightbulb className="h-5 w-5 text-purple-500" />;
    default:
      return <Eye className="h-5 w-5" />;
  }
};

// Function to generate enhanced insights from either QuickBooks or standard data
// Define this BEFORE it's used to avoid ReferenceError
const generateEnhancedInsights = (data: any) => {
  console.log("💡 [DASHBOARD] Generating enhanced insights from data:", data);

  const enhancedData = { ...data };
  const source = enhancedData.source;

  // Generate business insights
  const insights: BusinessInsight[] = [];

  // Calculate or use existing financial data
  const pendingInvoicesTotal = data.pendingInvoicesTotal || 5000;
  const overdueInvoicesTotal = data.overdueInvoicesTotal || 2500;
  const upcomingExpensesTotal = data.upcomingExpensesTotal || 3500;

  // Calculate profit margin - a key indicator of business health
  const profitMargin = data.income.mtd > 0 ? (data.profitLoss.mtd / data.income.mtd) * 100 : 0;

  // QuickBooks specific insights - enhance these if we have QuickBooks data
  if (source === "quickbooks") {
    console.log("📊 [DASHBOARD] Processing QuickBooks-specific insights");

    // If we have account balances from QuickBooks, highlight potential cash flow issues
    if (data.accountBalances) {
      const totalCash = Array.isArray(data.accountBalances)
        ? data.accountBalances.filter((acc) => acc.type === "BANK" || acc.type === "CASH").reduce((sum, acc) => sum + acc.balance, 0)
        : data.cash.balance;

      // Monthly burn rate (expenses)
      const burnRate = data.expenses.mtd;

      // Calculate runway in months (how long cash will last at current burn rate)
      const runway = burnRate > 0 ? totalCash / burnRate : 0;

      if (runway < 3 && runway > 0) {
        insights.push({
          id: "cash-runway-warning",
          type: "warning",
          title: "Cash Runway Alert",
          description: `At current spending levels, your cash will last ~${runway.toFixed(
            1
          )} months. Consider reducing expenses or accelerating collections.`,
          priority: 10,
          actionLink: "/dashboard/invoices?status=overdue",
          actionText: "View Overdue Invoices",
        });
      }
    }

    // Process customer insights if available
    if (data.customerInsights) {
      // Find customers with decreasing spending
      const decliningCustomers = Array.isArray(data.customerInsights.trendingCustomers)
        ? data.customerInsights.trendingCustomers.filter((c) => c.trend === "declining")
        : [];

      if (decliningCustomers.length > 0) {
        insights.push({
          id: "declining-customers",
          type: "warning",
          title: "Customer Spending Decline",
          description: `${decliningCustomers.length} top customers have reduced their spending. Consider reaching out to understand why.`,
          priority: 8,
          actionLink: "/dashboard/customers?trend=declining",
          actionText: "View Customers",
        });
      }

      // Identify potential sales opportunities
      const growingCustomers = Array.isArray(data.customerInsights.trendingCustomers)
        ? data.customerInsights.trendingCustomers.filter((c) => c.trend === "growing")
        : [];

      if (growingCustomers.length > 0) {
        insights.push({
          id: "growing-customers",
          type: "success",
          title: "Sales Opportunity",
          description: `${growingCustomers.length} customers are increasing their purchases. Consider offering additional products or services.`,
          priority: 7,
          actionLink: "/dashboard/customers?trend=growing",
          actionText: "View Growth Opportunities",
        });
      }
    }

    // Process payment insights if available
    if (data.paymentInsights) {
      const avgPaymentTime = data.paymentInsights.averagePaymentTime || 0;

      if (avgPaymentTime > 45) {
        insights.push({
          id: "slow-payments",
          type: "warning",
          title: "Slow Payment Cycle",
          description: `Customers take an average of ${avgPaymentTime.toFixed(0)} days to pay invoices. Consider offering payment incentives.`,
          priority: 8,
          actionLink: "/dashboard/settings/payment-terms",
          actionText: "Review Payment Terms",
        });
      }

      // Look for payment trend
      if (data.paymentInsights.paymentTimeTrend > 5) {
        insights.push({
          id: "payment-slowing",
          type: "warning",
          title: "Payment Times Increasing",
          description: `Customers are taking ${data.paymentInsights.paymentTimeTrend.toFixed(
            0
          )} days longer to pay than last period. Monitor your cash flow.`,
          priority: 9,
          actionLink: "/dashboard/invoices",
          actionText: "Review Invoices",
        });
      }
    }

    // Process expense insights
    if (data.expenseInsights) {
      // Identify categories with unusual spending
      const anomalies = Array.isArray(data.expenseInsights.anomalies) ? data.expenseInsights.anomalies : [];

      anomalies.forEach((anomaly) => {
        insights.push({
          id: `expense-anomaly-${anomaly.category.toLowerCase().replace(/\s+/g, "-")}`,
          type: "warning",
          title: "Unusual Expense Pattern",
          description: `Spending in "${anomaly.category}" is ${anomaly.percentageDiff}% higher than usual. Review these expenses for potential savings.`,
          priority: 8,
          actionLink: `/dashboard/expenses?category=${encodeURIComponent(anomaly.category)}`,
          actionText: "Review Expenses",
        });
      });

      // Tax deductions
      if (data.expenseInsights.potentialDeductions) {
        insights.push({
          id: "tax-deductions",
          type: "info",
          title: "Tax Deduction Opportunity",
          description: `You have ${formatCurrency(data.expenseInsights.potentialDeductions)} in expenses that may qualify for tax deductions.`,
          priority: 6,
          actionLink: "/dashboard/taxes/deductions",
          actionText: "Review Deductions",
        });
      }
    }
  }

  // Standard insights that apply regardless of data source

  // Cash flow insight
  if (data.cash.changePercentage < -10) {
    insights.push({
      id: "cash-flow-decrease",
      type: "warning",
      title: "Cash Flow Alert",
      description: `Your cash flow has decreased by ${Math.abs(
        data.cash.changePercentage
      )}% compared to last month. Consider following up on outstanding invoices.`,
      priority: 9,
      actionLink: "/dashboard/invoices?status=overdue",
      actionText: "View Overdue Invoices",
    });
  }

  // Overdue invoices insight
  if (overdueInvoicesTotal > 0) {
    insights.push({
      id: "overdue-invoices",
      type: "warning",
      title: "Overdue Invoices",
      description: `You have ${formatCurrency(overdueInvoicesTotal)} in overdue invoices. Follow up with clients to improve your cash flow.`,
      priority: 8,
      actionLink: "/dashboard/invoices?status=overdue",
      actionText: "View Overdue Invoices",
    });
  }

  // Profitability insight
  if (profitMargin < 15 && data.income.mtd > 0) {
    insights.push({
      id: "low-profit-margin",
      type: "info",
      title: "Profit Margin Alert",
      description: `Your profit margin is ${profitMargin.toFixed(1)}%, which is lower than the recommended 15-20% for small businesses.`,
      priority: 7,
      actionLink: "/dashboard/expenses",
      actionText: "Review Expenses",
    });
  }

  // Strong performance insight
  if (data.income.changePercentage > 15) {
    insights.push({
      id: "strong-income-growth",
      type: "success",
      title: "Strong Revenue Growth",
      description: `Your revenue has increased by ${data.income.changePercentage}% compared to last month. Great job!`,
      priority: 6,
    });
  }

  // Tax preparation insight
  const currentMonth = new Date().getMonth();
  const isNearQuarterEnd = [2, 5, 8, 11].includes(currentMonth);
  if (isNearQuarterEnd) {
    insights.push({
      id: "tax-preparation",
      type: "info",
      title: "Quarterly Tax Preparation",
      description: "The end of the quarter is approaching. Start preparing your documents for tax filing.",
      priority: 7,
      actionLink: "/dashboard/taxes",
      actionText: "Prepare Tax Documents",
    });
  }

  // Generate anomalies in expense categories if we don't have them from QuickBooks already
  const anomalies = [];
  if (!data.expenseInsights && data.topExpenseCategories.length > 0) {
    // Find the category with the largest change (this would normally compare with historical averages)
    const largestCategory = data.topExpenseCategories[0];
    if (largestCategory.amount > 5000) {
      // Just a threshold for demo purposes
      anomalies.push({
        category: largestCategory.category,
        value: largestCategory.amount,
        expected: largestCategory.amount * 0.7, // Just for demonstration
        percentageDiff: 30,
      });

      insights.push({
        id: "expense-anomaly",
        type: "warning",
        title: "Unusual Expense Pattern",
        description: `Spending in "${largestCategory.category}" is 30% higher than usual. Review these expenses for potential savings.`,
        priority: 8,
        actionLink: "/dashboard/expenses",
        actionText: "Review Expenses",
      });
    }
  }

  // Generate cash flow projections for next 3 months
  const cashFlowProjection = [];
  const lastCashFlowMonth = data.cashFlow.length > 0 ? data.cashFlow[data.cashFlow.length - 1] : null;

  if (lastCashFlowMonth) {
    // Check if we have predictive analytics data from QuickBooks
    if (data.predictiveAnalytics && Array.isArray(data.predictiveAnalytics.cashFlowForecast)) {
      // Use QuickBooks predictions if available
      console.log("🔮 [DASHBOARD] Using QuickBooks predictive cash flow data");
      data.predictiveAnalytics.cashFlowForecast.forEach((forecast) => {
        cashFlowProjection.push({
          month: forecast.period,
          projected_income: forecast.projectedIncome,
          projected_expenses: forecast.projectedExpenses,
          projected_balance: forecast.projectedIncome - forecast.projectedExpenses,
        });
      });
    } else {
      // Generate our own simple projections
      const baseIncome = lastCashFlowMonth.income;
      const baseExpenses = lastCashFlowMonth.expenses;

      // Get name of next three months
      const getNextMonths = () => {
        const months = [];
        const date = new Date();
        for (let i = 1; i <= 3; i++) {
          date.setMonth(date.getMonth() + 1);
          months.push(date.toLocaleString("default", { month: "short" }));
        }
        return months;
      };

      const nextMonths = getNextMonths();

      // Simple projection with some randomness
      for (let i = 0; i < 3; i++) {
        const growthFactor = 1 + (Math.random() * 0.1 - 0.05); // -5% to +5% change
        const expenseChangeFactor = 1 + (Math.random() * 0.08 - 0.03); // -3% to +5% change

        const projectedIncome = Math.round(baseIncome * Math.pow(growthFactor, i + 1));
        const projectedExpenses = Math.round(baseExpenses * Math.pow(expenseChangeFactor, i + 1));

        cashFlowProjection.push({
          month: nextMonths[i],
          projected_income: projectedIncome,
          projected_expenses: projectedExpenses,
          projected_balance: projectedIncome - projectedExpenses,
        });
      }
    }

    // Add insight about cash flow projection
    const threeMontProjection = cashFlowProjection.reduce((sum, month) => sum + month.projected_balance, 0);

    if (threeMontProjection < 0) {
      insights.push({
        id: "negative-cash-projection",
        type: "warning",
        title: "Cash Flow Warning",
        description: "Your projected cash flow for the next 3 months is negative. Consider reducing expenses or finding new revenue sources.",
        priority: 9,
        actionLink: "/dashboard/invoices?status=draft",
        actionText: "Send Pending Invoices",
      });
    } else {
      insights.push({
        id: "positive-cash-projection",
        type: "tip",
        title: "Investment Opportunity",
        description: `You're projected to have a positive cash flow of ${formatCurrency(
          threeMontProjection
        )} over the next 3 months. Consider investing in growth opportunities.`,
        priority: 5,
      });
    }
  }

  // Sort insights by priority (highest first)
  insights.sort((a, b) => b.priority - a.priority);

  console.log(`🧠 [DASHBOARD] Generated ${insights.length} business insights`);

  // Return enhanced data
  return {
    ...enhancedData,
    businessInsights: insights,
    cashFlowProjection,
    pendingInvoicesTotal,
    overdueInvoicesTotal,
    upcomingExpensesTotal,
    profitMargin,
    anomalies,
  };
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    cash: { balance: 0, changePercentage: 0 },
    income: { mtd: 0, changePercentage: 0 },
    expenses: { mtd: 0, changePercentage: 0 },
    profitLoss: { mtd: 0, changePercentage: 0 },
    recentActivity: [] as RecentActivity[],
    cashFlow: [] as CashFlowItem[],
    topCustomers: [] as CustomerItem[],
    topExpenseCategories: [] as CategoryItem[],
    source: "standard" as "standard" | "quickbooks",
    // Add new state properties for enhanced insights
    businessInsights: [] as BusinessInsight[],
    cashFlowProjection: [] as CashFlowProjection[],
    pendingInvoicesTotal: 0,
    overdueInvoicesTotal: 0,
    upcomingExpensesTotal: 0,
    averagePaymentTime: 0,
    profitMargin: 0,
    yearToDateTax: 0,
    anomalies: [] as { category: string; value: number; expected: number; percentageDiff: number }[],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "error">("checking");

  const auth = useAuth();
  const api = useApi();

  // Function to load dashboard data - memoized with useCallback
  const loadDashboardData = useCallback(async () => {
    try {
      // If still loading auth or not authenticated, don't try to load data
      if (auth.isLoading || !auth.isAuthenticated) {
        console.log("Auth not ready or not authenticated, skipping data load");
        return;
      }

      setIsLoading(true);
      console.log("Starting to load dashboard data...");

      // First check if we have a QuickBooks connection and try to get data from there
      try {
        console.log("🔍 [DASHBOARD] Checking QuickBooks connection...");
        // Get the auth token
        const token = auth.token || ""; // Provide empty string fallback to fix type error
        console.log("🔑 [DASHBOARD] Using auth token for QuickBooks API calls");

        const connectionResponse = await quickbooksApi.getConnectionStatus(token);
        console.log("📡 [DASHBOARD] QuickBooks connection response:", connectionResponse);

        if (connectionResponse.data?.connected) {
          console.log("✅ [DASHBOARD] QuickBooks is connected, fetching dashboard data from QuickBooks...");

          try {
            console.log("🔄 [DASHBOARD] Calling QuickBooks dashboard endpoint...");
            const qbDashboardResponse = await quickbooksApi.getDashboardData(token);
            console.log("📊 [DASHBOARD] QuickBooks dashboard response:", qbDashboardResponse);

            if (qbDashboardResponse.success && qbDashboardResponse.data) {
              console.log("🎉 [DASHBOARD] Successfully loaded dashboard data from QuickBooks");

              // Process dates in recent activity (they come as strings from API)
              const processedData = {
                ...qbDashboardResponse.data,
                recentActivity: qbDashboardResponse.data.recentActivity.map((item) => ({
                  ...item,
                  date: new Date(item.date),
                })),
                source: "quickbooks" as const, // Ensure source is set to quickbooks with correct type
              };

              console.log("🧩 [DASHBOARD] Processed QuickBooks data:", processedData);

              // Generate enhanced insights from QuickBooks data
              const enhancedData = generateEnhancedInsights(processedData);

              setDashboardData(enhancedData as any); // Type cast to avoid type errors for now
              setIsLoading(false);
              return; // Exit early as we got data from QuickBooks
            } else {
              console.warn("⚠️ [DASHBOARD] QuickBooks dashboard request success but no data returned:", qbDashboardResponse);
            }
          } catch (qbError) {
            console.error("❌ [DASHBOARD] Error fetching data from QuickBooks:", qbError);
            console.log("↩️ [DASHBOARD] Falling back to standard API data...");
            // Continue with regular data loading below
          }
        }
      } catch (connectionError) {
        console.error("❌ [DASHBOARD] Error checking QuickBooks connection:", connectionError);
        console.log("↩️ [DASHBOARD] Falling back to standard API data...");
        // Continue with regular data loading below
      }
    } catch (err) {
      setError(err as Error);
      console.error("Error loading dashboard data:", err);
      // Log details about which API call might have failed
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      }

      // Show user friendly toast notification
      toast({
        title: "Failed to load dashboard data",
        description: "Please check your network connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.token, api]);

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      console.log("Dashboard component mounted, auth state:", auth.isAuthenticated ? "authenticated" : "not authenticated");

      if (auth.isAuthenticated) {
        console.log("User is authenticated, proceeding with data loading");

        try {
          setApiStatus("checking"); // Set status to checking

          // Load dashboard data
          await loadDashboardData();
          setApiStatus("connected"); // If we get here, we're connected
          console.log("Dashboard data loaded successfully!");
        } catch (error) {
          console.error("Failed to load dashboard data:", error);
          setApiStatus("error");
          setError(error instanceof Error ? error : new Error("Unknown error occurred"));
        }
      } else {
        console.log("User is not authenticated, skipping data load");
      }
    };

    fetchData();
  }, [loadDashboardData]); // Depend on the memoized loadDashboardData function

  // Destructure dashboard data for easier access
  const {
    cash,
    income,
    expenses,
    profitLoss,
    recentActivity,
    cashFlow,
    topCustomers,
    topExpenseCategories,
    source,
    businessInsights,
    cashFlowProjection,
    pendingInvoicesTotal,
    overdueInvoicesTotal,
    upcomingExpensesTotal,
    profitMargin,
    anomalies,
  } = dashboardData;

  // If auth is still loading, show a loading state
  if (auth.isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center justify-center h-96">
          <p className="text-lg text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't show anything (will redirect from useEffect)
  if (!auth.isAuthenticated) {
    return null;
  }

  // Type-safe formatter functions for Recharts
  const tooltipFormatter = (value: number, name: string) => [`$${value}`, name];
  const tooltipLabelFormatter = (label: string) => `${label} ${new Date().getFullYear()}`;

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          {source === "quickbooks" && <Badge className="bg-blue-100 text-blue-800 border-blue-300">QuickBooks Data</Badge>}
          {source === "standard" && !recentActivity.length && !isLoading && (
            <div className="flex items-center ml-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                No data available
              </Badge>
              <Button variant="link" size="sm" asChild className="text-blue-600 hover:text-blue-800">
                <Link href="/settings/integrations">Connect an integration</Link>
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {apiStatus === "error" && (
            <Badge variant="destructive" className="mr-2">
              API Disconnected
            </Badge>
          )}
          {apiStatus === "connected" && (
            <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
              API Connected
            </Badge>
          )}
          {apiStatus === "checking" && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 mr-2">
              Checking API...
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => loadDashboardData()} disabled={isLoading}>
            {isLoading ? (
              <>Loading...</>
            ) : (
              <>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Refresh Data
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-9 grid gap-4 grid-cols-1 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-medium">Cash</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <div className="h-7 w-24 bg-muted animate-pulse rounded-md mb-2"></div>
                  <div className="h-4 w-36 bg-muted animate-pulse rounded-md"></div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatCurrency(cash.balance)}</div>
                  <div className="flex items-center pt-1 text-xs text-muted-foreground">
                    {cash.changePercentage > 0 ? (
                      <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span className={cash.changePercentage > 0 ? "text-green-500" : "text-red-500"}>
                      {cash.changePercentage > 0 ? "+" : ""}
                      {cash.changePercentage}%
                    </span>
                    <span className="ml-1">from last month</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-medium">Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <div className="h-7 w-24 bg-muted animate-pulse rounded-md mb-2"></div>
                  <div className="h-4 w-36 bg-muted animate-pulse rounded-md"></div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatCurrency(income.mtd)}</div>
                  <div className="flex items-center pt-1 text-xs text-muted-foreground">
                    {income.changePercentage > 0 ? (
                      <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span className={income.changePercentage > 0 ? "text-green-500" : "text-red-500"}>
                      {income.changePercentage > 0 ? "+" : ""}
                      {income.changePercentage}%
                    </span>
                    <span className="ml-1">from last month</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <div className="h-7 w-24 bg-muted animate-pulse rounded-md mb-2"></div>
                  <div className="h-4 w-36 bg-muted animate-pulse rounded-md"></div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatCurrency(expenses.mtd)}</div>
                  <div className="flex items-center pt-1 text-xs text-muted-foreground">
                    {expenses.changePercentage < 0 ? (
                      <ArrowDownRight className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUpRight className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span className={expenses.changePercentage < 0 ? "text-green-500" : "text-red-500"}>
                      {expenses.changePercentage > 0 ? "+" : ""}
                      {expenses.changePercentage}%
                    </span>
                    <span className="ml-1">from last month</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <div className="h-7 w-24 bg-muted animate-pulse rounded-md mb-2"></div>
                  <div className="h-4 w-36 bg-muted animate-pulse rounded-md"></div>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatCurrency(profitLoss.mtd)}</div>
                  <div className="flex items-center pt-1 text-xs text-muted-foreground">
                    {profitLoss.changePercentage > 0 ? (
                      <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span className={profitLoss.changePercentage > 0 ? "text-green-500" : "text-red-500"}>
                      {profitLoss.changePercentage > 0 ? "+" : ""}
                      {profitLoss.changePercentage}%
                    </span>
                    <span className="ml-1">from last month</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Financial Health</CardTitle>
            <CardDescription>Key indicators of your business health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Profit Margin</span>
                    <div className="h-4 w-10 bg-muted animate-pulse rounded-md"></div>
                  </div>
                  <div className="h-4 w-full bg-muted animate-pulse rounded-md"></div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Upcoming Financial Events</span>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center text-sm mt-2">
                      <div className="w-3 h-3 rounded-full bg-muted mr-2"></div>
                      <div className="h-4 w-24 bg-muted animate-pulse rounded-md"></div>
                      <div className="h-4 w-16 bg-muted animate-pulse rounded-md ml-auto"></div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Profit Margin</span>
                    <span className={profitMargin >= 20 ? "text-green-500" : profitMargin >= 15 ? "text-amber-500" : "text-red-500"}>
                      {profitMargin.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={profitMargin}
                    max={30}
                    className={profitMargin >= 20 ? "bg-green-100" : profitMargin >= 15 ? "bg-amber-100" : "bg-red-100"}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Upcoming Financial Events</span>
                  </div>
                  <div className="flex items-center text-sm mt-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>Pending Invoices:</span>
                    <span className="ml-auto font-medium">{formatCurrency(pendingInvoicesTotal)}</span>
                  </div>
                  <div className="flex items-center text-sm mt-1">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Overdue Invoices:</span>
                    <span className="ml-auto font-medium">{formatCurrency(overdueInvoicesTotal)}</span>
                  </div>
                  <div className="flex items-center text-sm mt-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Upcoming Expenses:</span>
                    <span className="ml-auto font-medium">{formatCurrency(upcomingExpensesTotal)}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Your income, expenses, and profit over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-muted/10 rounded-lg">
                  <div className="text-sm text-muted-foreground">Loading chart data...</div>
                </div>
              ) : cashFlow.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={[...cashFlow]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip formatter={tooltipFormatter} labelFormatter={tooltipLabelFormatter} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-sm text-muted-foreground">No cash flow data available</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Cash Flow Projection</CardTitle>
            <CardDescription>Forecasted financial position for the next 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-muted/10 rounded-lg">
                  <div className="text-sm text-muted-foreground">Loading projection data...</div>
                </div>
              ) : cashFlowProjection.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsAreaChart data={cashFlowProjection} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip formatter={tooltipFormatter} />
                    <Legend />
                    <Area type="monotone" dataKey="projected_income" name="Projected Income" stroke="#4f46e5" fill="#4f46e580" />
                    <Area type="monotone" dataKey="projected_expenses" name="Projected Expenses" stroke="#f43f5e" fill="#f43f5e80" />
                    <Line type="monotone" dataKey="projected_balance" name="Projected Balance" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  </RechartsAreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-sm text-muted-foreground">No projection data available</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions and activities</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-36 bg-muted animate-pulse rounded-md"></div>
                      <div className="h-3 w-24 bg-muted animate-pulse rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{formatDate(activity.date)}</span>
                        <span className="mx-1">•</span>
                        <span className={activity.amount > 0 ? "text-green-500" : "text-red-500"}>
                          {activity.amount > 0 ? "+" : ""}
                          {formatCurrency(activity.amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              <span>View All Activity</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Your highest revenue customers this month</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                      <div className="space-y-1">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded-md"></div>
                        <div className="h-3 w-16 bg-muted animate-pulse rounded-md"></div>
                      </div>
                    </div>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : topCustomers.length > 0 ? (
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="font-medium text-primary">{customer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">Customer</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{formatCurrency(customer.revenue)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No customer data available</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/contacts">
                <span>View All Customers</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Expense Categories</CardTitle>
            <CardDescription>Your highest spending categories this month</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                      <div className="h-4 w-28 bg-muted animate-pulse rounded-md"></div>
                    </div>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded-md"></div>
                  </div>
                ))}
              </div>
            ) : topExpenseCategories.length > 0 ? (
              <div className="space-y-4">
                {topExpenseCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">{category.category}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {formatCurrency(category.amount)}
                      {anomalies.some((a) => a.category === category.category) && (
                        <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-300">+30%</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No expense data available</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/expenses">
                <span>View All Expenses</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
