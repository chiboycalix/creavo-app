import { baseUrl } from "@/utils/constant";
import React from "react";
import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  metadata: {
    likesCount: number;
  };
  isLiked: boolean;
}

interface LikeButtonProps {
  postId: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId }) => {
  const queryClient = useQueryClient();
  const { getAuth } = useAuth();
  const router = useRouter();

  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: async () => {
      // First check if we have cached data
      const cachedData = queryClient.getQueryData<Post>(["post", postId]);

      const response = await fetch(`${baseUrl}/posts/${postId}`);
      if (!response.ok) throw new Error("Failed to fetch post data");
      const data = await response.json();

      // If we have cached data, use its isLiked state
      if (cachedData) {
        return {
          ...data.data,
          isLiked: cachedData.isLiked
        };
      }

      // Otherwise use the server response
      return {
        ...data.data,
        isLiked: Boolean(data.data.isLiked)
      };
    },
    staleTime: Infinity, // Keep the data fresh indefinitely
    gcTime: Infinity,    // Never garbage collect (previously cacheTime)
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${baseUrl}/posts/${postId}/toggle-like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to toggle like");
      const data = await response.json();
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      const previousPost = queryClient.getQueryData<Post>(["post", postId]);

      if (previousPost) {
        const newPost = {
          ...previousPost,
          isLiked: !previousPost.isLiked,
          metadata: {
            ...previousPost.metadata,
            likesCount: previousPost.metadata.likesCount + (previousPost.isLiked ? -1 : 1),
          },
        };

        // Update the cache with the new state
        queryClient.setQueryData(["post", postId], newPost);
      }

      return { previousPost };
    },
    onSuccess: (responseData, _, context) => {
      const previousPost = context?.previousPost;
      if (previousPost) {
        const updatedPost = {
          ...previousPost,
          isLiked: !previousPost.isLiked,
          metadata: {
            ...previousPost.metadata,
            likesCount: responseData.data.metadata.likesCount,
          },
        };

        // Persist the updated state in cache
        queryClient.setQueryData(["post", postId], updatedPost);

        // Also update any queries that might contain this post
        queryClient.invalidateQueries({
          queryKey: ["posts"], // If you have a posts list query
          exact: false,
        });
      }
    },
    onError: (_, __, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
    },
  });

  const handleLikeClick = () => {
    if (!getAuth()) {
      router.push("/auth?tab=signin");
      return;
    }
    toggleMutation.mutate();
  };

  if (isLoading || !post) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Heart className="w-6 h-6 stroke-gray-500" />
        <span className="text-xs font-semibold">0</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleLikeClick}
        disabled={toggleMutation.isPending}
        className="flex items-center focus:outline-none"
        aria-label={post.isLiked ? "Unlike post" : "Like post"}
      >
        <Heart
          className={`w-6 h-6 transition-colors duration-200 ${post.isLiked ? "fill-red-500 stroke-red-500" : "md:fill-gray-500 md:stroke-gray-500 fill-white stroke-white"
            }`}
        />
      </button>
      <span className="text-xs font-semibold">{post.metadata.likesCount}</span>
    </div>
  );
};

export default LikeButton;