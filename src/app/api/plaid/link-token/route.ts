import { NextRequest, NextResponse } from 'next/server';
import { createLinkToken } from '@/api/services/plaidService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Using the user's ID from session to create a link token
    const userId = session.user.id || 'user-id';
    const linkTokenResponse = await createLinkToken(userId);
    
    return NextResponse.json(linkTokenResponse);
  } catch (error) {
    console.error('Error in link token API:', error);
    return NextResponse.json(
      { error: 'Failed to create link token' },
      { status: 500 }
    );
  }
} 