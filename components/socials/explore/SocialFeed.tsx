"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import SocialPostSkeleton from '@/components/sketetons/SocialPostSkeleton'
import debounce from 'lodash/debounce'
import SocialPost from '@/components/socials/explore/SocialPost'
import CommentCard from './CommentCard'
import { useComments } from '@/context/CommentsContext'
import { useFetchInfinitePosts } from '@/hooks/useFetchInfinitePosts'
import { generalHelpers } from '@/helpers'
import { useInView } from 'react-intersection-observer'

const SocialFeed = ({ initialPosts }: any) => {
  const { ref, inView } = useInView({ rootMargin: "400px" })
  const firstNewPostRef = useRef<HTMLDivElement>(null)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const currentPageIndexRef = useRef(0)
  const { setActivePostId } = useComments()
  const observerRefs = useRef(new Map())
  const containerRef = useRef<HTMLDivElement>(null) as any
  const isFetchingRef = useRef(false);
  const postHeightRef = useRef(0);

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

    observerRefs.current.forEach((ref) => observer.unobserve(ref));

    observerRefs.current.clear();
    document.querySelectorAll('[data-post-id]').forEach((el) => {
      const postId = Number(el.getAttribute('data-post-id'));
      observer.observe(el);
      observerRefs.current.set(postId, el);
    });

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, data?.pages.length]);

  const setPostRef = useCallback((el: HTMLDivElement | null, postId: number) => {
    if (el) {
      observerRefs.current.set(postId, el);
    } else {
      observerRefs.current.delete(postId);
    }
  }, []);

  const scrollToFirstNewPost = useCallback(() => {
    if (firstNewPostRef.current && !isFirstLoad && containerRef.current && postHeightRef.current) {
      const scrollPosition = postHeightRef.current * currentPageIndexRef.current * 10;
      containerRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'instant',
      });

      requestAnimationFrame(() => {
        containerRef.current.dispatchEvent(new Event('scroll'));
      });
    }
    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);


  const debouncedFetchNextPage = useCallback(
    debounce(async () => {
      if (hasNextPage && !queryIsFetchingNextPage && !isFetchingRef.current) {
        isFetchingRef.current = true;
        currentPageIndexRef.current = (data?.pages.length || 0)
        await fetchNextPage()
        isFetchingRef.current = false;
        requestAnimationFrame(() => {
          setTimeout(scrollToFirstNewPost, 150);
        });
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

  return (
    <div className='w-full min-h-screen'>
      <div className='flex md:flex-row flex-co gap-6'>
        <div className='basis-6/12 no-scrollbar'>
          <div
            ref={containerRef}
            className='overflow-y-auto snap-y snap-mandatory no-scrollbar'
            style={{
              height: 'calc(100vh - 6rem)',
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
                        postIndex === 0

                      return (
                        <div
                          key={post.id}
                          className="snap-start"
                          style={{ height: 'calc(100vh - 6rem)' }}
                          data-post-id={post.id}
                        >
                          <SocialPost
                            post={post}
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