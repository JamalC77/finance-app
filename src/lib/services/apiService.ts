import apiClient from '../api';
import { API_CONFIG } from '../config';

/**
 * API Service for interacting with the backend
 * 
 * This service provides typed methods for all API endpoints,
 * with proper error handling and response typing.
 */

// Common types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// User types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Plaid types
export interface PlaidLinkTokenResponse {
  link_token: string;
  expiration: string;
}

export interface PlaidExchangeResponse {
  accessToken: string;
  itemId: string;
}

export interface PlaidAccount {
  account_id: string;
  balances: {
    available: number;
    current: number;
    iso_currency_code: string;
  };
  mask: string;
  name: string;
  official_name: string;
  type: string;
  subtype: string;
}

export interface PlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name?: string;
  payment_channel: string;
  pending: boolean;
  category?: string[];
}

// QuickBooks types
export interface QuickbooksConnection {
  connected: boolean;
  realmId?: string;
  lastSyncedAt?: string;
  tokenExpiresAt?: string;
  syncFrequency?: string;
  syncSettings?: Record<string, unknown>;
  error?: string;
}

export interface QuickBooksDashboardData {
  cash: { balance: number, changePercentage: number };
  income: { mtd: number, changePercentage: number };
  expenses: { mtd: number, changePercentage: number };
  profitLoss: { mtd: number, changePercentage: number };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    date: Date;
    amount: number;
  }>;
  cashFlow: Array<{
    month: string;
    income: number;
    expenses: number;
    profit: number;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    revenue: number;
  }>;
  topExpenseCategories: Array<{
    category: string;
    amount: number;
  }>;
  source: string;
}

// Define a more specific error type for axios-like errors
interface ApiErrorResponse {
  response?: {
    data: unknown;
    status: number;
  };
  request?: unknown;
  message?: string;
}

/**
 * API Service
 */
const apiService = {
  /**
   * Check the health of the API
   */
  checkHealth: async (): Promise<{ status: string; environment: string }> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  },

  /**
   * Auth APIs
   */
  auth: {
    /**
     * Login a user
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
      return apiClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data);
    },

    /**
     * Register a new user
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
      return apiClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
    },
  },

  /**
   * User APIs
   */
  user: {
    /**
     * Get the current user's profile
     */
    getProfile: async (token: string): Promise<UserProfile> => {
      return apiClient.get<UserProfile>(API_CONFIG.ENDPOINTS.USER.PROFILE, token);
    },
  },

  /**
   * Plaid APIs
   */
  plaid: {
    /**
     * Create a Plaid link token
     */
    createLinkToken: async (token: string): Promise<PlaidLinkTokenResponse> => {
      return apiClient.post<PlaidLinkTokenResponse>(
        API_CONFIG.ENDPOINTS.PLAID.CREATE_LINK_TOKEN,
        {},
        token
      );
    },

    /**
     * Exchange a public token for an access token
     */
    exchangePublicToken: async (publicToken: string, token: string): Promise<PlaidExchangeResponse> => {
      return apiClient.post<PlaidExchangeResponse>(
        API_CONFIG.ENDPOINTS.PLAID.EXCHANGE_PUBLIC_TOKEN,
        { publicToken },
        token
      );
    },

    /**
     * Get accounts from Plaid
     */
    getAccounts: async (accessToken: string, token: string): Promise<PlaidAccount[]> => {
      return apiClient.post<PlaidAccount[]>(
        API_CONFIG.ENDPOINTS.PLAID.ACCOUNTS,
        { accessToken },
        token
      );
    },

    /**
     * Get transactions from Plaid
     */
    getTransactions: async (
      accessToken: string,
      startDate: string,
      endDate: string,
      token: string
    ): Promise<PlaidTransaction[]> => {
      return apiClient.post<PlaidTransaction[]>(
        API_CONFIG.ENDPOINTS.PLAID.TRANSACTIONS,
        { accessToken, startDate, endDate },
        token
      );
    },
  },
};

/**
 * QuickBooks API Service
 */
