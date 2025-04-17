"use client"
import React, { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute';
import UserAvatarStack from '@/components/socials/community/UserAvatarStack';
import UserAvatarStackSkeleton from '@/components/sketetons/UserAvatarStackSkeleton';
import Chat from '@/components/socials/community/chat/Chat';
import { Settings } from 'lucide-react'
import { useParams } from 'next/navigation';
import { useFetchUserByUsername } from '@/hooks/profile/useFetchUserByUsername';
import { useListSpaceMembers } from '@/hooks/communities/useListSpaceMembers';
import SpaceSettings from '@/components/socials/community/SpaceSettings';
import { useListMemberCommunities } from '@/hooks/communities/useListMemberCommunities';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

const Space = () => {
  const { loading, currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser && currentUser?.id);
  const { data: communities, isLoading: isFetchingCommunities } = useListMemberCommunities(profileData && profileData?.data?.id)
  const community = communities && communities?.data?.communities[0];
  const params = useParams();
  const spaceId = params?.spaceId as string;
  const [userEmail, setUserEmail] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<any[]>([]);
  const [showSpaceSettingsCard, setShowSpaceSettingsCard] = useState(false);
  const [spaceSettingsAnchorRect, setSpaceSettingsAnchorRect] = useState<DOMRect | null>(null);

  const currentSpace = communities?.data?.communities[0]?.spaces?.filter((space: any) => Number(space?.id) === Number(spaceId))[0];

  const { data: userData, isFetching: userDataLoading } = useFetchUserByUsername(userEmail || undefined);

  const { data: spaceMembers, isFetching: isFetchingSpaceMembers } = useListSpaceMembers(community && community?.id, currentSpace?.id);

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
              isFetchingSpaceMembers || isFetchingCommunities ?
                <UserAvatarStackSkeleton maxVisible={5} itemCount={5} /> :
                <UserAvatarStack
                  items={members || []} maxVisible={5}
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
            <Chat
              spaceId={spaceId}
              communityId={community && community?.id}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Space