import { NextRequest, NextResponse } from 'next/server';
import { handleWebhookEvent } from '@/lib/stripe';

// This needs to be a POST request without CSRF protection
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }
    
    const result = await handleWebhookEvent(body, signature);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error handling Stripe webhook:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 400 }
    );
  }
}

// Add a simple health check for testing
export async function GET() {
  return NextResponse.json({ status: 'Stripe webhook endpoint is working' });
} 