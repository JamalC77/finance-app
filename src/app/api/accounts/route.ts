import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the organization ID from the user's session or query params
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId') || session.user.organizationId;
    
    // Fetch accounts for the organization
    const accounts = await prisma.account.findMany({
      where: {
        organizationId: organizationId as string,
      },
      orderBy: {
        accountNumber: 'asc',
      },
    });
    
    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    const { name, type, subtype, description, accountNumber } = data;
    
    // Validate required fields
    if (!name || !type || !accountNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create new account
    const account = await prisma.account.create({
      data: {
        name,
        type,
        subtype,
        description,
        accountNumber,
        organizationId: session.user.organizationId as string,
        currentBalance: 0, // Initialize with zero balance
      },
    });
    
    return NextResponse.json({ account }, { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
} 