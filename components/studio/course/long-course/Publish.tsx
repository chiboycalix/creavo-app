
import React, { useState } from 'react'
import ButtonLoader from '@/components/ButtonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { fetchSingleCourseService, publishCourseService } from '@/services/course.service';

const Publish = ({ courseId }: { courseId: any }) => {
  const [courseValue, setCourseValue] = useState("draft")

  const { mutate: handlePublishCourse, isPending: isPublishingModule } = useMutation({
    mutationFn: (payload: any) => publishCourseService(payload),
    onSuccess: (data) => {
      toast.success("Course published successfully");
    },
    onError: (error: any) => {
      toast.error(error?.data?.[0] || "Failed to publish course");
    },
  });

  const { data: courseData, isFetching } = useQuery<any>({
    queryKey: ["courseData", courseId],
    queryFn: async () => {
      const data = await fetchSingleCourseService({
        courseId: courseId
      });
      return data;
    },
    enabled: !!courseId,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });


  const handleSubmit = () => {
    handlePublishCourse({
      courseId
    })
  }

  const isPublished = courseData?.course?.isPublished

  return (
    <Card className='max-w-3xl mt-20 mx-auto border-none shadow-md'>
      <CardHeader>
        <CardTitle className='text-base font-semibold'>
          {
            isFetching ? <div className='h-2 w-1/2 bg-gray-200 rounded-sm animate-pulse'></div> : <> Course publish status ({isPublished ? <span className='text-primary-700 font-bold text-sm'>Published</span> : <span className='text-red-600 font-bold text-sm'>Not Published</span>})</>
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <RadioGroup defaultValue="draft" onValueChange={(value) => setCourseValue(value)}>
            <div className="flex flex-col items-start space-x-2 mb-4">
              <div className='flex items-center gap-2'>
                <RadioGroupItem value="draft" id="r1" className='basis-[1%]' />
                <Label htmlFor="r1" className='flex-1'>Draft</Label>
              </div>
              <div className='flex items-center gap-2 mt-2'>
                <div className='basis-[1%]'></div>
                <p className='text-sm flex-1 leading-6'>Students cannot purchase or enroll in this course. For students that are already enrolled, this course will not appear on their Student Dashboard.</p>
              </div>
            </div>
            <div className="flex flex-col items-start space-x-2">
              <div className='flex items-center gap-2'>
                <RadioGroupItem value="publish" id="r1" className='basis-[1%]' />
                <Label htmlFor="r1" className='flex-1'>Publish</Label>
              </div>
              <div className='flex items-center gap-2 mt-2'>
                <div className='basis-[1%]'></div>
                <p className='text-sm flex-1 leading-6'>Students can purchase, enroll in, and access the content of this course. For students that are enrolled, this course will appear on their Student Dashboard.</p>
              </div>
            </div>
          </RadioGroup>
        </div>
        <div className='w-full mt-12'>
          <Button
            onClick={handleSubmit}
            className='w-4/12' disabled={isPublishingModule || courseValue === "draft" || isPublished}>
            <ButtonLoader
              isLoading={isPublishingModule}
              caption='Save'
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Publish