"use client"
import Image from 'next/image';
import React from 'react'
import CourseDetailsSkeleton from '@/components/sketetons/CourseDetailsSkeleton';
import ShortCourseDetails from '@/components/studio/course-management/ShortCourseDetails';
import LongCourseDetails from '@/components/studio/course-management/LongCourseDetails';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Thumbnail } from '@/public/assets'
import { useParams, useRouter } from 'next/navigation';
import { generalHelpers } from '@/helpers';
import { formatDate } from '@/utils';
import { Button } from '@/components/ui/button';
import { ShareIcon, Trash } from 'lucide-react';
import { useFetchCourseData } from '@/hooks/courses/useFetchCourseData';

const Course = () => {
  const router = useRouter()
  const params = useParams();
  const courseId = params?.courseId ? parseInt(params.courseId as string, 10) : undefined;
  const { data: courseData, isFetching } = useFetchCourseData(courseId as any);

  const courseType = courseData?.data?.course?.category === "STANDARD" ? "long-course" : "short-course";
  const courseSlug = generalHelpers.convertToSlug(courseData?.data?.course?.title || "")

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className='py-4'>
        {
          isFetching ? <CourseDetailsSkeleton /> : <div className='flex items-start justify-between gap-4'>
            <div className='basis-5/12'>
              <Card>
                <CardContent className='py-4 px-4 w-full'>
                  <div>
                    {
                      courseData?.data?.course?.promotionalUrl && <Image
                        src={courseData?.data?.course?.promotionalUrl || Thumbnail}
                        alt="Thumbnail"
                        width={384}
                        height={200}
                        className='rounded-md max-h-72 w-full'
                      />
                    }
                  </div>
                  <div className='mt-2'>
                    <p className='font-semibold'>{generalHelpers.capitalizeWords(courseData?.data?.course?.title)}</p>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm font-semibold text-primary-700 mt-3'>{generalHelpers.getCurrencySymbol(courseData?.data?.course?.currency)}{courseData?.data?.course?.isPaid ? courseData?.data?.course.amount : "Free"}</p>
                      <p className='text-sm font-semibold'>{formatDate(courseData?.data?.course?.createdAt)}</p>
                      {/* <p className='text-sm font-semibold'>{formatDate("2021-03-05T10:02:07.289Z")}</p> */}
                    </div>
                  </div>
                  <hr className='my-4' />
                  <div>
                    <p className='text-sm font-semibold'>Details and Action</p>
                  </div>
                  <div className='flex gap-2 mt-4'>
                    <div className='flex-1'>
                      <Button className='w-full' onClick={() => router.push(`/studio/create-course/${courseType}/${courseSlug}`)}>
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
                  {
                    courseData?.data?.course?.category === "SIMPLE" ?
                      <ShortCourseDetails
                        course={courseData?.data?.course}
                      /> :
                      <LongCourseDetails
                        course={courseData?.data?.course} />
                  }
                </CardContent>
              </Card>
            </div>
          </div>
        }

      </div>
    </ProtectedRoute>
  )
}

export default Course