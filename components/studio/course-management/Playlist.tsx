import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'
import { generalHelpers } from '@/helpers'
import { Thumbnail } from '@/public/assets'

const Playlist = ({ course }: { value: number, course: any }) => {

  return (
    <div className='w-64 relative'>
      <div
        className={`absolute top-2 text-sm left-2 text-white px-2 py-1 rounded-bl-md rounded-tr-md ${course?.difficultyLevel === "beginner"
          ? "bg-green-600"
          : course?.difficultyLevel === "intermediate"
            ? "bg-yellow-600"
            : course?.difficultyLevel === "hard"
              ? "bg-red-600"
              : "bg-gray-600"
          }`}
      >
        {generalHelpers.capitalizeWords(course?.difficultyLevel)}
      </div>
      {
        course?.promotionalUrl ? <Image src={course?.promotionalUrl} alt="Thumbnail" width={384} height={160} className='rounded-md max-h-44' /> :
          <Image src={Thumbnail} alt="Thumbnail" width={384} height={160} className='rounded-md max-h-44' />
      }
      <div className='mt-2'>
        <h2 className='text-sm'>{generalHelpers.capitalizeWords(course?.title)}</h2>
      </div>
      <div className='flex items-center justify-between mt-2'>
        <p className='text-sm'>12 subscribers</p>
        <p className='text-sm text-primary-700'>{generalHelpers.getCurrencySymbol(course?.currency)}{course?.isPaid ? course.amount : "Free"}</p>
      </div>
      <div className='flex items-start justify-between mt-3'>
        <Link href={`/studio/course-management/${course?.id}`} className='text-sm underline cursor-pointer'>
          View course
        </Link>
        {
          !course?.isPublished && <Button className='py' variant={"secondary"} size={"sm"}>Draft</Button>
        }
      </div>

    </div>
  )
}

export default Playlist