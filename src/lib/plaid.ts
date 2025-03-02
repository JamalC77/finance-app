import { Configuration, PlaidApi, PlaidEnvironments, CountryCode, Products } from 'plaid';

// Configure Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENVIRONMENT || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

/**
 * Create a link token for initiating a Plaid Link session
 */
export async function createLinkToken(userId: string, organizationId: string) {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'Finance App',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
      webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/plaid`,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating link token:', error);
    throw error;
  }
}

/**
 * Exchange a public token for an access token
 */
export async function exchangePublicToken(publicToken: string) {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    return response.data;
  } catch (error) {
    console.error('Error exchanging public token:', error);
    throw error;
  }
}

/**
 * Get bank accounts for an item
 */
export async function getAccounts(accessToken: string) {
  try {
    const response = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    return response.data;
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
}

/**
 * Get transactions for an account
 */
export async function getTransactions(
  accessToken: string,
  startDate: string,
  endDate: string,
  options: {
    accountIds?: string[];
    count?: number;
    offset?: number;
  } = {}
) {
  try {
    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: {
        account_ids: options.accountIds,
        count: options.count,
        offset: options.offset,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
}

/**
 * Sync transactions for an item (incremental update)
 */
export async function syncTransactions(accessToken: string) {
  try {
    const response = await plaidClient.transactionsSync({
      access_token: accessToken,
    });

    return response.data;
  } catch (error) {
    console.error('Error syncing transactions:', error);
    throw error;
  }
} 