"use client";

import React, { useState } from 'react';
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
  FileText
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
import { expenses, contacts, accounts } from '@/lib/mock-data';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date: Date | null) => {
  if (!date) return 'Not paid';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
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
  return category.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Get unique categories
  const categories = [...new Set(expenses.map(expense => expense.category))];
  
  // Get contact and account names for expenses
  const enrichedExpenses = expenses.map(expense => {
    const contact = contacts.find(c => c.id === expense.contactId);
    const account = accounts.find(a => a.id === expense.accountId);
    return {
      ...expense,
      contactName: contact ? contact.name : 'Unknown',
      accountName: account ? account.name : 'Unknown',
      categoryLabel: getCategoryLabel(expense.category),
    };
  });
  
  // Filter expenses based on search query, status and category
  const filteredExpenses = enrichedExpenses.filter(expense => {
    // Filter by search query
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    
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
                      {getCategoryLabel(category)}
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Vendor</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Description</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Category</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Date</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Amount</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
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
                        {expense.contactName}
                      </td>
                      <td className="h-12 px-4 align-middle">
                        <Link href={`/dashboard/expenses/${expense.id}`} className="text-primary hover:underline">
                          {expense.description}
                        </Link>
                      </td>
                      <td className="h-12 px-4 align-middle">{expense.categoryLabel}</td>
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
                            <DropdownMenuItem>
                              <Receipt className="mr-2 h-4 w-4" />
                              <span>View Receipt</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
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