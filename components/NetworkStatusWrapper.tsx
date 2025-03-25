'use client';

import { useEffect, useState } from 'react';
import NetworkError from './NetworkError';
import { usePathname, useSearchParams } from 'next/navigation';
import { RouterSpinner } from './Loaders/RouterSpinner';

export default function NetworkStatusWrapper({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true); // Assume online initially
  const [isLoading, setIsLoading] = useState(false); // For route changes
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Detect network status
  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    // Handle online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const checkNetworkQuality = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch('https://www.google.com', {
          signal: controller.signal,
          mode: 'no-cors', // Avoid CORS issues
        });

        clearTimeout(timeoutId);
        setIsOnline(true); // Network is good
      } catch (error) {
        setIsOnline(false); // Network is poor or offline
      }
    };

    checkNetworkQuality();
  }, [pathname, searchParams]); // Re-check on route change

  // Handle route transitions
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 100); // Simulate loading
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isOnline) {
    return <NetworkError />;
  }

  return (
    <>
      {isLoading && <RouterSpinner />}
      {!isLoading && children}
    </>
  );
}