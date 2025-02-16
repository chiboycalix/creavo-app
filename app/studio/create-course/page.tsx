import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/Input'

const CreateCourse = () => {
  return (
    <Card className='border-none mt-4'>
      <CardHeader className="">
        <CardTitle className="text-base font-semibold">New Course</CardTitle>
      </CardHeader>
      <CardContent className='border-none'>
        <form>
          <Input
            variant='text'
            label="Username"
            maxLength={100} // Add maxLength to enable character count
            placeholder="Enter your username"
          />
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateCourse