import React from 'react';
import { Message } from '@/types/chat';
import { MessageSquare, MoreVertical, ThumbsUp } from 'lucide-react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Avatar from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {

  const { currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser?.id);
  const defaultAvatar = "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png";
  const avatarUrl = profileLoading
    ? defaultAvatar
    : profileData?.data?.profile?.avatar || defaultAvatar;

  return (
    <div className="animate-fade-in">
      {message.date && (
        <div className="flex justify-center my-6">
          <div className="bg-gray-700 text-white px-4 py-1 rounded-full text-sm">
            {message.date}
          </div>
        </div>
      )}
      <div className="flex gap-3 mb-6">
        <div className={cn("rounded-full overflow-hidden h-10 w-10 flex-shrink-0")}>
          <img src={avatarUrl} alt={message.user.avatar} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{message.user.name}</h3>
              <p className="text-gray-500 text-xs">{message.timestamp}</p>
            </div>
            <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="mt-2 space-y-3">
            <p className="text-gray-800 text-sm">{message.content}</p>
            {message.image && (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 max-w-xs">
                <img
                  src={"https://res.cloudinary.com/db1upbvak/image/upload/v1743782952/ug1jbppiupbpuef3wjuu.jpg"}
                  alt="Message attachment"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex mt-3 gap-2">
            <button className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors",
              "hover:bg-gray-100"
            )}>
              <ThumbsUp size={16} />
              <span>{message.reactions.likes}</span>
            </button>

            <button className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors",
              "hover:bg-gray-100"
            )}>
              <Heart size={16} />
              <span>{message.reactions.loves}</span>
            </button>

            <button className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors",
              "hover:bg-gray-100"
            )}>
              <MessageSquare size={16} />
              <span>Comment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
