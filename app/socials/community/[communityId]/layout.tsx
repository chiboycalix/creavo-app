"use client"
import CommunitySidebar from '@/components/socials/community/CommunitySidebar';
import { Card } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';

export default function CommunityLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const communityId = params?.communityId as string;

  return (
    <div className="flex gap-4">
      <CommunitySidebar communityId={communityId} />
      <Card className='w-full'>
        {children}
      </Card>
    </div>
  );
}