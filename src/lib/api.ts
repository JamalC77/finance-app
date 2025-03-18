import { API_CONFIG } from './config';

/**
 * Base API client for making HTTP requests to the API
 */
class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Make a GET request to the API
   */
  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
      credentials: 'omit',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw await this.handleError(response);
    }
    
    return response.json();
  }
  
  /**
   * Make a POST request to the API
   */
  async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'omit',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw await this.handleError(response);
    }
    
    return response.json();
  }

  /**
   * Make a DELETE request to the API
   */
  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
      credentials: 'omit',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw await this.handleError(response);
    }
    
    return response.json();
  }
  
  /**
   * Handle error responses from the API
   */
  private async handleError(response: Response): Promise<Error> {
    let errorMessage: string;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || 'Unknown error';
    } catch (e) {
      errorMessage = `HTTP error ${response.status}`;
    }
    
    return new Error(errorMessage);
  }
}

/**
 * Create API client instance
 */
const apiClient = new ApiClient(API_CONFIG.BASE_URL);

/**
 * Plaid API service
 */
export const plaidApi = {
  /**
   * Create a link token
   */
  createLinkToken: async (token?: string) => {
    return apiClient.post<{ link_token: string }>(
      API_CONFIG.ENDPOINTS.PLAID.CREATE_LINK_TOKEN,
      {},
      token
    );
  },
  
  /**
   * Exchange public token for access token
   */
  exchangePublicToken: async (publicToken: string, token?: string) => {
    return apiClient.post<{ accessToken: string, itemId: string }>(
      API_CONFIG.ENDPOINTS.PLAID.EXCHANGE_PUBLIC_TOKEN,
      { publicToken },
      token
    );
  },
  
  /**
   * Get accounts
   */
  getAccounts: async (accessToken: string, token?: string) => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.PLAID.ACCOUNTS,
      { accessToken },
      token
    );
  },
  
  /**
   * Get transactions
   */
  getTransactions: async (
    accessToken: string, 
    startDate: string, 
    endDate: string, 
    token?: string
  ) => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.PLAID.TRANSACTIONS,
      { accessToken, startDate, endDate },
      token
    );
  },
};

/**
 * Auth API service
 */
export const authApi = {
  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    return apiClient.post<{ token: string, user: any }>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      { email, password }
    );
  },
  
  /**
   * Register user
   */
  register: async (name: string, email: string, password: string) => {
    return apiClient.post<{ token: string, user: any }>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      { name, email, password }
    );
  },
};

/**
 * Reconciliation API service
 */
export const reconciliationApi = {
  /**
   * Get list of reconciliation statements
   */
  getStatements: async (token?: string) => {
    return apiClient.get(
      API_CONFIG.ENDPOINTS.RECONCILIATION.LIST_STATEMENTS,
      token
    );
  },
  
  /**
   * Get reconciliation statement details
   */
  getStatement: async (statementId: string, token?: string) => {
    const endpoint = API_CONFIG.ENDPOINTS.RECONCILIATION.GET_STATEMENT.replace(
      ':id',
      statementId
    );
    return apiClient.get(endpoint, token);
  },
  
  /**
   * Import a new reconciliation statement
   */
  importStatement: async (statementData: any, token?: string) => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.RECONCILIATION.IMPORT_STATEMENT,
      statementData,
      token
    );
  },
  
  /**
   * Match transactions for reconciliation
   */
  matchTransactions: async (matchData: any, token?: string) => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.RECONCILIATION.MATCH_TRANSACTIONS,
      matchData,
      token
    );
  },
  
  /**
   * Complete reconciliation process
   */
  completeReconciliation: async (statementId: string, reconciliationData: any, token?: string) => {
    const endpoint = API_CONFIG.ENDPOINTS.RECONCILIATION.COMPLETE_RECONCILIATION.replace(
      ':id',
      statementId
    );
    return apiClient.post(endpoint, reconciliationData, token);
  }
};

// Export the API client for direct use
export default apiClient; 