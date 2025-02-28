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
  initialIsLiked: isLiked,
  likedId,
}) => {
  const queryClient = useQueryClient();
  const { getAuth } = useAuth();
  const router = useRouter();
  const ws = useWebSocket();

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
      // Emit WebSocket event
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
      await queryClient.cancelQueries({ queryKey: ["likeStatus", postId] });

      // Optimistically update the like status and likes count
      queryClient.setQueryData(['likeStatus', postId], { data: { liked: true } });

      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId ? { ...post, liked: true, likesCount: post.likesCount + 1 } : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });

      return { previousLikesCount: initialLikesCount };
    },
    onError: (_, __, context) => {
      // Revert to the previous likes count on error
      queryClient.setQueryData(['likeStatus', postId], { data: { liked: false } });
      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId ? { ...post, liked: false, likesCount: context?.previousLikesCount } : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['likeStatus', postId] });
    },
  });

  // Unlike post mutation
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
      await queryClient.cancelQueries({ queryKey: ["likeStatus", postId] });

      // Optimistically update the like status and likes count
      queryClient.setQueryData(['likeStatus', postId], { data: { liked: false } });

      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId ? { ...post, liked: false, likesCount: post.likesCount - 1 } : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });

      return { previousLikesCount: initialLikesCount };
    },
    onError: (_, __, context) => {
      // Revert to the previous likes count on error
      queryClient.setQueryData(['likeStatus', postId], { data: { liked: true } });
      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId ? { ...post, liked: true, likesCount: context?.previousLikesCount } : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['likeStatus', postId] });
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

  // Get the current likes count from the cache or use the initial value
  const currentLikesCount = (queryClient.getQueryData<{ data: { posts: { id: number; likesCount: number }[] } }>(['posts'])?.data?.posts.find((post) => post.id === postId)?.likesCount) ?? initialLikesCount;

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
      <span className="text-xs font-semibold">
        {currentLikesCount}
      </span>
    </div>
  );
};

export default LikeButton;