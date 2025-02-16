import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BsFillCollectionPlayFill } from "react-icons/bs";

const RecentCourses = () => {
  return (
    <Card className='w-full border-none'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className="text-base font-normal">Recent Courses</CardTitle>
          <p className="text-sm text-gray-500">
           See all
          </p>
        </CardHeader>
        <CardContent className="h-[275px]">
         <div className='flex flex-col items-center justify-center mt-10'>
          <BsFillCollectionPlayFill size={80} color='#8B98B1'/>
          <h2 className='text-center font-semibold text-md'>No course yet!</h2>
          <p className='text-center text-sm'>Currently, you do not have any course uploaded </p>
         </div>
        </CardContent>
      </Card>
  )
}

export default RecentCourses