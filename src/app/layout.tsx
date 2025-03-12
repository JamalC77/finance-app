'use client';

import './globals.css';
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
        <title>CFO Line</title>
        <meta name="description" content="Connect your QuickBooks data to build powerful financial models and deliver better insights to your clients" />
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
