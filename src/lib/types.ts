/**
 * Types for the Finance App
 */

export type ReconciliationStatus = 'pending' | 'in_progress' | 'matched' | 'completed';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category?: string;
  type: 'debit' | 'credit';
  reconciled: boolean;
}

export interface ReconciliationStatement {
  id: string;
  accountId: string;
  accountName: string;
  period: {
    startDate: string;
    endDate: string;
  };
  openingBalance: number;
  closingBalance: number;
  transactions: Transaction[];
  status: ReconciliationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionMatch {
  statementTransactionId: string;
  systemTransactionId: string;
  confidence: number;
}

export interface ReconciliationSummary {
  totalTransactions: number;
  matchedTransactions: number;
  unmatchedTransactions: number;
  statementBalance: number;
  systemBalance: number;
  difference: number;
} 