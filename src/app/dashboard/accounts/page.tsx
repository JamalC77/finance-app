"use client";

import React, { useState, useEffect } from 'react';
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
import { useApi } from '@/lib/contexts/ApiContext';

// Define account type that works with both mock data and API data
interface Account {
  id: string;
  name: string;
  code?: string;
  accountNumber?: string;
  type: string;
  subtype?: string;
  description?: string;
  balance?: number;
  currentBalance?: number;
  organizationId: string;
  institution?: string;
  isActive?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Get account type icon based on account type
const getAccountTypeIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case 'BANK':
      return <Landmark className="h-5 w-5" />;
    case 'CREDIT_CARD':
      return <CreditCard className="h-5 w-5" />;
    case 'LOAN':
      return <FileText className="h-5 w-5" />;
    default:
      return <Wallet className="h-5 w-5" />;
  }
};

// Get account type name based on account type
const getAccountTypeName = (type: string) => {
  switch (type.toUpperCase()) {
    case 'BANK':
      return 'Bank Account';
    case 'CREDIT_CARD':
      return 'Credit Card';
    case 'LOAN':
      return 'Loan';
    default:
      return 'Account';
  }
};

export default function AccountsPage() {
  // State for accounts data
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Get API context
  const api = useApi();
  
  // Fetch accounts data from API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const data = await api.get<Account[]>('/api/accounts');
        
        // Normalize data to ensure compatibility with the component
        const normalizedData = data.map(account => ({
          ...account,
          // Ensure we have consistent property names between mock data and API
          currentBalance: account.balance || account.currentBalance || 0,
          // Default institution value if needed by the UI
          institution: account.institution || ''
        }));
        
        setAccounts(normalizedData);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError(err as Error);
        // No longer falling back to mock data
        setAccounts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAccounts();
  }, [api]);
  
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Accounts</h1>
        </div>
        <div className="grid gap-4">
          <p>Loading accounts...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Accounts</h1>
        </div>
        <div className="grid gap-4">
          <p className="text-red-500">Error loading accounts: {error.message}</p>
          <p>Showing fallback data</p>
        </div>
      </div>
    );
  }

  // Render function for accounts table
  const renderAccounts = () => {
    if (filteredAccounts.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="h-24 text-center">
            No accounts found. Try adjusting your filters or create a new account.
          </td>
        </tr>
      );
    }
    
    return filteredAccounts.map((account) => (
      <tr key={account.id} className="border-b border-gray-100">
        <td className="py-3 pl-4 pr-8">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gray-50 p-2 text-black">
              {getAccountTypeIcon(account.type)}
            </div>
            <div>
              <div className="font-medium">{account.name}</div>
              <div className="text-sm text-muted-foreground">
                {account.institution || 'Personal'}
              </div>
            </div>
          </div>
        </td>
        <td className="py-3 px-4">{account.accountNumber || 'N/A'}</td>
        <td className="py-3 px-4">{getAccountTypeName(account.type)}</td>
        <td className="py-3 px-4">
          {formatCurrency(account.currentBalance || account.balance || 0)}
        </td>
        <td className="py-3 px-4 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={`/dashboard/accounts/${account.id}`} className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>View Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/dashboard/accounts/${account.id}/edit`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Account</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    ));
  };

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
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="h-12 px-4 text-left font-medium">Name</th>
                    <th className="h-12 px-4 text-left font-medium">Account Number</th>
                    <th className="h-12 px-4 text-left font-medium">Type</th>
                    <th className="h-12 px-4 text-left font-medium">Balance</th>
                    <th className="h-12 px-4 text-left font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="h-24 text-center">
                        <div className="flex justify-center items-center">Loading accounts...</div>
                      </td>
                    </tr>
                  ) : (
                    renderAccounts()
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 