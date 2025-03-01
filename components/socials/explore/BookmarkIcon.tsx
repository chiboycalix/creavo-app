"use client";

import Cookies from "js-cookie";
import { BookmarkIcon as SolidBookmark } from "@heroicons/react/24/solid";
import { BookmarkIcon as OutlineBookmark } from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/context/WebSocket";
import { baseUrl } from "@/utils/constant";

interface BookmarkButtonProps {
  postId: number;
  initialIsBookmarked: boolean;
  bookmarkCount?: number;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  postId,
  initialIsBookmarked,
  bookmarkCount = 0,
}) => {
  const queryClient = useQueryClient();
  const { getAuth, getCurrentUser } = useAuth();
  const router = useRouter();
  const ws = useWebSocket();
  const currentUser = getCurrentUser();
  const isAuthenticated = getAuth();

  // Fetch bookmark status
  const { data: bookmarkStatus } = useQuery({
    queryKey: ["bookmarkStatus", postId],
    queryFn: async () => {
      if (!isAuthenticated) return { data: { bookmarked: initialIsBookmarked } };

      const response = await fetch(`${baseUrl}/posts/${postId}/bookmark-status`, {
        headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch bookmark status");
      return response.json();
    },
    enabled: !!isAuthenticated,
    staleTime: 0,
    refetchInterval: 500,
    placeholderData: { data: { bookmarked: initialIsBookmarked } },
  });

  const isBookmarked = bookmarkStatus?.data?.bookmarked ?? initialIsBookmarked;

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${baseUrl}/posts/${postId}/toggle-bookmark`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to toggle bookmark");
      const result = await response.json();

      // Emit WebSocket event
      if (ws && ws.connected) {
        const request = {
          userId: currentUser?.id,
          notificationId: result?.data?.id,
        };
        ws.emit("bookmark", request);
      } else {
        console.log("Failed to emit bookmark event", currentUser?.id);
      }

      return result;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["bookmarkStatus", postId] });

      // Store previous bookmark count
      const previousBookmarkCount =
        queryClient.getQueryData<{ data: { posts: { id: number; bookmarkCount: number }[] } }>([
          "posts",
        ])?.data?.posts.find((post) => post.id === postId)?.bookmarkCount ?? bookmarkCount;

      // Optimistic UI update
      queryClient.setQueryData(["bookmarkStatus", postId], {
        data: { bookmarked: !isBookmarked },
      });

      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId
            ? { ...post, bookmarked: !isBookmarked, bookmarkCount: post.bookmarkCount + (isBookmarked ? -1 : 1) }
            : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });

      return { previousBookmarkCount }; // Return previous count for rollback
    },
    onError: (_, __, context: { previousBookmarkCount: number } | undefined) => {
      queryClient.setQueryData(["bookmarkStatus", postId], {
        data: { bookmarked: isBookmarked },
      });

      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId
            ? { ...post, bookmarked: isBookmarked, bookmarkCount: context?.previousBookmarkCount ?? bookmarkCount }
            : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarkStatus", postId] });
    },
  });

  const handleToggleBookmark = () => {
    if (!isAuthenticated) {
      router.push("/auth?tab=signin");
      return;
    }
    bookmarkMutation.mutate();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleToggleBookmark}
        disabled={bookmarkMutation.isPending}
        className="flex items-center focus:outline-none transition-opacity disabled:opacity-50"
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        {isBookmarked ? (
          <SolidBookmark className="w-8 h-8 text-yellow-400" />
        ) : (
          <OutlineBookmark className="w-8 h-8 text-white sm:text-gray-400 hover:text-yellow-400" />
        )}
      </button>
      <span className="text-xs font-semibold">{bookmarkCount}</span>
    </div>
  );
};

export default BookmarkButton;
