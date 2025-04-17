"use client"
import Link from 'next/link';
import CreateSpaceDialog from './CreateSpaceDialog';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from 'react';
import { CommunitySidebarSkeleton } from '@/components/sketetons/CommunitySidebarSkeleton';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useListMemberCommunities } from '@/hooks/communities/useListMemberCommunities';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function CommunitySidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const { loading, currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser && currentUser?.id);
  const { data: communities, isLoading: isFetchingCommunity } = useListMemberCommunities(profileData && profileData?.data?.id)
  const community = communities?.data?.communities[0]
  const pathname = usePathname();

  return (
    <Card className='rounded-md h-[87vh] bg-white'>
      {
        isFetchingCommunity || loading || profileLoading ? <CommunitySidebarSkeleton /> : <div className="w-64 p-4">
          <div className="flex items-center space-x-2 pt-2 pb-4 mb-6 border-b">
            <img src={community?.logo || "/assets/community.svg"} alt="Community Avatar" className="rounded-full h-10 w-10 object-cover" />
            <span className="text-sm font-semibold">{community?.name}</span>
          </div>

          <div className="space-y-2">
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
                <div className='flex-1 cursor-pointer'>
                  <CreateSpaceDialog
                    communityId={community?.id}
                  />
                </div>
              </div>
              <CollapsibleContent className="py-2">
                {community?.spaces?.map((space: any) => {
                  const isActive = pathname === `/socials/community/${community?.id}/${space?.id}`;
                  return (
                    <Link
                      key={space?.id}
                      href={`/socials/community/${community?.id}/${space?.id}`}
                      className={cn("text-sm flex items-center p-2 rounded-md hover:bg-primary-100 transition-colors mb-1",
                        isActive ? "bg-primary-100 text-primary-900" : "text-gray-700"
                      )}
                    >
                      {space?.displayName}
                    </Link>
                  )
                })}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      }
    </Card>
  );
}