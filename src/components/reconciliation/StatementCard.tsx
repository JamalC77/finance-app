import React from 'react';
import Link from 'next/link';
import { CalendarRange, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ReconciliationStatement, ReconciliationStatus } from '@/lib/types';

interface StatementCardProps {
  statement: ReconciliationStatement;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatusBadge = (status: ReconciliationStatus) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline">Pending</Badge>;
    case 'in_progress':
      return <Badge variant="secondary">In Progress</Badge>;
    case 'matched':
      return <Badge variant="default">Matched</Badge>;
    case 'completed':
      return <Badge variant="success" className="bg-green-600">Completed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getStatusIcon = (status: ReconciliationStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'pending':
    case 'in_progress':
    case 'matched':
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    default:
      return null;
  }
};

export function StatementCard({ statement }: StatementCardProps) {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-xl">{statement.accountName}</CardTitle>
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <CalendarRange className="h-4 w-4 mr-1" />
            <span>
              {formatDate(statement.period.startDate)} - {formatDate(statement.period.endDate)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(statement.status)}
          {getStatusBadge(statement.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 py-2">
          <div>
            <div className="text-sm text-muted-foreground">Opening Balance</div>
            <div className="font-medium mt-1">{formatCurrency(statement.openingBalance)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Closing Balance</div>
            <div className="font-medium mt-1">{formatCurrency(statement.closingBalance)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Transactions</div>
            <div className="font-medium mt-1">{statement.transactions.length}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-0">
        <Link href={`/dashboard/reconciliation/${statement.id}`} passHref>
          <Button variant="outline" size="sm" className="gap-1">
            View Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 