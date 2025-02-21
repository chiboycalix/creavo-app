"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import SocialPostSkeleton from '@/components/sketetons/SocialPostSkeleton'
import debounce from 'lodash/debounce'
import SocialPost from '@/components/socials/explore/SocialPost'
import CommentCard from './CommentCard'
import { useComments } from '@/context/CommentsContext'
import { motion } from 'framer-motion'
import { useFetchInfinitePosts } from '@/hooks/useFetchInfinitePosts'
import { generalHelpers } from '@/helpers'
import { useInView } from 'react-intersection-observer'

const SocialFeed = ({ initialPosts }: any) => {
  const { ref, inView } = useInView({ rootMargin: "400px" })
  const firstNewPostRef = useRef<HTMLDivElement>(null)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const currentPageIndexRef = useRef(0)

  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: queryIsFetchingNextPage,
  } = useFetchInfinitePosts({
    initialData: {
      pages: [{
        data: initialPosts?.data || { posts: [], likedStatuses: [], followStatuses: [] }
      }],
      pageParams: [1]
    }
  })

  const debouncedFetchNextPage = useCallback(
    debounce(async () => {
      if (hasNextPage && !queryIsFetchingNextPage) {
        currentPageIndexRef.current = (data?.pages.length || 0)
        await fetchNextPage()
        scrollToFirstNewPost()
      }
    }, 300),
    [hasNextPage, fetchNextPage, queryIsFetchingNextPage, data?.pages.length]
  )

  const scrollToFirstNewPost = useCallback(() => {
    if (firstNewPostRef.current && !isFirstLoad) {
      firstNewPostRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    if (isFirstLoad) {
      setIsFirstLoad(false)
    }
  }, [isFirstLoad])

  useEffect(() => {
    if (inView) {
      debouncedFetchNextPage()
    }
    return () => {
      debouncedFetchNextPage.cancel()
    }
  }, [inView, debouncedFetchNextPage])

  const isEmpty = !data?.pages[0]?.data?.posts?.length

  return (
    <div className='w-full min-h-screen'>
      <div className='flex md:flex-row flex-col'>
        <div className='basis-6/12'>
          <div
            className='overflow-y-auto snap-y snap-mandatory'
            style={{
              height: 'calc(100vh - 0rem)',
              overflowY: 'auto',
              scrollSnapType: 'y mandatory',
            }}
          >
            {isFetching && !data ? (
              <>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num: number) => (
                  <SocialPostSkeleton key={num} />
                ))}
              </>
            ) : isEmpty ? (
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
              data?.pages.map((page, pageIndex) => {
                const result = generalHelpers.processPostsData({
                  posts: page?.data.posts,
                  likedStatuses: page?.data.likedStatuses,
                  followStatuses: page?.data?.followStatuses,
                })

                return (
                  <React.Fragment key={pageIndex}>
                    {result?.map((post: any, postIndex: number) => {
                      const isFirstPostOfNewPage =
                        pageIndex === currentPageIndexRef.current &&
                        postIndex === 0;

                      return (
                        <div
                          key={post.id}
                          className="snap-start"
                          style={{ height: 'calc(100vh - 6rem)' }}
                        >
                          <SocialPost
                            post={post}
                            ref={(el: any) => {
                              if (isFirstPostOfNewPage) {
                                firstNewPostRef.current = el
                              }
                            }}
                          />
                        </div>
                      )
                    })}
                  </React.Fragment>
                )
              })
            )}
            <div ref={ref} className="py-1 text-center">
              {queryIsFetchingNextPage
                ? <div className='h-1 w-10/12 rounded-lg bg-gray-400 animate-pulse mx-auto'></div>
                : hasNextPage
                  ? ''
                  : 'No more posts'}
            </div>
          </div>
        </div>
        <div className='flex-1'>
          <CommentCard />
        </div>
      </div>
    </div>
  )
}

export default SocialFeed