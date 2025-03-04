"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { FileText, Loader2, LockIcon, CreditCard, CalendarClock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import Stripe Elements
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/payment/PaymentForm';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PublicInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isExpedited, setIsExpedited] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);

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
      setTotalAmount(data.total);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError('Unable to load invoice. It may no longer be available or the link has expired.');
    } finally {
      setLoading(false);
    }
  };

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      
      // Create payment intent for this invoice
      const paymentResponse = await fetch(`/api/public/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: params.id,
          isExpedited
        }),
      });
      
      if (!paymentResponse.ok) {
        throw new Error('Failed to set up payment process');
      }
      
      const paymentData = await paymentResponse.json();
      
      setPaymentIntent({
        clientSecret: paymentData.clientSecret,
        paymentIntentId: paymentData.paymentIntentId
      });
      
      // Update total amount with the one from server (including any fees)
      if (paymentData.totalAmount) {
        setTotalAmount(paymentData.totalAmount);
      }
      
      setShowPaymentForm(true);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setError('Failed to set up payment process. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpeditedChange = (checked: boolean) => {
    setIsExpedited(checked);
    // Reset payment intent when changing expedited option
    setPaymentIntent(null);
    setShowPaymentForm(false);
    
    // Reset total amount to original invoice amount
    if (invoice) {
      setTotalAmount(invoice.total);
    }
  };

  const handlePaymentSuccess = () => {
    router.push(`/invoices/${params.id}/payment-success`);
  };

  if (loading && !invoice) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-6">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Invoice Not Available</h2>
              <p className="text-center text-muted-foreground mb-4">{error}</p>
              <p className="text-center text-sm text-muted-foreground">
                If you believe this is an error, please contact the sender.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-6">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Invoice Not Found</h2>
              <p className="text-center text-muted-foreground">
                The invoice you are looking for could not be found or has expired.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate amount already paid
  const paidAmount = invoice.payments?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0;
  const remainingAmount = invoice.total - paidAmount;
  
  // Calculate expedited fee if applicable
  const expeditedFeePercent = 0.015; // 1.5%
  const expeditedFeeMinimum = 5;
  const expeditedFee = isExpedited 
    ? Math.max(remainingAmount * expeditedFeePercent, expeditedFeeMinimum)
    : 0;
  
  // Show expedited fee in total if selected but payment intent not created yet
  const displayTotal = isExpedited && !paymentIntent 
    ? remainingAmount + expeditedFee 
    : totalAmount;

  // Determine if the invoice is fully paid
  const isFullyPaid = remainingAmount <= 0;

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Invoice #{invoice.number}</h1>
          <Badge 
            className={
              invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
              invoice.status === 'PARTIALLY_PAID' ? 'bg-blue-100 text-blue-800' :
              invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
              'bg-orange-100 text-orange-800'
            }
          >
            {invoice.status?.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Issued: {format(new Date(invoice.date), 'PPP')} | 
          Due: {format(new Date(invoice.dueDate), 'PPP')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">From</h3>
                  <p className="font-medium">{invoice.organization?.name || 'Organization Name'}</p>
                  <p>{invoice.organization?.email || 'organization@example.com'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Bill To</h3>
                  <p className="font-medium">{invoice.contact?.name}</p>
                  <p>{invoice.contact?.email}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Line Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="px-3 py-2">Description</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                        <th className="px-3 py-2 text-right">Price</th>
                        <th className="px-3 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.lineItems?.map((item: any) => (
                        <tr key={item.id} className="border-b">
                          <td className="px-3 py-2">{item.description}</td>
                          <td className="px-3 py-2 text-right">{item.quantity}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-right font-medium">Subtotal</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(invoice.subtotal)}</td>
                      </tr>
                      {invoice.taxAmount > 0 && (
                        <tr>
                          <td colSpan={3} className="px-3 py-2 text-right font-medium">Tax</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(invoice.taxAmount)}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-right font-bold">Total</td>
                        <td className="px-3 py-2 text-right font-bold">{formatCurrency(invoice.total)}</td>
                      </tr>
                      {paidAmount > 0 && (
                        <tr>
                          <td colSpan={3} className="px-3 py-2 text-right font-medium">Paid to Date</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(paidAmount)}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-right font-bold">Balance Due</td>
                        <td className="px-3 py-2 text-right font-bold">{formatCurrency(remainingAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {invoice.notes && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="text-sm">{invoice.notes}</p>
                </div>
              )}
              
              {invoice.terms && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Terms & Conditions</h3>
                  <p className="text-sm">{invoice.terms}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {!isFullyPaid && !showPaymentForm && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-6">
                  <Switch 
                    id="expedited" 
                    checked={isExpedited}
                    onCheckedChange={handleExpeditedChange}
                  />
                  <Label htmlFor="expedited">Expedited Processing (+{formatCurrency(expeditedFee)})</Label>
                </div>
                
                {isExpedited && (
                  <Alert className="mb-6 bg-blue-50">
                    <CalendarClock className="h-4 w-4" />
                    <AlertDescription>
                      Expedited processing prioritizes your payment and significantly speeds up processing time.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={createPaymentIntent}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay {formatCurrency(displayTotal)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {!isFullyPaid && showPaymentForm && paymentIntent && (
            <Card>
              <CardHeader>
                <CardTitle>Secure Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Amount due:</span>
                    <span>{formatCurrency(remainingAmount)}</span>
                  </div>
                  
                  {isExpedited && (
                    <div className="flex justify-between mb-2">
                      <span>Expedited processing fee:</span>
                      <span>{formatCurrency(expeditedFee)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total payment:</span>
                    <span>{formatCurrency(displayTotal)}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Elements 
                    stripe={stripePromise} 
                    options={{ 
                      clientSecret: paymentIntent.clientSecret,
                      appearance: { theme: 'stripe' }
                    }}
                  >
                    <PaymentForm onSuccess={handlePaymentSuccess} />
                  </Elements>
                </div>
                
                <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
                  <LockIcon className="h-3 w-3 mr-1" />
                  All payment information is encrypted and secure
                </div>
              </CardContent>
            </Card>
          )}
          
          {isFullyPaid && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-green-600"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Payment Complete</h2>
                  <p className="text-muted-foreground">
                    This invoice has been fully paid. Thank you for your business!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-1">
                <span>Invoice Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
              
              {paidAmount > 0 && (
                <div className="flex justify-between py-1">
                  <span>Already Paid</span>
                  <span>- {formatCurrency(paidAmount)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between py-1 font-bold">
                <span>Balance Due</span>
                <span>{formatCurrency(remainingAmount)}</span>
              </div>
              
              {isExpedited && !isFullyPaid && (
                <>
                  <div className="flex justify-between py-1">
                    <span>Expedited Fee</span>
                    <span>+ {formatCurrency(expeditedFee)}</span>
                  </div>
                  
                  <div className="flex justify-between py-1 font-bold">
                    <span>Total Payment</span>
                    <span>{formatCurrency(displayTotal)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {invoice.payments && invoice.payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoice.payments.map((payment: any) => (
                    <div key={payment.id} className="flex justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{format(new Date(payment.date), 'PPP')}</p>
                        <p className="text-sm text-muted-foreground">{payment.method.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        <Badge
                          className={
                            payment.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {payment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Due Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <CalendarClock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{format(new Date(invoice.dueDate), 'PPP')}</p>
                  {new Date(invoice.dueDate) < new Date() && !isFullyPaid && (
                    <p className="text-sm text-red-500 mt-1">This invoice is overdue</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 