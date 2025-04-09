"use client";
import React, { useState } from "react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, MessageSquare, MoreHorizontalIcon, Trash2Icon, X } from "lucide-react";
import { BiLike } from "react-icons/bi";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { useComments } from "@/context/CommentsContext";
import { useFetchPost } from "@/hooks/posts/useFetchPost";
import { useMutation } from "@tanstack/react-query";
import { DeleteCommentPayload, deleteCommentService, replyCommentService } from "@/services/comment.service";
import { toast } from "sonner";
import { CommentPayload } from "@/types";
import { useWebSocket } from "@/context/WebSocket";
import { Input } from "@/components/Input";
import { useFetchCommentReplies } from "@/hooks/comments/useFetchCommentReplies";
import { formatCommentDate } from "@/utils";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface Comment {
  id: string;
  _user: User;
  body: string;
  createdAt: string;
  likes?: number;
  replies?: Comment[];
  commentId?: number;
}

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  activeCommentId: string | null;
  onToggleCommentInput: (commentId: string) => void;
}

const CommentItem = ({
  comment,
  depth = 0,
  activeCommentId,
  onToggleCommentInput,
}: CommentItemProps) => {
  const maxDepth = 2;
  const [isHovered, setIsHovered] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const { activePostId } = useComments();
  const isIconVisible = isHovered || isPopoverOpen;
  const { data: post } = useFetchPost(activePostId as any);
  const [commentReply, setCommentReply] = useState("");
  const ws = useWebSocket();
  const isCommentInputVisible = activeCommentId === comment.id;
  const { data: replies } = useFetchCommentReplies(post?.data?.id, comment?.id);

  const { mutate: handleDeleteComment } = useMutation({
    mutationFn: (payload: DeleteCommentPayload) => deleteCommentService(payload),
    onSuccess: async () => {
      toast.success("Comment deleted successfully");
    },
    onError: () => { },
  });

  const { mutate: handleReplyComment, isPending: isReplyingComment } = useMutation({
    mutationFn: (payload: CommentPayload) => replyCommentService(payload),
    onSuccess(data) {
      if (ws && ws.connected && currentUser?.id !== data.userId) {
        const request = {
          userId: data.userId,
          notificationId: data?.id,
        };
        ws.emit("comment", request);
      }
    },
  });

  const handleSubmit = async () => {
    await handleReplyComment({
      comment: commentReply,
      postId: post?.data?.id,
      commentId: Number(comment?.id),
    });
    setCommentReply("");
    onToggleCommentInput(comment.id);
  };

  // Animation variants
  const commentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={commentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mb-4"
    >
      <div
        className={`flex items-start gap-3 ${depth > 0 ? "pl-12 mt-2" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={comment._user?.avatar}
          alt={comment._user.firstName}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <motion.div
          className="flex-1 min-w-0 flex gap-4"
          whileHover={{ backgroundColor: "" }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <motion.h3
                className="font-semibold text-sm group cursor-pointer hover:underline"
                whileHover={{ color: "#3b82f6" }}
              >
                {comment._user.firstName} {comment._user.lastName}
              </motion.h3>
              {post?.data?.userId === comment._user.id && (
                <span className="text-primary-700 font-bold text-sm">Creator</span>
              )}
            </div>
            <p className="text-sm text-gray-800 mt-1">{comment?.body}</p>
            <motion.span
              className="text-[10px] text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {formatCommentDate(comment.createdAt)}
            </motion.span>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <div className="flex items-center gap-1">
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-gray-500 hover:text-red-500 mr-4 transition-opacity duration-200 ${isIconVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  >
                    <MoreHorizontalIcon className="w-4 h-4" />
                  </motion.button>
                </PopoverTrigger>
                <PopoverContent className="w-32" sideOffset={4}>
                  <div>
                    {currentUser?.id === comment._user.id && (
                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() =>
                          handleDeleteComment({
                            postId: activePostId as any,
                            commentId: Number(comment.id),
                          })
                        }
                        className="text-gray-500 hover:text-red-500 w-full flex gap-2 items-center text-sm"
                      >
                        <Trash2Icon size={16} />
                        Delete
                      </motion.button>
                    )}
                    {currentUser?.id !== comment._user.id && (
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="text-gray-500 hover:text-red-500 w-full flex gap-2 items-center text-sm"
                      >
                        <Flag className="w-4 h-4" />
                        Report
                      </motion.button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <motion.button
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-500 hover:text-red-500"
              >
                <BiLike className="w-4 h-4" />
              </motion.button>
              <span className="text-xs text-gray-500">{comment.likes ?? 0}</span>
            </div>

            {depth === 0 && (
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => onToggleCommentInput(comment.id)}
                >
                  <MessageSquare className="w-4 h-4" />
                </motion.button>
                <span className="text-xs text-gray-500">{replies?.length ?? 0}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Animated comment input */}
      <AnimatePresence>
        {isCommentInputVisible && depth === 0 && (
          <motion.div
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex items-center mt-2"
          >
            <div className="basis-1/12"></div>
            <div className="flex-1">
              <Input
                variant="comment"
                buttonCaption="Post"
                onButtonClick={handleSubmit}
                value={commentReply}
                onChange={(e) => setCommentReply(e.target.value)}
                placeholder="Write a reply..."
                className="rounded-full w-full mx-auto bg-white"
                isLoading={isReplyingComment}
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="cursor-pointer" onClick={() => onToggleCommentInput(comment.id)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated replies */}
      <AnimatePresence>
        {depth < maxDepth && replies?.data?.comments?.length > 0 && (
          replies?.data?.comments?.map((reply: any) => (
            <CommentItem
              key={reply?.id}
              comment={{
                id: reply?.id?.toString(),
                _user: reply?._user,
                body: reply?.body,
                createdAt: reply?.createdAt,
                likes: reply?.likesCount,
              }}
              depth={depth + 1}
              activeCommentId={activeCommentId}
              onToggleCommentInput={onToggleCommentInput}
            />
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommentItem;