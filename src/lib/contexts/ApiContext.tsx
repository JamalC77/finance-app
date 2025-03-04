'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Define types for our API context
type ApiState = {
  isLoading: boolean;
  error: Error | null;
};

export type ApiContextType = ApiState & {
  get: <T>(url: string, params?: Record<string, any>) => Promise<T>;
  post: <T>(url: string, data?: any) => Promise<T>;
  put: <T>(url: string, data: any) => Promise<T>;
  patch: <T>(url: string, data: any) => Promise<T>;
  delete: <T>(url: string) => Promise<T>;
  clearError: () => void;
};

// Create the API context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Base URL from environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API Provider component
export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ApiState>({
    isLoading: false,
    error: null,
  });
  
  const auth = useAuth();

  // Helper method to build request options with authentication
  const buildRequestOptions = (method: string, data?: any): RequestInit => {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authentication header if we have a token
    if (auth.token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${auth.token}`,
      };
    }

    // Add body for methods that support it
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = JSON.stringify(data);
    }

    return options;
  };

  // Common fetch handler with error handling
  const fetchHandler = async <T,>(url: string, options: RequestInit): Promise<T> => {
    // Add loading state
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Ensure we're using the full URL
      const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
      
      // Make the request
      const response = await fetch(fullUrl, options);
      
      // Handle non-200 responses
      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          // Clear auth state
          auth.logout();
          throw new Error('Your session has expired. Please log in again.');
        }
        
        // Try to parse error message from the response
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }
      
      // Parse the JSON response
      const data = await response.json();
      
      // Return successful response
      return data as T;
    } catch (error) {
      // Store the error in state
      setState(prev => ({ ...prev, error: error as Error }));
      
      // Re-throw for handling in components
      throw error;
    } finally {
      // Clear loading state
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // HTTP method implementations
  const get = <T,>(url: string, params?: Record<string, any>): Promise<T> => {
    // Build query string from params
    const queryString = params 
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    
    return fetchHandler<T>(`${url}${queryString}`, buildRequestOptions('GET'));
  };

  const post = <T,>(url: string, data?: any): Promise<T> => {
    return fetchHandler<T>(url, buildRequestOptions('POST', data));
  };

  const put = <T,>(url: string, data: any): Promise<T> => {
    return fetchHandler<T>(url, buildRequestOptions('PUT', data));
  };

  const patch = <T,>(url: string, data: any): Promise<T> => {
    return fetchHandler<T>(url, buildRequestOptions('PATCH', data));
  };

  const delete_ = <T,>(url: string): Promise<T> => {
    return fetchHandler<T>(url, buildRequestOptions('DELETE'));
  };

  // Utility methods
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Build context value
  const value: ApiContextType = {
    isLoading: state.isLoading,
    error: state.error,
    get,
    post,
    put,
    patch,
    delete: delete_,
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

// Create a standalone apiService for use outside React components
export const apiService = {
  get: async <T,>(url: string, params?: Record<string, any>): Promise<T> => {
    // Build query string from params
    const queryString = params 
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    
    // Ensure we're using the full URL
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    
    // Get token from localStorage (if available)
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('financeAppToken');
    }
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make the request
    const response = await fetch(`${fullUrl}${queryString}`, {
      method: 'GET',
      headers,
    });
    
    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    // Parse the JSON response
    return await response.json() as T;
  },
  
  post: async <T,>(url: string, data?: any): Promise<T> => {
    // Ensure we're using the full URL
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    
    // Get token from localStorage (if available)
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('financeAppToken');
    }
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make the request
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    // Parse the JSON response
    return await response.json() as T;
  },
  
  put: async <T,>(url: string, data: any): Promise<T> => {
    // Ensure we're using the full URL
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    
    // Get token from localStorage (if available)
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('financeAppToken');
    }
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make the request
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    // Parse the JSON response
    return await response.json() as T;
  },
  
  patch: async <T,>(url: string, data: any): Promise<T> => {
    // Ensure we're using the full URL
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    
    // Get token from localStorage (if available)
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('financeAppToken');
    }
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make the request
    const response = await fetch(fullUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    
    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    // Parse the JSON response
    return await response.json() as T;
  },
  
  delete: async <T,>(url: string): Promise<T> => {
    // Ensure we're using the full URL
    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    
    // Get token from localStorage (if available)
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('financeAppToken');
    }
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Make the request
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers,
    });
    
    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    // Parse the JSON response
    return await response.json() as T;
  },
}; 