"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function QuickBooksSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const organizationId = searchParams.get('organizationId');
  
  // Redirect to integration page after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/settings/integrations/quickbooks');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="container max-w-md py-12">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">QuickBooks Connected!</CardTitle>
          <CardDescription>
            Your QuickBooks account has been successfully connected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We&apos;ll start syncing your QuickBooks data according to your sync settings.
            You&apos;ll be redirected back automatically in a few seconds.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button 
            variant="default" 
            onClick={() => router.push('/settings/integrations/quickbooks')}
          >
            Return to QuickBooks Integration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 