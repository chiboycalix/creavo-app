"use client"
import React from 'react'
import ProtectedRoute from '@/components/ProtectedRoute';
import UserAvatarStack from '@/components/socials/community/UserAvatarStack';
import UserAvatarStackSkeleton from '@/components/sketetons/UserAvatarStackSkeleton';
import Chat from '@/components/socials/community/chat/Chat';
import { useParams } from 'next/navigation';
import { useListSpaceMembers } from '@/hooks/communities/useListSpaceMembers';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useListMemberCommunities } from '@/hooks/communities/useListMemberCommunities';

const Space = () => {
  const params = useParams();
  const communityId = params?.communityId as string;
  const spaceId = params?.spaceId as string;
  const { loading, currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser && currentUser?.id);
  const { data: communities, isLoading: isFetchingCommunities } = useListMemberCommunities(profileData && profileData?.data?.id)

  const currentSpace = communities?.data?.communities[0]?.spaces?.filter((space: any) => Number(space?.id) === Number(spaceId))[0];

  const { data: spaceMembers, isFetching: isFetchingSpaceMembers } = useListSpaceMembers(communityId, currentSpace?.id);

  const members = spaceMembers?.data?.members?.map((member: any) => {
    return {
      id: member?.userId,
      name: `${member?.firstName} ${member?.lastName}`,
      image: member?.avatar,
      username: member?.username,
    }
  })

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className="w-full h-[85vh] relative">
        <div className="border-b p-4 shadow-md shadow-primary-50 flex justify-between items-center">
          <div>
            <p className="font-semibold text-sm">{currentSpace?.displayName}</p>
            <p className="text-xs">{currentSpace?.description}</p>
          </div>
          <div className="flex gap-8 items-center">
            {
              isFetchingSpaceMembers || loading || profileLoading || isFetchingCommunities ?
                <UserAvatarStackSkeleton maxVisible={5} itemCount={5} /> :
                <UserAvatarStack
                  items={members || []} maxVisible={5}
                />
            }
          </div>
        </div>

        <div className='max-h-[87vh] flex flex-col justify-between'>
          <div>
            {
              members?.length < 0 && <div className="p-4 py-10 bg-gray-100 w-[50%] mx-auto mt-20 rounded-md flex items-center flex-col">
                <p>Looks like you&apos;re leading the way</p>
                <p>Start a discussion by creating a new post</p>
              </div>
            }
            <Chat
              spaceId={spaceId}
              communityId={communityId}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Space