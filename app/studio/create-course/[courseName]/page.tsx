"use client";
import React, { useState } from 'react'
import { generalHelpers } from '@/helpers';
import { useParams } from 'next/navigation';
import { PenBox } from 'lucide-react';
import CustomTab from '@/components/CustomTab';
import Curriculum from '@/components/studio/create-course/curriculum';
import Quiz from '@/components/studio/create-course/quiz';
import Grade from '@/components/studio/create-course/grade';

const CourseName = () => {
  const { courseName } = useParams();
  const fromSlug = generalHelpers.convertFromSlug(Array.isArray(courseName) ? courseName[0] : courseName || '')

  const tabs = [
    {
      id: 1,
      title: "Curriculum",
      content: (<Curriculum />)
    },
    {
      id: 2,
      title: "Quiz",
      content: (<Quiz />)
    },
    {
      id: 3,
      title: "Grade",
      content: (<Grade />)
    },
  ]
  return (
    <div className='w-full py-4'>
      <div className='flex items-center gap-3'>
        <h2 className='font-semibold'>{fromSlug}</h2>
        <PenBox size={20} className='cursor-pointer' />
      </div>

      <div>
        <div className='mt-4 w-full'>
          <CustomTab tabs={tabs} defaultValue="curriculum" />
        </div>
      </div>
    </div>
  )
}

export default CourseName