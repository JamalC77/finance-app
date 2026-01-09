/**
 * Plaid Service - Frontend API client
 *
 * NOTE: All Plaid API calls go through the backend.
 * The frontend only uses Plaid Link for the user connection flow.
 *
 * Plaid integration status: PENDING (awaiting Plaid approval)
 * When approved, set PLAID_CLIENT_ID and PLAID_SECRET in backend .env
 */

import { apiClient } from '../utils/apiClient';

/**
 * Create a Plaid Link token
 * The backend handles the actual Plaid API call
 */
export async function createLinkToken(): Promise<{ link_token: string }> {
  try {
    const response = await apiClient.post('/plaid/create-link-token');
    return response.data;
  } catch (error) {
    console.error('Error creating Plaid link token:', error);
    throw error;
  }
}

/**
 * Exchange a public token for an access token
 * Called after user completes Plaid Link flow
 */
export async function exchangePublicToken(publicToken: string, metadata: {
  institution?: { name: string; institution_id: string };
  accounts?: Array<{ id: string; name: string; type: string; subtype: string }>;
}): Promise<{ success: boolean; accountId?: string }> {
  try {
    const response = await apiClient.post('/plaid/exchange-public-token', {
      publicToken,
      institutionName: metadata.institution?.name,
      institutionId: metadata.institution?.institution_id,
      accounts: metadata.accounts,
    });
    return response.data;
  } catch (error) {
    console.error('Error exchanging Plaid public token:', error);
    throw error;
  }
}

/**
 * Get linked bank accounts
 */
export async function getLinkedAccounts(): Promise<Array<{
  id: string;
  name: string;
  type: string;
  subtype: string;
  mask: string;
  balance: number;
}>> {
  try {
    const response = await apiClient.get('/plaid/accounts');
    return response.data;
  } catch (error) {
    console.error('Error getting linked accounts:', error);
    throw error;
  }
}

/**
 * Sync transactions for a linked account
 */
export async function syncTransactions(accountId: string): Promise<{
  added: number;
  modified: number;
  removed: number;
}> {
  try {
    const response = await apiClient.post(`/plaid/accounts/${accountId}/sync`);
    return response.data;
  } catch (error) {
    console.error('Error syncing Plaid transactions:', error);
    throw error;
  }
}

/**
 * Remove a linked bank connection
 */
export async function unlinkAccount(accountId: string): Promise<{ success: boolean }> {
  try {
    const response = await apiClient.delete(`/plaid/accounts/${accountId}`);
    return response.data;
  } catch (error) {
    console.error('Error unlinking Plaid account:', error);
    throw error;
  }
}
