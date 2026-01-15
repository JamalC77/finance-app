'use client';

import { ThemeProvider } from '@/components/ThemeProvider';
import { OnboardingProvider } from '@/lib/contexts/OnboardingContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ApiProvider } from '@/lib/contexts/ApiContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
