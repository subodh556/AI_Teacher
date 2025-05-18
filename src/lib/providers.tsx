'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import { UIProvider } from '@/context/ui-context';
import { QueryProvider } from '@/context/query-provider';
import { AnalyticsProvider } from '@/lib/analytics';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <QueryProvider>
          <UIProvider>
            <AnalyticsProvider>
              {children}
            </AnalyticsProvider>
          </UIProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
