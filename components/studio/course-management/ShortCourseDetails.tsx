import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Play, PlaySquareIcon, Trash } from 'lucide-react';
import { generalHelpers } from '@/helpers';

const ShortCourseDetails = ({ course }: any) => {

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="w-full cursor-pointer rounded-md mb-4 border-none">
        <AccordionTrigger className="px-4 border w-full rounded-sm text-sm">
          <p className="flex items-center gap-2">
            {generalHelpers.capitalizeWords(course?.title)}
          </p>
        </AccordionTrigger>
        <AccordionContent className="px-4 mt-3 w-full mx-auto">
          {
            course?.media?.map((media: any) => {
              return <div key={media?.id} className='flex gap-2 items-center mb-4'>
                <div className='border rounded-full bg-gray-200 p-2'><PlaySquareIcon size={14} /></div>
                <div className='font-bold'>{media?.title}</div>
              </div>
            })
          }
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default ShortCourseDetails