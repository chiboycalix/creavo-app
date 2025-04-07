import React, { useState } from 'react';
import ChatFeed from './ChatFeed';
import MessageInput from './MessageInput';
import { Message, User } from '@/types/chat';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

const initialMessages: Message[] = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Obaking',
      avatar: "",
    },
    content: 'We have some other ping & group roles you can select as well! These do not open any additional channels but will be used to send you notifications.',
    timestamp: 'Oct 30, 2024 | 11:28 am',
    reactions: {
      likes: 32,
      loves: 32,
    },
  },
  {
    id: '2',
    user: {
      id: 'user1',
      name: 'Obaking',
      avatar: "",
    },
    content: 'You can still access all general channels without these roles.',
    timestamp: 'Oct 30, 2024 | 11:28 am',
    date: 'November 16, 2021',
    reactions: {
      likes: 32,
      loves: 32,
    },
  },
  {
    id: '3',
    user: {
      id: 'user1',
      name: 'Obaking',
      avatar: "",
    },
    content: 'We have some other ping & group roles you can select as well! These do not open any additional channels but will be used to send you notifications.',
    timestamp: 'Oct 30, 2024 | 11:28 am',
    image: '/lovable-uploads/528577e0-5da9-449c-b49c-de7f3df584d8.png',
    reactions: {
      likes: 32,
      loves: 32,
    },
  },
  {
    id: '4',
    user: {
      id: 'user1',
      name: 'Obaking',
      avatar: "",
    },
    content: 'You can still access all general channels without these roles.',
    timestamp: 'Oct 30, 2024 | 11:28 am',
    reactions: {
      likes: 32,
      loves: 32,
    },
  },
];

const Chat = ({ communityId, spaceId }: { communityId: string, spaceId: string }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser?.id);

  const defaultAvatar = "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png";
  const avatarUrl = profileLoading
    ? defaultAvatar
    : profileData?.data?.profile?.avatar || defaultAvatar;

  const handleSendMessage = (content: string, imageUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      user: {
        id: profileData?.data?.id,
        name: profileData?.profile?.firstName,
        avatar: avatarUrl
      },
      content,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
      image: imageUrl,
      reactions: {
        likes: 0,
        loves: 0,
      },
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-[78.5vh] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <ChatFeed messages={messages} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} communityId={communityId} spaceId={spaceId} />
    </div>
  );
};

export default Chat;
