"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useApi } from '@/lib/contexts/ApiContext';
import { useAuth } from '@/lib/contexts/AuthContext';

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
    recentActivity: [] as any[],
    cashFlow: [] as any[],
    topCustomers: [] as any[],
    topExpenseCategories: [] as any[]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const router = useRouter();
  const auth = useAuth();
  const api = useApi();
  
  // Function to load dashboard data
  const loadDashboardData = async () => {
    try {
      // If still loading auth or not authenticated, don't try to load data
      if (auth.isLoading || !auth.isAuthenticated) {
        return;
      }

      setIsLoading(true);
      
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

      // Load data in parallel using the new API context
      const [
        currentTransactions,
        prevTransactions,
        currentInvoices,
        prevInvoices,
        currentExpenses,
        prevExpenses,
        contacts
      ] = await Promise.all([
        // Current month transactions
        api.get<Transaction[]>('/api/transactions', {
          startDate: formatApiDate(startDate),
          endDate: formatApiDate(endDate)
        }),
        // Previous month transactions
        api.get<Transaction[]>('/api/transactions', {
          startDate: formatApiDate(prevMonthStart),
          endDate: formatApiDate(prevMonthEnd)
        }),
        // Current month invoices
        api.get<Invoice[]>('/api/invoices', {
          startDate: formatApiDate(startDate),
          endDate: formatApiDate(endDate)
        }),
        // Previous month invoices
        api.get<Invoice[]>('/api/invoices', {
          startDate: formatApiDate(prevMonthStart),
          endDate: formatApiDate(prevMonthEnd)
        }),
        // Current month expenses
        api.get<Expense[]>('/api/expenses', {
          startDate: formatApiDate(startDate),
          endDate: formatApiDate(endDate)
        }),
        // Previous month expenses
        api.get<Expense[]>('/api/expenses', {
          startDate: formatApiDate(prevMonthStart),
          endDate: formatApiDate(prevMonthEnd)
        }),
        // All contacts
        api.get<Contact[]>('/api/contacts')
      ]);
      
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
      const cashChangePercentage = calculatePercentageChange(cashBalance, prevCashBalance);
      const profitLossChangePercentage = calculatePercentageChange(
        currentIncome - currentExpensesTotal,
        prevIncome - prevExpensesTotal
      );
      
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
      for (let i = 5; i >= 0; i--) {
        const month = new Date(currentYear, currentMonth - i, 1);
        const monthEnd = new Date(currentYear, currentMonth - i + 1, 0);
        
        // Get the month name
        const monthName = month.toLocaleString('default', { month: 'short' });
        
        // Calculate income for this month
        const monthIncome = currentInvoices
          .filter(invoice => {
            const invoiceDate = new Date(invoice.issueDate);
            return (
              invoiceDate >= month && 
              invoiceDate <= monthEnd && 
              invoice.status === 'paid'
            );
          })
          .reduce((sum, invoice) => sum + invoice.total, 0);
        
        // Calculate expenses for this month
        const monthExpenses = currentExpenses
          .filter(expense => {
            const expenseDate = new Date(expense.date);
            return (
              expenseDate >= month && 
              expenseDate <= monthEnd && 
              expense.status === 'paid'
            );
          })
          .reduce((sum, expense) => sum + expense.amount, 0);
        
        cashFlowData.push({
          month: monthName,
          income: monthIncome,
          expenses: monthExpenses
        });
      }
      
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
          mtd: currentIncome - currentExpensesTotal,
          changePercentage: profitLossChangePercentage
        },
        recentActivity,
        cashFlow: cashFlowData,
        topCustomers,
        topExpenseCategories
      });
    } catch (err) {
      setError(err as Error);
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load data on component mount or when auth state changes
  useEffect(() => {
    if (auth.isAuthenticated) {
      loadDashboardData();
    }
  }, [auth.isAuthenticated]);
  
  // Destructure dashboard data for easier access
  const { 
    cash, 
    income, 
    expenses, 
    profitLoss, 
    recentActivity, 
    cashFlow,
    topCustomers,
    topExpenseCategories
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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <CalendarDays className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Export
          </Button>
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
              Your income and expenses over the last 6 months
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
        <Button asChild variant="outline" className="h-20 justify-start px-4">
          <Link href="/dashboard/invoices/new">
            <FileText className="mr-3 h-5 w-5 text-primary" />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">New Invoice</span>
              <span className="text-xs text-muted-foreground">Create a new invoice</span>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-20 justify-start px-4">
          <Link href="/dashboard/expenses/new">
            <Receipt className="mr-3 h-5 w-5 text-primary" />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">Add Expense</span>
              <span className="text-xs text-muted-foreground">Record a new expense</span>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-20 justify-start px-4">
          <Link href="/dashboard/reports">
            <BarChart className="mr-3 h-5 w-5 text-primary" />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">View Reports</span>
              <span className="text-xs text-muted-foreground">Financial insights</span>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-20 justify-start px-4">
          <Link href="/dashboard/contacts/new">
            <DollarSign className="mr-3 h-5 w-5 text-primary" />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">Add Contact</span>
              <span className="text-xs text-muted-foreground">Create a new contact</span>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
} 