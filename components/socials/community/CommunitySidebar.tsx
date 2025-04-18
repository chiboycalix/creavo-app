"use client"
import Link from 'next/link';
import CommunitySelect from './CommunitySelect';
import { Card } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from 'react';
import { CommunitySidebarSkeleton } from '@/components/sketetons/CommunitySidebarSkeleton';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useListMemberCommunities } from '@/hooks/communities/useListMemberCommunities';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/context/AuthContext';
interface Community {
  id: string;
  name: string;
  logo?: string;
  spaces?: any[];
}

function getCommunityById(communities: any[], id: any): any | undefined {
  return communities?.find((community) => community.id === id);
}

export default function CommunitySidebar({ communityId }: { communityId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const { loading, currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser && currentUser?.id);
  const { data: communities, isLoading: isFetchingCommunity } = useListMemberCommunities(profileData && profileData?.data?.id);

  const selected = getCommunityById(communities && communities?.data?.communities, Number(communityId));

  const handleCommunitySelect = (community: Community) => {
    if (community.id === communityId) return;
    router.push(`/socials/community/${community.id}`);
  };

  return (
    <Card className='rounded-md h-[87vh] bg-white w-96'>
      {isFetchingCommunity || profileLoading || loading ? (
        <CommunitySidebarSkeleton />
      ) : (
        <div className='p-4'>
          <CommunitySelect
            communities={communities?.data?.communities}
            selectedCommunity={selected}
            onSelect={handleCommunitySelect}
          />
          <div className="space-y-2 mt-8">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <div className='inline-flex justify-between items-center gap-4 w-full'>
                <CollapsibleTrigger className="basis-10/12">
                  <div className="flex items-center gap-2 uppercase text-sm font-semibold text-gray-500 cursor-pointer">
                    Space
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="py-2">
                {selected?.spaces?.map((space: any) => {
                  const isActive = pathname === `/socials/community/${selected.id}/${space.id}`;
                  return (
                    <Link
                      key={space.id}
                      href={`/socials/community/${selected.id}/${space.id}`}
                      className={cn(
                        "text-sm flex items-center p-2 rounded-md hover:bg-primary-100 transition-colors mb-1",
                        isActive ? "bg-primary-100 text-primary-900" : "text-gray-700"
                      )}
                    >
                      {space.displayName}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      )}
    </Card>
  );

}