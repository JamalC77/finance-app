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

export default apiService; 