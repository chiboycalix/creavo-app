"use client"
import SocialPostSkeleton from '@/components/sketetons/SocialPostSkeleton'
import SocialPost from '@/components/Socials/SocialPost'
import { useComments } from '@/context/CommentsContext'
import { generalHelpers } from '@/helpers'
import { useFetchPosts } from '@/hooks/useFetchPosts'
import Image from 'next/image'
import React from 'react'

import { motion, useScroll, useSpring } from 'framer-motion'

const Explore = () => {
  const { data: posts, isPending: isFetcingPosts } = useFetchPosts()
  const { isOpen } = useComments()
  const result = generalHelpers.processPostsData({
    posts: posts?.data.posts,
    likedStatuses: posts?.data.likedStatuses,
    followStatuses: posts?.data.followStatuses
  });

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className='w-full'>
      <motion.div className="progress-bar" style={{ scaleX }} />
      <div className='flex md:flex-row flex-col'>
        <div className='basis-6/12'>
          <div className='mb-0 scroll-container'>
            {isFetcingPosts ? (
              <>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num: number) => {
                  return <SocialPostSkeleton key={num} />
                })}
              </>
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
              result?.map((post: any) =>
                <div key={post.id} className='sm:mb-10 mb-0 h-full scroll-item'>
                  <SocialPost post={post} />
                </div>)
            )}
          </div>
        </div>
        <div className='flex-1'>
          {
            isOpen && <div>
              comments
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Explore