"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import SocialPostSkeleton from '@/components/sketetons/SocialPostSkeleton'
import debounce from 'lodash/debounce'
import SocialPost from '@/components/socials/explore/SocialPost'
import CommentCard from './CommentCard'
import { useComments } from '@/context/CommentsContext'
import { useFetchInfinitePosts } from '@/hooks/posts/useFetchInfinitePosts'
import { generalHelpers } from '@/helpers'
import { useInView } from 'react-intersection-observer'
import { X } from 'lucide-react'

const SocialFeed = ({ initialPosts }: any) => {
  const { ref, inView } = useInView({ rootMargin: "400px" })
  const firstNewPostRef = useRef<HTMLDivElement>(null)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isCommentOpen, setIsCommentOpen] = useState(false)
  const currentPageIndexRef = useRef(0)
  const { setActivePostId, activePostId } = useComments()
  const observerRefs = useRef(new Map())
  const containerRef = useRef<HTMLDivElement>(null) as any
  const commentSheetRef = useRef<HTMLDivElement>(null)
  const isFetchingRef = useRef(false)
  const postHeightRef = useRef(0)

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

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle body scroll lock when comment sheet is open
  useEffect(() => {
    if (isMobileView) {
      if (isCommentOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCommentOpen, isMobileView])

  // Handle clicking outside comment sheet to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commentSheetRef.current &&
        !commentSheetRef.current.contains(event.target as Node) &&
        isCommentOpen
      ) {
        setIsCommentOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCommentOpen])

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const postId = Number((entry.target as HTMLElement).dataset.postId)
        setActivePostId(postId)
      }
    })
  }, [setActivePostId])

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.8,
      rootMargin: '-10% 0px'
    })

    observerRefs.current.forEach((ref) => observer.unobserve(ref))
    observerRefs.current.clear()

    document.querySelectorAll('[data-post-id]').forEach((el) => {
      const postId = Number(el.getAttribute('data-post-id'))
      observer.observe(el)
      observerRefs.current.set(postId, el)
    })

    return () => {
      observer.disconnect()
    }
  }, [handleIntersection, data?.pages.length])

  const setPostRef = useCallback((el: HTMLDivElement | null, postId: number) => {
    if (el) {
      observerRefs.current.set(postId, el)
    } else {
      observerRefs.current.delete(postId)
    }
  }, [])

  const scrollToFirstNewPost = useCallback(() => {
    if (firstNewPostRef.current && !isFirstLoad && containerRef.current && postHeightRef.current) {
      const scrollPosition = postHeightRef.current * currentPageIndexRef.current * 10
      containerRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'instant',
      })

      requestAnimationFrame(() => {
        containerRef.current.dispatchEvent(new Event('scroll'))
      })
    }
    if (isFirstLoad) {
      setIsFirstLoad(false)
    }
  }, [isFirstLoad])

  const debouncedFetchNextPage = useCallback(
    debounce(async () => {
      if (hasNextPage && !queryIsFetchingNextPage && !isFetchingRef.current) {
        isFetchingRef.current = true
        currentPageIndexRef.current = (data?.pages.length || 0)
        await fetchNextPage()
        isFetchingRef.current = false
        requestAnimationFrame(() => {
          setTimeout(scrollToFirstNewPost, 150)
        })
      }
    }, 300),
    [hasNextPage, fetchNextPage, queryIsFetchingNextPage, data?.pages.length]
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

  const getPostHeight = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return '100vh'
      return 'calc(100vh - 6rem)'
    }
    return 'calc(100vh - 6rem)'
  }

  const handleCommentClick = () => {
    setIsCommentOpen(true)
  }

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Posts Section */}
        <div className={`${isMobileView ? 'w-full' : 'md:w-8/12 lg:w-6/12'} order-1 md:order-none`}>
          <div
            ref={containerRef}
            className="overflow-y-auto snap-y snap-mandatory no-scrollbar"
            style={{
              height: getPostHeight(),
              overflowY: 'auto',
              scrollSnapType: 'y mandatory',
            }}
          >
            {isFetching && !data ? (
              <div className="grid gap-4">
                {[1, 2, 3, 4].map((num: number) => (
                  <SocialPostSkeleton key={num} />
                ))}
              </div>
            ) : isEmpty ? (
              <div className="items-center justify-center flex text-gray-500 min-h-screen">
                <div className="w-full flex items-center flex-col space-y-3">
                  <Image
                    width={50}
                    height={50}
                    src="/assets/icons/file-error.svg"
                    alt="icon"
                    className="aspect-square w-24 md:w-40"
                  />
                  <div className="text-center">
                    <h3 className="text-base md:text-lg font-semibold pb-px">
                      No posts available
                    </h3>
                    <p className="text-xs pt-px">Refresh or upload post</p>
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
                        postIndex === 0

                      return (
                        <div
                          key={post.id}
                          className="snap-start"
                          style={{ height: getPostHeight() }}
                          data-post-id={post.id}
                        >
                          <SocialPost
                            post={post}
                            onCommentClick={handleCommentClick}
                            ref={(el: any) => {
                              setPostRef(el, post.id)
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
              {queryIsFetchingNextPage ? (
                <div className="h-1 w-10/12 rounded-lg bg-gray-400 animate-pulse mx-auto"></div>
              ) : hasNextPage ? (
                ''
              ) : (
                'No more posts'
              )}
            </div>
          </div>
        </div>

        {/* Desktop Comments Section */}
        <div className={`${isMobileView ? 'hidden' : 'md:flex-1'}`}>
          <CommentCard />
        </div>

        {/* Mobile Comments Bottom Sheet */}
        {isMobileView && (
          <div
            className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isCommentOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
          >
            <div
              ref={commentSheetRef}
              className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl transform transition-transform duration-300 ease-out ${isCommentOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
              style={{ height: '80vh' }}
            >
              {/* Comment Sheet Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">Comments</h3>
                <button
                  onClick={() => setIsCommentOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drag Handle */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full" />

              {/* Comment Content */}
              <div className="h-full overflow-y-auto pb-safe">
                <CommentCard />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SocialFeed