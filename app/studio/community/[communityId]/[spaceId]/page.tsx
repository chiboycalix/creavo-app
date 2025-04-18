"use client"
import React, { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute';
import UserAvatarStack from '@/components/studio/community/UserAvatarStack';
import UserAvatarStackSkeleton from '@/components/sketetons/UserAvatarStackSkeleton';
import SpaceSettings from '@/components/studio/community/SpaceSettings';
import Chat from '@/components/studio/community/chat/Chat';
import ButtonLoader from '@/components/ButtonLoader';
import { Button } from '@/components/ui/button'
import { Check, Loader, Plus, Settings } from 'lucide-react'
import { useParams } from 'next/navigation';
import { useListCommunities } from '@/hooks/communities/useListCommunities';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserBadge } from '@/components/meeting/InvitePeople/UserBadge';
import { useFetchUserByUsername } from '@/hooks/profile/useFetchUserByUsername';
import { SearchInput } from '@/components/Input/SearchInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMembersManuallyToSpaceService, AddMemberToSpacePayload } from '@/services/community.service';
import { toast } from 'sonner';
import { useListSpaceMembers } from '@/hooks/communities/useListSpaceMembers';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useListMemberCommunities } from '@/hooks/communities/useListMemberCommunities';

const Space = () => {
  const { data: communityData, isFetching: isFetchingCommunity } = useListCommunities();
  const community = communityData?.data?.communities[0];
  const queryClient = useQueryClient();
  const params = useParams();
  const spaceId = params?.spaceId as string;
  const [addMember, setAddMember] = useState(false);
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showSpaceSettingsCard, setShowSpaceSettingsCard] = useState(false);
  const [spaceSettingsAnchorRect, setSpaceSettingsAnchorRect] = useState<DOMRect | null>(null);
  const { loading, currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser && currentUser?.id);
  const { data: communities, isLoading: isFetchingCommunities } = useListMemberCommunities(profileData && profileData?.data?.id)

  const currentSpace = communities?.data?.communities[0]?.spaces?.filter((space: any) => Number(space?.id) === Number(spaceId))[0];

  const { data: userData, isFetching: userDataLoading } = useFetchUserByUsername(userEmail || undefined);

  const { data: spaceMembers, isFetching: isFetchingSpaceMembers } = useListSpaceMembers(community && community?.id, currentSpace?.id);

  const { mutate: handleAddMemberManually, isPending: isAddingMemberMannually } = useMutation({
    mutationFn: (payload: AddMemberToSpacePayload) => addMembersManuallyToSpaceService(payload),
    onSuccess: async (data) => {
      setUserEmail("")
      toast.success("Members added successfully")
      setAddMember(false)
      await queryClient.invalidateQueries({ queryKey: ["useListMemberCommunities"] });
      await queryClient.invalidateQueries({ queryKey: ["spaceId-communityId"] });
    },
    onError: (error: any) => {
      const errorMessage = userData?.data?.length < 1 ? "This user does not exist" : error?.data[0]
      toast.error(errorMessage || "Error adding member(s) to space")
    },
  });

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await handleAddMemberManually({
      communityId: community && community?.id,
      spaceId: currentSpace?.id,
      members: userData?.data?.map((invitedUser: any) => invitedUser?.username)
    })
  }

  const members = spaceMembers?.data?.members?.map((member: any) => {
    return {
      id: member?.userId,
      name: `${member?.firstName} ${member?.lastName}`,
      image: member?.avatar,
      username: member?.username,
    }
  })

  const handleSpaceSettingsClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setSpaceSettingsAnchorRect(buttonRect);
    setShowSpaceSettingsCard(true);
  };
  console.log(spaceId, "===")
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
              isFetchingSpaceMembers || isFetchingCommunity ?
                <UserAvatarStackSkeleton maxVisible={5} itemCount={5} /> :
                <UserAvatarStack
                  items={members || []} maxVisible={5}
                  handleLinkCourse={handleLinkCourse}
                  handleManualAdd={handleManualAdd}
                />
            }
            <div className='flex items-center gap-2'>
              <span className="bg-gray-100 p-1 rounded-full cursor-pointer" onClick={handleSpaceSettingsClick}>
                <Settings className="cursor-pointer" />
              </span>

              {showSpaceSettingsCard && currentSpace && (
                <SpaceSettings
                  isOpen={showSpaceSettingsCard}
                  onClose={() => setShowSpaceSettingsCard(false)}
                  anchorRect={spaceSettingsAnchorRect}
                  currentSpace={currentSpace}
                  communityId={community && community?.id}
                  members={members}
                  isFetchingSpaceMembers={isFetchingSpaceMembers}
                />
              )}
            </div>
          </div>
        </div>

        <div className='max-h-[87vh] flex flex-col justify-between'>
          <div>
            {
              members?.length < 0 && <div className="p-4 py-10 bg-gray-100 w-[50%] mx-auto mt-20 rounded-md flex items-center flex-col">
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
            }
            <Chat
              spaceId={spaceId}
              communityId={community && community?.id}
            />

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
                    />
                  </div>
                  {
                    userDataLoading ? <div className='w-full flex items-center justify-center text-center mt-2'>
                      <Loader className='animate-spin text-primary-600' />
                    </div> : null
                  }
                  {
                    userData?.data?.length > 0 && <div className='mt-4'>
                      <UserBadge
                        label={userEmail}
                        canRemove={false}
                      />
                    </div>
                  }

                  <div className='w-full mt-4'>
                    <Button className='w-full' disabled={isAddingMemberMannually}>
                      <ButtonLoader isLoading={isAddingMemberMannually} caption={`Add`} />
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Link a Course</DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Space