/**
 * Vercel Analytics Configuration
 * 
 * This file sets up Vercel Analytics for the application.
 * It provides components and utilities for tracking page views and custom events.
 */

'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

/**
 * AnalyticsProvider component that wraps the application with Vercel Analytics
 * and Speed Insights components.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    if (pathname) {
      // You can add custom tracking logic here if needed
      // For example, sending events to a custom analytics service
    }
  }, [pathname, searchParams]);

  return (
    <>
      {children}
      {/* Vercel Analytics - automatically tracks page views */}
      <VercelAnalytics />
      {/* Vercel Speed Insights - tracks web vitals */}
      <SpeedInsights />
    </>
  );
}

/**
 * Track a custom event with Vercel Analytics
 * 
 * @param eventName The name of the event to track
 * @param properties Additional properties to include with the event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', {
      name: eventName,
      ...properties
    });
  }
}
