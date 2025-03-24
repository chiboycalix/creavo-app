"use client"
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from 'react';
import Link from 'next/link';


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const spaces = [
    { id: "1", name: "General" },
    { id: "2", name: "Social" },
  ];

  return (
    <Card className='rounded-md h-[88vh] bg-white'>
      <div className="w-64 p-4">
        <div className="flex items-center space-x-2 pt-2 pb-4 mb-6 border-b">
          <Image src="/assets/community.svg" alt="Community Avatar" width={40} height={40} className="rounded-full" />
          <span className="text-sm font-semibold">Unlimited Community</span>
        </div>
        <div className="space-y-2">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center gap-2">
              Space
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
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

          {/* */}
        </div>
      </div>
    </Card>
  );
}