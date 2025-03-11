"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, RefreshCw, Link2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/contexts/ApiContext';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function QuickBooksIntegrationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<any>(null);
  const [syncFrequency, setSyncFrequency] = useState('DAILY');
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load connection status
  useEffect(() => {
    const fetchConnection = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/quickbooks/connection');
        setConnection(response.data);
        
        if (response.data.syncFrequency) {
          setSyncFrequency(response.data.syncFrequency);
        }
        
        // If there's an active connection, also fetch sync status
        if (response.data.connected) {
          const statusResponse = await apiService.get('/quickbooks/sync/status');
          setSyncStatus(statusResponse.data);
        }
      } catch (error) {
        console.error('Error fetching QuickBooks connection:', error);
        setError('Failed to load QuickBooks connection status');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConnection();
    }
  }, [user]);

  // Handle connect to QuickBooks button click
  const handleConnect = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/api/quickbooks/auth/url');
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error generating QuickBooks auth URL:', error);
      setError('Failed to connect to QuickBooks. Please try again.');
      setLoading(false);
    }
  };

  // Handle disconnect from QuickBooks button click
  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect from QuickBooks? This will stop all synchronization.')) {
      return;
    }
    
    try {
      setLoading(true);
      await apiService.delete('/quickbooks/connection');
      setConnection({ connected: false });
      toast({
        title: "Successfully disconnected",
        description: "Your QuickBooks account has been disconnected",
      });
    } catch (error) {
      console.error('Error disconnecting from QuickBooks:', error);
      setError('Failed to disconnect from QuickBooks');
    } finally {
      setLoading(false);
    }
  };

  // Handle sync frequency change
  const handleSyncFrequencyChange = async (value: string) => {
    setSyncFrequency(value);
    
    try {
      await apiService.put('/quickbooks/connection/settings', { syncFrequency: value });
      toast({
        title: "Settings updated",
        description: "Sync frequency updated successfully",
      });
    } catch (error) {
      console.error('Error updating sync frequency:', error);
      setError('Failed to update sync frequency');
    }
  };

  // Handle manual sync button click
  const handleManualSync = async () => {
    try {
      setIsSyncing(true);
      await apiService.post('/quickbooks/sync');
      const statusResponse = await apiService.get('/quickbooks/sync/status');
      setSyncStatus(statusResponse.data);
      toast({
        title: "Sync started",
        description: "QuickBooks data synchronization has started",
      });
    } catch (error) {
      console.error('Error starting sync:', error);
      setError('Failed to start synchronization');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">QuickBooks Integration</h1>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading && !connection ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>
                Connect your QuickBooks account to sync your financial data
              </CardDescription>
            </CardHeader>
            <CardContent>
              {connection?.connected ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Link2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Connected to QuickBooks</p>
                      <p className="text-sm text-muted-foreground">
                        Last synced: {connection.lastSyncedAt 
                          ? new Date(connection.lastSyncedAt).toLocaleString() 
                          : 'Never'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sync Frequency</label>
                      <Select value={syncFrequency} onValueChange={handleSyncFrequencyChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HOURLY">Hourly</SelectItem>
                          <SelectItem value="DAILY">Daily</SelectItem>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                          <SelectItem value="MANUAL">Manual Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        onClick={handleManualSync}
                        disabled={isSyncing}
                        className="space-x-2"
                      >
                        {isSyncing ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        <span>Sync Now</span>
                      </Button>
                    </div>
                  </div>
                  
                  {syncStatus?.isActive && (
                    <Alert>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <AlertTitle>Sync in Progress</AlertTitle>
                      <AlertDescription>
                        Your QuickBooks data is currently being synchronized
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Connect your QuickBooks account to automatically sync your accounting data.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                    <li>Import your chart of accounts</li>
                    <li>Sync customers and vendors</li>
                    <li>Import invoices and bills</li>
                    <li>Sync transactions</li>
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {connection?.connected ? (
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect}
                  disabled={loading}
                >
                  Disconnect from QuickBooks
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  onClick={handleConnect}
                  disabled={loading}
                >
                  Connect to QuickBooks
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {connection?.connected && (
            <Card>
              <CardHeader>
                <CardTitle>Sync History</CardTitle>
                <CardDescription>
                  Recent synchronization activity with QuickBooks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Full Sync</p>
                      <p className="text-sm text-muted-foreground">
                        {connection.lastSyncedAt 
                          ? new Date(connection.lastSyncedAt).toLocaleString() 
                          : 'No sync history available'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
} 