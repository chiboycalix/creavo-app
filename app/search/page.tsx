"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { X, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { baseUrl } from "@/utils/constant"
import Cookies from "js-cookie"
import PostModal from "./_components/PostModal"

type ContentTab = {
  id: string
  label: string
}

type SearchResultItem = {
  id: string
  index: string
  data: {
    id: number
    type: string
    title?: string
    description?: string
    username?: string
    email?: string
    body?: string
    content?: string
    userId?: number
    media?: any[]
    [key: string]: any
  }
}

type ApiResponse = {
  data: {
    results: SearchResultItem[]
    meta: {
      totalCount: number
      limit: number
      totalPages: number
      currentPage: number
    }
  }
  message: string
  code: number
  status: string
  statusCode: number
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [activeContentTab, setActiveContentTab] = useState<string>("post")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<{
    posts: SearchResultItem[]
    courses: SearchResultItem[]
    accounts: SearchResultItem[]
  }>({
    posts: [],
    courses: [],
    accounts: [],
  })

  // Modal state
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const contentTabs: ContentTab[] = [
    { id: "post", label: "Post" },
    { id: "courses", label: "Courses" },
    { id: "account", label: "Account" },
  ]

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return

      setIsLoading(true)
      setError(null)

      try {
        const token = Cookies.get("token")

        const response = await fetch(`${baseUrl}/search/?search_query=${encodeURIComponent(query)}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch search results")
        }

        const data: ApiResponse = await response.json()

        // Categorize results by type
        const posts: SearchResultItem[] = []
        const courses: SearchResultItem[] = []
        const accounts: SearchResultItem[] = []

        data.data.results.forEach((item) => {
          if (item.data.type === "post") {
            posts.push(item)
          } else if (item.data.type === "course") {
            courses.push(item)
          } else if (item.data.type === "user") {
            accounts.push(item)
          }
        })

        setResults({
          posts,
          courses,
          accounts,
        })

        // Set active tab based on which has results
        if (activeContentTab === "post" && posts.length === 0) {
          if (courses.length > 0) {
            setActiveContentTab("courses")
          } else if (accounts.length > 0) {
            setActiveContentTab("account")
          }
        }
      } catch (err) {
        console.error("Search error:", err)
        setError("An error occurred while fetching search results")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  const openPostModal = (postId: number) => {
    setSelectedPostId(postId)
    setIsModalOpen(true)
  }

  const closePostModal = () => {
    setIsModalOpen(false)
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      )
    }

    switch (activeContentTab) {
      case "post":
        return results.posts.length > 0 ? (
         <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {results.posts.map((post) => {
    const mediaUrl = post.data.media?.[0] || "";
    const isVideo = mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm") || mediaUrl.endsWith(".ogg");
    const isImage = mediaUrl.match(/\.(jpeg|jpg|png|gif|webp|svg)$/);

    return (
      <div
        key={post.id}
        className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => openPostModal(post.data.id)}
      >
        <div className="aspect-square relative">
          {mediaUrl ? (
            isVideo ? (
              <video
                src={mediaUrl}
                className="object-cover w-full h-full"
              />
            ) : isImage ? (
              <Image
                src={mediaUrl}
                alt={post.data.title || post.data.body || "Post"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">Unsupported Media</p>
              </div>
            )
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400">No media</p>
            </div>
          )}
        </div>

        <div className="p-3">
          {post.data.title && <h3 className="font-medium">{post.data.title}</h3>}
          {(post.data.body || post.data.content) && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {post.data.body || post.data.content}
            </p>
          )}
        </div>
      </div>
    );
  })}
</div>
         </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts available</h3>
              <p className="text-gray-500">We couldnt find any posts matching your search.</p>
            </div>
          </div>
        )

      case "courses":
        return results.courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.courses.map((course) => (
              <div key={course.id} className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video relative bg-gray-100">
                  <Image
                    src={course.data.imageUrl || course.data.thumbnailUrl || "/placeholder.svg?height=200&width=400"}
                    alt={course.data.title || "Course"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">{course.data.title}</h3>
                  {course.data.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.data.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
              <p className="text-gray-500">We couldnt find any courses matching your search.</p>
            </div>
          </div>
        )

      case "account":
        return results.accounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  {account.data.avatar ? (
                    <Image
                      src={account.data.avatar || "/placeholder.svg"}
                      alt={account.data.username || "User"}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{account.data.username}</h3>
                  {account.data.email && <p className="text-sm text-gray-500">{account.data.email}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts available</h3>
              <p className="text-gray-500">We couldnt find any accounts matching your search.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Search query display */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center">
          <div className="bg-gray-100 rounded-full py-2 px-4 flex items-center">
            <span className="text-gray-800">{query}</span>
            <Link href="/" className="ml-2">
              <X className="h-5 w-5 text-blue-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content tabs */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {contentTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveContentTab(tab.id)}
                className={`py-4 px-2 relative ${
                  activeContentTab === tab.id ? "text-gray-900 font-medium" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label}
                {activeContentTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-t-md"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search results content */}
      <div className="max-w-7xl mx-auto px-4 py-8">{renderContent()}</div>

      {/* Post Modal */}
      {selectedPostId && <PostModal postId={selectedPostId} isOpen={isModalOpen} onClose={closePostModal} />}
    </div>
  )
}

