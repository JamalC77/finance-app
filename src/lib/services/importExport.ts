import { prisma } from '../prisma';
import { Account, Transaction, LedgerEntry } from '@prisma/client';
import Papa from 'papaparse';
import { format } from 'date-fns';

// Types for imported data
export type ImportableAccount = {
  accountNumber: string;
  name: string;
  type: string;
  subtype?: string;
  description?: string;
  openingBalance?: number;
};

export type ImportableTransaction = {
  date: string;
  description: string;
  reference?: string;
  entries: {
    accountNumber: string;
    amount: number;
    description?: string;
  }[];
};

/**
 * Import accounts from a CSV file
 */
export async function importAccounts(
  csvContent: string,
  organizationId: string
): Promise<{ success: Account[]; errors: string[] }> {
  const results = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const success: Account[] = [];
  const errors: string[] = [];

  for (const row of results.data) {
    try {
      // Validate required fields
      if (!row.accountNumber || !row.name || !row.type) {
        errors.push(`Missing required fields in row: ${JSON.stringify(row)}`);
        continue;
      }

      // Check if account already exists
      const existingAccount = await prisma.account.findFirst({
        where: {
          organizationId,
          accountNumber: row.accountNumber,
        },
      });

      if (existingAccount) {
        errors.push(`Account with number ${row.accountNumber} already exists`);
        continue;
      }

      // Create the account
      const account = await prisma.account.create({
        data: {
          organizationId,
          accountNumber: row.accountNumber,
          name: row.name,
          type: row.type.toUpperCase(),
          subtype: row.subtype,
          description: row.description,
          currentBalance: parseFloat(row.openingBalance || '0'),
        },
      });

      success.push(account);
    } catch (error: any) {
      errors.push(`Error importing row ${JSON.stringify(row)}: ${error.message}`);
    }
  }

  return { success, errors };
}

/**
 * Export accounts to CSV
 */
export async function exportAccounts(organizationId: string): Promise<string> {
  const accounts = await prisma.account.findMany({
    where: {
      organizationId,
    },
    orderBy: {
      accountNumber: 'asc',
    },
  });

  const csvData = accounts.map((account) => ({
    accountNumber: account.accountNumber,
    name: account.name,
    type: account.type,
    subtype: account.subtype || '',
    description: account.description || '',
    currentBalance: account.currentBalance,
  }));

  return Papa.unparse(csvData);
}

/**
 * Export transactions to CSV
 */
export async function exportTransactions(
  organizationId: string,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    accountId?: string;
  }
): Promise<string> {
  const where: any = {
    organizationId,
  };

  if (filters?.startDate) {
    where.date = {
      ...where.date,
      gte: filters.startDate,
    };
  }

  if (filters?.endDate) {
    where.date = {
      ...where.date,
      lte: filters.endDate,
    };
  }

  // Get transactions with their ledger entries
  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      ledgerEntries: {
        include: {
          account: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  // Filter by account if specified
  const filteredTransactions = filters?.accountId
    ? transactions.filter((t) =>
        t.ledgerEntries.some((entry) => entry.accountId === filters.accountId)
      )
    : transactions;

  // Format transactions for CSV export
  const csvRows: any[] = [];

  filteredTransactions.forEach((transaction) => {
    transaction.ledgerEntries.forEach((entry) => {
      csvRows.push({
        'Transaction ID': transaction.id,
        Date: format(transaction.date, 'yyyy-MM-dd'),
        Description: transaction.description,
        Reference: transaction.reference || '',
        'Account Number': entry.account.accountNumber,
        'Account Name': entry.account.name,
        Amount: entry.amount,
        'Entry Description': entry.description || transaction.description,
      });
    });
  });

  return Papa.unparse(csvRows);
}

/**
 * Import transactions from a CSV file
 */
export async function importTransactions(
  csvContent: string,
  organizationId: string
): Promise<{ success: Transaction[]; errors: string[] }> {
  const results = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const success: Transaction[] = [];
  const errors: string[] = [];

  // Group rows by transaction
  const transactionGroups = new Map<string, any[]>();

  for (const row of results.data) {
    const transactionId = row['Transaction ID'] || row['Reference'] || '';
    if (!transactionGroups.has(transactionId)) {
      transactionGroups.set(transactionId, []);
    }
    transactionGroups.get(transactionId)?.push(row);
  }

  // Process each transaction group
  for (const [transactionId, rows] of transactionGroups.entries()) {
    try {
      if (rows.length < 2) {
        errors.push(`Transaction ${transactionId} has less than 2 entries`);
        continue;
      }

      const firstRow = rows[0];
      const date = new Date(firstRow['Date']);
      const description = firstRow['Description'];

      // Prepare entries and verify they balance
      const entries: { accountId: string; amount: number; description?: string }[] = [];
      let sum = 0;

      for (const row of rows) {
        // Find the account by number
        const account = await prisma.account.findFirst({
          where: {
            organizationId,
            accountNumber: row['Account Number'],
          },
        });

        if (!account) {
          throw new Error(`Account with number ${row['Account Number']} not found`);
        }

        const amount = parseFloat(row['Amount']);
        entries.push({
          accountId: account.id,
          amount,
          description: row['Entry Description'],
        });

        sum += amount;
      }

      // Check if entries balance
      if (Math.abs(sum) > 0.001) {
        errors.push(`Transaction ${transactionId} entries do not balance (sum: ${sum})`);
        continue;
      }

      // Create the transaction
      const transaction = await prisma.$transaction(async (tx) => {
        const createdTransaction = await tx.transaction.create({
          data: {
            organizationId,
            date,
            description,
            reference: firstRow['Reference'] || null,
            status: 'COMPLETED',
          },
        });

        // Create ledger entries
        await Promise.all(
          entries.map((entry) =>
            tx.ledgerEntry.create({
              data: {
                transactionId: createdTransaction.id,
                accountId: entry.accountId,
                amount: entry.amount,
                description: entry.description || description,
              },
            })
          )
        );

        // Update account balances
        await Promise.all(
          entries.map((entry) =>
            tx.account.update({
              where: { id: entry.accountId },
              data: {
                currentBalance: {
                  increment: entry.amount,
                },
              },
            })
          )
        );

        return createdTransaction;
      });

      success.push(transaction);
    } catch (error: any) {
      errors.push(`Error importing transaction ${transactionId}: ${error.message}`);
    }
  }

  return { success, errors };
} 