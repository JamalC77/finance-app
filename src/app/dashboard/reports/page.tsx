"use client";

import React, { useState } from 'react';
import { 
  DownloadIcon, 
  BarChart3,
  FileText,
  ArrowUpDown,
  CalendarIcon,
  PieChart,
  TrendingUp 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboardSummary } from '@/lib/mock-data';
import ExportButton from '@/components/ExportButton';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState<string>('month');
  
  const { income, expenses, profitLoss, cashFlow } = dashboardSummary;
  
  // Prepare data for export 
  const getProfitLossData = () => {
    return [
      { category: 'Service Revenue', amount: income.ytd * 0.7, type: 'Income' },
      { category: 'Product Sales', amount: income.ytd * 0.3, type: 'Income' },
      { category: 'Total Income', amount: income.ytd, type: 'Income' },
      { category: 'Office Supplies', amount: expenses.ytd * 0.25, type: 'Expense' },
      { category: 'Software & Services', amount: expenses.ytd * 0.15, type: 'Expense' },
      { category: 'Utilities', amount: expenses.ytd * 0.2, type: 'Expense' },
      { category: 'Travel & Entertainment', amount: expenses.ytd * 0.1, type: 'Expense' },
      { category: 'Other Expenses', amount: expenses.ytd * 0.3, type: 'Expense' },
      { category: 'Total Expenses', amount: expenses.ytd, type: 'Expense' },
      { category: 'Net Profit', amount: profitLoss.ytd, type: 'Summary' }
    ];
  };

  const profitLossColumns = [
    { header: 'Category', accessor: 'category' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Type', accessor: 'type' }
  ];
  
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <ExportButton 
            title="Profit and Loss Report" 
            data={getProfitLossData()}
            columns={profitLossColumns}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="profitLoss" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profitLoss">
              <TrendingUp className="mr-2 h-4 w-4" />
              Profit & Loss
            </TabsTrigger>
            <TabsTrigger value="cashFlow">
              <BarChart3 className="mr-2 h-4 w-4" />
              Cash Flow
            </TabsTrigger>
            <TabsTrigger value="expenses">
              <PieChart className="mr-2 h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="taxReport">
              <FileText className="mr-2 h-4 w-4" />
              Tax Report
            </TabsTrigger>
          </TabsList>

          {/* Profit & Loss Tab */}
          <TabsContent value="profitLoss" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profit & Loss Statement</CardTitle>
                <CardDescription>
                  Summary of your business's revenue, costs, and expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Income Section */}
                  <div>
                    <h3 className="font-semibold mb-2">Income</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b">
                        <span>Service Revenue</span>
                        <span>{formatCurrency(income.ytd * 0.7)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span>Product Sales</span>
                        <span>{formatCurrency(income.ytd * 0.3)}</span>
                      </div>
                      <div className="flex justify-between py-1 font-medium">
                        <span>Total Income</span>
                        <span>{formatCurrency(income.ytd)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expenses Section */}
                  <div>
                    <h3 className="font-semibold mb-2">Expenses</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-1 border-b">
                        <span>Office Supplies</span>
                        <span>{formatCurrency(expenses.ytd * 0.25)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span>Software & Services</span>
                        <span>{formatCurrency(expenses.ytd * 0.15)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span>Utilities</span>
                        <span>{formatCurrency(expenses.ytd * 0.2)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span>Travel & Entertainment</span>
                        <span>{formatCurrency(expenses.ytd * 0.1)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b">
                        <span>Other Expenses</span>
                        <span>{formatCurrency(expenses.ytd * 0.3)}</span>
                      </div>
                      <div className="flex justify-between py-1 font-medium">
                        <span>Total Expenses</span>
                        <span>{formatCurrency(expenses.ytd)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Net Profit Section */}
                  <div className="flex justify-between py-2 font-bold text-lg border-t">
                    <span>Net Profit</span>
                    <span>{formatCurrency(profitLoss.ytd)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(income.ytd)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {income.changePercentage > 0 ? '↑' : '↓'} {Math.abs(income.changePercentage)}% from previous period
                    </p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Expenses</p>
                    <p className="text-2xl font-bold">{formatCurrency(expenses.ytd)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {expenses.changePercentage > 0 ? '↑' : '↓'} {Math.abs(expenses.changePercentage)}% from previous period
                    </p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Profit Margin</p>
                    <p className="text-2xl font-bold">{((profitLoss.ytd / income.ytd) * 100).toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {profitLoss.changePercentage > 0 ? '↑' : '↓'} {Math.abs(profitLoss.changePercentage)}% from previous period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cash Flow Tab */}
          <TabsContent value="cashFlow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Report</CardTitle>
                <CardDescription>
                  Coming soon - Detailed Cash Flow and Financial Movement Reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center text-muted-foreground">
                  <BarChart3 className="mx-auto h-12 w-12 mb-4 text-muted" />
                  <h3 className="text-lg font-medium">Cash Flow Report</h3>
                  <p className="mt-2">
                    This report is under development and will be available soon. Check back later!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expenses Breakdown</CardTitle>
                <CardDescription>
                  Coming soon - Detailed Expense Categorization and Analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center text-muted-foreground">
                  <PieChart className="mx-auto h-12 w-12 mb-4 text-muted" />
                  <h3 className="text-lg font-medium">Expenses Report</h3>
                  <p className="mt-2">
                    This report is under development and will be available soon. Check back later!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Report Tab */}
          <TabsContent value="taxReport" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tax Report</CardTitle>
                <CardDescription>
                  Coming soon - Comprehensive Tax Reports and Documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 text-muted" />
                  <h3 className="text-lg font-medium">Tax Report</h3>
                  <p className="mt-2">
                    This report is under development and will be available soon. Check back later!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 