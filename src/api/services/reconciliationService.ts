import { apiClient } from '../utils/apiClient';

/**
 * Get reconciliation statements for an account
 */
export async function getStatements(accountId: string) {
  try {
    const response = await apiClient.get(`/reconciliation/accounts/${accountId}/statements`);
    return response.data;
  } catch (error) {
    console.error('Error getting reconciliation statements:', error);
    throw error;
  }
}

/**
 * Create a new reconciliation statement
 */
export async function createStatement(accountId: string, data: {
  startDate: string;
  endDate: string;
  startingBalance: number;
  endingBalance: number;
}) {
  try {
    const response = await apiClient.post(`/reconciliation/accounts/${accountId}/statements`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating reconciliation statement:', error);
    throw error;
  }
}

/**
 * Get a reconciliation statement by ID
 */
export async function getStatement(statementId: string) {
  try {
    const response = await apiClient.get(`/reconciliation/statements/${statementId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting reconciliation statement:', error);
    throw error;
  }
}

/**
 * Import transactions from a CSV/OFX file
 */
export async function importStatementTransactions(statementId: string, file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post(`/reconciliation/statements/${statementId}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error importing statement transactions:', error);
    throw error;
  }
}

/**
 * Auto-match transactions
 */
export async function matchTransactions(statementId: string) {
  try {
    const response = await apiClient.post(`/reconciliation/statements/${statementId}/match`);
    return response.data;
  } catch (error) {
    console.error('Error matching transactions:', error);
    throw error;
  }
}

/**
 * Reconcile a transaction
 */
export async function reconcileTransaction(transactionId: string, statementTransactionId: string) {
  try {
    const response = await apiClient.post(`/reconciliation/transactions/${transactionId}/reconcile`, {
      statementTransactionId
    });
    return response.data;
  } catch (error) {
    console.error('Error reconciling transaction:', error);
    throw error;
  }
}

/**
 * Unmatch a transaction
 */
export async function unmatchTransaction(transactionId: string) {
  try {
    const response = await apiClient.post(`/reconciliation/transactions/${transactionId}/unmatch`);
    return response.data;
  } catch (error) {
    console.error('Error unmatching transaction:', error);
    throw error;
  }
}

/**
 * Complete reconciliation
 */
export async function completeReconciliation(statementId: string) {
  try {
    const response = await apiClient.post(`/reconciliation/statements/${statementId}/complete`);
    return response.data;
  } catch (error) {
    console.error('Error completing reconciliation:', error);
    throw error;
  }
} 