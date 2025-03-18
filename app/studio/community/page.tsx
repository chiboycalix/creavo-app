import CreateCommunityDialog from '@/components/studio/community/CreateCommunityDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const Community = () => {
  return (
    <div className='h-[70vh] py-4'>
      <h2 className='text-xl font-semibold'>Community</h2>

      <Card className='mt-56 w-[70%] mx-auto border-none'>
        <CardHeader>
          <CardTitle className='text-center flex flex-col items-center justify-center'>
            <img src="/assets/community.svg" alt="" />
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center'>
          <p className='w-[40%] text-center text-lg'>Oops, looks like you don’t have a community yet! </p>

          <div className='flex justify-between items-center gap-4 mt-8 bg-primary-50 p-4 roundex-xl'>
            <div className='basis-8/12'>
              <p className='text-sm'> No worries—now’s your chance to start something amazing! Build your own space, spark great conversations, and connect with like-minded learners. 🚀✨</p>
            </div>
            <div className='flex-1'>
              <CreateCommunityDialog />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Community