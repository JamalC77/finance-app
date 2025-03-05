"use client";

import React, { useState, useEffect } from 'react';
import { 
  DownloadIcon, 
  BarChart3,
  FileText,
  ArrowUpDown,
  CalendarIcon,
  PieChart,
  TrendingUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExportButton from '@/components/ExportButton';
import { getProfitLossReport, getCashFlowReport } from '@/api/services/reportService';
import { format, subMonths, subWeeks, subYears, startOfMonth, startOfWeek, startOfYear, endOfMonth, isSameDay, addMonths } from 'date-fns';
import { dashboardSummary } from '@/lib/mock-data';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { Input } from '@/components/ui/input';

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

// Date range options
const dateRangeOptions = [
  { label: 'This Week', value: 'thisWeek' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Last 3 Months', value: 'last3Months' },
  { label: 'Year to Date', value: 'YTD' },
  { label: 'Last Year', value: 'lastYear' },
  { label: 'Custom Range', value: 'custom' },
];

// Get date range from selected period
const getDateRangeFromPeriod = (period: string): { startDate: Date, endDate: Date } => {
  const today = new Date();
  
  switch(period) {
    case 'thisWeek':
      return {
        startDate: startOfWeek(today, { weekStartsOn: 1 }), // Week starts on Monday
        endDate: today
      };
    case 'thisMonth':
      return {
        startDate: startOfMonth(today),
        endDate: today
      };
    case 'lastMonth':
      const lastMonth = subMonths(today, 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth)
      };
    case 'last3Months':
      return {
        startDate: subMonths(today, 3),
        endDate: today
      };
    case 'YTD':
      return {
        startDate: startOfYear(today),
        endDate: today
      };
    case 'lastYear':
      const lastYear = subYears(today, 1);
      return {
        startDate: startOfYear(lastYear),
        endDate: endOfYear(lastYear)
      };
    case 'custom':
      // Return current date range for custom - will be set via date picker
      return {
        startDate: subMonths(today, 1),
        endDate: today
      };
    default:
      // Default to this month
      return {
        startDate: startOfMonth(today),
        endDate: today
      };
  }
};

// Helper function for last day of year
const endOfYear = (date: Date): Date => {
  return new Date(date.getFullYear(), 11, 31);
};

// Mock data formatter to match API response structure
const formatMockProfitLossData = () => {
  const { income, expenses, profitLoss } = dashboardSummary;
  
  return {
    startDate: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    income: {
      total: income.ytd,
      changePercentage: income.changePercentage,
      categories: [
        { name: 'Service Revenue', amount: income.ytd * 0.7 },
        { name: 'Product Sales', amount: income.ytd * 0.3 }
      ]
    },
    expenses: {
      total: expenses.ytd,
      changePercentage: expenses.changePercentage,
      categories: [
        { name: 'Office Supplies', amount: expenses.ytd * 0.25 },
        { name: 'Software & Services', amount: expenses.ytd * 0.15 },
        { name: 'Utilities', amount: expenses.ytd * 0.20 },
        { name: 'Travel & Entertainment', amount: expenses.ytd * 0.10 },
        { name: 'Other Expenses', amount: expenses.ytd * 0.30 }
      ]
    },
    netIncome: profitLoss.ytd,
    profitMarginChange: profitLoss.changePercentage
  };
};

// Mock data formatter for cash flow
const formatMockCashFlowData = () => {
  const { cashFlow } = dashboardSummary;
  const totalIncome = cashFlow.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = cashFlow.reduce((sum, month) => sum + month.expenses, 0);
  
  return {
    startDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    operatingActivities: {
      items: [
        { name: 'Sales Revenue', amount: totalIncome * 0.95 },
        { name: 'Interest Income', amount: totalIncome * 0.05 },
        { name: 'Payments to Suppliers', amount: -totalExpenses * 0.6 },
        { name: 'Payments to Employees', amount: -totalExpenses * 0.4 }
      ]
    },
    investingActivities: {
      items: [
        { name: 'Purchase of Equipment', amount: -1200 },
        { name: 'Sale of Assets', amount: 500 }
      ]
    },
    financingActivities: {
      items: [
        { name: 'Loan Repayment', amount: -800 },
        { name: 'Owner Investment', amount: 5000 }
      ]
    },
    operatingCashFlow: totalIncome - totalExpenses,
    investingCashFlow: -700,
    financingCashFlow: 4200,
    netCashFlow: (totalIncome - totalExpenses) + (-700) + 4200
  };
};

export default function ReportsPage() {
  // Period selection (month, quarter, year, custom)
  const [dateRangePeriod, setDateRangePeriod] = useState<string>('thisMonth');
  const [isCustomRange, setIsCustomRange] = useState<boolean>(false);
  
  // Date range state
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfMonth(new Date()),
    to: new Date()
  });
  
  // Direct input date strings
  const [startDateInput, setStartDateInput] = useState<string>(format(dateRange.from, 'yyyy-MM-dd'));
  const [endDateInput, setEndDateInput] = useState<string>(format(dateRange.to, 'yyyy-MM-dd'));
  
  const [loading, setLoading] = useState<boolean>(true);
  const [profitLossData, setProfitLossData] = useState<any>(null);
  const [cashFlowData, setCashFlowData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);
  
  // State for calendar navigation
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  
  // Handle date range period change
  const handleDateRangePeriodChange = (value: string) => {
    setDateRangePeriod(value);
    
    if (value === 'custom') {
      setIsCustomRange(true);
    } else {
      setIsCustomRange(false);
      const { startDate, endDate } = getDateRangeFromPeriod(value);
      setDateRange({ from: startDate, to: endDate });
      setStartDateInput(format(startDate, 'yyyy-MM-dd'));
      setEndDateInput(format(endDate, 'yyyy-MM-dd'));
    }
  };
  
  // Format start and end dates for API requests
  const startDate = format(dateRange.from, 'yyyy-MM-dd');
  const endDate = format(dateRange.to, 'yyyy-MM-dd');
  
  // Handle input date changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDateInput(e.target.value);
    try {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) {
        if (newDate > dateRange.to) {
          // If start date is after end date, adjust end date
          setDateRange({ from: newDate, to: newDate });
          setEndDateInput(e.target.value);
        } else {
          setDateRange({ ...dateRange, from: newDate });
        }
        setDateRangePeriod('custom');
        setIsCustomRange(true);
      }
    } catch (err) {
      console.error('Invalid date format', err);
    }
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDateInput(e.target.value);
    try {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) {
        if (newDate < dateRange.from) {
          // If end date is before start date, adjust start date
          setDateRange({ from: newDate, to: newDate });
          setStartDateInput(e.target.value);
        } else {
          setDateRange({ ...dateRange, to: newDate });
        }
        setDateRangePeriod('custom');
        setIsCustomRange(true);
      }
    } catch (err) {
      console.error('Invalid date format', err);
    }
  };
  
  // Fetch report data when date range changes
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        // Fetch Profit & Loss data
        const plResponse = await getProfitLossReport({
          startDate,
          endDate
        });
        setProfitLossData(plResponse.data);
        
        // Fetch Cash Flow data
        const cfResponse = await getCashFlowReport({
          startDate,
          endDate
        });
        setCashFlowData(cfResponse.data);
        
        setUsingMockData(false);
      } catch (err: any) {
        console.error('Error fetching report data:', err);
        
        // Fallback to mock data
        setProfitLossData(formatMockProfitLossData());
        setCashFlowData(formatMockCashFlowData());
        setUsingMockData(true);
        
        // Only show an error message if it's likely a server issue, not just missing data
        if (err.message && err.message.includes('NetworkError') || 
            err.message && err.message.includes('Failed to fetch')) {
          setError('Unable to connect to the server. Using sample data instead.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [startDate, endDate]);
  
  // Prepare data for export 
  const getProfitLossExportData = () => {
    if (!profitLossData) {
      return [];
    }
    
    // Format data for export based on API response
    // This assumes the API returns a structure with income, expenses categories
    const income = profitLossData.income || {};
    const expenses = profitLossData.expenses || {};
    const total = profitLossData.netIncome || 0;
    
    const exportData = [];
    
    // Add income items
    if (income.categories) {
      income.categories.forEach((item: any) => {
        exportData.push({
          category: item.name,
          amount: item.amount,
          type: 'Income'
        });
      });
    }
    
    // Add total income
    exportData.push({
      category: 'Total Income',
      amount: income.total || 0,
      type: 'Income'
    });
    
    // Add expense items
    if (expenses.categories) {
      expenses.categories.forEach((item: any) => {
        exportData.push({
          category: item.name,
          amount: item.amount,
          type: 'Expense'
        });
      });
    }
    
    // Add total expenses
    exportData.push({
      category: 'Total Expenses',
      amount: expenses.total || 0,
      type: 'Expense'
    });
    
    // Add net profit/loss
    exportData.push({
      category: 'Net Profit',
      amount: total,
      type: 'Summary'
    });
    
    return exportData;
  };

  const profitLossColumns = [
    { header: 'Category', accessor: 'category' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Type', accessor: 'type' }
  ];
  
  // Format date range display string
  const formatDateRangeDisplay = () => {
    if (isSameDay(dateRange.from, dateRange.to)) {
      return format(dateRange.from, 'MMM d, yyyy');
    }
    
    if (dateRange.from.getFullYear() === dateRange.to.getFullYear()) {
      return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
    }
    
    return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
  };
  
  // Custom calendar caption to improve month navigation
  const CustomCaption = ({ displayMonth, onMonthChange }: { displayMonth: Date, onMonthChange: (date: Date) => void }) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);
    
    return (
      <div className="flex items-center justify-center px-1 mb-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onMonthChange(addMonths(displayMonth, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Select
          value={displayMonth.getMonth().toString()}
          onValueChange={(value) => {
            const newMonth = new Date(displayMonth);
            newMonth.setMonth(parseInt(value));
            onMonthChange(newMonth);
          }}
        >
          <SelectTrigger className="h-8 w-[100px] border-none text-center font-medium">
            <SelectValue>{months[displayMonth.getMonth()]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={displayMonth.getFullYear().toString()}
          onValueChange={(value) => {
            const newMonth = new Date(displayMonth);
            newMonth.setFullYear(parseInt(value));
            onMonthChange(newMonth);
          }}
        >
          <SelectTrigger className="h-8 w-[80px] border-none text-center font-medium">
            <SelectValue>{displayMonth.getFullYear()}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onMonthChange(addMonths(displayMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading report data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-6">
      {usingMockData && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                {error || "Couldn't retrieve real data. Showing sample data for demonstration."}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Date Range Period Selection */}
          <div className="w-full sm:w-48">
            <Select value={dateRangePeriod} onValueChange={handleDateRangePeriodChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Range Picker with direct input fields */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRangeDisplay()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
              <div className="space-y-4">
                {/* Quick select buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(dateRangePeriod === 'thisMonth' && "bg-primary text-primary-foreground")}
                    onClick={() => handleDateRangePeriodChange('thisMonth')}
                  >
                    This Month
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(dateRangePeriod === 'lastMonth' && "bg-primary text-primary-foreground")}
                    onClick={() => handleDateRangePeriodChange('lastMonth')}
                  >
                    Last Month
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(dateRangePeriod === 'last3Months' && "bg-primary text-primary-foreground")}
                    onClick={() => handleDateRangePeriodChange('last3Months')}
                  >
                    Last 3 Months
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(dateRangePeriod === 'YTD' && "bg-primary text-primary-foreground")}
                    onClick={() => handleDateRangePeriodChange('YTD')}
                  >
                    Year to Date
                  </Button>
                </div>
                
                {/* Direct date input fields */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium mb-1">Start Date</label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDateInput}
                      onChange={handleStartDateChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium mb-1">End Date</label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDateInput}
                      onChange={handleEndDateChange}
                      className="w-full"
                    />
                  </div>
                </div>
                
                {/* Current selection summary */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Selected: </span>
                    {formatDateRangeDisplay()}
                  </p>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      const today = new Date();
                      const todayStr = format(today, 'yyyy-MM-dd');
                      setDateRange({ from: today, to: today });
                      setStartDateInput(todayStr);
                      setEndDateInput(todayStr);
                      setDateRangePeriod('custom');
                      setIsCustomRange(true);
                    }}
                  >
                    Today
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <ExportButton 
            title="Profit and Loss Report" 
            data={getProfitLossExportData()}
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
                  Summary of your business's revenue, costs, and expenses for {formatDateRangeDisplay()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Income Section */}
                  <div>
                    <h3 className="font-semibold mb-2">Income</h3>
                    <div className="space-y-2">
                      {profitLossData?.income?.categories?.map((item: any, index: number) => (
                        <div key={`income-${index}`} className="flex justify-between py-1 border-b">
                          <span>{item.name}</span>
                          <span>{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-1 font-medium">
                        <span>Total Income</span>
                        <span>{formatCurrency(profitLossData?.income?.total || 0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expenses Section */}
                  <div>
                    <h3 className="font-semibold mb-2">Expenses</h3>
                    <div className="space-y-2">
                      {profitLossData?.expenses?.categories?.map((item: any, index: number) => (
                        <div key={`expense-${index}`} className="flex justify-between py-1 border-b">
                          <span>{item.name}</span>
                          <span>{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-1 font-medium">
                        <span>Total Expenses</span>
                        <span>{formatCurrency(profitLossData?.expenses?.total || 0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Net Profit Section */}
                  <div className="flex justify-between py-2 font-bold text-lg border-t">
                    <span>Net Profit</span>
                    <span>{formatCurrency(profitLossData?.netIncome || 0)}</span>
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
                    <p className="text-2xl font-bold">{formatCurrency(profitLossData?.income?.total || 0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {profitLossData?.income?.changePercentage > 0 ? '↑' : '↓'} {Math.abs(profitLossData?.income?.changePercentage || 0)}% from previous period
                    </p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Expenses</p>
                    <p className="text-2xl font-bold">{formatCurrency(profitLossData?.expenses?.total || 0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {profitLossData?.expenses?.changePercentage > 0 ? '↑' : '↓'} {Math.abs(profitLossData?.expenses?.changePercentage || 0)}% from previous period
                    </p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Profit Margin</p>
                    <p className="text-2xl font-bold">
                      {profitLossData?.income?.total ? 
                        ((profitLossData?.netIncome / profitLossData?.income?.total) * 100).toFixed(1) + '%' :
                        '0.0%'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {profitLossData?.profitMarginChange > 0 ? '↑' : '↓'} {Math.abs(profitLossData?.profitMarginChange || 0)}% from previous period
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
                  Summary of cash flowing in and out of your business for {formatDateRangeDisplay()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cashFlowData ? (
                  <div className="space-y-6">
                    {/* Operating Activities Section */}
                    <div>
                      <h3 className="font-semibold mb-2">Operating Activities</h3>
                      <div className="space-y-2">
                        {cashFlowData?.operatingActivities?.items?.map((item: any, index: number) => (
                          <div key={`operating-${index}`} className="flex justify-between py-1 border-b">
                            <span>{item.name}</span>
                            <span>{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between py-1 font-medium">
                          <span>Net Cash from Operations</span>
                          <span>{formatCurrency(cashFlowData?.operatingCashFlow || 0)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Investing Activities Section */}
                    <div>
                      <h3 className="font-semibold mb-2">Investing Activities</h3>
                      <div className="space-y-2">
                        {cashFlowData?.investingActivities?.items?.map((item: any, index: number) => (
                          <div key={`investing-${index}`} className="flex justify-between py-1 border-b">
                            <span>{item.name}</span>
                            <span>{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between py-1 font-medium">
                          <span>Net Cash from Investing</span>
                          <span>{formatCurrency(cashFlowData?.investingCashFlow || 0)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Financing Activities Section */}
                    <div>
                      <h3 className="font-semibold mb-2">Financing Activities</h3>
                      <div className="space-y-2">
                        {cashFlowData?.financingActivities?.items?.map((item: any, index: number) => (
                          <div key={`financing-${index}`} className="flex justify-between py-1 border-b">
                            <span>{item.name}</span>
                            <span>{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between py-1 font-medium">
                          <span>Net Cash from Financing</span>
                          <span>{formatCurrency(cashFlowData?.financingCashFlow || 0)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Net Cash Flow Section */}
                    <div className="flex justify-between py-2 font-bold text-lg border-t">
                      <span>Net Cash Flow</span>
                      <span>{formatCurrency(cashFlowData?.netCashFlow || 0)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <BarChart3 className="mx-auto h-12 w-12 mb-4 text-muted" />
                    <h3 className="text-lg font-medium">No cash flow data available</h3>
                    <p className="mt-2">
                      There is no cash flow data available for the selected period.
                    </p>
                  </div>
                )}
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
                  Coming soon - Detailed Tax Reporting and Analysis
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