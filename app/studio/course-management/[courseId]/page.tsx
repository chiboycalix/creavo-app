"use client"
import Image from 'next/image';
import React from 'react'
import CourseDetailsSkeleton from '@/components/sketetons/CourseDetailsSkeleton';
import ShortCourseDetails from '@/components/studio/course-management/ShortCourseDetails';
import LongCourseDetails from '@/components/studio/course-management/LongCourseDetails';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Card, CardContent } from '@/components/ui/card';
import { Thumbnail } from '@/public/assets'
import { useParams, useRouter } from 'next/navigation';
import { generalHelpers } from '@/helpers';
import { formatDate } from '@/utils';
import { Button } from '@/components/ui/button';
import { Loader2, ShareIcon, Trash, TriangleAlertIcon } from 'lucide-react';
import { useFetchCourseData } from '@/hooks/courses/useFetchCourseData';
import { useMutation } from '@tanstack/react-query';
import { deleteCourseService } from '@/services/course.service';
import { toast } from 'sonner';

const Course = () => {
  const router = useRouter()
  const params = useParams();
  const courseId = params?.courseId ? parseInt(params.courseId as string, 10) : undefined;
  const { data: courseData, isFetching } = useFetchCourseData(courseId as any);

  const courseType = courseData?.data?.course?.category === "STANDARD" ? "long-course" : "short-course";
  const courseSlug = generalHelpers.convertToSlug(courseData?.data?.course?.title || "")

  const { mutate: handleCourseDelete, isPending: isDeletingCourse } = useMutation({
    mutationFn: (payload: { courseId: string }) => deleteCourseService(payload),
    onSuccess: async (data) => {
      toast.success("Course deleted successfully")
      router.push("/studio/course-management")
    },
    onError: (error: any) => {
      toast.error("Error creating post")
    },
  });

  const handleDeleteCourse = async () => {
    handleCourseDelete({ courseId: courseId?.toString() || '' })
  }

  const handleEdit = () => {
    const queryParams = new URLSearchParams({
      "edit": JSON.stringify(courseId),
    }).toString();
    router.push(`/studio/course/${courseType}/${courseSlug}?${queryParams}`)
  }

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
                    </div>
                  </div>
                  <hr className='my-4' />
                  <div>
                    <p className='text-sm font-semibold'>Details and Action</p>
                  </div>
                  <div className='flex gap-2 mt-4'>
                    <div className='flex-1'>
                      <Button className='w-full' onClick={() => handleEdit()}>
                        Edit course
                      </Button>
                    </div>
                    <div className='border basis-1/12 flex items-center justify-center rounded-md cursor-pointer'>
                      <ShareIcon size={16} />
                    </div>
                    <div className='border basis-1/12 flex items-center justify-center rounded-md cursor-pointer'>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Trash size={16} />
                        </AlertDialogTrigger>
                        <AlertDialogContent className='flex flex-col items-center justify-center'>
                          <AlertDialogHeader className='w-full inline-flex flex-col items-center justify-center'>
                            <AlertDialogTitle className='flex items-center justify-center text-center'>
                              <TriangleAlertIcon className='text-red-500' size={40} />
                            </AlertDialogTitle>
                            <AlertDialogDescription className='font-semibold text-center'>
                              Are you sure you want to delete this course?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteCourse}
                              className='bg-red-600 text-white' disabled={isDeletingCourse}>
                              {
                                isDeletingCourse ? <Loader2 className='text-white animate-spin' /> : "Delete"
                              }
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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