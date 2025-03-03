"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  ArrowLeft, 
  FileText, 
  Printer, 
  Download,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { reconciliationApi } from '@/lib/api';
import { ReconciliationStatement, ReconciliationSummary } from '@/lib/types';

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

export default function CompletionPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;
  
  const [statement, setStatement] = useState<ReconciliationStatement | null>(null);
  const [summary, setSummary] = useState<ReconciliationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch the statement and summary data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch the statement details
        const statementData = await reconciliationApi.getStatement(id);
        setStatement(statementData);
        
        // Calculate summary
        if (statementData) {
          const matchedTransactions = statementData.transactions.filter(t => t.reconciled).length;
          
          setSummary({
            totalTransactions: statementData.transactions.length,
            matchedTransactions,
            unmatchedTransactions: statementData.transactions.length - matchedTransactions,
            statementBalance: statementData.closingBalance,
            systemBalance: statementData.openingBalance, // This would normally come from the system
            difference: statementData.closingBalance - statementData.openingBalance // This is just a placeholder
          });
        }
      } catch (err) {
        console.error('Error fetching reconciliation data:', err);
        setError('Failed to load reconciliation data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handlePrint = () => {
    window.print();
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href={`/dashboard/reconciliation/${id}`} passHref>
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Statement
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
              <div className="h-64 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (error || !statement || !summary) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href={`/dashboard/reconciliation/${id}`} passHref>
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Statement
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Reconciliation Complete</h2>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Reconciliation Data</CardTitle>
            <CardDescription className="text-red-700">{error || 'Failed to load reconciliation data'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => router.refresh()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const completionDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href={`/dashboard/reconciliation/${id}`} passHref>
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Statement
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reconciliation Complete</h2>
            <p className="text-muted-foreground mt-1">
              {statement.accountName} statement has been reconciled successfully
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center text-green-800 py-8">
            <div className="bg-white p-3 rounded-full border border-green-200 mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Reconciliation Completed Successfully</h3>
            <p className="max-w-md">
              The bank statement has been successfully reconciled and all transactions have been matched.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Certificate</CardTitle>
          <CardDescription>Summary of reconciliation for your records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-md p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold">Bank Reconciliation Certificate</h3>
              <p className="text-muted-foreground">
                Completed on {completionDate}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Account Name</p>
                <p className="font-medium">{statement.accountName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statement Period</p>
                <p className="font-medium">
                  {formatDate(statement.period.startDate)} - {formatDate(statement.period.endDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bank Statement Balance</p>
                <p className="font-medium">{formatCurrency(statement.closingBalance)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">System Balance</p>
                <p className="font-medium">{formatCurrency(summary.systemBalance)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="font-medium">Total Transactions</p>
                <p className="font-medium">{summary.totalTransactions}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Matched Transactions</p>
                <p className="font-medium">{summary.matchedTransactions}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Unmatched Transactions</p>
                <p className="font-medium">{summary.unmatchedTransactions}</p>
              </div>
              <Separator />
              <div className="flex justify-between">
                <p className="font-semibold">Difference</p>
                <p className="font-semibold text-green-600">{formatCurrency(summary.difference)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="text-center text-sm text-muted-foreground">
              <p>This certificate confirms that the bank statement has been reconciled with the accounting records.</p>
              <p className="mt-2">Reconciliation ID: {id}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            View Transactions
          </Button>
          <Link href="/dashboard/reconciliation" passHref>
            <Button>
              Back to Statements
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 