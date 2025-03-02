import Stripe from 'stripe';

// Initialize Stripe with the secret key from env vars
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-10-16', // Use the latest API version
});

/**
 * Create a payment intent for an invoice
 */
export async function createPaymentIntent(
  amount: number, 
  currency: string = 'usd',
  metadata: {
    invoiceId: string;
    organizationId: string;
    customerId?: string;
  }
) {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

/**
 * Create or update a Stripe customer
 */
export async function upsertCustomer(
  data: {
    id?: string; // Stripe customer ID if exists
    email: string;
    name: string;
    phone?: string;
    metadata: {
      organizationId: string;
      contactId: string;
    };
  }
) {
  const { id, ...customerData } = data;
  
  if (id) {
    // Update existing customer
    return stripe.customers.update(id, customerData);
  } else {
    // Create new customer
    return stripe.customers.create(customerData);
  }
}

/**
 * Process a webhook event from Stripe
 */
export async function handleWebhookEvent(
  body: string,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handleSuccessfulPayment(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handleFailedPayment(event.data.object as Stripe.PaymentIntent);
        break;
      // Add more event handlers as needed
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    throw error;
  }
}

/**
 * Handle a successful payment
 */
async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  const { invoiceId, organizationId } = paymentIntent.metadata;
  
  // This would interact with your own services to update the invoice and create a transaction
  // Import the necessary services here
  
  // Example:
  // await prisma.invoice.update({
  //   where: { id: invoiceId },
  //   data: {
  //     status: 'PAID',
  //     paymentDate: new Date(),
  //     paymentReference: paymentIntent.id,
  //   },
  // });
  
  // Might also create a transaction for the payment
}

/**
 * Handle a failed payment
 */
async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  const { invoiceId } = paymentIntent.metadata;
  
  // Update the invoice status
  // Example:
  // await prisma.invoice.update({
  //   where: { id: invoiceId },
  //   data: {
  //     status: 'PAYMENT_FAILED',
  //     paymentReference: paymentIntent.id,
  //   },
  // });
  
  // Could also notify the business owner
} 