"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function QuickBooksErrorPage() {
  const router = useRouter();
  
  return (
    <div className="container max-w-md py-12">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Connection Failed</CardTitle>
          <CardDescription>
            We couldn&apos;t connect to your QuickBooks account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            There was a problem connecting to QuickBooks. This could be due to:
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside text-left">
            <li>QuickBooks authorization was declined</li>
            <li>The connection timed out</li>
            <li>There was a server error</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            Please try connecting again. If the problem persists, contact support.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button 
            variant="default" 
            onClick={() => router.push('/settings/integrations/quickbooks')}
          >
            Back to QuickBooks Integration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 