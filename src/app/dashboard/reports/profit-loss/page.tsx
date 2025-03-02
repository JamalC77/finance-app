import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Download, Printer, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for profit and loss report
const profitLossData = {
  period: "Jan 1, 2025 - Dec 31, 2025",
  income: [
    { name: "Sales Revenue", amount: 125000.00 },
    { name: "Service Revenue", amount: 75000.00 },
    { name: "Interest Income", amount: 1250.50 },
  ],
  expenses: [
    { name: "Rent Expense", amount: 24000.00 },
    { name: "Utilities Expense", amount: 7500.00 },
    { name: "Salaries Expense", amount: 85000.00 },
    { name: "Advertising Expense", amount: 12500.00 },
    { name: "Office Supplies Expense", amount: 3500.75 },
    { name: "Insurance Expense", amount: 8500.00 },
    { name: "Depreciation Expense", amount: 5000.00 },
    { name: "Interest Expense", amount: 2500.00 },
    { name: "Other Expenses", amount: 4750.25 },
  ],
  previousPeriod: {
    totalIncome: 175000.00,
    totalExpenses: 135000.00,
    netIncome: 40000.00,
  }
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper function to calculate percentage change
const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export default function ProfitLossReportPage() {
  // Calculate totals
  const totalIncome = profitLossData.income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = profitLossData.expenses.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalIncome - totalExpenses;
  
  // Calculate percentage changes
  const incomeChange = calculatePercentageChange(totalIncome, profitLossData.previousPeriod.totalIncome);
  const expensesChange = calculatePercentageChange(totalExpenses, profitLossData.previousPeriod.totalExpenses);
  const netIncomeChange = calculatePercentageChange(netIncome, profitLossData.previousPeriod.netIncome);

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/reports" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Profit & Loss</h1>
        <div className="ml-auto flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            {profitLossData.period}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">
              {incomeChange >= 0 ? (
                <span className="text-green-500 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {incomeChange.toFixed(1)}% from previous period
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  {Math.abs(incomeChange).toFixed(1)}% from previous period
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              {expensesChange <= 0 ? (
                <span className="text-green-500 flex items-center">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  {Math.abs(expensesChange).toFixed(1)}% from previous period
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {expensesChange.toFixed(1)}% from previous period
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(netIncome)}</div>
            <p className="text-xs text-muted-foreground">
              {netIncomeChange >= 0 ? (
                <span className="text-green-500 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {netIncomeChange.toFixed(1)}% from previous period
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  {Math.abs(netIncomeChange).toFixed(1)}% from previous period
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
            <CardDescription>
              Revenue and other income for the period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profitLossData.income.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="pt-4 border-t flex items-center justify-between font-bold">
                <span>Total Income</span>
                <span>{formatCurrency(totalIncome)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>
              Costs and expenses for the period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profitLossData.expenses.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="pt-4 border-t flex items-center justify-between font-bold">
                <span>Total Expenses</span>
                <span>{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Net Profit Summary</CardTitle>
          <CardDescription>
            Summary of income, expenses, and profit for the period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Income</span>
              <span className="font-medium">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Expenses</span>
              <span className="font-medium">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="pt-4 border-t flex items-center justify-between font-bold">
              <span>Net Profit</span>
              <span className={netIncome >= 0 ? "text-green-600" : "text-red-600"}>
                {formatCurrency(netIncome)}
              </span>
            </div>
            <div className="pt-4 text-sm text-muted-foreground">
              <p>
                This report shows your income and expenses for the period {profitLossData.period}. 
                Your net profit for this period is {formatCurrency(netIncome)}, which is a 
                {netIncomeChange >= 0 ? " " + netIncomeChange.toFixed(1) + "% increase" : " " + Math.abs(netIncomeChange).toFixed(1) + "% decrease"} 
                compared to the previous period.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 