"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type TabsProps = {
  tabs: {
    id: number;
    title: string;
    content: React.ReactNode
  }[],
  defaultValue: string;
}
const CustomTab = ({ tabs, defaultValue }: TabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const activeTab = searchParams.get('tab') || defaultValue;

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  return (
    <Tabs defaultValue={activeTab} className="w-full" onValueChange={handleTabChange}>
      <ScrollArea className="w-full">
        <TabsList className="w-1/2 inline-flex justify-between bg-transparent mb-4">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.title.toLowerCase()}
              className="rounded-t-md flex-shrink-0 lg:flex-1 border-b data-[state=active]:border-b-4 data-[state=active]:text-primary-700 data-[state=active]:border-primary-700 data-[state=active]:bg-transparent px-8"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.title.toLowerCase()}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default CustomTab