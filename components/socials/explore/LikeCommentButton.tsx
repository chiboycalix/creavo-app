import React from "react";
import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import { useWebSocket } from "@/context/WebSocket";
import { BiLike } from "react-icons/bi";

interface LikeCommentButtonProps {
  commentId: number;
  initialLikesCount: number;
  initialIsLiked: boolean;
  likedId: number;
}

const LikeCommentButton: React.FC<LikeCommentButtonProps> = ({
  commentId,
  initialLikesCount,
  initialIsLiked,
  likedId,
}) => {
  const queryClient = useQueryClient();
  const { getAuth } = useAuth();
  const router = useRouter();
  const ws = useWebSocket();

  const [isLiked, setIsLiked] = React.useState(initialIsLiked);
  const [likesCount, setLikesCount] = React.useState(initialLikesCount);

  const likePostMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${baseUrl}/comments/${commentId}/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify({
          commentId,
        }),
      });

      if (!response.ok) throw new Error("Failed to like post");
      const result = await response.json();

      if (ws && ws.connected) {
        const request = {
          userId: likedId,
          notificationId: result?.data?.id,
        };
        ws.emit("like", request);
      } else {
        console.log("Failed to emit like event", likedId);
      }

      return result;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["infinite-posts"] });

      const previousData = queryClient.getQueryData(["infinite-posts"]);
      queryClient.setQueryData(["infinite-posts"], (oldData: any) => {
        if (!oldData?.pages) return oldData;

        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: any) =>
            post.id === commentId
              ? { ...post, likesCount: post.likesCount + 1, liked: true }
              : post
          ),
        }));

        return { ...oldData, pages: updatedPages };
      });

      setIsLiked(true);
      setLikesCount((prev) => prev + 1);

      return { previousData };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["infinite-posts"], context?.previousData);
      setIsLiked(initialIsLiked);
      setLikesCount(initialLikesCount);
    },
  });

  const unlikePostMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${baseUrl}/comments/${commentId}/likes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to unlike post");
      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["infinite-posts"] });

      const previousData = queryClient.getQueryData(["infinite-posts"]);
      queryClient.setQueryData(["infinite-posts"], (oldData: any) => {
        if (!oldData?.pages) return oldData;

        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: any) =>
            post.id === commentId
              ? { ...post, likesCount: post.likesCount - 1, liked: false }
              : post
          ),
        }));

        return { ...oldData, pages: updatedPages };
      });

      setIsLiked(false);
      setLikesCount((prev) => prev - 1);

      return { previousData };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["infinite-posts"], context?.previousData);
      setIsLiked(initialIsLiked);
      setLikesCount(initialLikesCount);
    },
  });

  const handleToggleLike = () => {
    if (!getAuth()) {
      router.push("/auth?tab=signin");
      return;
    }

    if (isLiked) {
      unlikePostMutation.mutate();
    } else {
      likePostMutation.mutate();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div
        onClick={handleToggleLike}
        className="flex items-center focus:outline-none transition-opacity disabled:opacity-50"
        aria-label={isLiked ? "Unlike post" : "Like post"}
      >
        <BiLike
          className={`w-5 h-5 transition-colors duration-200 
            ${isLiked
              ? "fill-red-500 stroke-red-500"
              : "md:hover:stroke-red-500 stroke-white fill-white md:fill-gray-400 md:hover:fill-red-500"
            }`}
        />
      </div>
      <span className="text-xs font-semibold">{likesCount}</span>
    </div>
  );
};

export default LikeCommentButton;
