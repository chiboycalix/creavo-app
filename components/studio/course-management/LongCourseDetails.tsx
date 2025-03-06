"use client"
import React, { useEffect } from 'react'
import Spinner from '@/components/Spinner';
import { fetchCourseDetailsService } from '@/services/module.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlaySquareIcon } from 'lucide-react';
import { generalHelpers } from '@/helpers';
import { PiEmptyBold } from 'react-icons/pi';
import { ChatEmpty } from '@/public/assets';

const LongCourseDetails = ({ course }: any) => {
  const queryClient = useQueryClient();
  const [responses, setResponses] = React.useState<any[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const { mutateAsync: processModule } = useMutation({
    mutationFn: (payload: any) => fetchCourseDetailsService(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courseModulesData", variables.moduleId] });
    },
    onError: (error: any, variables) => {
      toast.error(`Failed to process module ${variables.moduleId}: ${error?.message || "Unknown error"}`);
    },
  });


  const handleProcessModules = React.useCallback(async () => {
    setIsProcessing(true);
    try {
      const results = await Promise.all(
        course?.modules.map((module: any) =>
          processModule({ courseId: module.courseId, moduleId: module.id })
        )
      );
      setResponses(results);
    } catch (error) {
      toast.error("An error occurred while processing modules");
    } finally {
      setIsProcessing(false);
    }
  }, [course?.modules, processModule]);

  useEffect(() => {
    handleProcessModules()
  }, [handleProcessModules])

  if (isProcessing) {
    return <div className='h-[50vh] flex flex-col items-center justify-center'><Spinner /></div>
  }

  if (course?.modules.length === 0) {
    return <div>
      <p>Your course has no modules yet. Edit to add modules</p>
    </div>
  }
  return (
    <>

      {
        responses?.map((response, index) => {
          return <Accordion type="single" collapsible className="w-full" key={index}>
            <AccordionItem value="item-1" className="w-full cursor-pointer rounded-md mb-4 border-none">
              <AccordionTrigger className="px-4 border w-full rounded-sm text-sm">
                <p className="flex items-center gap-2">
                  Module {index + 1}: {generalHelpers.capitalizeWords(response?.module?.title)}
                </p>
              </AccordionTrigger>
              <AccordionContent className="px-4 mt-3 w-full mx-auto">
                {
                  response?.module?.media?.length === 0 ? <div>
                    <p className='text-sm font-semibold'>No Video uploaded for this module</p>
                  </div> : null
                }
                {
                  response?.module?.media?.map((media: any) => {
                    return <div key={media?.id} className='flex gap-2 items-center mb-4'>
                      <div className='border rounded-full bg-gray-200 p-2'><PlaySquareIcon size={14} /></div>
                      <div className='font-bold'>{media?.title}</div>
                    </div>
                  })
                }
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        })
      }

    </>
  )
}

export default LongCourseDetails