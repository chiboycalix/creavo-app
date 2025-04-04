"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Plus, Settings } from 'lucide-react'
import { useParams } from 'next/navigation';
import { useListCommunities } from '@/hooks/communities/useListCommunities';
import { useListSpaces } from '@/hooks/communities/useListSpaces';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Space = () => {
  const { data: communityData, isFetching } = useListCommunities();
  const community = communityData?.data?.communities[0]
  const { data } = useListSpaces(community && community?.id);
  const params = useParams();
  const spaceId = params?.spaceId as string;
  const [addMember, setAddMember] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const currentSpace = data?.data?.spaces?.filter((space: any) => Number(space?.id) === Number(spaceId))[0]


  const handleAddMemeber = () => {
    setAddMember(!addMember);
  };

  useEffect(() => {
    if (isOpen) {

    }
  }, [])

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className="w-full">
        <div className="border-b p-4 shadow-md shadow-primary-50 flex justify-between items-center">
          <div>
            <p className="font-semibold text-sm">{currentSpace?.displayName}</p>
            <p className="text-xs">{currentSpace?.description}</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className="bg-gray-100 p-1 rounded-full cursor-pointer"> <Plus /></span>
            <span className="bg-gray-100 p-1 rounded-full cursor-pointer"><Settings className="cursor-pointer" /></span>
          </div>
        </div>

        <div className="p-4 py-10 bg-gray-100 w-[50%] mx-auto mt-20 rounded-md flex items-center flex-col">
          <p>Looks like you&apos;re leading the way</p>
          <p>Start a discussion by creating a new post</p>
          <div className="mt-4 w-6/12 relative">
            <Button className="w-full" onClick={handleAddMemeber}>
              <Plus />
              Add member</Button>
            <AnimatePresence>
              {addMember && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden w-full rounded-md shadow-lg mt-4 border border-gray-100 absolute top-8 left-0 z-[100]"
                >
                  <div className="px-4 py-2 bg-white">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger>
                        <div
                          className="flex items-center gap-2 group hover:bg-primary-600 cursor-pointer px-2 py-1 rounded-sm"
                        >
                          <div className="w-3 h-3 hidden group-hover:inline-block">
                            <Check className="text-primary group-hover:bg-white w-3 h-3" />
                          </div>
                          <span className="group-hover:text-white text-sm inline-block">
                            Add manually
                          </span>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>

                    {/* second link */}
                    <div
                      className="group flex items-center gap-2 hover:bg-primary-600 cursor-pointer px-2 py-1 rounded-sm"
                      onClick={() => { }}
                    >
                      <div className="w-3 h-3 hidden group-hover:inline-block">
                        <Check className="text-primary group-hover:bg-white w-3 h-3" />
                      </div>
                      <span className="group-hover:text-white text-sm inline-block">
                        Link a course
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Space