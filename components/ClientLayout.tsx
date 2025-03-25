'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RouterSpinner } from './Loaders/RouterSpinner';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 10);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <div className="relative">
      <div className={isLoading ? 'opacity-50' : 'opacity-100'}>{children}</div>
      {isLoading && <RouterSpinner />}
    </div>
  );
}