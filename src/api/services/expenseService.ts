import { apiClient } from '../utils/apiClient';

/**
 * Get all expenses with optional filters
 */
export async function getExpenses(filters?: {
  startDate?: string;
  endDate?: string;
  contactId?: string;
  status?: string;
}) {
  try {
    const response = await apiClient.get('/api/expenses', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
}

/**
 * Get a single expense by ID
 */
export async function getExpense(id: string) {
  try {
    const response = await apiClient.get(`/api/expenses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching expense ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new expense
 */
export async function createExpense(expenseData: any) {
  try {
    const response = await apiClient.post('/api/expenses', expenseData);
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
}

/**
 * Update an existing expense
 */
export async function updateExpense(id: string, expenseData: any) {
  try {
    const response = await apiClient.put(`/api/expenses/${id}`, expenseData);
    return response.data;
  } catch (error) {
    console.error(`Error updating expense ${id}:`, error);
    throw error;
  }
}

/**
 * Delete an expense
 */
export async function deleteExpense(id: string) {
  try {
    const response = await apiClient.delete(`/api/expenses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting expense ${id}:`, error);
    throw error;
  }
} 