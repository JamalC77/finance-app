import { NextRequest, NextResponse } from 'next/server';

// This needs to be a POST request without CSRF protection
export async function POST(req: NextRequest) {
  try {
    // Mock implementation - just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 400 }
    );
  }
}

// Add a simple health check for testing
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
} 