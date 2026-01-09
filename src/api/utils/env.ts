/**
 * Environment variable utility to safely access and validate required env vars
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Function to get environment variables with validation
export function getEnvVariable(key: string, defaultValue?: string): string {
  // Skip validation for server-only variables when in browser
  if (isBrowser && isServerOnlyVariable(key)) {
    return ''; // Return empty string for server-only variables in browser
  }

  const value = process.env[key] || defaultValue;
  
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  
  return value;
}

// List of variables that should only be accessed on the server
function isServerOnlyVariable(key: string): boolean {
  const serverOnlyVariables = [
    'DATABASE_URL',
    'JWT_SECRET',
    'PLAID_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];
  
  return serverOnlyVariables.includes(key);
}

// Export commonly used environment variables
export const env = {
  // Client-safe variables (NEXT_PUBLIC_ prefix means they're exposed to browser)
  API_URL: getEnvVariable('NEXT_PUBLIC_API_URL', '/api'),
  NEXTAUTH_URL: getEnvVariable('NEXTAUTH_URL', isBrowser ? window.location.origin : ''),

  // Check if we're in a development environment
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Check if we're in a development environment
export const isDev = process.env.NODE_ENV === 'development'; 