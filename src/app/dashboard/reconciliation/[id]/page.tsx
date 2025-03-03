"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Building, 
  BadgeCheck, 
  DownloadCloud,
  RefreshCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TransactionTable } from '@/components/reconciliation/TransactionTable';
import { ReconciliationSummary } from '@/components/reconciliation/ReconciliationSummary';
import { reconciliationApi } from '@/lib/api';
import { ReconciliationStatement, Transaction, ReconciliationSummary as ReconciliationSummaryType } from '@/lib/types';

interface PageProps {
  params: {
    id: string;
  };
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

export default function StatementDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;
  
  const [statement, setStatement] = useState<ReconciliationStatement | null>(null);
  const [systemTransactions, setSystemTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatching, setIsMatching] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('transactions');
  
  // Calculate summary data based on the current state
  const calculateSummary = (): ReconciliationSummaryType => {
    if (!statement) {
      return {
        totalTransactions: 0,
        matchedTransactions: 0,
        unmatchedTransactions: 0,
        statementBalance: 0,
        systemBalance: 0,
        difference: 0
      };
    }
    
    const matchedTransactions = statement.transactions.filter(t => t.reconciled).length;
    
    return {
      totalTransactions: statement.transactions.length,
      matchedTransactions,
      unmatchedTransactions: statement.transactions.length - matchedTransactions,
      statementBalance: statement.closingBalance,
      systemBalance: statement.openingBalance, // This would normally come from the system
      difference: statement.closingBalance - statement.openingBalance // This is just a placeholder
    };
  };
  
  const fetchStatement = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await reconciliationApi.getStatement(id);
      setStatement(data);
      
      // In a real app, we would also fetch system transactions for matching
      // For demo purposes, we'll just use the same transactions as mock system transactions
      if (data && data.transactions) {
        // Create a copy with modified IDs to simulate system transactions
        const mockSystemTransactions = data.transactions.map(t => ({
          ...t,
          id: `sys-${t.id}`,
          reconciled: false // Reset reconciled status for demo
        }));
        setSystemTransactions(mockSystemTransactions);
      }
    } catch (err) {
      console.error('Error fetching statement:', err);
      setError('Failed to load reconciliation statement');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStatement();
  }, [id]);
  
  const handleMatchTransaction = async (statementTransactionId: string, systemTransactionId: string) => {
    if (!statement) return;
    
    setIsMatching(true);
    
    try {
      // Make API call to match transactions
      await reconciliationApi.matchTransactions({
        statementId: id,
        matches: [{ statementTransactionId, systemTransactionId }]
      });
      
      // Update local state to reflect the match
      setStatement({
        ...statement,
        transactions: statement.transactions.map(t => 
          t.id === statementTransactionId ? { ...t, reconciled: true } : t
        )
      });
      
      // Update system transactions state
      setSystemTransactions(systemTransactions.map(t => 
        t.id === systemTransactionId ? { ...t, reconciled: true } : t
      ));
    } catch (err) {
      console.error('Error matching transactions:', err);
      // Show error toast or notification here
    } finally {
      setIsMatching(false);
    }
  };
  
  const handleUnmatchTransaction = async (statementTransactionId: string) => {
    if (!statement) return;
    
    setIsMatching(true);
    
    try {
      // Make API call to unmatch a transaction
      await reconciliationApi.matchTransactions({
        statementId: id,
        unmatch: [statementTransactionId]
      });
      
      // Update local state to reflect the unmatch
      setStatement({
        ...statement,
        transactions: statement.transactions.map(t => 
          t.id === statementTransactionId ? { ...t, reconciled: false } : t
        )
      });
      
      // Reset system transaction status
      // In a real app we'd need to know which system transaction was matched, here we use a simplified approach
      setSystemTransactions(systemTransactions.map(t => 
        t.id === `sys-${statementTransactionId}` ? { ...t, reconciled: false } : t
      ));
    } catch (err) {
      console.error('Error unmatching transaction:', err);
      // Show error toast or notification here
    } finally {
      setIsMatching(false);
    }
  };
  
  const handleCompleteReconciliation = async () => {
    if (!statement) return;
    
    setIsCompleting(true);
    
    try {
      // Make API call to complete the reconciliation process
      await reconciliationApi.completeReconciliation(id, {
        statementId: id,
        notes: 'Reconciliation completed successfully'
      });
      
      // Update local state
      setStatement({
        ...statement,
        status: 'completed'
      });
      
      // Redirect to completion page
      router.push(`/dashboard/reconciliation/${id}/complete`);
    } catch (err) {
      console.error('Error completing reconciliation:', err);
      // Show error toast or notification here
    } finally {
      setIsCompleting(false);
    }
  };
  
  const summary = calculateSummary();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href="/dashboard/reconciliation" passHref>
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Statements
            </Button>
          </Link>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
        
        <div className="animate-pulse space-y-6">
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  if (error || !statement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href="/dashboard/reconciliation" passHref>
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Statements
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Statement Details</h2>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Statement</CardTitle>
            <CardDescription className="text-red-700">{error || 'Failed to load statement'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={fetchStatement}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/dashboard/reconciliation" passHref>
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Statements
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{statement.accountName}</h2>
            <p className="text-muted-foreground mt-1">
              Statement Period: {formatDate(statement.period.startDate)} - {formatDate(statement.period.endDate)}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`
            px-3 py-1 
            ${statement.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
              statement.status === 'matched' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-amber-50 text-amber-700 border-amber-200'}
          `}
        >
          <BadgeCheck className="h-3.5 w-3.5 mr-1" />
          {statement.status === 'completed' ? 'Completed' : 
            statement.status === 'matched' ? 'Matched' : 
            statement.status === 'in_progress' ? 'In Progress' : 'Pending'}
        </Badge>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Statement Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Account</p>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                <p className="font-medium">{statement.accountName}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Period</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <p className="font-medium">{formatDate(statement.period.startDate)} - {formatDate(statement.period.endDate)}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Opening Balance</p>
              <p className="font-medium">{formatCurrency(statement.openingBalance)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Closing Balance</p>
              <p className="font-medium">{formatCurrency(statement.closingBalance)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="matching">Matching</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchStatement} size="sm">
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            <Separator className="mb-4" />
            <TabsContent value="transactions" className="m-0">
              <TransactionTable 
                transactions={statement.transactions} 
                showMatching={false}
              />
            </TabsContent>
            <TabsContent value="matching" className="m-0">
              <TransactionTable 
                transactions={statement.transactions} 
                systemTransactions={systemTransactions}
                onMatchTransaction={handleMatchTransaction}
                onUnmatchTransaction={handleUnmatchTransaction}
                showMatching={true}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <ReconciliationSummary 
            summary={summary} 
            onComplete={handleCompleteReconciliation}
            isCompleting={isCompleting}
          />
        </div>
      </div>
    </div>
  );
} 