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
  const { setActivePostId } = useComments()
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

  const observerRefs = useRef(new Map())
  const isFetchingNextPageRef = useRef(false)
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const postId = Number((entry.target as HTMLElement).dataset.postId);
        setActivePostId(postId);
      }
    });
  }, [setActivePostId]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.8,
      rootMargin: '-10% 0px'
    });

    const currentRefs = Array.from(observerRefs.current.values());

    currentRefs.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      observer.disconnect();
    };
  }, [handleIntersection, initialPosts]);

  const setPostRef = useCallback((el: HTMLDivElement | null, postId: number) => {
    if (el) {
      observerRefs.current.set(postId, el);
    } else {
      observerRefs.current.delete(postId);
    }
  }, []);

  const scrollToFirstNewPost = useCallback(() => {
    if (firstNewPostRef.current && !isFirstLoad) {
      firstNewPostRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (isFirstLoad) {
      setIsFirstLoad(false)
    }
  }, [isFirstLoad])

  const debouncedFetchNextPage = useCallback(
    debounce(async () => {
      if (hasNextPage && !isFetchingNextPageRef.current) {
        isFetchingNextPageRef.current = true
        currentPageIndexRef.current = (data?.pages.length || 0)
        await fetchNextPage()
        isFetchingNextPageRef.current = false
        scrollToFirstNewPost()
      }
    }, 300),
    [hasNextPage, fetchNextPage, scrollToFirstNewPost, data?.pages.length]
  )

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
    <div className='w-full hide-scrollbar '>
      <motion.div className="progress-bar" />
      <div className='flex md:flex-row flex-col gap-8'>
        <div className='basis-6/12'>
          <div className='mb-0 overflow-y-auto'>
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
                      // Track the first post of the new page
                      const isFirstPostOfNewPage =
                        pageIndex === currentPageIndexRef.current &&
                        postIndex === 0;

                      return (
                        <SocialPost
                          post={post}
                          key={post.id}
                          ref={(el: any) => {
                            setPostRef(el, post.id)
                            if (isFirstPostOfNewPage) {
                              firstNewPostRef.current = el
                            }
                          }}
                        />
                      )
                    })}
                  </React.Fragment>
                )
              })
            )}
            <div ref={ref} style={{ padding: '4px', textAlign: 'center' }}>
              {queryIsFetchingNextPage
                ? <div className='h-1 w-10/12 rounded-lg bg-gray-400 animate-pulse'></div>
                : hasNextPage
                  ? ''
                  : 'No more posts'}
            </div>
          </div>
        </div>
        <div className='flex-1 w-full'>
          <CommentCard />
        </div>
      </div>
    </div>
  )
}

export default SocialFeed