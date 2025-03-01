import React from "react";
import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import { BookmarkIcon } from "@heroicons/react/24/solid"

interface BookmarkButtonProps {
  postId: number;
  initialBookmarkCount: number;
  initialIsBookmarked: boolean;
  bookmarkId?: number;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  postId,
  initialBookmarkCount,
  initialIsBookmarked: isBookmarked,
  bookmarkId,
}) => {
  const queryClient = useQueryClient();
  const { getAuth, currentUser } = useAuth();
  const router = useRouter();

  const newBookmarkId = currentUser?.id
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

      queryClient.setQueryData(['bookmarkStatus', postId], { data: { bookmarked: true } });

      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId ? { ...post, bookmarked: true, bookmarkCount: post.bookmarkCount + 1 } : post
        );

        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });

      return { previousBookmarkCount: initialBookmarkCount };

    },

    onError: (_, __, context) => {
      queryClient.setQueryData(["bookmarkStatus", postId], {
        data: { bookmarked: false },
      });

      queryClient.setQueriesData({ queryKey: ['posts'] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;

        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId ? { ...post, bookmarked: false, bookmarkCount: context?.previousBookmarkCount } : post
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
      if (!bookmarkId) throw new Error("No bookmark ID available");

      const response = await fetch(`${baseUrl}/bookmark/delete-post-bookmark/${postId}`, {
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

      return { previousBookmarked: isBookmarked };
    },
    onError: () => {
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

  console.log("explore.....*****", { isBookmarked, bookmarkId, postId })

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
              ? "fill-primary-500 stroke-primary-500"
              : "md:hover:stroke-primary-500 stroke-white fill-white md:fill-gray-400 md:hover:fill-primary-500"
            }`}
        />
      </button>
    </div>
  );
};

export default BookmarkButton;