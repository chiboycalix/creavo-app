"use client"
import React, { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute';
import UserAvatarStack from '@/components/studio/community/UserAvatarStack';
import ButtonLoader from '@/components/ButtonLoader';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button'
import { Check, Loader2, Plus, Settings } from 'lucide-react'
import { useParams } from 'next/navigation';
import { useListCommunities } from '@/hooks/communities/useListCommunities';
import { useListSpaces } from '@/hooks/communities/useListSpaces';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/context/AuthContext';
import { TextInput } from '@/components/Input/TextInput';
import { UserBadge } from '@/components/meeting/InvitePeople/UserBadge';
import { useFetchUserByUsername } from '@/hooks/profile/useFetchUserByUsername';
import { SearchInput } from '@/components/Input/SearchInput';
import { useMutation } from '@tanstack/react-query';
import { addMembersManuallyToSpaceService, AddMemberToSpacePayload } from '@/services/community.service';
import { toast } from 'sonner';
import { useListSpaceMembers } from '@/hooks/communities/useListSpaceMembers';
import UserAvatarStackSkeleton from '@/components/sketetons/UserAvatarStackSkeleton';

const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "UX Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Soap Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  },
  {
    id: 6,
    name: "Dora",
    designation: "The Explorer",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
  },
];

const Space = () => {
  const { data: communityData, isFetching } = useListCommunities();
  const community = communityData?.data?.communities[0];
  const { data } = useListSpaces(community && community?.id);
  const params = useParams();
  const spaceId = params?.spaceId as string;
  const [addMember, setAddMember] = useState(false);
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<any[]>([]);
  const { currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser?.id);
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);

  const currentSpace = data?.data?.spaces?.filter((space: any) => Number(space?.id) === Number(spaceId))[0];

  const { data: userData, isFetching: userDataLoading } = useFetchUserByUsername(userEmail || undefined);
  const { data: spaceMembers, isFetching: isFetchingSpaceMembers } = useListSpaceMembers(community && community?.id, currentSpace?.id);

  const { mutate: handleAddMemberManually, isPending: isAddingMemberMannually } = useMutation({
    mutationFn: (payload: AddMemberToSpacePayload) => addMembersManuallyToSpaceService(payload),
    onSuccess: async (data) => {
      toast.success("Members added successfully")
    },
    onError: (error: any) => {
      toast.error(error?.data[0] || "Error adding member(s) to space")
    },
  });

  useEffect(() => {
    if (!userDataLoading && userData?.data?.length > 0 && userEmail) {
      const newUsers = userData.data.filter((user: any) =>
        !invitedUsers.some(invited => invited.email === user.email)
      );
      if (newUsers.length > 0) {
        setInvitedUsers(prev => [...prev, ...newUsers]);
        setUserEmail("");
      }
    }
  }, [userData, userDataLoading, userEmail, invitedUsers]);

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
    setIsInputDialogOpen(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await handleAddMemberManually({
      communityId: community && community?.id,
      spaceId: currentSpace?.id,
      members: invitedUsers?.map((invitedUser) => invitedUser?.username)
    })
  };
  console.log({ spaceMembers })
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
          <div className="flex gap-8 items-center">
            {
              isFetchingSpaceMembers ?
                <UserAvatarStackSkeleton maxVisible={5} itemCount={6} /> :
                <UserAvatarStack items={people} maxVisible={5} />
            }
            <div className='flex items-center gap-2'>
              <span className="bg-gray-100 p-1 rounded-full cursor-pointer"><Settings className="cursor-pointer" /></span>
            </div>
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
              <DialogContent className="max-w-xl max-h-[50vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div>
                    <SearchInput
                      label="Enter user email address"
                      placeholder='johndoe@creveo'
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      rightIcon={userDataLoading ? <Loader2 className='animate-spin text-primary-600' /> : null}
                    />
                  </div>
                  {invitedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {invitedUsers.map((user: any, index: number) => (
                        <UserBadge
                          key={index}
                          label={user?.email}
                          onRemove={() => {
                            setInvitedUsers(prev =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <div className='w-full mt-4'>
                    <Button className='w-full' disabled={isAddingMemberMannually}>
                      <ButtonLoader isLoading={isAddingMemberMannually} caption={`Invite ${invitedUsers.length > 0 ? `(${invitedUsers.length})` : ''}`} />
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
              <Avatar
                profileLoading={profileLoading}
                profileData={profileData}
                className="border-2 border-primary-500"
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