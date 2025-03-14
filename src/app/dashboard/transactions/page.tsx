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
  ArrowUp,
  ArrowDown
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

// Define transaction type that works with both mock data and API data
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  merchant?: string;
  accountId: string;
  categoryId?: string;
  account?: {
    id: string;
    name: string;
    type: string;
  };
  category?: {
    id: string;
    name: string;
    color: string;
  };
}

const formatCurrency = (amount: number, type?: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: type === 'EXPENSE' ? 'never' : 'auto'
  }).format(type === 'EXPENSE' ? -amount : amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export default function TransactionsPage() {
  // State for transactions data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get API context
  const api = useApi();
  
  // Fetch transactions data from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await api.get<Transaction[]>('/api/transactions');
        
        // Normalize data to ensure compatibility with the component
        const normalizedData = data.map(transaction => ({
          ...transaction,
          // Ensure date is in string format
          date: transaction.date ? new Date(transaction.date).toISOString() : new Date().toISOString()
        }));
        
        setTransactions(normalizedData);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [api]);
  
  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      transaction.description.toLowerCase().includes(query) ||
      (transaction.merchant && transaction.merchant.toLowerCase().includes(query)) ||
      (transaction.account?.name && transaction.account.name.toLowerCase().includes(query)) ||
      (transaction.category?.name && transaction.category.name.toLowerCase().includes(query))
    );
  });
  
  // Render function for transactions table
  const renderTransactions = () => {
    if (filteredTransactions.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="h-24 text-center">
            No transactions found. Try adjusting your filters or create a new transaction.
          </td>
        </tr>
      );
    }
    
    return filteredTransactions.map((transaction) => (
      <tr key={transaction.id} className="border-b border-gray-100">
        <td className="py-3 px-4">
          {formatDate(transaction.date)}
        </td>
        <td className="py-3 px-4">
          <div className="font-medium">{transaction.description}</div>
          <div className="text-sm text-muted-foreground">{transaction.merchant || ''}</div>
        </td>
        <td className="py-3 px-4">
          {transaction.account?.name || 'Unknown Account'}
        </td>
        <td className="py-3 px-4">
          {transaction.category?.name || 'Uncategorized'}
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center">
            <div className={`mr-2 ${transaction.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'}`}>
              {transaction.type === 'EXPENSE' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
            </div>
            <span className={transaction.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'}>
              {formatCurrency(transaction.amount, transaction.type)}
            </span>
          </div>
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
                <Link href={`/dashboard/transactions/${transaction.id}`} className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>View Details</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/dashboard/transactions/${transaction.id}/edit`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Transaction</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Transaction</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    ));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>View and manage your financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="ml-2">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="h-12 px-4 text-left font-medium">Date</th>
                    <th className="h-12 px-4 text-left font-medium">Description</th>
                    <th className="h-12 px-4 text-left font-medium">Account</th>
                    <th className="h-12 px-4 text-left font-medium">Category</th>
                    <th className="h-12 px-4 text-left font-medium">Amount</th>
                    <th className="h-12 px-4 text-left font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="h-24 text-center">
                        <div className="flex justify-center items-center">Loading transactions...</div>
                      </td>
                    </tr>
                  ) : (
                    renderTransactions()
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