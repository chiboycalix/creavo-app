import React, { useState } from "react";
import { Message } from "@/types/chat";
import { Edit2, MessageSquare, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser?.id);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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
      {!message.date && (
        <div className="flex gap-3 mb-6">
          <div className={cn("rounded-full overflow-hidden h-10 w-10 flex-shrink-0")}>
            <img src={avatarUrl} alt={message.user.avatar} className="h-full w-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-sm">{message.user.name}</h3>
                <p className="text-gray-500 text-xs">{message.timestamp}</p>
              </div>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-gray-500 mr-4 transition-opacity duration-200`}
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  >
                    <MoreVertical size={20} />
                  </motion.button>
                </PopoverTrigger>
                <PopoverContent className="w-40" sideOffset={4}>
                  <div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                      <Edit2 size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">Edit</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                      <Trash2 size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">Delete</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

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
              {/* <button
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors",
                  "hover:bg-gray-100"
                )}
              >
                <ThumbsUp size={16} />
                <span>{message.reactions.likes}</span>
              </button>

              <button
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors",
                  "hover:bg-gray-100"
                )}
              >
                <Heart size={16} />
                <span>{message.reactions.loves}</span>
              </button> */}

              <button
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors",
                  "hover:bg-gray-100"
                )}
              >
                <MessageSquare size={16} />
                <span>Comment</span>
              </button>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default ChatMessage;