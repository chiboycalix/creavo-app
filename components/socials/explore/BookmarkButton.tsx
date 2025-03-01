import React from "react";
import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import { BookmarkIcon } from "@heroicons/react/24/solid";

interface BookmarkButtonProps {
  postId: number;
  initialBookmarkCount: number;
  initialIsBookmarked: boolean;
  bookmarkId?: number;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  postId,
  initialBookmarkCount,
  initialIsBookmarked,
  bookmarkId: initialBookmarkId,
}) => {
  const queryClient = useQueryClient();
  const { getAuth } = useAuth();
  const router = useRouter();

  const [isBookmarked, setIsBookmarked] = React.useState(initialIsBookmarked);
  const [bookmarkCount, setBookmarkCount] = React.useState(initialBookmarkCount);
  const [bookmarkId, setBookmarkId] = React.useState(initialBookmarkId);

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

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to bookmark post");
      }
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
              ? {
                ...post,
                bookmarked: true,
                bookmarkCount: (post.bookmarkCount || 0) + 1,
                bookmarkId: post.bookmarkId
              }
              : post
          ),
        }));

        return { ...oldData, pages: updatedPages };
      });

      setIsBookmarked(true);
      setBookmarkCount((prev) => prev + 1);

      return { previousData };
    },
    onSuccess: (result) => {
      const newBookmarkId = result?.data?.id;
      if (newBookmarkId) {
        setBookmarkId(newBookmarkId);
        queryClient.setQueryData(["infinite-posts"], (oldData: any) => {
          if (!oldData?.pages) return oldData;
          const updatedPages = oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) =>
              post.id === postId
                ? { ...post, bookmarkId: newBookmarkId }
                : post
            ),
          }));
          return { ...oldData, pages: updatedPages };
        });
      }
      console.log("Bookmarked successfully:", { postId, newBookmarkId });
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["infinite-posts"], context?.previousData);
      setIsBookmarked(initialIsBookmarked);
      setBookmarkCount(initialBookmarkCount);
      setBookmarkId(initialBookmarkId);
      console.error("Bookmark error:", err.message);
    },
    retry: false,
  });

  const unbookmarkPostMutation = useMutation({
    mutationFn: async () => {
      const url = bookmarkId
        ? `${baseUrl}/bookmark/${bookmarkId}`
        : `${baseUrl}/bookmark/delete-post-bookmark/${postId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to unbookmark post");
      }

      if (response.status !== 204 && response.body) {
        return response.json();
      }
      return null;
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
              ? {
                ...post,
                bookmarked: false,
                bookmarkCount: Math.max((post.bookmarkCount || 0) - 1, 0),
                bookmarkId: undefined
              }
              : post
          ),
        }));

        return { ...oldData, pages: updatedPages };
      });

      setIsBookmarked(false);
      setBookmarkCount((prev) => Math.max(prev - 1, 0));
      setBookmarkId(undefined);

      return { previousData };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["infinite-posts"], context?.previousData);
      setIsBookmarked(initialIsBookmarked);
      setBookmarkCount(initialBookmarkCount);
      setBookmarkId(initialBookmarkId);
      console.error("Unbookmark error:", err.message);
    },
    onSuccess: () => {
      console.log("Unbookmarked successfully:", { postId });
    },
    retry: false,
  });

  const handleToggleBookmark = () => {
    if (!getAuth()) {
      router.push("/auth?tab=signin");
      return;
    }

    if (isBookmarked) {
      console.log("Attempting to unbookmark:", { postId, bookmarkId });
      unbookmarkPostMutation.mutate();
    } else {
      console.log("Attempting to bookmark:", { postId });
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
              ? "fill-primary-500 stroke-primary-500"
              : "md:hover:stroke-primary-500 stroke-white fill-white md:fill-gray-400 md:hover:fill-primary-500"
            }`}
        />
      </button>
      <span className="text-xs font-semibold">{bookmarkCount}</span>
    </div>
  );
};

export default BookmarkButton;