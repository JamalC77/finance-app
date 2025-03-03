import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  ChevronDown, 
  ArrowUpDown, 
  CalendarIcon 
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Transaction } from '@/lib/types';

interface TransactionTableProps {
  transactions: Transaction[];
  systemTransactions?: Transaction[];
  onMatchTransaction?: (statementTransactionId: string, systemTransactionId: string) => void;
  onUnmatchTransaction?: (statementTransactionId: string) => void;
  showMatching?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export function TransactionTable({ 
  transactions, 
  systemTransactions = [],
  onMatchTransaction,
  onUnmatchTransaction,
  showMatching = false
}: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortColumn, setSortColumn] = useState<keyof Transaction>('date');

  const toggleSort = (column: keyof Transaction) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortColumn === 'amount') {
      return sortDirection === 'asc' 
        ? a.amount - b.amount 
        : b.amount - a.amount;
    } else if (sortColumn === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      const aValue = a[sortColumn] || '';
      const bValue = b[sortColumn] || '';
      return sortDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    }
  });

  const filteredTransactions = sortedTransactions.filter(
    transaction => 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatCurrency(transaction.amount).includes(searchTerm) ||
      formatDate(transaction.date).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectTransaction = (transactionId: string) => {
    if (selectedTransactions.includes(transactionId)) {
      setSelectedTransactions(selectedTransactions.filter(id => id !== transactionId));
    } else {
      setSelectedTransactions([...selectedTransactions, transactionId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {selectedTransactions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedTransactions.length} selected
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedTransactions([])}
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSort('date')}
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="min-w-[300px]">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSort('description')}
                >
                  Description
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleSort('amount')}
                >
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              {showMatching && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showMatching ? 6 : 5} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTransactions.includes(transaction.id)}
                      onCheckedChange={() => toggleSelectTransaction(transaction.id)}
                      aria-label={`Select transaction ${transaction.description}`}
                    />
                  </TableCell>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    {transaction.reconciled ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Reconciled
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Unreconciled
                      </Badge>
                    )}
                  </TableCell>
                  {showMatching && (
                    <TableCell>
                      {transaction.reconciled ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUnmatchTransaction?.(transaction.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Unmatch
                        </Button>
                      ) : systemTransactions && systemTransactions.length > 0 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Match
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[300px] max-h-[400px] overflow-y-auto">
                            {systemTransactions
                              .filter(t => !t.reconciled)
                              .map(systemTransaction => (
                                <DropdownMenuItem
                                  key={systemTransaction.id}
                                  onClick={() => onMatchTransaction?.(transaction.id, systemTransaction.id)}
                                >
                                  <div className="flex flex-col">
                                    <span>{systemTransaction.description}</span>
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                      <span>{formatDate(systemTransaction.date)}</span>
                                      <span className={systemTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                                        {formatCurrency(systemTransaction.amount)}
                                      </span>
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          No matches
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 