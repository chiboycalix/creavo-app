import MediaWrapper from "../post/MediaWrapper"
import CommentSectionSkeleton from "../sketetons/CommentSectionSkeleton";
import CommentItem from "./CommentItem"
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useFetchComments } from "@/hooks/useFetchComments"
import { Heart, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { addCommentService } from "@/services/comment.service";
import Image from "next/image";

export function Comments({ post, onClose }: { post: any, onClose?: () => void }) {
  const { data: comments, isPending: isFetchingComments } = useFetchComments(post?.id)
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const [comment, setComment] = useState("")

  const { mutate: handleAddComment, isPending: isAddingComment } = useMutation({
    mutationFn: (payload: CommentPayload) => addCommentService(payload),
    onSuccess(data) {
      console.log({ data })
      setComment("")
    },
    onError: (error: any) => {

    }
  });

  const handleSubmit = async () => {
    await handleAddComment({
      comment,
      postId: post?.id
    })
  }

  return (
    <div className="h-full flex gap-4 w-full">
      {/* Media Section */}
      <div className="basis-5/12 bg-black/90 rounded-xl backdrop-blur-md">
        <MediaWrapper
          postId={post.id}
          title={post.title}
          size="object-cover"
          postMedia={post.media}
          isRenderedInComment
        />
      </div>

      {/* Comments Section */}
      <div className="flex flex-col flex-1 h-[80vh] border rounded-xl">
        {isFetchingComments ? (
          <CommentSectionSkeleton />
        ) : comments?.data.comments.length === 0 ? (
          <div className="items-center justify-center flex text-gray-500 h-screen">
            <div className="w-full flex items-center flex-col space-y-3">
              <div>
                <Image
                  width={50}
                  height={50}
                  src={'/assets/icons/file-error.svg'}
                  alt="icon"
                  className="aspect-square w-40"
                />
                <p className="">
                  Be the first to comment
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable Comments */}
            <div className="flex-1 overflow-y-auto pr-2 py-2">
              {comments?.data?.comments?.map((comment: any) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
            <div className="py-0">
              <hr />
            </div>
            {/* Input Section */}

          </>
        )}

        <div className="w-full px-2">
          {
            currentUser ?
              <div className="flex items-center gap-2 w-full">
                <div className="basis-1/12">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={currentUser?.avatar} alt="User avatar" />
                    <AvatarFallback>.</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 py-2">
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
              :
              <div className="py-3 px-2 rounded">
                <Link href={"/auth?tab=signin"} className="text-primary-700 font-black">
                  Log in to comment
                </Link>
              </div>
          }
        </div>
      </div>

      {/* Icons Column */}
      <div className="basis-0.5/12 flex flex-col items-center gap-4 mt-2 mr-1">
        {/* Close Button */}
        {onClose && (
          <X className="cursor-pointer text-gray-400 hover:text-white" size={24} onClick={onClose} />
        )}

        {/* Heart Icon */}
        <Heart className="cursor-pointer text-red-500" size={24} />
      </div>
    </div>
  );
}
