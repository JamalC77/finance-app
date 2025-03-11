"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function QuickBooksErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('error') || 'An unknown error occurred while connecting to QuickBooks.';

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">QuickBooks Connection Failed</CardTitle>
          <CardDescription className="text-center">
            There was a problem connecting to QuickBooks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Some possible reasons for this error:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
              <li>The authorization was denied or canceled</li>
              <li>The QuickBooks account requires additional setup</li>
              <li>There was a network issue during the connection process</li>
              <li>The application doesn't have permission to access the account</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full" 
            onClick={() => router.push('/settings/integrations/quickbooks')}
          >
            Back to QuickBooks Settings
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => window.open('https://help.quickbooks.intuit.com/', '_blank')}
          >
            QuickBooks Help Center
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 