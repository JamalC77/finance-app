"use client";

import React from 'react';
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
import { dashboardSummary } from '@/lib/mock-data';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
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
  const { 
    cash, 
    income, 
    expenses, 
    profitLoss, 
    recentActivity, 
    cashFlow,
    topCustomers,
    topExpenseCategories
  } = dashboardSummary;

  // Type-safe formatter functions for Recharts
  const tooltipFormatter = (value: number, name: string) => [`$${value}`, name];
  const tooltipLabelFormatter = (label: string) => `${label} 2025`;

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

      {/* Key Metrics */}
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

      {/* Charts and Activity */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        {/* Cash Flow Chart */}
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

        {/* Recent Activity */}
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

      {/* Top Customers and Expenses */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Top Customers */}
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

        {/* Top Expense Categories */}
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

      {/* Quick Actions */}
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