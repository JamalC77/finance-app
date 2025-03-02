import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

export type CreateTransactionInput = {
  organizationId: string;
  date: Date;
  description: string;
  reference?: string;
  entries: {
    accountId: string;
    amount: number; // Positive for debit, negative for credit
    description?: string;
  }[];
};

/**
 * Creates a financial transaction with double-entry accounting
 * Each transaction must have at least two entries that balance (sum to zero)
 */
export async function createTransaction(data: CreateTransactionInput) {
  // Validate that the transaction entries balance (sum to zero)
  const sum = data.entries.reduce((acc, entry) => acc + entry.amount, 0);
  
  // Allow for tiny floating point errors
  if (Math.abs(sum) > 0.001) {
    throw new Error('Transaction entries must balance (sum to zero)');
  }
  
  // Create the transaction in a transaction to ensure atomicity
  return prisma.$transaction(async (tx) => {
    // Create the transaction
    const transaction = await tx.transaction.create({
      data: {
        organizationId: data.organizationId,
        date: data.date,
        description: data.description,
        reference: data.reference,
        status: 'COMPLETED',
      },
    });
    
    // Create ledger entries for each account
    const ledgerEntries = await Promise.all(
      data.entries.map((entry) => 
        tx.ledgerEntry.create({
          data: {
            transactionId: transaction.id,
            accountId: entry.accountId,
            amount: entry.amount,
            description: entry.description || data.description,
          },
        })
      )
    );
    
    // Update account balances
    await Promise.all(
      data.entries.map((entry) => 
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
    
    return { transaction, ledgerEntries };
  });
}

/**
 * Get a transaction by ID with all its ledger entries
 */
export async function getTransaction(id: string) {
  return prisma.transaction.findUnique({
    where: { id },
    include: {
      ledgerEntries: {
        include: {
          account: true,
        },
      },
    },
  });
}

/**
 * Get transactions for an organization with pagination
 */
export async function getTransactions(
  organizationId: string,
  page = 1,
  limit = 20,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    accountId?: string;
    status?: string;
  }
) {
  const where: Prisma.TransactionWhereInput = {
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
  
  if (filters?.status) {
    where.status = filters.status;
  }
  
  // If accountId is provided, filter transactions that include this account
  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      ledgerEntries: filters?.accountId 
        ? {
            where: {
              accountId: filters.accountId,
            },
            include: {
              account: true,
            },
          }
        : {
            include: {
              account: true,
            },
          },
    },
    orderBy: {
      date: 'desc',
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  
  // If accountId is provided, filter out transactions that don't include this account
  const filteredTransactions = filters?.accountId
    ? transactions.filter((t) => t.ledgerEntries.length > 0)
    : transactions;
  
  const total = await prisma.transaction.count({ where });
  
  return {
    data: filteredTransactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
} 