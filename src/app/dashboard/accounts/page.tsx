"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  MoreHorizontal,
  ExternalLink,
  FileText,
  Edit,
  Trash2,
  Landmark,
  CreditCard,
  Wallet
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
import { accounts } from '@/lib/mock-data';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const getAccountTypeIcon = (type: string) => {
  switch (type) {
    case 'BANK':
      return <Landmark className="h-4 w-4 text-blue-500" />;
    case 'CREDIT_CARD':
      return <CreditCard className="h-4 w-4 text-purple-500" />;
    case 'LOAN':
      return <Wallet className="h-4 w-4 text-green-500" />;
    default:
      return <Landmark className="h-4 w-4" />;
  }
};

const getAccountTypeName = (type: string) => {
  switch (type) {
    case 'BANK':
      return 'Bank';
    case 'CREDIT_CARD':
      return 'Credit Card';
    case 'LOAN':
      return 'Loan';
    default:
      return type;
  }
};

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  
  // Filter accounts based on search query and type
  const filteredAccounts = accounts.filter(account => {
    // Filter by search query
    const matchesSearch = 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.institution.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by type
    const matchesType = typeFilter ? account.type === typeFilter : true;
    
    return matchesSearch && matchesType;
  });
  
  // Calculate totals
  const bankBalance = accounts
    .filter(account => account.type === 'BANK')
    .reduce((sum, account) => sum + account.currentBalance, 0);
  
  const creditBalance = accounts
    .filter(account => account.type === 'CREDIT_CARD')
    .reduce((sum, account) => sum + account.currentBalance, 0);
  
  const loanBalance = accounts
    .filter(account => account.type === 'LOAN')
    .reduce((sum, account) => sum + account.currentBalance, 0);

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
        <Link href="/dashboard/accounts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Account
          </Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Bank Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(bankBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {accounts.filter(a => a.type === 'BANK').length} accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Credit Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(creditBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {accounts.filter(a => a.type === 'CREDIT_CARD').length} accounts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(loanBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {accounts.filter(a => a.type === 'LOAN').length} accounts
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Accounts</CardTitle>
          <CardDescription>
            View and manage your financial accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search accounts..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Type</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTypeFilter(null)}>
                    All Accounts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('BANK')}>
                    Bank Accounts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('CREDIT_CARD')}>
                    Credit Cards
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('LOAN')}>
                    Loans
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {typeFilter && (
              <div className="flex items-center space-x-1">
                <div className="text-sm text-muted-foreground">
                  Type: <span className="font-medium">{getAccountTypeName(typeFilter)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setTypeFilter(null)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Clear filter</span>
                </Button>
              </div>
            )}
          </div>
          
          {/* Accounts Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Account</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Institution</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Type</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Balance</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-12 px-4 text-center text-muted-foreground">
                      No accounts found
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => (
                    <tr key={account.id} className="border-b hover:bg-muted/50">
                      <td className="h-12 px-4 align-middle">
                        <Link href={`/dashboard/accounts/${account.id}`} className="text-primary hover:underline">
                          {account.name}
                        </Link>
                      </td>
                      <td className="h-12 px-4 align-middle">{account.institution}</td>
                      <td className="h-12 px-4 align-middle">
                        <div className="flex items-center">
                          {getAccountTypeIcon(account.type)}
                          <span className="ml-2">{getAccountTypeName(account.type)}</span>
                        </div>
                      </td>
                      <td className="h-12 px-4 align-middle font-medium">{formatCurrency(account.currentBalance)}</td>
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
                              <ExternalLink className="mr-2 h-4 w-4" />
                              <span>Connect Bank</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View Transactions</span>
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