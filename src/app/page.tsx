'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Landmark, ArrowRight, BarChart, DollarSign, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect authenticated users to dashboard
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // If still loading auth state, show loading screen
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Landmark className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Finance App</h1>
          <p className="text-lg text-muted-foreground mb-8">Loading application...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show landing page
  // (We don't need to check isAuthenticated here because authenticated users
  // will be redirected by the useEffect hook)
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Landmark className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold">Finance App</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Manage Your Finances with Ease
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              A powerful financial management platform designed for individuals and businesses to track expenses, create invoices, and gain insights into your financial health.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/auth/register">
                <Button size="lg" className="text-lg px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <DollarSign className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Invoice Management</CardTitle>
                  <CardDescription>
                    Create and send professional invoices to your clients.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Track payments, send reminders, and manage your accounts receivable all in one place.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CreditCard className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Expense Tracking</CardTitle>
                  <CardDescription>
                    Keep track of all your business and personal expenses.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Categorize expenses, upload receipts, and manage your spending habits efficiently.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <BarChart className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription>
                    Get insights into your financial performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Generate cash flow, profit & loss, and other reports to make informed business decisions.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Finances?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of users who are managing their finances more effectively with our platform.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Landmark className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold">Finance App</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Finance App. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
