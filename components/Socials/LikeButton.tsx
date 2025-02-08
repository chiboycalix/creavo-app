import { baseUrl } from "@/utils/constant";
import React from 'react';
import { Heart } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  likes: number;
  isLiked: boolean;
}

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initiallyLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLikes,
  initiallyLiked,
}) => {
  const queryClient = useQueryClient();
  const { getAuth } = useAuth();
  const router = useRouter();
  const [currentState, setCurrentState] = React.useState({
    likes: initialLikes,
    isLiked: initiallyLiked,
  });

  const toggleLike = async () => {
    const response = await fetch(`${baseUrl}/posts/${postId}/toggle-like`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to toggle like');
    }

    return response.json();
  };

  const toggleMutation = useMutation({
    mutationFn: toggleLike,
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      // Get the current state
      const previousState = {
        likes: currentState.likes,
        isLiked: currentState.isLiked,
      };

      // Calculate new state
      const newState = {
        likes: previousState.isLiked ? previousState.likes - 1 : previousState.likes + 1,
        isLiked: !previousState.isLiked,
      };

      // Update local state
      setCurrentState(newState);

      // Update cache if it exists
      queryClient.setQueryData<Post>(['post', postId], (old) =>
        old ? { ...old, ...newState } : { id: postId, ...newState }
      );

      return { previousState };
    },
    onError: (err, variables, context) => {
      if (context) {
        // Revert local state
        setCurrentState(context.previousState);

        // Revert cache if it exists
        queryClient.setQueryData<Post>(['post', postId], (old) =>
          old ? { ...old, ...context.previousState } : { id: postId, ...context.previousState }
        );
      }
    },
    onSettled: () => {
      // Refetch to ensure server state
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  const handleLikeClick = () => {
    if (!getAuth()) {
      router.push("/auth?tab=signin");
      return;
    }
    toggleMutation.mutate();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleLikeClick}
        disabled={toggleMutation.isPending}
        className="flex items-center focus:outline-none"
        aria-label={currentState.isLiked ? "Unlike post" : "Like post"}
      >
        <Heart
          className={`w-6 h-6 transition-colors duration-200 ${currentState.isLiked ? 'fill-red-500 stroke-red-500' : 'sm:fill-gray-500 sm:text-gray-500 fill-white text-white'
            }`}
        />
      </button>
      <span className="text-xs sm:text-gray-800 text-white font-semibold">{currentState.likes}</span>
    </div>
  );
};

export default LikeButton;