import React from 'react'
import ReplyMessage from './ReplyMessage';

interface ReplyFeedProps {
  communityId?: string;
  spaceId?: string;
  replies: any[]
}


const ReplyFeed = ({ replies, communityId, spaceId }: ReplyFeedProps) => {
  return (
    <div className="p-4 flex flex-col gap-2 overflow-y-auto h-full max-h-[80vh] bg-gray-50">
      {
        replies?.map((reply, index) => {
          return <ReplyMessage key={index} reply={reply} communityId={communityId} spaceId={spaceId} />
        })
      }
    </div>
  )
}

export default ReplyFeed