import CommentSectionSkeleton from "../../sketetons/CommentSectionSkeleton";
import CommentItem from "./CommentItem";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/Input";
import { useFetchComments } from "@/hooks/useFetchComments";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { addCommentService } from "@/services/comment.service";
import { CommentPayload } from "@/types";
import { useWebSocket } from "@/context/WebSocket";

export function Comments({ postId }: { postId: number; }) {
  const { data: comments, isPending: isFetchingComments } = useFetchComments(postId);
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const [comment, setComment] = useState("");
  const ws = useWebSocket();

  const { mutate: handleAddComment, isPending: isAddingComment } = useMutation({
    mutationFn: (payload: CommentPayload) => addCommentService(payload),
    onSuccess(data) {
      setComment("");
      if (ws && ws.connected) {
        const request = {
          userId: data.userId,
          notificationId: data?.id,
        };
        ws.emit("comment", request);
      } else {
        console.log("Failed to emit like event", data?.id);
      }
    },
  });

  const handleSubmit = async () => {
    await handleAddComment({
      comment,
      postId
    });
  };

  return (
    <div className="relative h-full w-full">
      <div className="">
        {isFetchingComments ? (
          <CommentSectionSkeleton />
        ) : comments?.data?.comments?.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
            <Image width={50} height={50} src={'/assets/icons/file-error.svg'} alt="icon" className="w-40" />
            <p>Be the first to comment</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto max-h-[60vh] md:max-h-[73vh]">
            {comments?.data?.comments?.map((comment: any) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}

        {/* Input Section */}
        <div className="w-full p-2 border-t mt-auto">
          {currentUser ? (
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="basis-1.5/12">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={currentUser?.avatar} alt="User avatar" />
                  <AvatarFallback>.</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <Input
                  variant="comment"
                  buttonCaption="Post"
                  onButtonClick={() => handleSubmit()}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="rounded-full w-full bg-white"
                  isLoading={isAddingComment}
                />
              </div>
            </div>
          ) : (
            <div className="py-3 px-2 rounded">
              <Link href="/auth?tab=signin" className="text-primary-700 font-black">
                Log in to comment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
