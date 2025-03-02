// MOCK PLAID FILE FOR PROOF OF CONCEPT
// This file contains mock implementations for Plaid-related functionality

// Mock Plaid client
export const plaidClient = {
  linkTokenCreate: async () => ({
    data: { link_token: 'mock_link_token_123' }
  }),
  itemPublicTokenExchange: async () => ({
    data: { access_token: 'mock_access_token_123', item_id: 'mock_item_id_123' }
  }),
  accountsGet: async () => ({
    data: {
      accounts: [
        {
          account_id: 'mock_account_1',
          name: 'Mock Checking',
          type: 'depository',
          subtype: 'checking',
          mask: '1234',
          balances: {
            current: 5000.25,
            available: 4800.50,
            limit: null
          }
        },
        {
          account_id: 'mock_account_2',
          name: 'Mock Savings',
          type: 'depository',
          subtype: 'savings',
          mask: '5678',
          balances: {
            current: 12500.75,
            available: 12500.75,
            limit: null
          }
        }
      ]
    }
  }),
  transactionsGet: async () => ({
    data: {
      transactions: [
        {
          transaction_id: 'mock_tx_1',
          account_id: 'mock_account_1',
          amount: 125.45,
          date: '2025-05-20',
          name: 'Mock Office Supplies Store',
          category: ['Shops', 'Office Supplies']
        },
        {
          transaction_id: 'mock_tx_2',
          account_id: 'mock_account_1',
          amount: -2500.00,
          date: '2025-05-15',
          name: 'Mock Direct Deposit',
          category: ['Income', 'Direct Deposit']
        }
      ],
      total_transactions: 2
    }
  }),
  transactionsSync: async () => ({
    data: {
      added: [
        {
          transaction_id: 'mock_tx_3',
          account_id: 'mock_account_1',
          amount: 75.25,
          date: '2025-05-22',
          name: 'Mock Restaurant',
          category: ['Food and Drink', 'Restaurants']
        }
      ],
      modified: [],
      removed: [],
      has_more: false,
      next_cursor: 'mock_cursor_123'
    }
  })
};

/**
 * Create a link token for initiating a Plaid Link session
 */
export async function createLinkToken(userId: string, organizationId: string) {
  try {
    // Return mock data instead of calling Plaid
    return {
      link_token: 'mock_link_token_123',
      expiration: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
    };
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
    // Return mock data instead of calling Plaid
    return {
      access_token: 'mock_access_token_123',
      item_id: 'mock_item_id_123'
    };
  } catch (error) {
    console.error('Error exchanging public token:', error);
    throw error;
  }
}

/**
 * Get accounts for an access token
 */
export async function getAccounts(accessToken: string) {
  try {
    // Return mock accounts instead of calling Plaid
    return [
      {
        id: 'mock_account_1',
        name: 'Mock Checking',
        type: 'depository',
        subtype: 'checking',
        mask: '1234',
        balance: {
          current: 5000.25,
          available: 4800.50
        }
      },
      {
        id: 'mock_account_2',
        name: 'Mock Savings',
        type: 'depository',
        subtype: 'savings',
        mask: '5678',
        balance: {
          current: 12500.75,
          available: 12500.75
        }
      }
    ];
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
}

/**
 * Get transactions for an access token
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
    // Return mock transactions instead of calling Plaid
    return {
      transactions: [
        {
          id: 'mock_tx_1',
          accountId: 'mock_account_1',
          amount: 125.45,
          date: '2025-05-20',
          name: 'Mock Office Supplies Store',
          category: ['Shops', 'Office Supplies']
        },
        {
          id: 'mock_tx_2',
          accountId: 'mock_account_1',
          amount: -2500.00,
          date: '2025-05-15',
          name: 'Mock Direct Deposit',
          category: ['Income', 'Direct Deposit']
        }
      ],
      total: 2
    };
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
}

/**
 * Sync transactions for an access token
 */
export async function syncTransactions(accessToken: string) {
  try {
    // Return mock transactions instead of calling Plaid
    return {
      added: [
        {
          id: 'mock_tx_3',
          accountId: 'mock_account_1',
          amount: 75.25,
          date: '2025-05-22',
          name: 'Mock Restaurant',
          category: ['Food and Drink', 'Restaurants']
        }
      ],
      modified: [],
      removed: [],
      hasMore: false,
      cursor: 'mock_cursor_123'
    };
  } catch (error) {
    console.error('Error syncing transactions:', error);
    throw error;
  }
} 