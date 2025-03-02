// MOCK AUTH FILE FOR PROOF OF CONCEPT
// This file contains mock implementations for auth-related functionality

export const authOptions = {
  // Mock auth options
};

// Mock types
export interface User {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  organizationName: string;
  role: string;
}

export interface Session {
  user: User;
}

// Mock function that returns a dummy session
export function getServerAuthSession() {
  return {
    user: {
      id: "user-1",
      name: "Demo User",
      email: "demo@example.com",
      organizationId: "org-1",
      organizationName: "Demo Organization",
      role: "ADMIN"
    }
  };
} 