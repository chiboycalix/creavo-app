import React from 'react';
import ChatFeed from './ChatFeed';
import MessageInput from './MessageInput';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { listSpaceMessagesService } from '@/services/community.service';
import { transformAndGroupMessages } from '@/utils';
import ChatMessageSkeleton from '@/components/sketetons/ChatMessageSkeleton';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

const Chat = ({ communityId, spaceId }: { communityId: string, spaceId: string }) => {
  const { currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser?.id);

  const { data: spaceMessages, isLoading: isFetchingSpaceMessages } = useQuery<any>({
    queryKey: ["listMessages", communityId, spaceId],
    queryFn: async () => {
      const data = await listSpaceMessagesService({
        communityId,
        spaceId,
      });
      return data;
    },
    enabled: !!communityId && !!spaceId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: 0,
    refetchIntervalInBackground: false,
    retry: 0,
    retryDelay: 0,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });

  const transformedMessage = transformAndGroupMessages(spaceMessages, profileData?.data?.profile)

  return (
    <div className="flex flex-col h-[78.5vh] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {
          spaceMessages?.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          )
        }
        {
          isFetchingSpaceMessages && (
            <div className="p-4 flex flex-col gap-2 overflow-y-auto h-full max-h-[80vh] bg-gray-50">
              {Array.from({ length: 4 }).map((_, index) => (
                <ChatMessageSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          )
        }
        <ChatFeed messages={transformedMessage} />
      </div>
      <MessageInput communityId={communityId} spaceId={spaceId} />
    </div>
  );
};

export default Chat;
