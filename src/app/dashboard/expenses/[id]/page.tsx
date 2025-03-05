"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  ArrowLeft
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getExpense, deleteExpense } from '@/api/services/expenseService';

export default function ExpenseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchExpenseDetails();
  }, [params.id]);

  const fetchExpenseDetails = async () => {
    try {
      setLoading(true);
      const data = await getExpense(params.id as string);
      setExpense(data);
    } catch (error) {
      console.error('Error fetching expense:', error);
      toast({
        title: "Error",
        description: "Failed to load expense details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteExpense = async () => {
    try {
      await deleteExpense(params.id as string);
      toast({
        title: "Expense Deleted",
        description: "The expense has been deleted successfully"
      });
      router.push('/dashboard/expenses');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive"
      });
    }
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

  if (!expense) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-6">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Expense Not Found</h2>
              <p className="text-center text-muted-foreground">
                The expense you are looking for could not be found.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => router.push('/dashboard/expenses')}
              >
                Back to Expenses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format the date
  const formattedDate = expense.date ? format(new Date(expense.date), 'MMMM d, yyyy') : 'Not specified';

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/expenses')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Expense Details</h1>
            <p className="text-sm text-muted-foreground">
              View and manage expense information
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/expenses/${params.id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => router.push(`/dashboard/expenses/${params.id}/receipt`)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => router.push(`/dashboard/expenses/${params.id}/print`)}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleOpenDeleteDialog}
                className="text-red-600"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p className="font-medium">{expense.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Amount</h3>
                  <p className="font-medium">{formatCurrency(expense.amount)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                  <p className="font-medium">{formattedDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(expense.status)}`}>
                    {expense.status}
                  </span>
                </div>
                {expense.category && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                    <p className="font-medium">{expense.category}</p>
                  </div>
                )}
                {expense.reference && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Reference</h3>
                    <p className="font-medium">{expense.reference}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {expense.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{expense.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {expense.contact && (
            <Card>
              <CardHeader>
                <CardTitle>Vendor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{expense.contact.name}</p>
                  {expense.contact.email && (
                    <p className="text-sm text-muted-foreground">{expense.contact.email}</p>
                  )}
                  {expense.contact.phone && (
                    <p className="text-sm text-muted-foreground">{expense.contact.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {expense.receiptUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Receipt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="relative aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-lg border">
                    <img
                      src={expense.receiptUrl}
                      alt="Receipt"
                      className="absolute left-0 top-0 h-full w-full object-cover"
                    />
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => window.open(expense.receiptUrl, '_blank')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this expense. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteExpense}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 