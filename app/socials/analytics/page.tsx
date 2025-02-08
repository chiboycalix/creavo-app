"use client"
import SocialPostSkeleton from '@/components/sketetons/SocialPostSkeleton'
import SocialPost from '@/components/SocialPost'
import { useFetchPosts } from '@/queries/usePost'
import Image from 'next/image'
import React from 'react'

const Analytics = () => {
  const { data: posts, isPending: isFetcingPosts } = useFetchPosts()

  return (
    <div className='w-full'>
      <div className='flex md:flex-row flex-col'>
        <div className='basis-1/2'>
          <div className='mb-0'>
            {isFetcingPosts ? (
              <SocialPostSkeleton />
            ) : posts?.data.posts.length === 0 ? (
              <div className="items-center justify-center flex text-gray-500 min-h-screen">
                <div className="w-full flex items-center flex-col space-y-3">
                  <Image
                    width={50}
                    height={50}
                    src={'/assets/icons/file-error.svg'}
                    alt="icon"
                    className="aspect-square w-40"
                  />
                  <div>
                    <h3 className="text-lg font-semibold pb-px">
                      No posts available
                    </h3>
                    <p className="text-xs pt-px">{'Refresh or upload post'}</p>
                  </div>
                </div>
              </div>
            ) : (
              posts?.data.posts?.map((post: any) =>
                <div key={post.id} className='mb-20'><SocialPost post={post} /></div>)
            )}
          </div>
        </div>
        <div className='flex-1'>hello</div>
      </div>
    </div>
  )
}

export default Analytics