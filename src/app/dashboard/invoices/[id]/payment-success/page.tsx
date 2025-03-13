"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from '@/lib/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, CheckCircle2, FileText, Home } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const api = useApi();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const launchConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#8BC34A', '#CDDC39']
      });
    };

    fetchInvoiceDetails();
    launchConfetti();
  }, [params.id]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/invoices/${params.id}`);
      setInvoice(response.data);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const paymentAmount = invoice?.payments?.length > 0 
    ? invoice.payments[invoice.payments.length - 1]?.amount
    : invoice?.total;

  return (
    <div className="container max-w-lg mx-auto py-12">
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
            <Button variant="outline" onClick={() => router.push(`/dashboard/invoices/${params.id}`)}>
              <FileText className="h-4 w-4 mr-2" /> View Invoice
            </Button>
          )}
          
          <Button onClick={() => router.push('/dashboard')}>
            <Home className="h-4 w-4 mr-2" /> Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 