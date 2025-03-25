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

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: communityData, isFetching } = useListCommunities();
  const community = communityData?.data?.communities[0]

  const spaces = [
    { id: "1", name: "General" },
    { id: "2", name: "Social" },
  ];

  const handleAddSpaceToCommunity = (e: any) => {
    console.log("hii")
  }

  return (
    <Card className='rounded-md h-[88vh] bg-white'>
      {
        isFetching ? <CommunitySidebarSkeleton /> : <div className="w-64 p-4">
          <div className="flex items-center space-x-2 pt-2 pb-4 mb-6 border-b">
            <img src={community?.logo
            } alt="Community Avatar" className="rounded-full h-10 w-10 object-cover" />
            <span className="text-sm font-semibold">{community?.displayName}</span>
          </div>

          <div className="space-y-2">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <div className='inline-flex justify-between items-center gap-4 w-full'>
                <CollapsibleTrigger className="basis-10/12">
                  <div className="flex items-center gap-2">
                    Space
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>

                </CollapsibleTrigger>
                <div onClick={handleAddSpaceToCommunity} className='flex-1 cursor-pointer'>
                  <CreateSpaceDialog />
                </div>
              </div>
              <CollapsibleContent className="py-2">
                {spaces.map((space) => (
                  <Link
                    key={space.id}
                    href={`/studio/community/${2}/${space.id}`}
                    className="flex items-center p-2 rounded-md hover:bg-primary-100 transition-colors"
                  >
                    {space.name}
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      }
    </Card>
  );
}