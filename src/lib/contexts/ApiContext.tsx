'use client';

import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Define types for our API context
type ApiState = {
  isLoading: boolean;
  error: Error | null;
};

// Define the API client interface
interface ApiClient {
  get: <T>(url: string, params?: Record<string, unknown>) => Promise<T>;
  post: <T>(url: string, data?: unknown, config?: RequestInit) => Promise<T>;
  put: <T>(url: string, data: unknown) => Promise<T>;
  patch: <T>(url: string, data: unknown) => Promise<T>;
  delete: <T>(url: string) => Promise<T>;
}

export type ApiContextType = ApiState & ApiClient & {
  clearError: () => void;
};

// Create the API context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Base URL from environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create a singleton API client factory
class ApiClientFactory {
  private static instance: ApiClientFactory;
  private clients: Map<string, ApiClient> = new Map();
  // Use any here because we store promises of different types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private pendingRequests: Map<string, Promise<any>> = new Map();

  private constructor() {}

  public static getInstance(): ApiClientFactory {
    if (!ApiClientFactory.instance) {
      ApiClientFactory.instance = new ApiClientFactory();
    }
    return ApiClientFactory.instance;
  }

  public getClient(tokenGetter: () => string | null): ApiClient {
    // Use a unique key for each token getter
    const key = 'client';
    
    if (!this.clients.has(key)) {
      this.clients.set(key, this.createClient(tokenGetter));
    }
    
    return this.clients.get(key)!;
  }

  private createClient(tokenGetter: () => string | null): ApiClient {
    // Helper method to build request options with authentication
    const buildRequestOptions = (method: string, data?: unknown, config: RequestInit = {}): RequestInit => {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        ...config,
      };

      // Add authentication header if we have a token
      const token = tokenGetter();
      if (token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        };
      }

      // Add body for methods that support it
      if (data && ['POST', 'PUT', 'PATCH'].includes(method) && !options.body) {
        options.body = JSON.stringify(data);
      }

      return options;
    };

    // Generate a unique key for requests to enable deduplication
    const getRequestKey = (url: string, options: RequestInit): string => {
      return `${options.method}:${url}:${options.body ? JSON.stringify(options.body) : ''}`;
    };

    // Common fetch handler with error handling and request deduplication
    const fetchHandler = async <T,>(url: string, options: RequestInit): Promise<T> => {
      try {
        // Ensure we're using the full URL
        const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
        
        // Create a unique key for this request to deduplicate
        const requestKey = getRequestKey(fullUrl, options);
        
        // Check if there's already a pending request for this exact URL/method/body
        if (this.pendingRequests.has(requestKey)) {
          console.log('Returning pending request:', requestKey);
          return this.pendingRequests.get(requestKey)!;
        }
        
        // Create the new request promise
        const fetchPromise = (async () => {
          try {
            // Make the request
            console.log('Making fetch request:', requestKey);
            const response = await fetch(fullUrl, options);
            
            // Handle non-200 responses
            if (!response.ok) {
              // Try to parse error message from the response
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || `Request failed with status ${response.status}`);
            }
            
            // Parse the JSON response
            const data = await response.json();
            
            // Return successful response
            return data as T;
          } finally {
            // Clean up the pending request when done (whether success or error)
            this.pendingRequests.delete(requestKey);
          }
        })();
        
        // Store the pending request
        this.pendingRequests.set(requestKey, fetchPromise);
        
        // Return the promise
        return fetchPromise;
      } catch (error) {
        throw error;
      }
    };

    return {
      get: <T,>(url: string, params?: Record<string, unknown>): Promise<T> => {
        const queryString = params 
          ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
          : '';
        return fetchHandler<T>(`${url}${queryString}`, buildRequestOptions('GET'));
      },

      post: <T,>(url: string, data?: unknown, config?: RequestInit): Promise<T> => {
        return fetchHandler<T>(url, buildRequestOptions('POST', data, config));
      },

      put: <T,>(url: string, data: unknown): Promise<T> => {
        return fetchHandler<T>(url, buildRequestOptions('PUT', data));
      },

      patch: <T,>(url: string, data: unknown): Promise<T> => {
        return fetchHandler<T>(url, buildRequestOptions('PATCH', data));
      },

      delete: <T,>(url: string): Promise<T> => {
        return fetchHandler<T>(url, buildRequestOptions('DELETE'));
      },
    };
  }
}

// Get the singleton factory instance
const apiClientFactory = ApiClientFactory.getInstance();

// Create a standalone API service for use outside React components
export const apiService = apiClientFactory.getClient(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('financeAppToken');
  }
  return null;
});

// API Provider component
export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ApiState>({
    isLoading: false,
    error: null,
  });
  
  const auth = useAuth();
  
  // Get the API client using the auth token
  const apiClientRef = useRef<ApiClient | null>(null);
  
  // Initialize the API client on first render
  useEffect(() => {
    apiClientRef.current = apiClientFactory.getClient(() => auth.token);
  }, [auth.token]);
  
  // Utility methods
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // If the API client isn't initialized yet, use a placeholder
  const apiClient = apiClientRef.current || apiService;

  // Build context value
  const value: ApiContextType = {
    ...apiClient,
    isLoading: state.isLoading,
    error: state.error,
    clearError,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

// Custom hook to use the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  
  return context;
}; 