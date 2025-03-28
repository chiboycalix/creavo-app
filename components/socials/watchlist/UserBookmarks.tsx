"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserBookmarks } from "@/services/bookmark.service";
import { Bookmark, AlertCircle, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { baseUrl } from "@/utils/constant";
import { toast } from "sonner";
import { toggleBookmark } from "@/services/bookmark.service";
import { useRouter } from "next/navigation";
interface BookmarksResponse {
  data: {
    posts: BookmarkItem[];
  };
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

interface BookmarkItem {
  id: number;
  hashtag: string;
  body: string;
  userId: number;
  status: string;
  isPrivate: boolean;
  metadata: any;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  sharesCount: number;
  bookmarkCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  username: string;
  firstName: string | "None";
  lastName: string | "None";
  avatar: string;
  media: {
    id: number;
    description: string;
    title: string;
    url: string;
    thumbnailUrl: string | "None";
    mimeType: string;
    metadata: any;
  }[];
}

interface UserBookmarksProps {
  userId?: number;
  initialLimit?: number;
}

export default function UserBookmarks({
  userId,
  initialLimit = 10,
}: UserBookmarksProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const router = useRouter();

  const fetchUserIdFromPosts = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/posts?page=1&limit=1`);
      const data = await response.json();
      if (data?.data?.posts && data.data.posts.length > 0) {
        const firstPost = data.data.posts[0];
        return firstPost.userId;
      }
      return null;
    } catch (err) {
      console.error("Error fetching userId from posts:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const initUserId = async () => {
      if (userId !== undefined) {
        setCurrentUserId(userId);
      } else {
        const fetchedUserId = await fetchUserIdFromPosts();
        setCurrentUserId(fetchedUserId || 1);
      }
    };

    initUserId();
  }, [userId, fetchUserIdFromPosts]);

  const fetchBookmarks = useCallback(async () => {
    if (currentUserId === null) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getUserBookmarks(currentUserId, page, limit);
      if (response && response.data && Array.isArray(response.data.posts)) {
        setBookmarks(response.data.posts);
        if (response.meta) {
          setTotalPages(response.meta.totalPages || 1);
        }
      } else {
        console.error("Invalid response structure:", response);
        setBookmarks([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError("Failed to load bookmarks. Please try again later.");
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, page, limit]);

  useEffect(() => {
    if (currentUserId !== null) {
      fetchBookmarks();
    }
  }, [fetchBookmarks, currentUserId]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: number) => {
    try {
      await toggleBookmark(bookmarkId);
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== bookmarkId));

      toast.success("Bookmark removed", {
        description: "The bookmark has been successfully removed.",
      });
    } catch (err) {
      console.error("Error removing bookmark:", err);
      setError("Failed to remove bookmark. Please try again.");

      toast.error("Bookmark error", {
        description: "Fail to remove.",
      });
    }
  };

  const isImage = (postMedia: any) => {
    return (
      postMedia &&
      postMedia.length > 0 &&
      /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(postMedia[0]?.url)
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        {/* <h2 className="font-bold">Your Bookmarks</h2> */}
        <Badge variant="outline" className="px-3 py-1">
          <Bookmark className="w-4 h-4 mr-2" />
          {loading ? "..." : bookmarks.length} saved
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              <div className="animate-pulse bg-gray-200 aspect-video w-full"></div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="animate-pulse h-6 w-6 bg-gray-300 rounded-full"></div>
                  <div className="animate-pulse h-4 bg-gray-300 w-24"></div>
                </div>
                <div className="animate-pulse h-4 bg-gray-300 w-full mb-1"></div>
                <div className="animate-pulse h-4 bg-gray-300 w-3/4"></div>
                <div className="flex items-center mt-2">
                  <div className="animate-pulse h-3 bg-gray-300 w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="w-full text-center p-8">
          <div className="flex flex-col items-center gap-2">
            <Bookmark className="h-12 w-12 text-muted-foreground" />
            <h3 className="font-semibold mt-2">No bookmarks found</h3>
            <p className="text-muted-foreground">
              You haven&apos;t saved any posts yet. Start bookmarking content
              you want to revisit later.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="hover:bg-gray-100 transition-colors rounded-lg cursor-pointer overflow-hidden"
              onClick={() => router.push(`/socials/posts/${bookmark.id}`)}
            >
              <div className="relative aspect-video w-full">
                {bookmark.media && bookmark.media.length > 0 ? (
                  <img
                    src={
                      (!isImage(bookmark.media) &&
                      bookmark.media[0].thumbnailUrl !== "None"
                        ? bookmark.media[0].thumbnailUrl
                        : bookmark.media[0].url) || ""
                    }
                    alt={bookmark.body}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Bookmark className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  {bookmark.avatar ? (
                    <img
                      src={bookmark.avatar || "/placeholder.svg"}
                      alt={bookmark?.username[0]}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full object-cover font-bold border inline-flex justify-center items-center text-center p-1">
                      {bookmark?.firstName[0] + bookmark?.lastName[0]}
                    </div>
                  )}
                  <h3 className="font-medium text-sm truncate">
                    {bookmark.hashtag || bookmark.username}
                  </h3>
                </div>
                <p className="text-sm mb-2 line-clamp-2">{bookmark.body}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span className="flex items-center">
                    <Heart className="w-3 h-3 mr-1" /> {bookmark.likesCount}{" "}
                    likes
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(bookmark.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="text-sm text-blue-500 disabled:text-gray-400"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="text-sm text-blue-500 disabled:text-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}
