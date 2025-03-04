'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { OnboardingProvider } from '@/lib/contexts/OnboardingContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ApiProvider } from '@/lib/contexts/ApiContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Finance App</title>
        <meta name="description" content="Complete financial management for small businesses" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ApiProvider>
              <OnboardingProvider>
                {children}
              </OnboardingProvider>
            </ApiProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
