import React from "react";
import Cookies from "js-cookie";
import { Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import { useWebSocket } from "@/context/WebSocket";

interface LikeButtonProps {
  postId: number;
  initialLikesCount: number;
  initialIsLiked: boolean;
  likedId: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
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
      const response = await fetch(`${baseUrl}/posts/${postId}/like-post`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
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
            post.id === postId
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
      const response = await fetch(`${baseUrl}/posts/${postId}/unlike-post`, {
        method: "PATCH",
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
            post.id === postId
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
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleToggleLike}
        disabled={likePostMutation.isPending || unlikePostMutation.isPending}
        className="flex items-center focus:outline-none transition-opacity disabled:opacity-50"
        aria-label={isLiked ? "Unlike post" : "Like post"}
      >
        <Heart
          className={`w-8 h-8 transition-colors duration-200 
            ${isLiked
              ? "fill-red-500 stroke-red-500"
              : "md:hover:stroke-red-500 stroke-white fill-white md:fill-gray-400 md:hover:fill-red-500"
            }`}
        />
      </button>
      <span className="text-xs font-semibold">{likesCount}</span>
    </div>
  );
};

export default LikeButton;