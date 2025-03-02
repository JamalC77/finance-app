import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '@/lib/auth';

// Mock accounts data
const mockAccounts = [
  {
    id: 'acc_1',
    name: 'Checking Account',
    type: 'asset',
    subtype: 'bank',
    accountNumber: '1000',
    currentBalance: 24500.75,
    description: 'Primary business checking account',
    organizationId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc_2',
    name: 'Savings Account',
    type: 'asset',
    subtype: 'bank',
    accountNumber: '1001',
    currentBalance: 15000.00,
    description: 'Business savings account',
    organizationId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc_3',
    name: 'Accounts Receivable',
    type: 'asset',
    subtype: 'receivable',
    accountNumber: '1100',
    currentBalance: 8750.50,
    description: 'Money owed by customers',
    organizationId: 'org-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const session = getServerAuthSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the organization ID from the user's session or query params
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId') || session.user.organizationId;
    
    // Filter accounts for the organization from our mock data
    const accounts = mockAccounts.filter(acc => acc.organizationId === organizationId);
    
    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getServerAuthSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    const { name, type, subtype, description, accountNumber } = data;
    
    // Validate required fields
    if (!name || !type || !accountNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create new account (mock version)
    const newAccount = {
      id: `acc_${Date.now()}`,
      name,
      type,
      subtype,
      description,
      accountNumber,
      organizationId: session.user.organizationId,
      currentBalance: 0, // Initialize with zero balance
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // In a real implementation, we would save this to the database
    // For our mock, we'll just return the new account
    
    return NextResponse.json({ account: newAccount }, { status: 201 });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
} 