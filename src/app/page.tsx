'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Database, ArrowRight, BarChart, DollarSign, CreditCard } from 'lucide-react';
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
            <Database className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">CFO Line</h1>
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
            <Database className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold">CFO Line</span>
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
              Transform QuickBooks Data Into Powerful Insights
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              CFO Line connects seamlessly with QuickBooks to process your financial data and build sophisticated data models that help you deliver better insights to your clients.
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
                  <CardTitle>QuickBooks Integration</CardTitle>
                  <CardDescription>
                    Seamless connection with your QuickBooks account.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Automatically sync your financial data from QuickBooks and keep everything up-to-date in real-time.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CreditCard className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Advanced Data Modeling</CardTitle>
                  <CardDescription>
                    Transform raw financial data into meaningful insights.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Our sophisticated algorithms analyze your QuickBooks data to create custom financial models tailored to your clients&apos; needs.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <BarChart className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Client-Ready Reports</CardTitle>
                  <CardDescription>
                    Present professional insights to your clients.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Generate beautiful, customizable reports that help your clients understand their financial position and make better decisions.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Elevate Your Financial Services?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join accounting professionals who use CFO Line to deliver deeper insights and more value to their clients.
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
              <Database className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold">CFO Line</span>
            </div>
            <div className="flex space-x-6 mb-6 md:mb-0">
              <Link href="/privacy-policy" className="text-sm hover:underline">
                Privacy Policy
              </Link>
              <Link href="/eula" className="text-sm hover:underline">
                EULA
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CFO Line. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
