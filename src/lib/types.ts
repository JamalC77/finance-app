/**
 * Types for the Finance App
 */

// Common types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}

// Reconciliation types
export type ReconciliationStatus = 'pending' | 'in_progress' | 'matched' | 'completed';

export interface Transaction extends BaseEntity {
  date: string;
  description: string;
  amount: number;
  category?: string;
  type: 'debit' | 'credit';
  reconciled: boolean;
  accountId: string;
  contactId?: string;
  reference?: string;
  notes?: string;
}

export interface ReconciliationStatement extends BaseEntity {
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

// Invoice types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate?: number;
  taxAmount?: number;
}

export interface Invoice extends BaseEntity {
  invoiceNumber: string;
  contactId: string;
  contactName?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  notes?: string;
  terms?: string;
  paymentDetails?: string;
}

// Expense types
export type ExpenseStatus = 'draft' | 'pending' | 'paid' | 'reimbursed' | 'cancelled';

export interface Expense extends BaseEntity {
  id: string;
  date: string;
  description: string;
  amount: number;
  category?: string;
  contactId?: string;
  contactName?: string;
  reference?: string;
  status: ExpenseStatus;
  paymentMethod?: string;
  receiptUrl?: string;
  notes?: string;
  contact?: Contact;
}

// Contact types
export type ContactType = 'customer' | 'supplier' | 'both';

export interface Contact extends BaseEntity {
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  type: ContactType;
  taxNumber?: string;
  notes?: string;
}

// Account types
export type AccountType = 'checking' | 'savings' | 'credit' | 'investment' | 'cash' | 'other';

export interface Account extends BaseEntity {
  name: string;
  institution?: string;
  accountNumber?: string;
  routingNumber?: string;
  type: AccountType;
  balance: number;
  currency: string;
  isPlaidConnected?: boolean;
  plaidAccountId?: string;
  notes?: string;
}

// Organization types
export interface Organization extends BaseEntity {
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  taxNumber?: string;
  logo?: string;
  currency: string;
  fiscalYearStart?: string;
}

// User types
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  isActive: boolean;
  lastLogin?: string;
} 