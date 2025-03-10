"use client";
import React from 'react'
import CustomTab from '@/components/CustomTab';
import ProtectedRoute from '@/components/ProtectedRoute';
import Content from '@/components/studio/course/long-course/Content';
import Quiz from '@/components/studio/course/long-course/quiz';
import Publish from '@/components/studio/course/long-course/Publish';
import { useParams, useSearchParams } from 'next/navigation';
import { PenBox } from 'lucide-react';
import { useFetchCourseData } from '@/hooks/courses/useFetchCourseData';

const CourseName = () => {
  const searchParams = useSearchParams();
  const { courseId } = useParams();
  const id = searchParams.get("edit");
  const { data: courseData } = useFetchCourseData(id || courseId as any);

  const tabs = [
    {
      id: 1,
      title: "Content",
      content: (<Content
        courseId={id ? id : courseId}
      />)
    },
    {
      id: 2,
      title: "Quiz",
      content: (<Quiz
        courseId={id ? id : courseId}
      />)
    },
    {
      id: 3,
      title: "Publish",
      content: (<Publish
        courseId={id ? id : courseId}
      />)
    },
  ]
  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className='w-full py-4'>
        <div className='flex items-center gap-3'>
          <h2 className='font-semibold'>{courseData?.data?.course?.title}</h2>
          <PenBox size={20} className='cursor-pointer' />
        </div>

        <div>
          <div className='mt-4 w-full'>
            <CustomTab tabs={tabs} defaultValue="content" />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default CourseName