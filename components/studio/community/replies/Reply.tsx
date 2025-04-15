import React from 'react'
import ReplyFeed from './ReplyFeed'
import ReplyInput from './ReplyInput';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { listMessageRepliesService } from '@/services/community.service';

interface ReplyProps {
  communityId?: string;
  spaceId?: string;
  messageId?: string;
  mId?: string;
}

const Reply = ({ communityId, spaceId, messageId, mId }: ReplyProps) => {
  const { data: messageReplies, isLoading: iFetchingMessageReplies } = useQuery<any>({
    queryKey: ["listMessageReplies", communityId, spaceId, messageId],
    queryFn: async () => {
      const data = await listMessageRepliesService({
        communityId: communityId!,
        spaceId: spaceId!,
        messageId: mId!
      });
      return data;
    },
    enabled: !!communityId && !!spaceId && !!messageId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: 0,
    refetchIntervalInBackground: false,
    retry: 0,
    retryDelay: 0,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
  console.log({ messageReplies })
  return (
    <div className="flex flex-col h-[78.5vh] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <ReplyFeed
        communityId={communityId}
        spaceId={spaceId}
        replies={messageReplies?.data || []}
      />
      <ReplyInput
        communityId={communityId!}
        spaceId={spaceId!}
        messageId={messageId!}
        mId={mId!}
      />
    </div>
  )
}

export default Reply