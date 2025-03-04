import { apiClient } from '../utils/apiClient';

/**
 * Get all invoices with optional filters
 */
export async function getInvoices(filters?: {
  startDate?: string;
  endDate?: string;
  contactId?: string;
  status?: string;
}) {
  try {
    const response = await apiClient.get('/api/invoices', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

/**
 * Get a single invoice by ID
 */
export async function getInvoice(id: string) {
  try {
    const response = await apiClient.get(`/api/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new invoice
 */
export async function createInvoice(invoiceData: any) {
  try {
    const response = await apiClient.post('/api/invoices', invoiceData);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

/**
 * Update an existing invoice
 */
export async function updateInvoice(id: string, invoiceData: any) {
  try {
    const response = await apiClient.put(`/api/invoices/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    console.error(`Error updating invoice ${id}:`, error);
    throw error;
  }
}

/**
 * Delete an invoice
 */
export async function deleteInvoice(id: string) {
  try {
    const response = await apiClient.delete(`/api/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting invoice ${id}:`, error);
    throw error;
  }
}

/**
 * Get a public invoice by ID (no authentication required)
 */
export async function getPublicInvoice(id: string) {
  try {
    const response = await apiClient.get(`/api/public/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching public invoice ${id}:`, error);
    throw error;
  }
}

/**
 * Send an invoice to a customer via email
 */
export async function sendInvoice(id: string, emailData?: { 
  message?: string;
  cc?: string[];
}) {
  try {
    const response = await apiClient.post(`/api/invoices/${id}/send`, emailData || {});
    return response.data;
  } catch (error) {
    console.error(`Error sending invoice ${id}:`, error);
    throw error;
  }
}

/**
 * Generate a PDF for an invoice
 */
export async function generateInvoicePdf(id: string) {
  try {
    const response = await apiClient.get(`/api/invoices/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error(`Error generating PDF for invoice ${id}:`, error);
    throw error;
  }
} 