import React, { useState } from "react";
import Cookies from "js-cookie";
import { Bookmark, BookmarkIcon } from "lucide-react";
import { BookMarkedIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import { useWebSocket } from "@/context/WebSocket";
import { toggleBookmark } from "@/services/bookmark.service"; // Import the new function

interface BookmarkButtonProps {
  postId: number;
  initialBookmarksCount: number;
  initialIsBookmarked: boolean;
  bookmarkedId: number;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  postId,
  initialBookmarksCount,
  initialIsBookmarked: isBookmarked,
  bookmarkedId,
}) => {
  const queryClient = useQueryClient();
  const { getAuth } = useAuth();
  const router = useRouter();
  const ws = useWebSocket();

  // Mutation for toggling the bookmark
  const bookmarkMutation = useMutation({
    mutationFn: () => toggleBookmark(postId), // Use the new function
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["bookmarkStatus", postId] });

      // Optimistically update the bookmark status and count
      queryClient.setQueryData(["bookmarkStatus", postId], { data: { bookmarked: !isBookmarked } });

      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId
            ? { ...post, bookmarked: !isBookmarked, bookmarksCount: post.bookmarksCount + (isBookmarked ? -1 : 1) }
            : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });

      return { previousBookmarksCount: initialBookmarksCount };
    },
    onError: (_, __, context) => {
      // Revert to the previous bookmarks count on error
      queryClient.setQueryData(["bookmarkStatus", postId], { data: { bookmarked: isBookmarked } });
      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId
            ? { ...post, bookmarked: isBookmarked, bookmarksCount: context?.previousBookmarksCount }
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
    if (!getAuth()) {
      router.push("/auth?tab=signin");
      return;
    }

    bookmarkMutation.mutate(); // Call the mutation to toggle the bookmark
  };

  // Get the current bookmarks count from the cache or use the initial value
  const currentBookmarksCount =
    queryClient.getQueryData<{ data: { posts: { id: number; bookmarksCount: number }[] } }>(["posts"])?.data?.posts.find((post) => post.id === postId)?.bookmarksCount ??
    initialBookmarksCount;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleToggleBookmark}
        disabled={bookmarkMutation.isPending}
        className="flex items-center focus:outline-none transition-opacity disabled:opacity-50"
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <BookmarkIcon
          className={`w-8 h-8 transition-colors duration-200 
            ${isBookmarked
              ? "fill-primary-500 stroke-primary-500"
              : "md:hover:stroke-primary-500 stroke-white fill-white md:fill-gray-400 md:hover:fill-primary-500"
            }`}
        />
      </button>
      <span className="text-xs font-semibold">{currentBookmarksCount}</span>
    </div>
  );
};

export default BookmarkButton;
