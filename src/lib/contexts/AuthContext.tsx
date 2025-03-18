'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import apiService from '../services/apiService';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Types
export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
  // Extended profile information from metadata
  metadata?: {
    profile?: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      jobTitle?: string;
      company?: string;
      bio?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
      website?: string;
      twitter?: string;
      linkedin?: string;
    };
    preferences?: {
      dateFormat?: string;
      timeZone?: string;
      twoFactorEnabled?: boolean;
      emailNotifications?: boolean;
      appNotifications?: boolean;
    };
  };
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserData: (data: User) => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  setUserData: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for token in localStorage on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you'd fetch the token from cookies or localStorage
        // For this demo, we'll assume a cookie is set by the API
        const storedToken = localStorage.getItem('financeAppToken');
        
        if (storedToken) {
          try {
            // Verify the token is valid by decoding it
            const decoded = jwtDecode(storedToken);
            
            // Check if token is expired
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
              throw new Error('Token expired');
            }
            
            // Set the token
            setToken(storedToken);
            
            // Fetch the latest user data from the API
            try {
              console.log('Fetching user data from API...');
              const response = await apiService.get('/api/users/me');
              
              if (response && response.user) {
                console.log('User data retrieved from API:', response.user);
                setUser(response.user);
              } else {
                // Fallback to token data if API call fails
                console.log('API did not return user data, using token data');
                setUser({
                  id: decoded.sub as string,
                  name: decoded.name as string,
                  email: decoded.email as string,
                  role: decoded.role as string,
                });
              }
            } catch (apiError) {
              console.error('Error fetching user data from API:', apiError);
              // Fallback to token data
              setUser({
                id: decoded.sub as string,
                name: decoded.name as string,
                email: decoded.email as string,
                role: decoded.role as string,
              });
            }
          } catch (error) {
            console.error('Invalid token', error);
            localStorage.removeItem('financeAppToken');
          }
        }
      } catch (error) {
        console.error('Auth check failed', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.auth.login({ email, password });
      
      if (response.token) {
        localStorage.setItem('financeAppToken', response.token);
        setToken(response.token);
        
        // Decode and set user or fetch user profile
        const decoded = jwtDecode(response.token);
        setUser({
          id: decoded.sub as string,
          name: decoded.name as string,
          email: decoded.email as string,
          role: decoded.role as string,
        });
        
        router.push('/dashboard');
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login error', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.auth.register({ name, email, password });
      
      if (response.token) {
        localStorage.setItem('financeAppToken', response.token);
        setToken(response.token);
        
        // Decode and set user data
        const decoded = jwtDecode(response.token);
        setUser({
          id: decoded.sub as string,
          name: decoded.name as string,
          email: decoded.email as string,
          role: decoded.role as string,
        });
        
        router.push('/dashboard');
      } else {
        throw new Error('Registration failed: No token received');
      }
    } catch (error) {
      console.error('Registration error', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('financeAppToken');
      
      // Clear state
      setUser(null);
      setToken(null);
      
      // Call logout endpoint to invalidate server-side session if needed
      await fetch('/auth/logout');
      
      // Redirect to home page instead of login page
      router.push('/');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  // Function to manually set user data (useful for testing/development)
  const setUserData = (data: User) => {
    console.log('Setting user data in AuthContext:', data);
    setUser(data);
  };

  // Compute authentication status
  const isAuthenticated = !!user && !!token;

  // Context value
  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    setUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 