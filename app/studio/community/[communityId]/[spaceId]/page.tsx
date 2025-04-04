"use client"
import React, { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button'
import { Check, Plus, Settings } from 'lucide-react'
import { useParams } from 'next/navigation';
import { useListCommunities } from '@/hooks/communities/useListCommunities';
import { useListSpaces } from '@/hooks/communities/useListSpaces';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/context/AuthContext';
import { TextInput } from '@/components/Input/TextInput';
import { TextareaInput } from '@/components/Input/TextareaInput';

const Space = () => {
  const { data: communityData, isFetching } = useListCommunities();
  const community = communityData?.data?.communities[0]
  const { data } = useListSpaces(community && community?.id);
  const params = useParams();
  const spaceId = params?.spaceId as string;
  const [addMember, setAddMember] = useState(false);
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const { currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(
    currentUser?.id
  );
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);

  const currentSpace = data?.data?.spaces?.filter((space: any) => Number(space?.id) === Number(spaceId))[0]

  const handleAddMember = () => {
    setAddMember(!addMember);
  };

  const handleManualAdd = () => {
    setAddMember(false);
    setIsManualDialogOpen(true);
  };

  const handleLinkCourse = () => {
    setAddMember(false);
    setIsCourseDialogOpen(true);
  };

  const handleInputClick = () => {
    setIsInputDialogOpen(true); // Open dialog when TextInput is clicked
  };


  const defaultAvatar = "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png";


  // Determine the avatar URL to use
  const avatarUrl = profileLoading
    ? defaultAvatar // Show default while loading
    : profileData?.data?.profile?.avatar || defaultAvatar;

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className="w-full h-[87vh] relative">
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

        <div className='max-h-[87vh] flex flex-col justify-between'>
          <div>
            <div className="p-4 py-10 bg-gray-100 w-[50%] mx-auto mt-20 rounded-md flex items-center flex-col">
              <p>Looks like you&apos;re leading the way</p>
              <p>Start a discussion by creating a new post</p>
              <div className="mt-4 w-6/12 relative">
                <Button className="w-full" onClick={handleAddMember}>
                  <Plus />
                  Add member
                </Button>
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
                        <div
                          className="flex items-center gap-2 group hover:bg-primary-600 cursor-pointer px-2 py-1 rounded-sm"
                          onClick={handleManualAdd}
                        >
                          <div className="w-3 h-3 hidden group-hover:inline-block">
                            <Check className="text-primary group-hover:bg-white w-3 h-3" />
                          </div>
                          <span className="group-hover:text-white text-sm inline-block">
                            Add manually
                          </span>
                        </div>

                        <div
                          className="group flex items-center gap-2 hover:bg-primary-600 cursor-pointer px-2 py-1 rounded-sm"
                          onClick={handleLinkCourse}
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

            {/* Manual Add Dialog */}
            <Dialog open={isManualDialogOpen} onOpenChange={setIsManualDialogOpen}>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>
                <form>
                  <div>
                    <TextInput
                      label="Enter user email address"
                      placeholder='johndoe@creveo'
                      value={""}
                      onChange={() => { }}
                    />
                  </div>
                  <div className='w-full mt-4'>
                    <Button className='w-full'>
                      Invite
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Link Course Dialog */}
            <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Link a Course</DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>

          </div>
          <div className='w-full px-8 flex items-center gap-2 absolute bottom-3'>
            <div className='basis-0.5/12 bg-gray-200 p-1 rounded-full'>
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="rounded-full object-cover w-12"
              />
            </div>
            <TextInput
              placeholder='Write a general post'
              value={""}
              className='flex-1'
              isClickable={true}
              onClick={handleInputClick}
            />
          </div>
        </div>

        <Dialog open={isInputDialogOpen} onOpenChange={setIsInputDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Input Selection</DialogTitle>
            </DialogHeader>
            <p>This dialog opened from clicking the TextInput!</p>
          </DialogContent>
        </Dialog>

      </div>
    </ProtectedRoute>
  )
}

export default Space