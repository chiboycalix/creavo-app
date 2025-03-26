"use client"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const SuccessDialog = ({ closeDialog, courseId }: any) => {
  const router = useRouter();

  const handleViewCourse = () => {
    router.push(`/studio/course-management/${courseId}`)
    closeDialog()
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <img src="/success.svg" alt="image" />
      <h2 className='text-xl font-semibold mb-2'>Your Course is Now Live!</h2>
      <p className='text-center mb-6 text-sm'>Congratulations! Your course has been successfully published and is now available to learners. </p>
      <Button className='w-11/12 mx-auto' onClick={handleViewCourse}>View Course</Button>
    </div>
  )
}

export default SuccessDialog