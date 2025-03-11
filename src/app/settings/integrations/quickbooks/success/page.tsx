"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiService } from '@/lib/contexts/ApiContext';

export default function QuickBooksSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const completeConnection = async () => {
      try {
        setLoading(true);
        
        // Get the code and realmId from the URL
        const code = searchParams?.get('code');
        const realmId = searchParams?.get('realmId');
        
        if (!code || !realmId) {
          setError('Missing authorization parameters. Please try connecting again.');
          return;
        }
        
        // Complete the OAuth flow by sending the code and realmId to your API
        await apiService.post('/quickbooks/auth/callback', { code, realmId });
        
        setSuccess(true);
      } catch (error) {
        console.error('Error completing QuickBooks connection:', error);
        setError('Failed to connect to QuickBooks. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    completeConnection();
  }, [searchParams]);

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">QuickBooks Connection</CardTitle>
          <CardDescription className="text-center">
            Finalizing your connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground text-center">
                Connecting to QuickBooks...
              </p>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Connection Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Successfully Connected!</h3>
              <p className="text-muted-foreground text-center">
                Your QuickBooks account has been connected successfully.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => router.push('/settings/integrations/quickbooks')}
          >
            {success ? 'Go to QuickBooks Settings' : 'Back to Settings'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 