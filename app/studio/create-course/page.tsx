"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const CreateCour = () => {
  const router = useRouter()

  const handleCreateLongCourse = () => {
    router.push("/studio/create-course/long-course/")
  }

  return (
    <div className='min-h-[70vh] flex items-center justify-center gap-10'>
      <div className='bg-white p-20 rounded-lg hover:shadow-lg cursor-pointer hover:shadow-primary-100'>
        <Link href="">
          Create short course
        </Link>
      </div>
      <div className='bg-white p-20 rounded-lg hover:shadow-lg cursor-pointer hover:shadow-primary-100'>
        <div onClick={handleCreateLongCourse}>
          Create long course
        </div>
      </div>
    </div>
  )
}

export default CreateCour