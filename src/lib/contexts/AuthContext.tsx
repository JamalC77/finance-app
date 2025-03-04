'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { apiService } from '../contexts/ApiContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Types
export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
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
  bypassAuth: () => void;
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
  bypassAuth: () => {},
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
            
            // Set the token and user data
            setToken(storedToken);
            
            // You might want to make an API call to get fresh user data
            // For now, we'll extract basic info from the token
            setUser({
              id: decoded.sub as string,
              name: decoded.name as string,
              email: decoded.email as string,
              role: decoded.role as string,
            });
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
      const response = await apiService.post('/api/auth/login', { email, password });
      
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
      const response = await apiService.post('/api/auth/register', { 
        name, 
        email, 
        password 
      });
      
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
    setUser(data);
  };

  // Debug bypass function to set a mock token and user
  const bypassAuth = () => {
    // Create a mock token that won't expire for 24 hours
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXYtdXNlci1pZCIsIm5hbWUiOiJEZXZlbG9wbWVudCBVc2VyIiwiZW1haWwiOiJkZXZAZXhhbXBsZS5jb20iLCJyb2xlIjoiQURNSU4iLCJvcmdhbml6YXRpb25JZCI6ImRldi1vcmctaWQiLCJpYXQiOjE2MDk0NTkwMDAsImV4cCI6OTk5OTk5OTk5OX0.bTRrT1d0QWtQeDEyM3dlZXdnRGRrM2VyZHphUVphdXdm';
    
    // Set mock user
    const mockUser = {
      id: 'dev-user-id',
      name: 'Development User',
      email: 'dev@example.com',
      role: 'ADMIN'
    };
    
    // Store token in localStorage
    localStorage.setItem('financeAppToken', mockToken);
    
    // Update state
    setToken(mockToken);
    setUser(mockUser);
    
    // Show success message
    toast({
      title: 'Bypassed Authentication',
      description: 'Using development user credentials',
      duration: 3000
    });
    
    // Redirect to dashboard
    router.push('/dashboard');
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
    bypassAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      {process.env.NODE_ENV !== 'production' && !isAuthenticated && !isLoading && (
        <div className="fixed bottom-4 right-4 z-50 p-4 bg-black bg-opacity-70 rounded-lg">
          <Button 
            variant="destructive"
            onClick={bypassAuth}
            className="text-xs"
          >
            Bypass Auth (Dev Only)
          </Button>
        </div>
      )}
    </AuthContext.Provider>
  );
}; 