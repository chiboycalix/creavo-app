"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCourseDetailsService } from '@/services/course.service';
import { Thumbnail } from '@/public/assets'
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react'
import { generalHelpers } from '@/helpers';
import { formatDate } from '@/utils';
import { Button } from '@/components/ui/button';
import { ShareIcon, Trash } from 'lucide-react';

const Course = () => {
  const params = useParams();
  const courseId = params?.courseId ? parseInt(params.courseId as string, 10) : undefined;
  console.log({ courseId })


  const { data: courseData } = useQuery({
    queryKey: ["detailCourseData"],
    queryFn: async () => {
      if (courseId === undefined) {
        throw new Error("courseId is undefined");
      }
      const courseData = await getCourseDetailsService({
        courseId: courseId,
      });
      return courseData as any;
    },
    enabled: !!courseId,
    placeholderData: keepPreviousData,
  });

  console.log({ courseData })
  return (
    <div>
      <div className='flex items-start justify-between gap-4'>
        <div className='basis-5/12'>
          <Card>

            <CardContent className='py-4 px-4 w-full'>
              <div>
                {
                  courseData?.course?.promotionalUrl ?
                    <Image
                      src={courseData?.course?.promotionalUrl}
                      alt="Thumbnail"
                      width={384}
                      height={160}
                      className='rounded-md max-h-60 w-full'
                    /> :
                    <Image
                      src={Thumbnail}
                      alt="Thumbnail"
                      width={384}
                      height={160}
                      className='rounded-md max-h-44 w-full'
                    />
                }
              </div>
              <div className='mt-2'>
                <p className='font-semibold'>{generalHelpers.capitalizeWords(courseData?.course?.title)}</p>
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-semibold text-primary-700 mt-3'>{generalHelpers.getCurrencySymbol(courseData?.course?.currency)}{courseData?.course?.isPaid ? courseData?.course.amount : "Free"}</p>
                  <p className='text-sm font-semibold'>{formatDate(courseData?.course?.createdAt)}</p>
                </div>
              </div>
              <hr className='my-4' />
              <div>
                <p className='text-sm font-semibold'>Details and Action</p>
              </div>
              <div className='flex gap-2 mt-4'>
                <div className='flex-1'>
                  <Button className='w-full'>
                    Edit course
                  </Button>
                </div>
                <div className='border basis-1/12 flex items-center justify-center rounded-md cursor-pointer'>
                  <ShareIcon size={16} />
                </div>
                <div className='border basis-1/12 flex items-center justify-center rounded-md cursor-pointer'>
                  <Trash size={16} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='flex-1'>
          <Card>
            <CardContent className='py-4 px-4 w-full'>
              hello
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Course