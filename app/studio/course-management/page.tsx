"use client"
import Playlist from '@/components/studio/course-management/Playlist';
import { useAuth } from '@/context/AuthContext';
import { useFetchCourses } from '@/hooks/courses/useFetchCourses';
import React from 'react'

const ModuleManagement = () => {
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const { data: courses, isFetching } = useFetchCourses(currentUser?.id);

  return (
    <div className='grid grid-cols-4 gap-4 mt-4'>
      {
        courses?.data?.courses?.map((course: any, index: number) => {
          return <Playlist key={index} value={34} course={course} />
        })
      }
    </div>
  )
}

export default ModuleManagement