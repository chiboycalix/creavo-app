import React from "react";
import Cookies from "js-cookie";
import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  const { data: likeStatus } = useQuery({
    queryKey: ['likeStatus', postId],
    queryFn: async () => {
      if (!getAuth()) return { data: { liked: initialIsLiked } };

      const response = await fetch(`${baseUrl}/posts/${postId}/like-status`, {
        headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch like status");
      return response.json();
    },
    enabled: !!getAuth(),
    staleTime: 0,
    placeholderData: { data: { liked: initialIsLiked } }, // Prevent flicker
  });

  const isLiked = likeStatus?.data?.liked ?? initialIsLiked;

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
          userId: likedId, // Current user's ID
          notificationId: result?.data?.id, // Assuming the response contains the notification ID
        };
        console.log({ request });
        ws.emit("like", request);
      } else {
        console.log("Failed to emit like event", likedId);
      }

      return result;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["likeStatus", postId] });
      const previousStatus = queryClient.getQueryData(["likeStatus", postId]);
      queryClient.setQueryData(['likeStatus', postId], { data: { liked: true } });

      // Update the likesCount in the cache
      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId ? { ...post, liked: true, likesCount: post.likesCount + 1 } : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });

      return { previousStatus };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["likeStatus", postId], context?.previousStatus);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['likeStatus', postId] });
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
      await queryClient.cancelQueries({ queryKey: ["likeStatus", postId] });
      const previousStatus = queryClient.getQueryData(["likeStatus", postId]);
      queryClient.setQueryData(['likeStatus', postId], { data: { liked: false } });

      // Update the likesCount in the cache
      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId ? { ...post, liked: false, likesCount: post.likesCount - 1 } : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });

      return { previousStatus };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['likeStatus', postId], context?.previousStatus);
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

  // Calculate the displayed likes count based on the cache or initial value
  const displayedLikesCount = likeStatus?.data?.liked
    ? initialLikesCount + 1
    : initialLikesCount;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleToggleLike}
        disabled={likePostMutation.isPending || unlikePostMutation.isPending}
        className="flex items-center focus:outline-none transition-opacity disabled:opacity-50"
        aria-label={isLiked ? "Unlike post" : "Like post"}
      >
        <Heart
          className={`w-6 h-6 transition-colors duration-200 ${isLiked
            ? "fill-red-500 stroke-red-500"
            : "md:hover:stroke-red-500 stroke-gray-500"
            }`}
        />
      </button>
      <span className="text-xs font-semibold">
        {displayedLikesCount}
      </span>
    </div>
  );
};

export default LikeButton;