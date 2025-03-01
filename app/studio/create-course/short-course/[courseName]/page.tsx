"use client";
import React from 'react'
import CustomTab from '@/components/CustomTab';
import ProtectedRoute from '@/components/ProtectedRoute';
import Content from '@/components/studio/create-course/short-course/Content';
import Publish from '@/components/studio/create-course/short-course/Publish';
import { generalHelpers } from '@/helpers';
import { useParams } from 'next/navigation';
import { PenBox } from 'lucide-react';

const CourseName = () => {
  const { courseName } = useParams();
  const fromSlug = generalHelpers.convertFromSlug(Array.isArray(courseName) ? courseName[0] : courseName || '')

  const tabs = [
    {
      id: 1,
      title: "Content",
      content: (<Content />)
    },
    {
      id: 2,
      title: "Publish",
      content: (<Publish />)
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
          <h2 className='font-semibold'>{fromSlug}</h2>
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