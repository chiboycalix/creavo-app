"use client"
import React, { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import SocialPostSkeleton from '@/components/sketetons/SocialPostSkeleton'
import SocialPost from '@/components/socials/explore/SocialPost'
import CommentCard from './CommentCard'
import { useComments } from '@/context/CommentsContext'
import { motion } from 'framer-motion'

const SocialFeed = ({ posts, result, isFetcingPosts }: any) => {
  const { setActivePostId } = useComments()
  const observerRefs = useRef(new Map());

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
  }, [handleIntersection, posts]);

  const setPostRef = useCallback((el: HTMLDivElement | null, postId: number) => {
    if (el) {
      observerRefs.current.set(postId, el);
    } else {
      observerRefs.current.delete(postId);
    }
  }, []);

  return (
    <div className='w-full'>
      <motion.div className="progress-bar" />
      <div className='flex md:flex-row flex-col gap-8'>
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
              result?.map((post: any) => {
                return (
                  <SocialPost
                    post={post}
                    key={post.id}
                    ref={(el: any) => setPostRef(el, post.id)}
                  />
                )
              })
            )}
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