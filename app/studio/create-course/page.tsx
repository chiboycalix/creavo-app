import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const CreateCourse = () => {
  return (
    <Card className='border-none mt-4'>
      <CardHeader className="">
      <CardTitle className="text-base font-semibold">New Course</CardTitle>
    </CardHeader>
    </Card>
  )
}

export default CreateCourse