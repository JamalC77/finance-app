"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  Receipt
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApi } from '@/lib/contexts/ApiContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { quickbooksApi } from '@/lib/services/apiService';

// Types for our data
type Transaction = {
  id: string;
  type: 'credit' | 'debit';
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
  type: 'customer' | 'vendor' | 'both';
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'INVOICE_PAID':
      return <DollarSign className="h-4 w-4 text-green-500" />;
    case 'INVOICE_SENT':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'EXPENSE_PAID':
      return <CreditCard className="h-4 w-4 text-red-500" />;
    case 'EXPENSE_RECORDED':
      return <Receipt className="h-4 w-4 text-yellow-500" />;
    default:
      return <Eye className="h-4 w-4" />;
  }
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
    source: 'standard' as 'standard' | 'quickbooks'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  
  const auth = useAuth();
  const api = useApi();
  
  // Function to load dashboard data - memoized with useCallback
  const loadDashboardData = useCallback(async () => {
    try {
      // If still loading auth or not authenticated, don't try to load data
      if (auth.isLoading || !auth.isAuthenticated) {
        console.log('Auth not ready or not authenticated, skipping data load');
        return;
      }

      setIsLoading(true);
      console.log('Starting to load dashboard data...');
      
      // First check if we have a QuickBooks connection and try to get data from there
      try {
        console.log('🔍 [DASHBOARD] Checking QuickBooks connection...');
        // Get the auth token
        const token = auth.token;
        console.log('🔑 [DASHBOARD] Using auth token for QuickBooks API calls');
        
        const connectionResponse = await quickbooksApi.getConnectionStatus(token);
        console.log('📡 [DASHBOARD] QuickBooks connection response:', connectionResponse);
        
        if (connectionResponse.data?.connected) {
          console.log('✅ [DASHBOARD] QuickBooks is connected, fetching dashboard data from QuickBooks...');
          
          try {
            console.log('🔄 [DASHBOARD] Calling QuickBooks dashboard endpoint...');
            const qbDashboardResponse = await quickbooksApi.getDashboardData(token);
            console.log('📊 [DASHBOARD] QuickBooks dashboard response:', qbDashboardResponse);
            
            if (qbDashboardResponse.success && qbDashboardResponse.data) {
              console.log('🎉 [DASHBOARD] Successfully loaded dashboard data from QuickBooks');
              
              // Process dates in recent activity (they come as strings from API)
              const processedData = {
                ...qbDashboardResponse.data,
                recentActivity: qbDashboardResponse.data.recentActivity.map(item => ({
                  ...item,
                  date: new Date(item.date)
                })),
                source: 'quickbooks' // Ensure source is set to quickbooks
              };
              
              console.log('🧩 [DASHBOARD] Processed QuickBooks data:', processedData);
              
              setDashboardData(processedData);
              setIsLoading(false);
              return; // Exit early as we got data from QuickBooks
            } else {
              console.warn('⚠️ [DASHBOARD] QuickBooks dashboard request success but no data returned:', qbDashboardResponse);
            }
          } catch (qbError) {
            console.error('❌ [DASHBOARD] Error fetching data from QuickBooks:', qbError);
            console.log('↩️ [DASHBOARD] Falling back to standard API data...');
            // Continue with regular data loading below
          }
        } else {
          console.log('📵 [DASHBOARD] No active QuickBooks connection, using standard API data');
        }
      } catch (connectionError) {
        console.error('❌ [DASHBOARD] Error checking QuickBooks connection:', connectionError);
        console.log('↩️ [DASHBOARD] Falling back to standard API data...');
        // Continue with regular data loading below
      }
      
      // Regular data loading logic (existing code)
      // Get current date and calculate date range
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // Start date is first day of current month
      const startDate = new Date(currentYear, currentMonth, 1);
      
      // End date is last day of current month
      const endDate = new Date(currentYear, currentMonth + 1, 0);
      
      // Get previous month date range for comparison
      const prevMonthStart = new Date(currentYear, currentMonth - 1, 1);
      const prevMonthEnd = new Date(currentYear, currentMonth, 0);
      
      // Format dates for API
      const formatApiDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };

      console.log('Preparing to fetch data from API...');
      console.log('API BASE URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('Auth token exists:', !!auth.token);

      // Load each data type separately with error handling
      let currentTransactions: Transaction[] = [];
      let prevTransactions: Transaction[] = [];
      let currentInvoices: Invoice[] = [];
      let prevInvoices: Invoice[] = [];
      let currentExpenses: Expense[] = [];
      let prevExpenses: Expense[] = [];
      let contacts: Contact[] = [];

      try {
        console.log('Fetching current transactions...');
        currentTransactions = await api.get<Transaction[]>('/api/transactions', {
          startDate: formatApiDate(startDate),
          endDate: formatApiDate(endDate)
        });
        console.log('Current transactions loaded:', currentTransactions.length);
      } catch (error) {
        console.error('Failed to load current transactions:', error);
        // Continue with empty array
      }

      try {
        console.log('Fetching previous transactions...');
        prevTransactions = await api.get<Transaction[]>('/api/transactions', {
          startDate: formatApiDate(prevMonthStart),
          endDate: formatApiDate(prevMonthEnd)
        });
        console.log('Previous transactions loaded:', prevTransactions.length);
      } catch (error) {
        console.error('Failed to load previous transactions:', error);
        // Continue with empty array
      }

      try {
        console.log('Fetching current invoices...');
        currentInvoices = await api.get<Invoice[]>('/api/invoices', {
          startDate: formatApiDate(startDate),
          endDate: formatApiDate(endDate)
        });
        console.log('Current invoices loaded:', currentInvoices.length);
      } catch (error) {
        console.error('Failed to load current invoices:', error);
        // Continue with empty array
      }

      try {
        console.log('Fetching previous invoices...');
        prevInvoices = await api.get<Invoice[]>('/api/invoices', {
          startDate: formatApiDate(prevMonthStart),
          endDate: formatApiDate(prevMonthEnd)
        });
        console.log('Previous invoices loaded:', prevInvoices.length);
      } catch (error) {
        console.error('Failed to load previous invoices:', error);
        // Continue with empty array
      }

      try {
        console.log('Fetching current expenses...');
        currentExpenses = await api.get<Expense[]>('/api/expenses', {
          startDate: formatApiDate(startDate),
          endDate: formatApiDate(endDate)
        });
        console.log('Current expenses loaded:', currentExpenses.length);
      } catch (error) {
        console.error('Failed to load current expenses:', error);
        // Continue with empty array
      }

      try {
        console.log('Fetching previous expenses...');
        prevExpenses = await api.get<Expense[]>('/api/expenses', {
          startDate: formatApiDate(prevMonthStart),
          endDate: formatApiDate(prevMonthEnd)
        });
        console.log('Previous expenses loaded:', prevExpenses.length);
      } catch (error) {
        console.error('Failed to load previous expenses:', error);
        // Continue with empty array
      }

      try {
        console.log('Fetching contacts...');
        contacts = await api.get<Contact[]>('/api/contacts');
        console.log('Contacts loaded:', contacts.length);
      } catch (error) {
        console.error('Failed to load contacts:', error);
        // Continue with empty array
      }

      console.log('All data fetched, calculating metrics...');
      
      // Calculate metrics
      
      // Current month income (sum of paid invoices)
      const currentIncome = currentInvoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + invoice.total, 0);
      
      // Previous month income
      const prevIncome = prevInvoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + invoice.total, 0);
        
      // Current month expenses
      const currentExpensesTotal = currentExpenses
        .filter(expense => expense.status === 'paid')
        .reduce((sum, expense) => sum + expense.amount, 0);
        
      // Previous month expenses
      const prevExpensesTotal = prevExpenses
        .filter(expense => expense.status === 'paid')
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      // Calculate profit/loss (current cash flow)
      const currentCashFlow = currentIncome - currentExpensesTotal;
      
      // Calculate previous month's profit/loss
      const prevCashFlow = prevIncome - prevExpensesTotal;
        
      // Cash balance (sum of all transactions)
      const cashBalance = currentTransactions.reduce((sum, transaction) => {
        return sum + (transaction.type === 'credit' ? transaction.amount : -transaction.amount);
      }, 0);
      
      // Previous cash balance
      const prevCashBalance = prevTransactions.reduce((sum, transaction) => {
        return sum + (transaction.type === 'credit' ? transaction.amount : -transaction.amount);
      }, 0);
      
      // Calculate percentage changes
      const calculatePercentageChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / Math.abs(previous)) * 100);
      };
      
      const incomeChangePercentage = calculatePercentageChange(currentIncome, prevIncome);
      const expensesChangePercentage = calculatePercentageChange(currentExpensesTotal, prevExpensesTotal);
      // Cash change percentage should reflect the change in monthly cash flow, not total balance
      const cashChangePercentage = calculatePercentageChange(currentCashFlow, prevCashFlow);
      const profitLossChangePercentage = calculatePercentageChange(currentCashFlow, prevCashFlow);
      
      // Generate recent activity from transactions, invoices, and expenses
      const recentActivity = [
        // Paid invoices
        ...currentInvoices
          .filter(invoice => invoice.status === 'paid')
          .map(invoice => {
            const contact = contacts.find(c => c.id === invoice.contactId);
            return {
              id: invoice.id,
              type: 'INVOICE_PAID',
              description: `Invoice #${invoice.invoiceNumber} paid by ${contact?.name || 'Customer'}`,
              date: new Date(invoice.updatedAt),
              amount: invoice.total
            };
          }),
        // Sent invoices
        ...currentInvoices
          .filter(invoice => invoice.status === 'sent')
          .map(invoice => {
            const contact = contacts.find(c => c.id === invoice.contactId);
            return {
              id: invoice.id,
              type: 'INVOICE_SENT',
              description: `Invoice #${invoice.invoiceNumber} sent to ${contact?.name || 'Customer'}`,
              date: new Date(invoice.updatedAt),
              amount: invoice.total
            };
          }),
        // Paid expenses
        ...currentExpenses
          .filter(expense => expense.status === 'paid')
          .map(expense => {
            const contact = expense.contactId ? contacts.find(c => c.id === expense.contactId) : null;
            return {
              id: expense.id,
              type: 'EXPENSE_PAID',
              description: `Paid ${expense.description} ${contact ? `to ${contact.name}` : ''}`,
              date: new Date(expense.updatedAt),
              amount: -expense.amount
            };
          })
      ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5); // Get most recent 5 activities
      
      // Generate cash flow data for the last 6 months
      const cashFlowData = [];
      
      // We'll need data for all months to display cash flow correctly
      // Determine the last 6 months range
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1); // First day of the month
      sixMonthsAgo.setHours(0, 0, 0, 0);
      
      console.log('Generating cash flow data for last 6 months starting from:', sixMonthsAgo.toISOString());
      
      // Fetch all invoices and expenses for the last 6 months in one go
      let sixMonthInvoices: Invoice[] = [];
      let sixMonthExpenses: Expense[] = [];
      
      try {
        console.log('Fetching invoices for last 6 months...');
        sixMonthInvoices = await api.get<Invoice[]>('/api/invoices', {
          startDate: formatApiDate(sixMonthsAgo),
          endDate: formatApiDate(endDate)
        });
        console.log('Six month invoices loaded:', sixMonthInvoices.length);
      } catch (error) {
        console.error('Failed to load six month invoices:', error);
      }
      
      try {
        console.log('Fetching expenses for last 6 months...');
        sixMonthExpenses = await api.get<Expense[]>('/api/expenses', {
          startDate: formatApiDate(sixMonthsAgo),
          endDate: formatApiDate(endDate)
        });
        console.log('Six month expenses loaded:', sixMonthExpenses.length);
      } catch (error) {
        console.error('Failed to load six month expenses:', error);
      }
      
      // Generate the cash flow data for each of the last 6 months
      for (let i = 0; i < 6; i++) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - 5 + i);
        monthDate.setDate(1);
        monthDate.setHours(0, 0, 0, 0);
        
        const monthStart = new Date(monthDate);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);
        
        const monthYear = monthDate.getFullYear();
        
        // Get the month name and add year if not current year
        const monthName = monthDate.toLocaleString('default', { month: 'short' });
        const formattedMonth = monthYear !== currentYear 
          ? `${monthName} '${monthYear.toString().slice(2)}` 
          : monthName;
        
        console.log(`Calculating cash flow for ${formattedMonth} (${monthStart.toISOString()} to ${monthEnd.toISOString()})`);
        
        // Calculate income for this month using the fetched data
        const monthIncome = sixMonthInvoices
          .filter(invoice => {
            const invoiceDate = new Date(invoice.issueDate);
            return (
              invoiceDate >= monthStart && 
              invoiceDate <= monthEnd && 
              invoice.status === 'paid'
            );
          })
          .reduce((sum, invoice) => sum + invoice.total, 0);
        
        // Calculate expenses for this month using the fetched data
        const monthExpenses = sixMonthExpenses
          .filter(expense => {
            const expenseDate = new Date(expense.date);
            return (
              expenseDate >= monthStart && 
              expenseDate <= monthEnd && 
              expense.status === 'paid'
            );
          })
          .reduce((sum, expense) => sum + expense.amount, 0);
        
        cashFlowData.push({
          month: formattedMonth,
          income: monthIncome,
          expenses: monthExpenses,
          profit: monthIncome - monthExpenses
        });
      }
      
      console.log('Generated cash flow data:', cashFlowData);
      
      // Calculate top customers
      const customerInvoices = new Map();
      currentInvoices.forEach(invoice => {
        if (invoice.status === 'paid') {
          const contactId = invoice.contactId;
          if (!customerInvoices.has(contactId)) {
            customerInvoices.set(contactId, {
              id: contactId,
              revenue: 0
            });
          }
          
          const customer = customerInvoices.get(contactId);
          customer.revenue += invoice.total;
        }
      });
      
      const topCustomers = Array.from(customerInvoices.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5) // Top 5 customers
        .map(customer => {
          const contact = contacts.find(c => c.id === customer.id);
          return {
            ...customer,
            name: contact?.name || 'Customer'
          };
        });
      
      // Calculate top expense categories
      const expenseCategories = new Map();
      currentExpenses.forEach(expense => {
        if (expense.status === 'paid') {
          const category = expense.category || 'Uncategorized';
          if (!expenseCategories.has(category)) {
            expenseCategories.set(category, {
              category,
              amount: 0
            });
          }
          
          const categoryData = expenseCategories.get(category);
          categoryData.amount += expense.amount;
        }
      });
      
      const topExpenseCategories = Array.from(expenseCategories.values())
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5); // Top 5 categories
      
      // Set dashboard data
      setDashboardData({
        cash: {
          balance: cashBalance,
          changePercentage: cashChangePercentage
        },
        income: {
          mtd: currentIncome,
          changePercentage: incomeChangePercentage
        },
        expenses: {
          mtd: currentExpensesTotal,
          changePercentage: expensesChangePercentage
        },
        profitLoss: {
          mtd: currentCashFlow,
          changePercentage: profitLossChangePercentage
        },
        recentActivity,
        cashFlow: cashFlowData,
        topCustomers,
        topExpenseCategories,
        source: 'standard'
      });
    } catch (err) {
      setError(err as Error);
      console.error('Error loading dashboard data:', err);
      // Log details about which API call might have failed
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
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
      console.log('Dashboard component mounted, auth state:', auth.isAuthenticated ? 'authenticated' : 'not authenticated');
      
      if (auth.isAuthenticated) {
        console.log('User is authenticated, proceeding with data loading');
        
        try {
          setApiStatus('checking'); // Set status to checking
          
          // Load dashboard data
          await loadDashboardData();
          setApiStatus('connected'); // If we get here, we're connected
          console.log('Dashboard data loaded successfully!');
        } catch (error) {
          console.error('Failed to load dashboard data:', error);
          setApiStatus('error');
          setError(error instanceof Error ? error : new Error('Unknown error occurred'));
        }
      } else {
        console.log('User is not authenticated, skipping data load');
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
    source
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

  // Show loading state for dashboard data
  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center justify-center h-96">
          <p className="text-lg text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-lg text-red-500 mb-4">Error loading dashboard data</p>
            <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={loadDashboardData}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  // Type-safe formatter functions for Recharts
  const tooltipFormatter = (value: number, name: string) => [`$${value}`, name];
  const tooltipLabelFormatter = (label: string) => `${label} ${new Date().getFullYear()}`;

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          {source === 'quickbooks' && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              QuickBooks Data
            </Badge>
          )}
          {source === 'standard' && !recentActivity.length && (
            <div className="flex items-center ml-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                No data available
              </Badge>
              <Button variant="link" size="sm" asChild className="text-blue-600 hover:text-blue-800">
                <Link href="/settings/integrations">
                  Connect an integration
                </Link>
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {apiStatus === 'error' && (
            <Badge variant="destructive" className="mr-2">
              API Disconnected
            </Badge>
          )}
          {apiStatus === 'connected' && (
            <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
              API Connected
            </Badge>
          )}
          {apiStatus === 'checking' && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 mr-2">
              Checking API...
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => loadDashboardData()}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          {/* <Button variant="outline" size="sm">
            <CalendarDays className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Export
          </Button> */}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Cash</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(cash.balance)}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {cash.changePercentage > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={cash.changePercentage > 0 ? "text-green-500" : "text-red-500"}>
                {cash.changePercentage > 0 ? "+" : ""}{cash.changePercentage}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(income.mtd)}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {income.changePercentage > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={income.changePercentage > 0 ? "text-green-500" : "text-red-500"}>
                {income.changePercentage > 0 ? "+" : ""}{income.changePercentage}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(expenses.mtd)}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {expenses.changePercentage < 0 ? (
                <ArrowDownRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowUpRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={expenses.changePercentage < 0 ? "text-green-500" : "text-red-500"}>
                {expenses.changePercentage > 0 ? "+" : ""}{expenses.changePercentage}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">Profit/Loss</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(profitLoss.mtd)}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {profitLoss.changePercentage > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={profitLoss.changePercentage > 0 ? "text-green-500" : "text-red-500"}>
                {profitLoss.changePercentage > 0 ? "+" : ""}{profitLoss.changePercentage}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>
              Your income, expenses, and profit over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={cashFlow}>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis 
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={tooltipFormatter}
                    labelFormatter={tooltipLabelFormatter}
                  />
                  <Bar 
                    dataKey="income" 
                    name="Income" 
                    fill="#4f46e5" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="expenses" 
                    name="Expenses" 
                    fill="#f43f5e" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="profit" 
                    name="Profit" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]} 
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest transactions and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{formatDate(activity.date)}</span>
                      <span className="mx-1">•</span>
                      <span className={activity.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                        {activity.amount > 0 ? '+' : ''}
                        {formatCurrency(activity.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              <span>View All Activity</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>
              Your highest revenue customers this month
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  <div className="text-sm font-medium">
                    {formatCurrency(customer.revenue)}
                  </div>
                </div>
              ))}
            </div>
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
            <CardDescription>
              Your highest spending categories this month
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  </div>
                </div>
              ))}
            </div>
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

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      </div>
    </div>
  );
} 