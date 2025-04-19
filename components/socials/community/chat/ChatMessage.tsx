import Link from "next/link";
import React from "react";
import { Message } from "@/types/chat";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { DEFAULT_AVATAR } from "@/constants";
interface ChatMessageProps {
  message: Message;
  communityId?: string;
  spaceId?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  communityId,
  spaceId,
}) => {
  const { currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser?.id);

  const avatarUrl = profileLoading
    ? DEFAULT_AVATAR
    : profileData?.data?.profile?.avatar || DEFAULT_AVATAR;

  return (
    <div className="animate-fade-in">
      {message.date && (
        <div className="flex justify-center my-6">
          <div className="bg-gray-700 text-white px-4 py-1 rounded-full text-sm">
            {message.date}
          </div>
        </div>
      )}
      {!message.date && (
        <div className="flex gap-3 mb-6">
          <div
            className={cn(
              "rounded-full overflow-hidden h-10 w-10 flex-shrink-0"
            )}
          >
            <img
              src={avatarUrl}
              alt={message.user.avatar}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-sm">{message.user.name}</h3>
                <p className="text-gray-500 text-xs">{message.timestamp}</p>
              </div>
            </div>

            <div className="mt-2 space-y-3">
              <p className="text-gray-800 text-sm">{message.content}</p>
              {message.image && (
                <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 max-w-xs">
                  <img
                    src={message.image}
                    alt="Message attachment"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex mt-3 gap-2">
              <Link
                href={{
                  pathname: `/socials/community/${communityId}/${spaceId}/${message?.id}/replies`,
                  query: {
                    mId: message?.mId,
                    text: message?.content
                  },
                }}
                passHref
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors",
                    "hover:bg-gray-100"
                  )}
                >
                  <MessageSquare size={16} />
                  <span>Comment</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;