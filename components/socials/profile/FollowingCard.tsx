"use client"
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SearchInput } from '@/components/Input/SearchInput';
import { useInView } from 'react-intersection-observer';
import { useFetchFollowing } from '@/hooks/profile/useFetchFollowing';

type FollowersProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
  userId: string;
};

interface Follower {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  username: string;
  email: string;
  firstname: string;
  lastName: string;
  avatar: string;
}

const FollowingCard = ({ isOpen, onClose, anchorRect, userId }: FollowersProps) => {

  const menuPosition = {
    top: 90,
    right: 20,
  };
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useFetchFollowing(userId);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  if (!anchorRect) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              top: menuPosition.top,
              right: menuPosition.right,
              transformOrigin: 'bottom right'
            }}
            className="z-50 w-96 bg-white rounded-lg shadow-lg h-[87vh] p-3"
          >
            <div className='flex justify-between items-center'>
              <p className='font-semibold'>Following</p>
              <X size={18} onClick={onClose} className='cursor-pointer' />
            </div>
            <div className='mt-4'>
              <SearchInput placeholder='Search' className='rounded-lg' />
            </div>
            <div className='mt-4'>
              {data?.pages.map((page, i) => (
                <div key={i}>
                  {page.followers.map((follower: Follower) => (
                    <div key={follower.id} className='flex items-center gap-2'>
                      <img
                        src={follower.avatar}
                        alt={`${follower.username}'s avatar`}
                        style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                      />
                      <div className='flex flex-col'>
                        <span className='text-sm inline-block'>
                          {follower.firstname} {follower.lastName}
                        </span>
                        <span className='text-xs inline-block'>
                          @{follower.username}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div ref={ref} className='p-8 text-center text-sm'>
              {isFetchingNextPage ? (
                'Loading more...'
              ) : hasNextPage ? (
                'Load More'
              ) : (
                'No more following'
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FollowingCard