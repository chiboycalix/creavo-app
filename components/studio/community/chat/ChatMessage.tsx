import React, { useState } from "react";
import { Message } from "@/types/chat";
import { Edit2, Loader2, MessageSquare, MoreVertical, Trash2, TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteMessagePayload, deleteMessageService } from "@/services/community.service";
import { toast } from "sonner";
interface ChatMessageProps {
  message: Message;
  communityId?: string;
  spaceId?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, communityId, spaceId }) => {
  const { currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser?.id);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const queryClient = useQueryClient();

  const defaultAvatar = "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png";
  const avatarUrl = profileLoading
    ? defaultAvatar
    : profileData?.data?.profile?.avatar || defaultAvatar;

  const { mutate: handleDeleteMessage, isPending: isDeletingMessage } = useMutation({
    mutationFn: (payload: DeleteMessagePayload) => deleteMessageService(payload),
    onSuccess: async (data) => {
      toast.success("Message deleted successfully")
      queryClient.invalidateQueries({
        queryKey: ["listMessages", communityId, spaceId],
        exact: true,
      });
    },
    onError: (error: any) => {
      toast.error("Error deleting message")
    },
  });

  const handleDelete = async () => {
    handleDeleteMessage({ communityId: communityId!, spaceId: spaceId!, messageId: message?.id })
  }

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
                  <div className="w-full">
                    <div className="flex items-center gap-2 p-2 cursor-pointer">
                      <Edit2 size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">Edit</span>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger>
                        <div className="w-full flex items-center gap-2 p-2 cursor-pointer">
                          <Trash2 size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-700">Delete</span>
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent className='flex flex-col items-center justify-center'>
                        <AlertDialogHeader className='w-full inline-flex flex-col items-center justify-center'>
                          <AlertDialogTitle className='flex items-center justify-center text-center'>
                            <TriangleAlertIcon className='text-red-500' size={40} />
                          </AlertDialogTitle>
                          <AlertDialogDescription className='font-semibold text-center'>
                            Are you sure you want to delete this message?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className='bg-red-600 text-white' disabled={isDeletingMessage}>
                            {
                              isDeletingMessage ? <Loader2 className='text-white animate-spin' /> : "Delete"
                            }
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>



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