"use client"
import CommunitySidebar from '@/components/studio/community/SideBar';
import { Card } from '@/components/ui/card';
import type { ReactNode } from 'react';

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <CommunitySidebar />
      <Card className='w-full'>
        {children}
      </Card>
    </div>
  );
}