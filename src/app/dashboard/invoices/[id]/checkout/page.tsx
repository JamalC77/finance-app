"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from '@/lib/contexts/ApiContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Loader2, ArrowLeft, CreditCard, Lock, Zap } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { formatCurrency } from '@/lib/utils';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ clientSecret, invoiceId, onPaymentSuccess, isExpedited }: { 
  clientSecret: string; 
  invoiceId: string;
  onPaymentSuccess: () => void;
  isExpedited: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/invoices/${invoiceId}/payment-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      onPaymentSuccess();
    } else {
      setErrorMessage('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <Button 
        disabled={!stripe || loading} 
        className="w-full" 
        type="submit"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Pay Now {isExpedited && <Zap className="ml-2 h-4 w-4" />}
          </>
        )}
      </Button>
    </form>
  );
}

export default function InvoiceCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const api = useApi();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<any>(null);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExpedited, setIsExpedited] = useState(false);
  const [expeditedFee, setExpeditedFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [params.id]);

  // Calculate expedited fee whenever invoice or isExpedited changes
  useEffect(() => {
    if (invoice) {
      // Calculate expedited fee if option is selected
      if (isExpedited) {
        const expeditedFeePercent = 0.015; // 1.5%
        const expeditedFeeMinimum = 5; // $5 minimum
        const calculatedFee = Math.max(invoice.total * expeditedFeePercent, expeditedFeeMinimum);
        setExpeditedFee(calculatedFee);
        setTotalAmount(invoice.total + calculatedFee);
      } else {
        setExpeditedFee(0);
        setTotalAmount(invoice.total);
      }
    }
  }, [invoice, isExpedited]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/invoices/${params.id}`);
      setInvoice(response.data);
      setTotalAmount(response.data.total);
      
      // Create payment intent will be handled separately now
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      toast({
        title: "Error",
        description: "Failed to load invoice details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      
      // Create payment intent for this invoice
      const paymentResponse = await api.post('/payments/create-payment-intent', {
        invoiceId: params.id,
        isExpedited
      });
      
      setPaymentIntent({
        clientSecret: paymentResponse.data.clientSecret,
        paymentIntentId: paymentResponse.data.paymentIntentId
      });
      
      // Update total amount with the one from server (including any fees)
      if (paymentResponse.data.totalAmount) {
        setTotalAmount(paymentResponse.data.totalAmount);
      }
      
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "Error",
        description: "Failed to set up payment process",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExpeditedChange = (checked: boolean) => {
    setIsExpedited(checked);
    // Reset payment intent when changing expedited option
    setPaymentIntent(null);
  };

  const handlePaymentSuccess = () => {
    router.push(`/dashboard/invoices/${params.id}/payment-success`);
  };

  if (loading && !invoice) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-xl font-semibold">Invoice not found</h2>
        <Button onClick={() => router.push('/dashboard/invoices')} className="mt-4">
          Back to Invoices
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Pay Invoice #{invoice.number}</h1>
          <p className="text-muted-foreground">
            {format(new Date(invoice.date), 'PPP')}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/dashboard/invoices/${params.id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            {!paymentIntent ? (
              <div className="space-y-6">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="expedited" 
                    checked={isExpedited}
                    onCheckedChange={handleExpeditedChange}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <div className="flex items-center">
                      <Label htmlFor="expedited" className="font-medium">
                        Expedited Processing <Zap className="inline h-4 w-4 ml-1 text-amber-500" />
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Process this payment with priority for an additional {formatCurrency(expeditedFee)} fee.
                      Your payment will be processed within 1 business day.
                    </p>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={createPaymentIntent}
                >
                  Continue to Payment
                </Button>
              </div>
            ) : (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: paymentIntent.clientSecret,
                  appearance: {
                    theme: 'stripe',
                  },
                }}
              >
                <CheckoutForm 
                  clientSecret={paymentIntent.clientSecret} 
                  invoiceId={params.id as string}
                  onPaymentSuccess={handlePaymentSuccess}
                  isExpedited={isExpedited}
                />
              </Elements>
            )}
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Your payment is secure. We use Stripe for secure payment processing.
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Billed To</p>
              <p className="font-semibold">{invoice.contact?.name}</p>
              <p>{invoice.contact?.email}</p>
            </div>

            <Separator />

            <div>
              <div className="flex justify-between py-1">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              
              {invoice.taxAmount > 0 && (
                <div className="flex justify-between py-1">
                  <span>Tax</span>
                  <span>{formatCurrency(invoice.taxAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-1">
                <span>Invoice Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
              
              {isExpedited && expeditedFee > 0 && (
                <div className="flex justify-between py-1 text-amber-600">
                  <span className="flex items-center">
                    Expedited Fee <Zap className="h-3 w-3 ml-1" />
                  </span>
                  <span>{formatCurrency(expeditedFee)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-1 font-bold border-t mt-2 pt-2">
                <span>Total Due</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Separator />

            <div className="text-sm">
              <p>
                <span className="font-medium">Due Date: </span>
                {format(new Date(invoice.dueDate), 'PPP')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 