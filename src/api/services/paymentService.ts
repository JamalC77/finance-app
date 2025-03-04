import { apiClient } from '../utils/apiClient';

/**
 * Create a payment intent for an invoice
 */
export async function createPaymentIntent(invoiceId: string, paymentMethodId?: string) {
  try {
    const response = await apiClient.post('/payments/create-payment-intent', {
      invoiceId,
      paymentMethodId
    });
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Get saved payment methods for a contact
 */
export async function getPaymentMethods(contactId: string) {
  try {
    const response = await apiClient.get('/payments/payment-methods', {
      params: { contactId }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting payment methods:', error);
    throw error;
  }
}

/**
 * Create a setup intent to save a payment method
 */
export async function createSetupIntent(contactId: string) {
  try {
    const response = await apiClient.post('/payments/setup-intent', {
      contactId
    });
    return response.data;
  } catch (error) {
    console.error('Error creating setup intent:', error);
    throw error;
  }
}

/**
 * Remove a saved payment method
 */
export async function removePaymentMethod(paymentMethodId: string, contactId: string) {
  try {
    const response = await apiClient.post('/payments/remove-payment-method', {
      paymentMethodId,
      contactId
    });
    return response.data;
  } catch (error) {
    console.error('Error removing payment method:', error);
    throw error;
  }
}

/**
 * Attach a payment method to a contact
 */
export async function attachPaymentMethod(paymentMethodId: string, contactId: string) {
  try {
    const response = await apiClient.post('/payments/attach-payment-method', {
      paymentMethodId,
      contactId
    });
    return response.data;
  } catch (error) {
    console.error('Error attaching payment method:', error);
    throw error;
  }
}

/**
 * Get a checkout session for an invoice
 */
export async function getCheckoutSession(invoiceId: string) {
  try {
    const response = await apiClient.get(`/payments/invoice/${invoiceId}/checkout`);
    return response.data;
  } catch (error) {
    console.error('Error getting checkout session:', error);
    throw error;
  }
}

/**
 * Process a manual payment for an invoice
 */
export async function processManualPayment(invoiceId: string, paymentMethodId: string, amount: number) {
  try {
    const response = await apiClient.post('/payments/manual', {
      invoiceId,
      paymentMethodId,
      amount
    });
    return response.data;
  } catch (error) {
    console.error('Error processing manual payment:', error);
    throw error;
  }
} 