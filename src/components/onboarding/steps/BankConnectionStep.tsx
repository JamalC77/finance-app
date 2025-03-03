"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BuildingIcon, PlusIcon, LockIcon, RefreshCcwIcon, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BankConnectionStepProps {
  onValidityChange: (isValid: boolean) => void;
}

export default function BankConnectionStep({ onValidityChange }: BankConnectionStepProps) {
  const [connectClicked, setConnectClicked] = useState(false);
  const [bankConnected, setBankConnected] = useState(false);
  
  // Allow skipping this step
  useEffect(() => {
    // This step is optional, so it's always "valid"
    onValidityChange(true);
  }, [onValidityChange]);
  
  const handleConnect = () => {
    // In a real app, this would open the Plaid Link interface
    setConnectClicked(true);
    
    // Simulate successful connection after 2 seconds
    setTimeout(() => {
      setBankConnected(true);
    }, 2000);
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Connect your bank accounts to automatically import transactions. This helps you keep your finances up-to-date with minimal effort.
      </p>
      
      <div className="flex justify-center mb-6">
        <div className="border shadow-sm rounded-lg p-4 w-full max-w-md bg-muted/30">
          <div className="flex items-center justify-center mb-3">
            <LockIcon className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground">Secure bank-level encryption</span>
          </div>
          
          {!connectClicked ? (
            <Button 
              onClick={handleConnect} 
              className="w-full mb-2"
              variant="default"
            >
              <BuildingIcon className="mr-2 h-4 w-4" />
              Connect Bank Account
            </Button>
          ) : bankConnected ? (
            <div className="bg-primary/10 border border-primary/20 rounded-md p-3 mb-2">
              <div className="flex items-center">
                <CheckCircle className="text-primary h-5 w-5 mr-2" />
                <div>
                  <p className="text-sm font-medium">Bank Connected Successfully</p>
                  <p className="text-xs text-muted-foreground">Chase Bank ending in 4567</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-10 mb-2">
              <RefreshCcwIcon className="animate-spin h-5 w-5 text-primary" />
              <span className="ml-2 text-sm">Connecting to your bank...</span>
            </div>
          )}
          
          <p className="text-xs text-center text-muted-foreground px-6">
            We use Plaid to securely connect to your bank. Your credentials are never stored on our servers.
          </p>
        </div>
      </div>
      
      {bankConnected && (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleConnect}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Connect Another Account
        </Button>
      )}
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-center text-muted-foreground">
          You can skip this step and connect your accounts later from the Dashboard.
        </p>
      </div>
    </div>
  );
} 