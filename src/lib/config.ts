/**
 * Configuration settings for the Finance App frontend
 */

// Helper to ensure the URL has the correct format
const formatApiUrl = (url: string): string => {
  if (!url) return 'http://localhost:5000';
  
  // Make sure URL has protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  
  return url;
};

// API configuration
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: formatApiUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'),
  
  // API endpoints
  ENDPOINTS: {
    // Plaid endpoints
    PLAID: {
      BASE: '/api/plaid',
      CREATE_LINK_TOKEN: '/api/plaid/create-link-token',
      EXCHANGE_PUBLIC_TOKEN: '/api/plaid/exchange-public-token',
      ACCOUNTS: '/api/plaid/accounts',
      TRANSACTIONS: '/api/plaid/transactions',
    },
    
    // Auth endpoints
    AUTH: {
      BASE: '/api/auth',
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
    },
    
    // User endpoints
    USER: {
      BASE: '/api/user',
      PROFILE: '/api/user/profile',
    },

    // Users endpoints (for admin)
    USERS: {
      BASE: '/api/users',
    },
    
    // Reconciliation endpoints
    RECONCILIATION: {
      BASE: '/api/reconciliation',
      LIST_STATEMENTS: '/api/reconciliation/statements',
      GET_STATEMENT: '/api/reconciliation/statements/:id',
      IMPORT_STATEMENT: '/api/reconciliation/import',
      MATCH_TRANSACTIONS: '/api/reconciliation/match',
      COMPLETE_RECONCILIATION: '/api/reconciliation/complete/:id',
    },

    // Invoice endpoints
    INVOICES: {
      BASE: '/api/invoices',
      GET_INVOICE: '/api/invoices/:id',
      CREATE_INVOICE: '/api/invoices',
      UPDATE_INVOICE: '/api/invoices/:id',
      DELETE_INVOICE: '/api/invoices/:id',
      LIST_INVOICES: '/api/invoices',
    },

    // Expense endpoints
    EXPENSES: {
      BASE: '/api/expenses',
      GET_EXPENSE: '/api/expenses/:id',
      CREATE_EXPENSE: '/api/expenses',
      UPDATE_EXPENSE: '/api/expenses/:id',
      DELETE_EXPENSE: '/api/expenses/:id',
      LIST_EXPENSES: '/api/expenses',
    },

    // Contact endpoints
    CONTACTS: {
      BASE: '/api/contacts',
      GET_CONTACT: '/api/contacts/:id',
      CREATE_CONTACT: '/api/contacts',
      UPDATE_CONTACT: '/api/contacts/:id',
      DELETE_CONTACT: '/api/contacts/:id',
      LIST_CONTACTS: '/api/contacts',
    },

    // Account endpoints
    ACCOUNTS: {
      BASE: '/api/accounts',
      GET_ACCOUNT: '/api/accounts/:id',
      CREATE_ACCOUNT: '/api/accounts',
      UPDATE_ACCOUNT: '/api/accounts/:id',
      DELETE_ACCOUNT: '/api/accounts/:id',
      LIST_ACCOUNTS: '/api/accounts',
    },

    // Transaction endpoints
    TRANSACTIONS: {
      BASE: '/api/transactions',
      GET_TRANSACTION: '/api/transactions/:id',
      CREATE_TRANSACTION: '/api/transactions',
      UPDATE_TRANSACTION: '/api/transactions/:id',
      DELETE_TRANSACTION: '/api/transactions/:id',
      LIST_TRANSACTIONS: '/api/transactions',
    },

    // Organization endpoints
    ORGANIZATIONS: {
      BASE: '/api/organizations',
      GET_ORGANIZATION: '/api/organizations/:id',
      CREATE_ORGANIZATION: '/api/organizations',
      UPDATE_ORGANIZATION: '/api/organizations/:id',
      DELETE_ORGANIZATION: '/api/organizations/:id',
      LIST_ORGANIZATIONS: '/api/organizations',
    },
  },
};

// Feature flags
export const FEATURES = {
  ENABLE_STRIPE: process.env.NEXT_PUBLIC_ENABLE_STRIPE === 'true',
};

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development'; 