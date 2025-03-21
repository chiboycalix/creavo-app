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
import { Loader } from 'lucide-react'

const SocialFeed = ({ initialPosts }: any) => {
  const { ref, inView } = useInView({ rootMargin: "400px" })
  const firstNewPostRef = useRef<HTMLDivElement>(null)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const currentPageIndexRef = useRef(0)
  const { setActivePostId } = useComments()
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [optionsAnchorRect, setOptionsAnchorRect] = useState<DOMRect | null>(
    null
  );
  const observerRefs = useRef(new Map())
  const socialFeedRef = useRef<HTMLDivElement>(null) as any
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const isFetchingRef = useRef(false)
  const postHeightRef = useRef(0)
  const { showComments } = useComments();
  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: queryIsFetchingNextPage,
  } = useFetchInfinitePosts({
    initialData: {
      pages: [{
        data: initialPosts?.data || { posts: [], likedStatuses: [], followStatuses: [], bookmarkStatuses: [] }
      }],
      pageParams: [1]
    }
  })

  useEffect(() => {
    if (!socialFeedRef.current) return;

    const handleScroll = () => {
      if (!socialFeedRef.current) return;

      const scrollPos = socialFeedRef.current.scrollTop;
      const postHeight = socialFeedRef.current.clientHeight;
      const index = Math.floor(scrollPos / postHeight);

      if (index !== currentPostIndex) {
        setCurrentPostIndex(index);
      }
    };

    socialFeedRef.current.addEventListener('scroll', handleScroll);

    return () => {
      socialFeedRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [currentPostIndex]);

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
    if (firstNewPostRef.current && !isFirstLoad && socialFeedRef.current && postHeightRef.current) {
      const scrollPosition = postHeightRef.current * currentPageIndexRef.current * 10
      socialFeedRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'instant',
      })

      requestAnimationFrame(() => {
        socialFeedRef.current.dispatchEvent(new Event('scroll'))
      })
    }
    if (isFirstLoad) {
      setIsFirstLoad(false)
    }
  }, [isFirstLoad])

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const isEmpty = !data?.pages[0]?.posts?.length
  const height = "calc(100vh - 5rem)"

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        <div className={`w-full`}>
          <div
            ref={socialFeedRef}
            className="overflow-y-auto snap-y snap-mandatory no-scrollbar"
            style={{
              height,
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
                  posts: page?.posts,
                  likedStatuses: page?.likedStatuses,
                  followStatuses: page?.followStatuses,
                  bookmarkStatuses: page?.bookmarkStatuses,
                })
                return (
                  <React.Fragment key={pageIndex}>
                    {result?.map((post: any, postIndex: number) => {
                      const isFirstPostOfNewPage = pageIndex === currentPageIndexRef.current && postIndex === 0

                      return (
                        <div
                          key={post.id}
                          className="snap-start w-full max-w-5xl"
                          style={{ height: height }}
                          data-post-id={post.id}
                        >
                          <SocialPost
                            post={post}
                            socialPostRef={(el: any) => {
                              setPostRef(el, post.id)
                              if (isFirstPostOfNewPage) {
                                firstNewPostRef.current = el
                              }
                            }}
                            setOptionsAnchorRect={setOptionsAnchorRect}
                            setShowOptionsMenu={setShowOptionsMenu}
                          />
                        </div>
                      )
                    })}
                  </React.Fragment>
                )
              })
            )}
            <div ref={ref} className="py-1 text-center w-full flex items-center ml-[30rem] mb-10">
              {queryIsFetchingNextPage ? (
                <div className=''>
                  <Loader />
                </div>
              ) : hasNextPage ? (
                ''
              ) : (
                'No more posts'
              )}
            </div>
          </div>
        </div>

        <div>
          {
            showComments && <CommentCard
              isOpen={showOptionsMenu}
              onClose={() => setShowOptionsMenu(false)}
              anchorRect={optionsAnchorRect}
            />
          }
        </div>
      </div>
    </div>
  )
}

export default SocialFeed