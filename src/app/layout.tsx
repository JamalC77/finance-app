import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { OnboardingProvider } from '@/lib/contexts/OnboardingContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Finance App',
  description: 'Complete financial management for small businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <OnboardingProvider>
            {children}
          </OnboardingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
