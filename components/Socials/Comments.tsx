import MediaWrapper from "../post/MediaWrapper"
import CommentSectionSkeleton from "../sketetons/CommentSectionSkeleton";
import CommentItem from "./CommentItem"
import Input from "@/components/ui/Input";
import { useFetchComments } from "@/hooks/useFetchComments"
import { Heart, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useAuth } from "@/context/AuthContext";

export function Comments({ post, onClose }: { post: any, onClose?: () => void }) {
  const { data: comments, isPending: isFetchingComments } = useFetchComments(post?.id)
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();

  return (
    <div className="h-[75vh] flex gap-4 w-full">
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
      <div className="flex flex-col flex-1 h-full">
        {isFetchingComments ? (
          <CommentSectionSkeleton />
        ) : (
          <>
            {/* Scrollable Comments */}
            <div className="flex-1 overflow-y-auto pr-2">
              {comments?.data?.comments?.map((comment: any) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>

            {/* Input Section */}
            <div className="w-full">
              <div className="flex items-center gap-2 w-full">
                <div className="basis-1/12">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={currentUser?.avatar} alt="User avatar" />
                    <AvatarFallback>.</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <Input
                    variant="comment"
                    buttonCaption="Post"
                    onButtonClick={() => console.log("Button clicked!")}
                    placeholder="Write a comment..."
                    className="rounded-full w-full"
                  />
                </div>
              </div>
            </div>
          </>
        )}
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
