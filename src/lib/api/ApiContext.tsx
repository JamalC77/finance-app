"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios, { AxiosInstance } from 'axios';
import { useToast } from '@/components/ui/use-toast';

interface ApiContextType {
  api: AxiosInstance;
  isLoading: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Create axios instance
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      setIsLoading(true);
      
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? 
        localStorage.getItem('financeAppToken') || localStorage.getItem('token') : 
        null;
      
      // If token exists, add to headers
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      setIsLoading(false);
      return Promise.reject(error);
    }
  );
  
  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      setIsLoading(false);
      return response;
    },
    (error) => {
      setIsLoading(false);
      
      // Handle different error scenarios
      if (error.response) {
        // Server responded with an error
        if (error.response.status === 401) {
          // Unauthorized - could be expired token
          if (typeof window !== 'undefined') {
            // Clear token and redirect to login (optional)
            localStorage.removeItem('financeAppToken');
            // No auto redirect, let the component handle it
          }
        }
        
        if (error.response.status === 500) {
          toast({
            title: "Server Error",
            description: "Something went wrong on our server. Please try again later.",
            variant: "destructive",
          });
        }
      } else if (error.request) {
        // Request made but no response received
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your internet connection.",
          variant: "destructive",
        });
      }
      
      return Promise.reject(error);
    }
  );
  
  return (
    <ApiContext.Provider value={{ api, isLoading }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  
  return context;
}; 