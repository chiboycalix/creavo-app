import React from 'react';
interface Reply {
  _id: string;
  uId: string;
  rUid: string;
  roomId: string;
  mId: string;
  text: string;
  tMid: string;
  firstName: string;
  lastName: string;
  avatar: string;
  imageUrl: string;
  date: string;
  __v: number;
}

interface ReplyMessageProps {
  communityId?: string;
  spaceId?: string;
  reply: Reply;
}

const ReplyMessage = ({ reply }: ReplyMessageProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isYesterday) {
      return `Yesterday ${time}`;
    }
    return `${date.toLocaleDateString()} ${time}`;
  };

  const userName = `${reply?.firstName} ${reply?.lastName}`;
  const defaultAvatar = "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png";
  const avatarUrl = reply?.avatar || defaultAvatar

  return (
    <div className="flex items-end space-x-3 py-2 animate-fade-in">
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        <img src={avatarUrl} alt="" className='rounded-full' />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-800">{userName}</span>
          <span className="text-xs text-gray-500">{formatDate(reply.date)}</span>
        </div>
        <div className="relative border-l-4 rounded-l border-blue-500 mt-1">
          <p className="text-sm text-gray-700 bg-gray-200 p-2 py-4">{reply.text}</p>
        </div>
      </div>
    </div>
  );
};

export default ReplyMessage;