"use client";

import React, { useState } from 'react';
import { 
  Database as DatabaseIcon,
  RefreshCw,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/contexts/ApiContext';

interface DirectExportButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function DirectExportButton({ 
  variant = 'outline',
  size = 'default'
}: DirectExportButtonProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleDirectExport = async () => {
    try {
      setIsExporting(true);
      setExportStatus('starting');
      
      await apiService.post('/api/quickbooks/direct-export');
      
      toast({
        title: "Direct export started",
        description: "QuickBooks data is being exported directly to Snowflake",
      });
      
      // Poll for status
      pollExportStatus();
    } catch (error) {
      console.error('Direct export failed:', error);
      setIsExporting(false);
      setExportStatus('failed');
      
      toast({
        title: "Export failed",
        description: "Failed to start direct export. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEntityExport = async (entityType: string) => {
    try {
      setIsExporting(true);
      setExportStatus('starting');
      
      await apiService.post(`/api/quickbooks/direct-export/${entityType}`);
      
      toast({
        title: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} export started`,
        description: `QuickBooks ${entityType} are being exported directly to Snowflake`,
      });
      
      // Poll for status
      pollExportStatus();
    } catch (error) {
      console.error(`${entityType} export failed:`, error);
      setIsExporting(false);
      setExportStatus('failed');
      
      toast({
        title: "Export failed",
        description: `Failed to start ${entityType} export. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const pollExportStatus = async () => {
    try {
      const response = await apiService.get('/api/quickbooks/direct-export/status');
      
      if (response && response.data) {
        const status = response.data.status;
        setExportStatus(status);
        
        if (status === 'COMPLETED') {
          setIsExporting(false);
          toast({
            title: "Export completed",
            description: "Data has been successfully exported to Snowflake",
            variant: "default"
          });
        } else if (status === 'FAILED') {
          setIsExporting(false);
          toast({
            title: "Export failed",
            description: response.data.errorMessage || "An error occurred during export",
            variant: "destructive"
          });
        } else if (status === 'IN_PROGRESS') {
          // Continue polling
          setTimeout(pollExportStatus, 5000);
        }
      }
    } catch (error) {
      console.error('Error polling export status:', error);
      setIsExporting(false);
      setExportStatus('failed');
    }
  };

  const getStatusIcon = () => {
    if (!exportStatus) return null;
    
    switch (exportStatus) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'IN_PROGRESS':
      case 'starting':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting}>
          {isExporting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <DatabaseIcon className="mr-2 h-4 w-4" />
              <span>Direct Export</span>
              {getStatusIcon() && (
                <span className="ml-2">{getStatusIcon()}</span>
              )}
              <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDirectExport} disabled={isExporting}>
          <DatabaseIcon className="mr-2 h-4 w-4" />
          <span>Export All Data</span>
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => handleEntityExport('accounts')} disabled={isExporting}>
          <DatabaseIcon className="mr-2 h-4 w-4" />
          <span>Export Accounts</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEntityExport('transactions')} disabled={isExporting}>
          <DatabaseIcon className="mr-2 h-4 w-4" />
          <span>Export Transactions</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEntityExport('invoices')} disabled={isExporting}>
          <DatabaseIcon className="mr-2 h-4 w-4" />
          <span>Export Invoices</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEntityExport('contacts')} disabled={isExporting}>
          <DatabaseIcon className="mr-2 h-4 w-4" />
          <span>Export Contacts</span>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 