"use client"

import { useState, useEffect, useCallback } from "react"
import { getUserBookmarks } from "@/services/bookmark.service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Bookmark, ExternalLink, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { baseUrl } from "@/utils/constant"
import { toast } from "sonner"
import { toggleBookmark } from "@/services/bookmark.service"

interface BookmarksResponse {
  data: {
    posts: BookmarkItem[]
  }
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}

interface BookmarkItem {
  id: number
  hashtag: string
  body: string
  userId: number
  status: string
  isPrivate: boolean
  metadata: any
  likesCount: number
  commentsCount: number
  viewsCount: number
  sharesCount: number
  bookmarkCount: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  user_username: string
  user_profile_firstName: string | "None"
  user_profile_lastName: string | "None"
  user_profile_avatar: string
  media: {
    id: number
    description: string
    title: string
    url: string
    thumbnailUrl: string | "None"
    mimeType: string
    metadata: any
  }[]
}

interface UserBookmarksProps {
  userId?: number
  initialLimit?: number
}

export default function UserBookmarks({ userId, initialLimit = 10 }: UserBookmarksProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(initialLimit)
  const [totalPages, setTotalPages] = useState(1)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

  // Fetch posts to get userId if not provided
  const fetchUserIdFromPosts = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/posts?page=1&limit=1`)
      const data = await response.json()
      if (data?.data?.posts && data.data.posts.length > 0) {
        const firstPost = data.data.posts[0]
        return firstPost.userId
      }
      return null
    } catch (err) {
      console.error("Error fetching userId from posts:", err)
      return null
    }
  }, [])

  // Initialize userId from props or fetch from API
  useEffect(() => {
    const initUserId = async () => {
      if (userId !== undefined) {
        setCurrentUserId(userId)
      } else {
        const fetchedUserId = await fetchUserIdFromPosts()
        setCurrentUserId(fetchedUserId || 1) // Default to 1 if not found
      }
    }

    initUserId()
  }, [userId, fetchUserIdFromPosts])

  const fetchBookmarks = useCallback(async () => {
    if (currentUserId === null) return
    try {
      setLoading(true)
      setError(null)
      const response = await getUserBookmarks(currentUserId, page, limit)

      // Log the response to debug
      console.log("Bookmarks response:", response)

      if (response && response.data && Array.isArray(response.data.posts)) {
        setBookmarks(response.data.posts)
        if (response.meta) {
          setTotalPages(response.meta.totalPages || 1)
        }
      } else {
        console.error("Invalid response structure:", response)
        setBookmarks([])
        setTotalPages(1)
      }
    } catch (err) {
      setError("Failed to load bookmarks. Please try again later.")
      console.error("Error fetching bookmarks:", err)
    } finally {
      setLoading(false)
    }
  }, [currentUserId, page, limit])

  useEffect(() => {
    if (currentUserId !== null) {
      fetchBookmarks()
    }
  }, [fetchBookmarks, currentUserId])

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  const handleRemoveBookmark = async (bookmarkId: number) => {
    try {
      await toggleBookmark(bookmarkId)
      // Remove the bookmark from the local state
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== bookmarkId))

      toast.success("Bookmark removed", {
        description: "The bookmark has been successfully removed.",
      })
    } catch (err) {
      console.error("Error removing bookmark:", err)
      setError("Failed to remove bookmark. Please try again.")

      // Use toast for error
      toast.error("Bookmark error", {
        description: "Fail to  remove.",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className=" font-bold">Your Bookmarks</h2>
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
        <div className="grid grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <Card className="w-full text-center p-8">
          <div className="flex flex-col items-center gap-2">
            <Bookmark className="h-12 w-12 text-muted-foreground" />
            <h3 className=" font-semibold mt-2">No bookmarks found</h3>
            <p className="text-muted-foreground">
              You haven&apos;t saved any posts yet. Start bookmarking content you want to revisit later.
            </p>
          </div>
        </Card>
      ) : (
        <div className=" grid grid-cols-3 gap-5">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="w-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={bookmark.user_profile_avatar || "/placeholder.svg"}
                    alt={bookmark.user_username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">
                      {bookmark.user_profile_firstName !== "None" && bookmark.user_profile_lastName !== "None"
                        ? `${bookmark.user_profile_firstName} ${bookmark.user_profile_lastName}`
                        : bookmark.user_username}
                    </CardTitle>
                    <CardDescription>
                      @{bookmark.user_username} • {formatDate(bookmark.createdAt)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{bookmark.body}</p>
                {bookmark.hashtag && (
                  <Badge variant="secondary" className="mr-2">
                    {bookmark.hashtag}
                  </Badge>
                )}
                {bookmark.media && bookmark.media.length > 0 && (
                  <div className="mt-3">
                    {bookmark.media[0].mimeType.startsWith("video") ? (
                      <div className="relative">
                        <video
                          controls
                          poster={
                            bookmark.media[0].thumbnailUrl !== "None" ? bookmark.media[0].thumbnailUrl : undefined
                          }
                          className="w-full h-auto rounded-md max-h-96"
                        >
                          <source src={bookmark.media[0].url} type={bookmark.media[0].mimeType} />
                        </video>
                      </div>
                    ) : bookmark.media[0].mimeType.startsWith("image") ? (
                      <img
                        src={bookmark.media[0].url || "/placeholder.svg"}
                        alt={bookmark.media[0].title || "Post media"}
                        className="w-full h-auto rounded-md object-cover max-h-64"
                      />
                    ) : (
                      <div className="bg-muted rounded-md p-4 text-center">
                        <ExternalLink className="h-8 w-8 mx-auto mb-2" />
                        <p>{bookmark.media[0].title || "Media attachment"}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{bookmark.likesCount} likes</span>
                  <span>{bookmark.commentsCount} comments</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveBookmark(bookmark.id)}>
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

