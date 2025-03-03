/**
 * Configuration settings for the Finance App frontend
 */

// API configuration
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  
  // API endpoints
  ENDPOINTS: {
    // Plaid endpoints
    PLAID: {
      CREATE_LINK_TOKEN: '/api/plaid/create-link-token',
      EXCHANGE_PUBLIC_TOKEN: '/api/plaid/exchange-public-token',
      ACCOUNTS: '/api/plaid/accounts',
      TRANSACTIONS: '/api/plaid/transactions',
    },
    
    // Auth endpoints
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
    },
    
    // User endpoints
    USER: {
      PROFILE: '/api/user/profile',
    },
    
    // Reconciliation endpoints
    RECONCILIATION: {
      LIST_STATEMENTS: '/api/reconciliation/statements',
      GET_STATEMENT: '/api/reconciliation/statements/:id',
      IMPORT_STATEMENT: '/api/reconciliation/import',
      MATCH_TRANSACTIONS: '/api/reconciliation/match',
      COMPLETE_RECONCILIATION: '/api/reconciliation/complete/:id',
    },
  },
};

// Feature flags
export const FEATURES = {
  ENABLE_STRIPE: process.env.NEXT_PUBLIC_ENABLE_STRIPE === 'true',
};

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development'; 