import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { env } from '../utils/env';

// Create and configure the Plaid client using environment variables
const configuration = new Configuration({
  basePath: PlaidEnvironments[env.PLAID.ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': env.PLAID.CLIENT_ID,
      'PLAID-SECRET': env.PLAID.SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

/**
 * Example function to create a link token
 */
export async function createLinkToken(userId: string) {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'Finance App',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });

    return response.data;
  } catch (error) {
    console.error('Error creating link token:', error);
    throw error;
  }
}

/**
 * Example function to exchange public token for access token
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

// Add more Plaid service functions as needed 