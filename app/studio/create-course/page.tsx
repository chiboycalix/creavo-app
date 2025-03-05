"use client"
import ProtectedRoute from '@/components/ProtectedRoute'
import { Longcourse, ShortCourse } from '@/public/assets'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const CreateCour = () => {
  const router = useRouter()

  const handleCreateLongCourse = () => {
    router.push("/studio/create-course/long-course/")
  }

  const handleCreateShortCourse = () => {
    router.push("/studio/create-course/short-course/")
  }

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className='min-h-[70vh] flex flex-col items-center justify-center'>
        <div className='mb-8'>
          <h2 className='font-semibold text-xl text-center mb-2'>Select your course type</h2>
          <p className='text-center text-sm'>Select the course format that best suits your content. </p>
        </div>
        <div className='flex items-center justify-center gap-4 w-9/12'>
          <div
            onClick={handleCreateShortCourse}
            className='bg-white px-4 py-3 rounded-lg hover:shadow-lg cursor-pointer hover:shadow-primary-100 hover:border hover:border-primary-400 basis-6/12'
          >
            <Image
              src={ShortCourse}
              alt={"ShortCourse"}
              className='w-10 h-10'
            />
            <p className='font-semibold mt-4'>Short course</p>
            <p className='mt-4 text-xs leading-5'>A short course is a quick, focused learning program that teaches a specific skill in a short time. It’s ideal for upskilling efficiently without long-term commitment.</p>
          </div>
          <div
            onClick={handleCreateLongCourse}
            className='bg-white px-4 py-3 rounded-lg hover:shadow-lg cursor-pointer hover:shadow-primary-100 hover:border hover:border-primary-400 basis-6/12'
          >
            <Image
              src={Longcourse}
              alt={"Longcourse"}
              className='w-10 h-10'
            />
            <p className='font-semibold mt-4'>Masterclass Series</p>
            <p className='mt-4 text-xs leading-5'>A masterclass series offers in-depth learning over weeks or months, providing comprehensive knowledge, hands-on practice, and certification for career growth.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default CreateCour