"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, FileText, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatementCard } from '@/components/reconciliation/StatementCard';
import { useApi } from '@/lib/contexts/ApiContext';
import { ReconciliationStatement } from '@/lib/types';

export default function ReconciliationPage() {
  const api = useApi();
  const [statements, setStatements] = useState<ReconciliationStatement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatements = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/reconciliation/statements');
      setStatements(response.data);
    } catch (err) {
      console.error('Error fetching statements:', err);
      setError('Failed to load reconciliation statements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatements();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bank Reconciliation</h2>
          <p className="text-muted-foreground mt-1">
            Reconcile your bank statements with your accounting records
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchStatements} disabled={isLoading}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/dashboard/reconciliation/import" passHref>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Import Statement
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-full h-64">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error Loading Statements</CardTitle>
            <CardDescription className="text-red-700">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={fetchStatements}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : statements.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Statements Found</CardTitle>
            <CardDescription>
              Import your first bank statement to begin reconciliation
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-4">
              You haven't imported any bank statements yet. Import a statement to get started with reconciliation.
            </p>
            <Link href="/dashboard/reconciliation/import" passHref>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Import Statement
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statements.map((statement) => (
            <StatementCard key={statement.id} statement={statement} />
          ))}
        </div>
      )}
    </div>
  );
} 