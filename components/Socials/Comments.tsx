import MediaWrapper from "../post/MediaWrapper";
import CommentSectionSkeleton from "../sketetons/CommentSectionSkeleton";
import CommentItem from "./CommentItem";
import Input from "@/components/ui/Input";
import Link from "next/link";
import Image from "next/image";
import { useFetchComments } from "@/hooks/useFetchComments";
import { X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { addCommentService } from "@/services/comment.service";
import { CommentPayload } from "@/types/index";

export function Comments({ post, onClose }: { post: any; onClose?: () => void }) {
  const { data: comments, isPending: isFetchingComments } = useFetchComments(post?.id);
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const [comment, setComment] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { mutate: handleAddComment, isPending: isAddingComment } = useMutation({
    mutationFn: (payload: CommentPayload) => addCommentService(payload),
    onSuccess() {
      setComment("");
    },
  });

  const handleSubmit = async () => {
    await handleAddComment({
      comment,
      postId: post?.id,
    });
  };

  return (
    <div className="relative flex gap-4 flex-col md:flex-row h-full w-full">
      {/* Media Section */}
      <div className="bg-black/90 rounded-xl md:basis-5/12 w-full md:w-auto">
        <MediaWrapper
          postId={post.id}
          title={post.title}
          size="object-cover"
          postMedia={post.media}
          isRenderedInComment
        />
      </div>

      {/* Drawer (Tablet & Mobile) */}
      <div
        className={`fixed md:relative bottom-0 rounded-xl left-0 w-full md:flex-1 h-[80vh] bg-white border rounded-t-xl md:rounded-xl transition-transform duration-300 ${isDrawerOpen ? "translate-y-0" : "translate-y-[90%] md:translate-y-0"
          } md:h-auto flex flex-col`}
      >
        <div className="flex justify-between items-center p-3 md:hidden">
          <p className="font-semibold">Comments</p>
          <X className="cursor-pointer" onClick={() => setIsDrawerOpen(false)} size={24} />
        </div>

        {isFetchingComments ? (
          <CommentSectionSkeleton />
        ) : comments?.data?.comments?.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
            <Image width={50} height={50} src={'/assets/icons/file-error.svg'} alt="icon" className="w-40" />
            <p>Be the first to comment</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-2">
            {comments?.data?.comments?.map((comment: any) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}

        {/* Input Section */}
        <div className="w-full p-2 border-t mt-auto">
          {currentUser ? (
            <div className="flex items-center gap-2 w-full">
              <Avatar className="w-12 h-12 basis-1.5/12">
                <AvatarImage src={currentUser?.avatar} alt="User avatar" />
                <AvatarFallback>.</AvatarFallback>
              </Avatar>
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

      {/* Floating Comments Button (Tablet & Mobile) */}
      <button
        className="md:hidden fixed bottom-20 right-4 bg-primary-700 text-white h-10 w-10 rounded-full shadow-lg"
        onClick={() => setIsDrawerOpen(true)}
      >
        💬
      </button>
    </div>
  );
}
