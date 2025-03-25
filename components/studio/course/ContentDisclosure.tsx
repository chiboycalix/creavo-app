/* eslint-disable react-hooks/exhaustive-deps */
import { publishCourseService } from '@/services/course.service';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { toast } from 'sonner';

const ContentDisclosure = ({ setButtonProps, goNext, closeDialog, courseId }: any) => {
  const contentDisclosure = [
    'Makes a real person appear to say or do something they didn’t actually say or.',
    'Modifies real footage of an event, place or person.',
    'Creates a realistic-looking scene that never actually happened.'
  ]

  const { mutate: handlePublishCourse, isPending: isPublishingModule } = useMutation({
    mutationFn: (payload: any) => publishCourseService(payload),
    onSuccess: (data) => {
      goNext();
      toast.success("Course published successfully");
    },
    onError: (error: any) => {
      toast.error(error?.data?.[0] || "Failed to publish course");
    },
  });

  useEffect(() => {
    setButtonProps([
      {
        caption: "No",
        onClick: () => closeDialog(),
        variant: "outline",
      },
      {
        caption: "Yes",
        onClick: async () => {
          await handlePublishCourse({ courseId })
        },
        props: { disabled: isPublishingModule, loading: isPublishingModule },
      },
    ]);
  }, [isPublishingModule]);

  return (
    <div>
      <p className='text-xs'>Does your content involve any of the following:</p>
      <ul className='pl-5 mt-4'>
        {
          contentDisclosure.map((item, index) => (
            <li key={index} className='text-xs list-disc py-1'>{item}</li>
          ))
        }
      </ul>
      <p className='text-xs mt-4 leading-5'>If yes, please disclose this to ensure transparency. At Crevoe, we value authenticity and responsible content creation.</p>
      <p className='text-xs mt-4 leading-5'>(Selecting “Yes” will add a disclosure to your content.).</p>
    </div>
  )
}

export default ContentDisclosure