export const quickbooksApi = {
  // To prevent duplicate API calls
  _pendingRequests: new Map<string, Promise<ApiResponse<unknown>>>(),

  // Helper to deduplicate requests
  _dedupRequest: async function<T>(key: string, makeRequest: () => Promise<T>): Promise<T> {
    // If there's already a pending request with this key, return it
    if (this._pendingRequests.has(key)) {
      console.log(`🔄 [QB API] Returning existing request for ${key}`);
      return this._pendingRequests.get(key) as Promise<T>;
    }

    // Otherwise, create a new request
    const requestPromise = makeRequest();
    // Store in the pending requests map
    this._pendingRequests.set(key, requestPromise as Promise<ApiResponse<unknown>>);

    // Clean up after the request completes
    requestPromise.finally(() => {
      this._pendingRequests.delete(key);
    });

    return requestPromise;
  },

  /**
   * Get QuickBooks connection status
   */
  getConnectionStatus: async (token?: string): Promise<ApiResponse<QuickbooksConnection>> => {
    const requestKey = 'getConnectionStatus';
    
    return quickbooksApi._dedupRequest(requestKey, async () => {
      try {
        console.log('📊 [QB API] Making request to check QuickBooks connection');
        const response = await apiClient.get<ApiResponse<QuickbooksConnection>>('/api/quickbooks/connection', token);
        console.log('✅ [QB API] Connection status response:', response);
        return response;
      } catch (error: unknown) {
        console.error('❌ [QB API] Error getting QuickBooks connection status:', error);
        throw error;
      }
    });
  },

  /**
   * Get QuickBooks authorization URL
   */
  getAuthUrl: async (token?: string): Promise<ApiResponse<{ url: string }>> => {
    const requestKey = 'getAuthUrl';
    
    return quickbooksApi._dedupRequest(requestKey, async () => {
      try {
        const response = await apiClient.get<ApiResponse<{ url: string }>>('/api/quickbooks/auth/url', token);
        return response;
      } catch (error: unknown) {
        console.error('Failed to get QuickBooks auth URL:', error);
        throw error;
      }
    });
  },

  /**
   * Disconnect from QuickBooks
   */
  disconnect: async (token?: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const requestKey = 'disconnect';
    
    return quickbooksApi._dedupRequest(requestKey, async () => {
      try {
        const response = await apiClient.delete<ApiResponse<Record<string, unknown>>>('/api/quickbooks/connection', token);
        return response;
      } catch (error: unknown) {
        console.error('Failed to disconnect from QuickBooks:', error);
        throw error;
      }
    });
  },

  /**
   * Start a QuickBooks sync
   */
  startSync: async (token?: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const requestKey = 'startSync';
    
    return quickbooksApi._dedupRequest(requestKey, async () => {
      try {
        const response = await apiClient.post<ApiResponse<Record<string, unknown>>>('/api/quickbooks/sync', {}, token);
        return response;
      } catch (error: unknown) {
        console.error('Failed to start QuickBooks sync:', error);
        throw error;
      }
    });
  },

  /**
   * Get dashboard data from QuickBooks
   */
  getDashboardData: async (token?: string): Promise<ApiResponse<QuickBooksDashboardData>> => {
    const requestKey = 'getDashboardData';
    
    return quickbooksApi._dedupRequest(requestKey, async () => {
      try {
        console.log('📊 [QB API] Making request to fetch QuickBooks dashboard data');
        const response = await apiClient.get<ApiResponse<QuickBooksDashboardData>>('/api/quickbooks/dashboard', token);
        console.log('✅ [QB API] QuickBooks dashboard data fetched successfully');
        return response;
      } catch (error: unknown) {
        console.error('❌ [QB API] Error fetching QuickBooks dashboard data:', error);
        const apiError = error as ApiErrorResponse;
        if (apiError && typeof apiError === 'object' && 'response' in apiError && apiError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('❌ [QB API] Error response data:', apiError.response.data);
          console.error('❌ [QB API] Error response status:', apiError.response.status);
        } else if (apiError && typeof apiError === 'object' && 'request' in apiError) {
          // The request was made but no response was received
          console.error('❌ [QB API] No response received from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('❌ [QB API] Error message:', error instanceof Error ? (error as Error).message : String(error));
        }
        throw error;
      }
    });
  }
};

export default apiService; 