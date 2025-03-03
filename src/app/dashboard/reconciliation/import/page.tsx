"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatementUploader } from '@/components/reconciliation/StatementUploader';

// Normally this would come from an API, but for demo purposes we'll use mock data
const mockAccounts = [
  { id: '1', name: 'Business Checking' },
  { id: '2', name: 'Business Savings' },
  { id: '3', name: 'Credit Card' },
];

export default function ImportStatementPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState(mockAccounts);
  
  const handleSuccess = (data: any) => {
    // Redirect to the statement detail page after successful import
    if (data && data.statementId) {
      router.push(`/dashboard/reconciliation/${data.statementId}`);
    } else {
      // If we don't get a specific statement ID, go back to the list
      router.push('/dashboard/reconciliation');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/dashboard/reconciliation" passHref>
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Statements
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Import Bank Statement</h2>
          <p className="text-muted-foreground mt-1">
            Upload a statement file from your bank to begin reconciliation
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <StatementUploader accounts={accounts} onSuccess={handleSuccess} />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>How to prepare your statement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-md">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Supported Formats</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    We support CSV, OFX, QFX, and QBO formats from most major banks.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Best Practices</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Download the most recent statement from your bank</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Ensure all transactions are included in the statement period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>For CSV files, make sure the columns include date, description, and amount</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>After import, you'll be able to match transactions to your records</span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2">Need Help?</h4>
                <Button variant="link" className="h-auto p-0 text-sm">
                  View Import Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 