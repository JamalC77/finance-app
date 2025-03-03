"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCardIcon, CheckCircle, RefreshCcwIcon, BanknoteIcon, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PaymentSetupStepProps {
  onValidityChange: (isValid: boolean) => void;
}

export default function PaymentSetupStep({ onValidityChange }: PaymentSetupStepProps) {
  const [stripeConnected, setStripeConnected] = useState(false);
  const [connectClicked, setConnectClicked] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({
    creditCard: true,
    bankTransfer: false,
    paypal: false,
  });
  
  // Allow skipping this step
  useEffect(() => {
    // This step is optional, so it's always "valid"
    onValidityChange(true);
  }, [onValidityChange]);
  
  const handleStripeConnect = () => {
    // In a real app, this would initiate OAuth flow to Stripe
    setConnectClicked(true);
    
    // Simulate successful connection after 2 seconds
    setTimeout(() => {
      setStripeConnected(true);
    }, 2000);
  };
  
  const handleTogglePaymentMethod = (method: keyof typeof paymentMethods) => {
    setPaymentMethods({
      ...paymentMethods,
      [method]: !paymentMethods[method],
    });
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Set up how you'll accept payments from your customers. The faster you set this up, the sooner you can get paid.
      </p>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Connect Payment Processor</CardTitle>
          <CardDescription>
            Securely accept online payments directly through invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!connectClicked ? (
            <Button 
              onClick={handleStripeConnect} 
              className="w-full"
              variant="default"
            >
              <CreditCardIcon className="mr-2 h-4 w-4" />
              Connect Stripe Account
            </Button>
          ) : stripeConnected ? (
            <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
              <div className="flex items-center">
                <CheckCircle className="text-primary h-5 w-5 mr-2" />
                <div>
                  <p className="text-sm font-medium">Stripe Connected Successfully</p>
                  <p className="text-xs text-muted-foreground">Ready to accept payments</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-10">
              <RefreshCcwIcon className="animate-spin h-5 w-5 text-primary" />
              <span className="ml-2 text-sm">Connecting to Stripe...</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      {stripeConnected && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Payment Methods</CardTitle>
            <CardDescription>
              Select which payment methods you want to accept
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="credit-card">Credit Card</Label>
                </div>
                <Switch
                  id="credit-card"
                  checked={paymentMethods.creditCard}
                  onCheckedChange={() => handleTogglePaymentMethod('creditCard')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="bank-transfer">Bank Transfer (ACH)</Label>
                </div>
                <Switch
                  id="bank-transfer"
                  checked={paymentMethods.bankTransfer}
                  onCheckedChange={() => handleTogglePaymentMethod('bankTransfer')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <rect width="18" height="12" x="3" y="11" rx="2" />
                  </svg>
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <Switch
                  id="paypal"
                  checked={paymentMethods.paypal}
                  onCheckedChange={() => handleTogglePaymentMethod('paypal')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-center text-muted-foreground">
          You can configure payment settings in more detail later from the Dashboard.
        </p>
      </div>
    </div>
  );
} 