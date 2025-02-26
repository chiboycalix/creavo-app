import React from "react";
import Cookies from "js-cookie";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import { ChatBubbleOvalLeftEllipsisIcon, BookmarkIcon } from "@heroicons/react/24/solid"

interface BookmarkButtonProps {
  postId: number;
  initialIsBookmarked: boolean;
  bookmarkId?: number;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  postId,
  initialIsBookmarked,
  bookmarkId: initialBookmarkId,
}) => {
  const queryClient = useQueryClient();
  const { getAuth } = useAuth();
  const router = useRouter();

  const { data: bookmarkStatus } = useQuery({
    queryKey: ["bookmarkStatus", postId],
    queryFn: async () => {
      if (!getAuth()) return { data: { bookmarked: initialIsBookmarked, bookmarkId: initialBookmarkId } };

      const response = await fetch(`${baseUrl}/posts/${postId}/bookmark-status`, {
        headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch bookmark status");
      return response.json();
    },
    enabled: !!getAuth(),
    staleTime: 0,
    refetchInterval: 500,
    placeholderData: { data: { bookmarked: initialIsBookmarked, bookmarkId: initialBookmarkId } },
  });

  const isBookmarked = bookmarkStatus?.data?.bookmarked ?? initialIsBookmarked;
  const currentBookmarkId = bookmarkStatus?.data?.bookmarkId ?? initialBookmarkId;

  // Bookmark post mutation
  const bookmarkPostMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${baseUrl}/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify({
          interactableId: postId,
          interactableType: "POST",
        }),
      });

      if (!response.ok) throw new Error("Failed to bookmark post");
      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["bookmarkStatus", postId] });

      // Optimistically update the bookmark status
      const newBookmarkId = currentBookmarkId || Date.now(); // Temporary ID if none exists
      queryClient.setQueryData(["bookmarkStatus", postId], {
        data: { bookmarked: true, bookmarkId: newBookmarkId },
      });

      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId ? { ...post, bookmarked: true } : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });

      return { previousBookmarked: initialIsBookmarked };
    },
    onError: () => {
      queryClient.setQueryData(["bookmarkStatus", postId], {
        data: { bookmarked: false, bookmarkId: initialBookmarkId },
      });
      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId ? { ...post, bookmarked: false } : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarkStatus", postId] });
    },
  });

  // Unbookmark post mutation
  const unbookmarkPostMutation = useMutation({
    mutationFn: async () => {
      if (!currentBookmarkId) throw new Error("No bookmark ID available");

      const response = await fetch(`${baseUrl}/bookmark/${currentBookmarkId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to unbookmark post");
      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["bookmarkStatus", postId] });

      // Optimistically update the bookmark status
      queryClient.setQueryData(["bookmarkStatus", postId], {
        data: { bookmarked: false, bookmarkId: null },
      });

      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId ? { ...post, bookmarked: false } : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });

      return { previousBookmarked: initialIsBookmarked };
    },
    onError: () => {
      queryClient.setQueryData(["bookmarkStatus", postId], {
        data: { bookmarked: true, bookmarkId: currentBookmarkId },
      });
      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId ? { ...post, bookmarked: true } : post
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

    if (isBookmarked) {
      unbookmarkPostMutation.mutate();
    } else {
      bookmarkPostMutation.mutate();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleToggleBookmark}
        disabled={bookmarkPostMutation.isPending || unbookmarkPostMutation.isPending}
        className="flex items-center focus:outline-none transition-opacity disabled:opacity-50"
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <BookmarkIcon
          className={`w-8 h-8 transition-colors duration-200 
            ${isBookmarked
              ? "fill-blue-500 stroke-blue-500"
              : "md:hover:stroke-blue-500 stroke-white fill-white md:fill-gray-400 md:hover:fill-blue-500"
            }`}
        />
      </button>
    </div>
  );
};

export default BookmarkButton;