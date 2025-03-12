"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, Link2, AlertTriangle, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/contexts/ApiContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import DirectExportButton from '@/components/DirectExportButton';

// Define types for API responses
interface QuickBooksConnection {
  connected: boolean;
  syncFrequency?: string;
  lastSyncedAt?: string;
  useDirectExport?: boolean;
  [key: string]: unknown;
}

interface SyncStatus {
  isActive: boolean;
  [key: string]: unknown;
}

interface ApiResponse<T> {
  data: T;
  [key: string]: unknown;
}

interface AuthUrlResponse {
  url: string;
  [key: string]: unknown;
}

export default function QuickBooksIntegrationPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<QuickBooksConnection>({ connected: false });
  const [syncFrequency, setSyncFrequency] = useState('DAILY');
  const [isSyncing, setIsSyncing] = useState(false);
  const [useDirectExport, setUseDirectExport] = useState(false);

  // Load connection status
  useEffect(() => {
    const fetchConnection = async () => {
      try {
        setLoading(true);
        const response = await apiService.get<ApiResponse<QuickBooksConnection>>('/api/quickbooks/connection');
        
        // Make sure response and response.data exist before using them
        if (response && typeof response === 'object' && 'data' in response) {
          const data = response.data as QuickBooksConnection;
          setConnection(data);
          
          // Check if syncFrequency exists before accessing it
          if (data.syncFrequency) {
            setSyncFrequency(data.syncFrequency);
          }
          
          // Check if useDirectExport exists before accessing it
          if (data.useDirectExport !== undefined) {
            setUseDirectExport(data.useDirectExport);
          }
          
          // If there's an active connection, also fetch sync status
          if (data.connected) {
            try {
              await apiService.get<ApiResponse<SyncStatus>>('/api/quickbooks/sync/status');
              // We're not using the sync status anymore, so we don't need to set it
            } catch (syncError) {
              console.error('Error fetching QuickBooks sync status:', syncError);
              // Don't set the main error - just log it, as we still have the connection
            }
          }
        } else {
          // Handle case where response or response.data is undefined
          setConnection({ connected: false });
          console.error('Invalid response format from QuickBooks connection API');
          setError('Received invalid data from QuickBooks connection API');
        }
      } catch (error) {
        console.error('Error fetching QuickBooks connection:', error);
        setError('Failed to load QuickBooks connection status');
        // Set a default connection state to prevent undefined errors
        setConnection({ connected: false });
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
      const response = await apiService.get<ApiResponse<AuthUrlResponse>>('/api/quickbooks/auth/url');
      
      if (response && typeof response === 'object' && 'data' in response && 
          response.data && typeof response.data === 'object' && 'url' in response.data) {
        window.location.href = response.data.url as string;
      } else {
        throw new Error('Invalid response from auth URL endpoint');
      }
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
      await apiService.delete('/api/quickbooks/connection');
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
      await apiService.put('/api/quickbooks/connection/settings', { syncFrequency: value });
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
      await apiService.post('/api/quickbooks/sync');
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

  // Handle direct export toggle
  const handleDirectExportToggle = async (checked: boolean) => {
    try {
      setUseDirectExport(checked);
      
      await apiService.put('/api/quickbooks/connection/settings', { 
        syncFrequency,
        useDirectExport: checked 
      });
      
      toast({
        title: "Settings updated",
        description: `Direct export ${checked ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error) {
      console.error('Error updating direct export setting:', error);
      setError('Failed to update direct export setting');
      // Revert the UI state if the API call fails
      setUseDirectExport(!checked);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">QuickBooks Integration</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>
            Connect your QuickBooks account to automatically sync your accounting data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Loading connection status...</span>
            </div>
          ) : connection.connected ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <Link2 className="h-5 w-5" />
                <span className="font-medium">Connected to QuickBooks</span>
              </div>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="syncFrequency" className="text-right">
                    Sync Frequency
                  </Label>
                  <select
                    id="syncFrequency"
                    className="col-span-3 p-2 border rounded"
                    value={syncFrequency}
                    onChange={(e) => handleSyncFrequencyChange(e.target.value)}
                  >
                    <option value="HOURLY">Hourly</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="MANUAL">Manual Only</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="directExport" className="text-right">
                    Direct Export
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="directExport"
                      checked={useDirectExport}
                      onCheckedChange={handleDirectExportToggle}
                    />
                    <span className="text-sm text-gray-500">
                      Export data directly from QuickBooks to Snowflake without storing in the application database
                    </span>
                  </div>
                </div>
                
                {connection.lastSyncedAt && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-right text-sm text-gray-500">Last Synced</span>
                    <span className="col-span-3 text-sm">
                      {new Date(connection.lastSyncedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleManualSync}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleDisconnect}
                  disabled={isSyncing}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Not connected to QuickBooks</span>
              </div>
              
              <Button onClick={handleConnect} disabled={loading}>
                <Link2 className="mr-2 h-4 w-4" />
                Connect to QuickBooks
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Your QuickBooks data will be synchronized according to your settings.
            You can manually trigger a sync at any time.
          </p>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Direct Export to Snowflake</CardTitle>
          <CardDescription>
            Export your QuickBooks data directly to Snowflake without storing it in the application database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            The direct export feature allows you to send your QuickBooks data directly to Snowflake,
            bypassing the application database. This is useful for:
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Reducing storage requirements in the application database</li>
            <li>Improving performance for large datasets</li>
            <li>Enabling advanced analytics in Snowflake</li>
            <li>Maintaining a single source of truth in Snowflake</li>
          </ul>
          
          <div className="mb-4">
            <h3 className="font-medium flex items-center mb-2">
              <Database className="h-4 w-4 mr-2" />
              How it works
            </h3>
            <p className="text-sm text-gray-500">
              When direct export is enabled, the system will fetch data from QuickBooks and send it
              directly to Snowflake without storing it in the application database. You can trigger
              a direct export manually using the Direct Export button, or it will happen automatically
              based on your sync frequency settings.
            </p>
          </div>
          
          {connection.connected && (
            <div className="flex justify-start mt-4">
              <DirectExportButton variant="outline" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            Direct export requires an active QuickBooks connection and Snowflake configuration.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 