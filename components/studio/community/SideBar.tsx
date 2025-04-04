"use client"
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import CreateSpaceDialog from './CreateSpaceDialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState } from 'react';
import { useListCommunities } from '@/hooks/communities/useListCommunities';
import { CommunitySidebarSkeleton } from '@/components/sketetons/CommunitySidebarSkeleton';
import { useListSpaces } from '@/hooks/communities/useListSpaces';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function CommunitySidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: communityData, isFetching } = useListCommunities();

  const community = communityData?.data?.communities[0]
  const { data } = useListSpaces(community && community?.id);

  const pathname = usePathname();

  return (
    <Card className='rounded-md h-[88vh] bg-white'>
      {
        isFetching ? <CommunitySidebarSkeleton /> : <div className="w-64 p-4">
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
                {data?.data?.spaces.map((space: any) => {
                  const isActive = pathname === `/studio/community/${community?.id}/${space?.id}`;
                  return (
                    <Link
                      key={space?.id}
                      href={`/studio/community/${community?.id}/${space?.id}`}
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