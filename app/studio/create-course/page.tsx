"use client"
import React, { FormEvent, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/Input'
import { Switch } from '@/components/ui/switch'
import { UploadInput } from '@/components/Input/UploadInput'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { generalHelpers } from '@/helpers'
import { CreateCourseForm, createCourseService } from '@/services/course.service'
import { useMutation } from '@tanstack/react-query'

const CreateCourse = () => {
  const [course, setCourse] = useState("")
  const [description, setDescription] = useState("")
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter()

  const { mutate: handleAddModule, isPending: isAddingModule } = useMutation({
    mutationFn: (payload: CreateCourseForm) => createCourseService(payload),
    onSuccess: async (data) => { },
    onError: (error: any) => { },
  });


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const slugTitle = generalHelpers?.convertToSlug(course)
    router.push(`/studio/create-course/${slugTitle}`)
  }

  return (
    <Card className='border-none mt-4 max-w-5xl mx-auto'>
      <CardHeader className="">
        <CardTitle className="text-base font-semibold">New Course</CardTitle>
      </CardHeader>
      <CardContent className='border-none'>
        <form onSubmit={handleSubmit}>
          <div className='mb-8'>
            <Input
              variant="text"
              label="Course Name"
              maxLength={54}
              placeholder="Enter course title"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
            <p className='text-sm mt-1'>You can always change this later</p>
          </div>

          <div className='mb-8'>
            <Input
              variant="textarea"
              label="Course Description"
              maxLength={365}
              placeholder="Enter your course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
            />
          </div>
          <div className='mb-4 flex items-center gap-4'>
            <div className='basis-1/2'>
              <Input
                label="Difficulty level"
                variant='select'
                placeholder='Select course difficulty'
                options={[
                  {
                    value: "Easy",
                    label: "Easy"
                  }
                ]}
              />
            </div>
            <div className='flex-1'>
              <Input
                label="Category"
                variant='select'
                placeholder='Select course category'
                options={[
                  {
                    value: "Easy",
                    label: "Easy"
                  }
                ]}
              />
            </div>
          </div>
          <div className='flex gap-2 items-center mb-8'>
            <Switch />
            <p>Add payment</p>
          </div>

          <div>
            <UploadInput
              label="Promotional video/images"
              accept="video/*,image/*"
              maxFiles={50}
              errorMessage={files.length > 50 ? "You can only upload up to 50 files." : undefined}
            // nextPath=''
            />
          </div>
          <div className='w-full mt-12'>
            <Button
              type="submit"
              disabled={!course}
              className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateCourse