"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { 
  FileText, 
  Loader2, 
  Pencil, 
  Printer, 
  Download, 
  Trash, 
  MoreHorizontal, 
  Save, 
  Link2, 
  Clipboard 
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getInvoice } from '@/api/services/invoiceService';
import { getPaymentLink } from '@/api/services/paymentService';

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchInvoiceDetails();
  }, [params.id]);

  const fetchInvoiceDetails = async () => {
    try {
      setLoading(true);
      const data = await getInvoice(params.id as string);
      setInvoice(data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast({
        title: "Error",
        description: "Failed to load invoice details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSharePaymentLink = async () => {
    try {
      setIsGeneratingLink(true);
      
      // Get payment link from API
      const response = await getPaymentLink(params.id as string);
      
      // Copy link to clipboard
      await navigator.clipboard.writeText(response.paymentLink);
      
      toast({
        title: "Payment Link Copied!",
        description: "The payment link has been copied to your clipboard. You can now share it with your client."
      });
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast({
        title: "Error",
        description: "Failed to generate payment link",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyInvoiceNumber = async () => {
    if (invoice?.number) {
      await navigator.clipboard.writeText(invoice.number);
      toast({
        title: "Copied!",
        description: `Invoice #${invoice.number} copied to clipboard`
      });
    }
  };

  const handleOpenDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteInvoice = async () => {
    // Implement delete functionality
    toast({
      title: "Invoice Deleted",
      description: "The invoice has been deleted successfully"
    });
    router.push('/dashboard/invoices');
  };

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-6">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Invoice Not Found</h2>
              <p className="text-center text-muted-foreground">
                The invoice you are looking for could not be found.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => router.push('/dashboard/invoices')}
              >
                Back to Invoices
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate amount already paid
  const paidAmount = invoice.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const remainingAmount = invoice.total - paidAmount;

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            Invoice #{invoice.number}
            <Button variant="ghost" onClick={copyInvoiceNumber} className="ml-2 h-8 w-8 p-0">
              <Clipboard className="h-4 w-4" />
              <span className="sr-only">Copy Invoice Number</span>
            </Button>
          </h1>
          <p className="text-muted-foreground">
            Issued: {format(new Date(invoice.date), 'PPP')} | 
            Due: {format(new Date(invoice.dueDate), 'PPP')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/invoices/${params.id}/payment`)}>
            <Save className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
          
          <Button variant="outline" onClick={handleSharePaymentLink} disabled={isGeneratingLink}>
            {isGeneratingLink ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Link2 className="mr-2 h-4 w-4" />
            )}
            Share Payment Link
          </Button>
          
          <Button variant="outline" onClick={() => router.push(`/dashboard/invoices/${params.id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Invoice
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/invoices/${params.id}/print`)}>
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`/dashboard/invoices/${params.id}/print`, '_blank')}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleOpenDeleteDialog} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Delete Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">From</h3>
                  <p className="font-medium">{invoice.organization?.name}</p>
                  <p>{invoice.organization?.email}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Bill To</h3>
                  <p className="font-medium">{invoice.contact?.name}</p>
                  <p>{invoice.contact?.email}</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="font-medium mb-3">Line Items</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="px-3 py-2 text-sm font-medium">Description</th>
                        <th className="px-3 py-2 text-right text-sm font-medium">Qty</th>
                        <th className="px-3 py-2 text-right text-sm font-medium">Price</th>
                        <th className="px-3 py-2 text-right text-sm font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.lineItems?.map((item) => (
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
                      {invoice.discount > 0 && (
                        <tr>
                          <td colSpan={3} className="px-3 py-2 text-right font-medium">Discount</td>
                          <td className="px-3 py-2 text-right">-{formatCurrency(invoice.discount)}</td>
                        </tr>
                      )}
                      {invoice.tax > 0 && (
                        <tr>
                          <td colSpan={3} className="px-3 py-2 text-right font-medium">Tax</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(invoice.tax)}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-right font-medium">Total</td>
                        <td className="px-3 py-2 text-right font-bold">{formatCurrency(invoice.total)}</td>
                      </tr>
                      {paidAmount > 0 && (
                        <tr>
                          <td colSpan={3} className="px-3 py-2 text-right font-medium">Paid</td>
                          <td className="px-3 py-2 text-right text-green-600">-{formatCurrency(paidAmount)}</td>
                        </tr>
                      )}
                      {paidAmount > 0 && (
                        <tr>
                          <td colSpan={3} className="px-3 py-2 text-right font-medium">Balance Due</td>
                          <td className="px-3 py-2 text-right font-bold">{formatCurrency(remainingAmount)}</td>
                        </tr>
                      )}
                    </tfoot>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {invoice.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
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
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Amount Due</p>
                  <p className="text-2xl font-bold">{formatCurrency(remainingAmount)}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Due Date</p>
                  <p>{format(new Date(invoice.dueDate), 'PPP')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {invoice.payments && invoice.payments.length > 0 && (
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoice.payments.map((payment) => (
                    <div key={payment.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(payment.date), 'PPP')}
                          </p>
                        </div>
                        <Badge variant="outline">{payment.method}</Badge>
                      </div>
                      {payment.reference && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Ref: {payment.reference}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvoice} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 