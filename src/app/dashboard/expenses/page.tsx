"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  MoreHorizontal,
  Receipt,
  Edit,
  Trash2,
  FileText,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { getExpenses } from '@/api/services/expenseService';
import { Expense } from '@/lib/types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date: string | Date | null) => {
  if (!date) return 'Not specified';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryLabel = (category: string) => {
  if (!category) return 'Uncategorized';
  return category.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export default function ExpensesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchExpenses();
  }, []);
  
  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const data = await getExpenses();
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive"
      });
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get unique categories
  const categories = [...new Set((expenses || []).filter(e => e.category).map(expense => expense.category))];
  
  // Filter expenses based on search query, status and category
  const filteredExpenses = (expenses || []).filter(expense => {
    // Filter by search query
    const matchesSearch = !searchQuery ? true :
      expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (expense.contactName || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter ? expense.status === statusFilter : true;
    
    // Filter by category
    const matchesCategory = categoryFilter ? expense.category === categoryFilter : true;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  // Get total stats
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidAmount = filteredExpenses
    .filter(expense => expense.status === 'PAID')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const pendingAmount = filteredExpenses
    .filter(expense => expense.status === 'PENDING')
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <Link href="/dashboard/expenses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Expense
          </Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredExpenses.length} expenses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredExpenses.filter(e => e.status === 'PAID').length} expenses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredExpenses.filter(e => e.status === 'PENDING').length} expenses
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Expenses</CardTitle>
          <CardDescription>
            Record, view, and manage your expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search expenses..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Status</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('PAID')}>
                    Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('PENDING')}>
                    Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Category</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                    All Categories
                  </DropdownMenuItem>
                  {categories.map(category => (
                    <DropdownMenuItem 
                      key={category} 
                      onClick={() => setCategoryFilter(category)}
                    >
                      {getCategoryLabel(category || '')}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {(statusFilter || categoryFilter) && (
              <div className="flex items-center space-x-4">
                {statusFilter && (
                  <div className="flex items-center space-x-1">
                    <div className="text-sm text-muted-foreground">
                      Status: <span className="font-medium">{statusFilter}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setStatusFilter(null)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Clear status filter</span>
                    </Button>
                  </div>
                )}
                {categoryFilter && (
                  <div className="flex items-center space-x-1">
                    <div className="text-sm text-muted-foreground">
                      Category: <span className="font-medium">{getCategoryLabel(categoryFilter)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCategoryFilter(null)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Clear category filter</span>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Expenses Table */}
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Vendor
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="h-12 px-4 text-center text-muted-foreground">
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-muted/50">
                      <td className="h-12 px-4 align-middle font-medium">
                        {expense.contactName || 'Not specified'}
                      </td>
                      <td className="h-12 px-4 align-middle">
                        <Link href={`/dashboard/expenses/${expense.id}`} className="text-primary hover:underline">
                          {expense.description}
                        </Link>
                      </td>
                      <td className="h-12 px-4 align-middle">{expense.category ? getCategoryLabel(expense.category) : 'Uncategorized'}</td>
                      <td className="h-12 px-4 align-middle">{formatDate(expense.date)}</td>
                      <td className="h-12 px-4 align-middle font-medium">{formatCurrency(expense.amount)}</td>
                      <td className="h-12 px-4 align-middle text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </td>
                      <td className="h-12 px-4 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/expenses/${expense.id}`}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/expenses/${expense.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            {expense.receiptUrl && (
                              <DropdownMenuItem
                                onClick={() => window.open(expense.receiptUrl, '_blank')}
                              >
                                <Receipt className="mr-2 h-4 w-4" />
                                View Receipt
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 