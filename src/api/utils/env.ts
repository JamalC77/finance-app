/**
 * Environment variable utility to safely access and validate required env vars
 */

// Function to get environment variables with validation
export function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  
  return value;
}

// Export commonly used environment variables
export const env = {
  // Database
  DATABASE_URL: getEnvVariable('DATABASE_URL'),
  
  // Authentication
  JWT_SECRET: getEnvVariable('JWT_SECRET'),
  NEXTAUTH_SECRET: getEnvVariable('NEXTAUTH_SECRET'),
  NEXTAUTH_URL: getEnvVariable('NEXTAUTH_URL'),
  
  // Plaid
  PLAID: {
    CLIENT_ID: getEnvVariable('PLAID_CLIENT_ID'),
    SECRET: getEnvVariable('PLAID_SECRET'),
    ENV: getEnvVariable('PLAID_ENV', 'sandbox'),
  },
  
  // Stripe
  STRIPE: {
    SECRET_KEY: getEnvVariable('STRIPE_SECRET_KEY'),
    WEBHOOK_SECRET: getEnvVariable('STRIPE_WEBHOOK_SECRET'),
  },
  
  // Add other service configurations as needed
};

// Check if we're in a development environment
export const isDev = process.env.NODE_ENV === 'development'; 