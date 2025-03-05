import { apiClient } from '../utils/apiClient';

/**
 * Get all contacts with optional filters
 */
export async function getContacts(filters?: {
  type?: string;
  isActive?: boolean;
}) {
  try {
    const response = await apiClient.get('/api/contacts', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}

/**
 * Get a contact by ID
 */
export async function getContact(id: string) {
  try {
    const response = await apiClient.get(`/api/contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching contact ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new contact
 */
export async function createContact(contactData: any) {
  try {
    const response = await apiClient.post('/api/contacts', contactData);
    return response.data;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
}

/**
 * Update a contact
 */
export async function updateContact(id: string, contactData: any) {
  try {
    const response = await apiClient.put(`/api/contacts/${id}`, contactData);
    return response.data;
  } catch (error) {
    console.error(`Error updating contact ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a contact
 */
export async function deleteContact(id: string) {
  try {
    const response = await apiClient.delete(`/api/contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting contact ${id}:`, error);
    throw error;
  }
} 