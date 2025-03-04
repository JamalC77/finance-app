"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, FileText, Home } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [params.id]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      
      // This would be a public API endpoint that doesn't require authentication
      const response = await fetch(`/api/public/invoices/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Invoice not found or no longer available');
      }
      
      const data = await response.json();
      setInvoice(data);
      
      // Get the most recent payment amount for display
      if (data.payments && data.payments.length > 0) {
        const mostRecentPayment = data.payments[data.payments.length - 1];
        setPaymentAmount(mostRecentPayment.amount);
      } else {
        // Fallback to total amount if no payments found
        setPaymentAmount(data.total);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-lg mx-auto py-12 px-4">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto py-12 px-4">
      <Card className="text-center">
        <CardContent className="pt-6 pb-8 px-6">
          <div className="mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          
          <p className="text-4xl font-bold text-green-600 my-4">
            {formatCurrency(paymentAmount || 0)}
          </p>
          
          <p className="text-muted-foreground mb-6">
            Thank you for your payment. Your transaction has been completed successfully.
            {invoice && 
              ` We've sent a receipt to ${invoice.contact?.email}.`
            }
          </p>
          
          <div className="bg-green-50 p-4 rounded-lg inline-block">
            <p className="font-medium">Payment Reference</p>
            <p className="text-sm">
              {invoice?.payments?.length > 0 
                ? invoice.payments[invoice.payments.length - 1]?.reference
                : 'Payment recorded'}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4 pb-6">
          {invoice && (
            <Button variant="outline" onClick={() => router.push(`/invoices/${params.id}`)}>
              <FileText className="h-4 w-4 mr-2" /> View Invoice
            </Button>
          )}
          
          <Button onClick={() => router.push('/')}>
            <Home className="h-4 w-4 mr-2" /> Return Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 