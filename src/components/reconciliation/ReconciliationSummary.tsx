import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ReconciliationSummary as ReconciliationSummaryType } from '@/lib/types';

interface ReconciliationSummaryProps {
  summary: ReconciliationSummaryType;
  onComplete?: () => void;
  isCompleting?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function ReconciliationSummary({ 
  summary, 
  onComplete,
  isCompleting = false
}: ReconciliationSummaryProps) {
  const matchPercentage = Math.round(
    (summary.matchedTransactions / (summary.totalTransactions || 1)) * 100
  );
  
  const isBalanced = Math.abs(summary.difference) < 0.01;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reconciliation Summary</CardTitle>
        <CardDescription>
          Overall progress and balance difference
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Matching Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Matching Progress</span>
            <span className="text-sm font-medium">{matchPercentage}%</span>
          </div>
          <Progress value={matchPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {summary.matchedTransactions} of {summary.totalTransactions} matched
            </span>
            <span>{summary.unmatchedTransactions} unmatched</span>
          </div>
        </div>
        
        {/* Balance Comparison */}
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-medium">Balance Comparison</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Statement Balance</div>
              <div className="text-lg font-semibold">{formatCurrency(summary.statementBalance)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">System Balance</div>
              <div className="text-lg font-semibold">{formatCurrency(summary.systemBalance)}</div>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Difference</span>
              <span className={`text-sm font-medium ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.difference)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className={`
          flex items-center gap-2 p-3 rounded-md
          ${isBalanced ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}
        `}>
          {isBalanced ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          )}
          <div>
            <p className="text-sm font-medium">
              {isBalanced 
                ? 'Balanced & Ready to Complete' 
                : 'Balances Do Not Match'}
            </p>
            <p className="text-xs mt-0.5">
              {isBalanced
                ? 'You can complete the reconciliation process'
                : 'Continue matching transactions to resolve the difference'}
            </p>
          </div>
        </div>
      </CardContent>
      {onComplete && (
        <CardFooter>
          <Button 
            onClick={onComplete}
            disabled={!isBalanced || isCompleting}
            className="w-full"
          >
            {isCompleting ? 'Completing...' : 'Complete Reconciliation'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 