"use client"
import React, { FormEvent, useState } from 'react'
import ButtonLoader from '@/components/ButtonLoader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/Input'
import { Switch } from '@headlessui/react';
import { UploadInput } from '@/components/Input/UploadInput'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { COURSE_CATEGORY, CreateCourseForm, createCourseService } from '@/services/course.service'
import { useMutation } from '@tanstack/react-query'
import { useAppDispatch, useAppSelector } from '@/hooks/useStore.hook';
import { resetCreateLongCourseForm, updatCreateLongCourseForm } from '@/redux/slices/course.slice';
import { useCreateCourseFormValidator } from '@/helpers/validators/useCreateCourse.validator';
import { useToast } from "@/context/ToastContext";
import { TagsInput } from '@/components/Input/TagsInput';
import { Checkbox } from '@/components/ui/check-box';

const currencies = [
  {
    label: 'USD',
    value: 'USD',
  },
  {
    label: 'EUR',
    value: 'EUR',
  },
  {
    label: 'GBP',
    value: 'GBP',
  },
  {
    label: 'JPY',
    value: 'JPY',
  },
  {
    label: 'CAD',
    value: 'CAD',
  },
  {
    label: 'AUD',
    value: 'AUD',
  },
  {
    label: 'CHF',
    value: 'CHF',
  },
  {
    label: 'CNY',
    value: 'CNY',
  },
  {
    label: 'SEK',
    value: 'SEK',
  },
  {
    label: 'NZD',
    value: 'NZD',
  },
  {
    label: 'NGN',
    value: 'NGN',
  },
];

const CreateLongCourse = () => {
  const router = useRouter()
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { createLongCourseForm: createCourseStateValues } = useAppSelector((store) => store.courseStore);
  const { validate, errors, validateField } = useCreateCourseFormValidator({ store: createCourseStateValues });
  const updateCreateCourse = (payload: Partial<CreateCourseForm>) => dispatch(updatCreateLongCourseForm(payload));
  const maxFiles = 1;
  const [isSelected, setIsSelected] = useState(false)

  const { mutate: handleCreateCourse, isPending: isCreatingCourse } = useMutation({
    mutationFn: (payload: CreateCourseForm) => createCourseService(payload, COURSE_CATEGORY.STANDARD),
    onSuccess: async (data) => {
      showToast('success', 'Success', "Course created successfully");
      router.push(`/studio/course/long-course/${data?.id}?tab=content`)
      dispatch(resetCreateLongCourseForm())
    },
    onError: (error: any) => {
      showToast('error', 'Failed to create course', error.data[0]);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    validate(() => handleCreateCourse({
      title: createCourseStateValues.title,
      description: createCourseStateValues.description,
      difficultyLevel: createCourseStateValues.difficultyLevel,
      tags: createCourseStateValues.tags,
      amount: createCourseStateValues.amount,
      isPaid: createCourseStateValues.isPaid,
      currency: createCourseStateValues.currency,
      promotionalUrl: createCourseStateValues?.promotionalUrl,
      promote: isSelected
    }))
  }

  return (
    <Card className='border-none mt-4 max-w-xl mx-auto'>
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
              value={createCourseStateValues?.title}
              onChange={(e) => {
                validateField("title", e.target.value)
                updateCreateCourse({ title: e.target.value });
              }}
              errorMessage={errors.title}
            />
            <p className='text-xs mt-1'>You can always change this later</p>
          </div>

          <div className='mb-8'>
            <Input
              variant="textarea"
              label="Course Description"
              maxLength={365}
              placeholder="Enter your course description"
              value={createCourseStateValues?.description}
              onChange={(e) => {
                validateField("description", e.target.value)
                updateCreateCourse({ description: e.target.value });
              }}
              errorMessage={errors.description}
              rows={5}
            />
          </div>
          <div className='mb-4'>
            <TagsInput
              label="Tags"
              value={createCourseStateValues?.tags}
              onChange={(newTags: any) => {
                validateField("tags", newTags)
                updateCreateCourse({ tags: newTags });
              }}
              placeholder="#fun #tiktok #post"
              errorMessage={errors.tags}
              className="w-full py-2.5"
            />
          </div>
          <div className='mb-4 flex items-center gap-4'>
            <div className='w-full'>
              <Input
                label="Difficulty level"
                variant='select'
                value={createCourseStateValues?.difficultyLevel?.toString()}
                onSelect={(value) => {
                  validateField("difficultyLevel", value.toString())
                  updateCreateCourse({ difficultyLevel: value?.toString() });
                }}
                placeholder='Select course difficulty'
                options={[
                  {
                    value: "beginner",
                    label: "Beginner"
                  },
                  {
                    value: "intermediate",
                    label: "Intermediate"
                  },
                  {
                    value: "hard",
                    label: "Hard"
                  }
                ]}
                errorMessage={errors.difficultyLevel}
              />
            </div>
          </div>
          <div className='flex gap-2 items-center mb-8'>
            <Switch
              checked={createCourseStateValues?.isPaid}
              onChange={(checked) => {
                updateCreateCourse({ isPaid: checked });
              }}
              className={`${createCourseStateValues?.isPaid ? 'bg-primary-600' : 'bg-gray-200'} relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none`}
            >
              <span
                className={`${createCourseStateValues?.isPaid ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <p>Add payment</p>
          </div>
          {
            createCourseStateValues?.isPaid && <div className='flex items-center justify-between gap-4 mb-8'>
              <div className='basis-1/2'>
                <Input
                  label="Currency"
                  variant='select'
                  placeholder='Select currency'
                  options={currencies}
                  value={createCourseStateValues?.currency}
                  className='w-full'
                  onSelect={(value) => {
                    validateField("currency", value?.toString())
                    updateCreateCourse({ currency: value?.toString() });
                  }}
                  errorMessage={errors.currency}
                />
              </div>

              <div className='flex-1'>
                <Input
                  label="Amount"
                  placeholder='Enter amount'
                  className='w-full'
                  value={createCourseStateValues?.amount?.toString()}
                  type='number'
                  onChange={(e) => {
                    validateField("amount", e.target.value)
                    updateCreateCourse({ amount: e.target.value });
                  }}
                  errorMessage={errors.amount}
                />
              </div>
            </div>
          }

          <div>
            <UploadInput
              label="Promotional video/images"
              accept="video/*,image/*"
              maxFiles={maxFiles}
              onChange={(uploads: any) => {
                updateCreateCourse({ promotionalUrl: uploads[0] })
              }}
              className='py-10'
            />
          </div>

          <div className='flex flex-col gap-3 mt-4'>

            <Checkbox
              checked={isSelected}
              onCheckedChange={(isChecked: boolean) => setIsSelected(isChecked)}
              label="Upload promotional video/images to Explore"
              className=""
            />
            <Checkbox label="List to marketplace" className="" />
          </div>

          <div className='w-full mt-12'>
            <Button
              disabled={isCreatingCourse}
              className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
            >
              <ButtonLoader
                isLoading={isCreatingCourse}
                caption="Continue"
              />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateLongCourse