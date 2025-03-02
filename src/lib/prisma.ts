// MOCK PRISMA FILE FOR PROOF OF CONCEPT
// This file contains a mock implementation of the Prisma client

// Create a simple mock Prisma client with empty methods
// This prevents "prisma is not initialized" errors
export const prisma = {
  user: {
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
  },
  account: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
  },
  invoice: {
    findMany: async () => [], 
    findUnique: async () => null,
    create: async () => ({}),
    update: async () => ({}),
  },
  transaction: {
    findMany: async () => [],
    create: async () => ({}),
  },
  expense: {
    findMany: async () => [],
    create: async () => ({}),
  },
  contact: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async () => ({}),
  },
}; 