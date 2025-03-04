import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  // Clear cookies if needed (depends on your auth implementation)
  const cookieStore = cookies();
  cookieStore.delete('financeAppToken');
  
  // Redirect to login page
  return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
} 