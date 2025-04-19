"use client"

import React, { useEffect } from "react"
import Cookies from "js-cookie"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Check } from "lucide-react"
import { baseUrl } from "@/utils/constant"
import { useWebSocket } from "@/context/WebSocket"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface FollowButtonProps {
  followedId: number | string
  avatar: string
  initialFollowStatus?: boolean
  isMyPost: boolean
  userInitial: string
}

const FollowButton: React.FC<FollowButtonProps> = ({
  followedId,
  avatar,
  isMyPost,
  initialFollowStatus = false,
  userInitial,
}) => {
  const queryClient = useQueryClient()
  const { getAuth } = useAuth()
  const router = useRouter()
  const ws = useWebSocket()

  const [isFollowing, setIsFollowing] = React.useState(initialFollowStatus)

  // Sync local state with prop changes
  useEffect(() => {
    setIsFollowing(initialFollowStatus)
  }, [initialFollowStatus])

  // Helper function to update query data
  const updateQueryData = (queryKey: string[], isFollowed: boolean) => {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.pages) return oldData

      const updatedPages = oldData.pages.map((page: any) => {
        // Handle followers data structure
        if (page.followers) {
          return {
            ...page,
            followers: page.followers.map((follower: any) =>
              follower.userId === followedId ? { ...follower, followed: isFollowed } : follower,
            ),
          }
        }

        // Handle posts data structure
        if (page.posts) {
          return {
            ...page,
            posts: page.posts.map((post: any) =>
              post.userId === followedId ? { ...post, followed: isFollowed } : post,
            ),
          }
        }

        return page
      })

      return { ...oldData, pages: updatedPages }
    })
  }

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!getAuth()) {
        router.push("/auth?tab=signin")
        return
      }

      const response = await fetch(`${baseUrl}/users/follows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify({ userId: followedId }),
      })

      if (!response.ok) throw new Error("Failed to follow the user")
      const result = await response.json()

      return result
    },
    onMutate: async () => {
      // Convert followedId to string for query keys
      const followedIdStr = String(followedId)

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user-followers"] })
      await queryClient.cancelQueries({ queryKey: ["infinite-posts"] })
      await queryClient.cancelQueries({ queryKey: ["user", followedIdStr] })

      // Save previous data for rollback
      const previousFollowersData = queryClient.getQueryData(["user-followers", followedIdStr])
      const previousPostsData = queryClient.getQueryData(["infinite-posts"])
      const previousUserData = queryClient.getQueryData(["user", followedIdStr])

      // Update all relevant queries
      updateQueryData(["user-followers", followedIdStr], true)
      updateQueryData(["infinite-posts"], true)

      // Update user profile data if it exists
      if (previousUserData) {
        queryClient.setQueryData(["user", followedIdStr], (oldData: any) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            followed: true,
            followersCount: (oldData.followersCount || 0) + 1,
          }
        })
      }

      // Update local state
      setIsFollowing(true)

      return { previousFollowersData, previousPostsData, previousUserData, followedIdStr }
    },
    onError: (err, _, context) => {
      // Revert on error
      if (context?.previousFollowersData) {
        queryClient.setQueryData(["user-followers", context.followedIdStr], context.previousFollowersData)
      }

      if (context?.previousPostsData) {
        queryClient.setQueryData(["infinite-posts"], context.previousPostsData)
      }

      if (context?.previousUserData) {
        queryClient.setQueryData(["user", context.followedIdStr], context.previousUserData)
      }

      setIsFollowing(initialFollowStatus)
    },
    onSuccess: () => {
      const followedIdStr = String(followedId)
      queryClient.invalidateQueries({ queryKey: ["user-followers", followedIdStr] })
      queryClient.invalidateQueries({ queryKey: ["infinite-posts"] })
      queryClient.invalidateQueries({ queryKey: ["user", followedIdStr] })
    },
  })

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch(`${baseUrl}/users/${followedId}/unfollow`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        })

        if (!response.ok) throw new Error("Failed to unfollow the user")

        // Check if the response has content before trying to parse it
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json") && response.headers.get("content-length") !== "0") {
          return response.json()
        }

        // Return an empty object if there's no JSON content
        return { success: true }
      } catch (error) {
        console.error("Unfollow error:", error)
        throw error
      }
    },
    onMutate: async () => {
      // Convert followedId to string for query keys
      const followedIdStr = String(followedId)

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["user-followers"] })
      await queryClient.cancelQueries({ queryKey: ["infinite-posts"] })

      const previousFollowersData = queryClient.getQueryData(["user-followers", followedIdStr])
      queryClient.setQueryData(["user-followers", followedIdStr], (oldData: any) => {
        if (!oldData?.pages) return oldData
        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          followers: page.followers?.map((follower: any) =>
            follower.userId === followedId ? { ...follower, followed: false } : follower,
          ),
        }))
        return { ...oldData, pages: updatedPages }
      })

      const previousPostsData = queryClient.getQueryData(["infinite-posts"])
      queryClient.setQueryData(["infinite-posts"], (oldData: any) => {
        if (!oldData?.pages) return oldData
        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts?.map((post: any) => (post.userId === followedId ? { ...post, followed: false } : post)),
        }))
        return { ...oldData, pages: updatedPages }
      })

      const previousUserData = queryClient.getQueryData(["user", followedIdStr])
      if (previousUserData) {
        queryClient.setQueryData(["user", followedIdStr], (oldData: any) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            followed: false,
            followersCount: Math.max((oldData.followersCount || 0) - 1, 0),
          }
        })
      }
      setIsFollowing(false)

      return { previousFollowersData, previousPostsData, previousUserData, followedIdStr }
    },
    onError: (err, _, context) => {
      if (context?.previousFollowersData) {
        queryClient.setQueryData(["user-followers", context.followedIdStr], context.previousFollowersData)
      }

      if (context?.previousPostsData) {
        queryClient.setQueryData(["infinite-posts"], context.previousPostsData)
      }

      if (context?.previousUserData) {
        queryClient.setQueryData(["user", context.followedIdStr], context.previousUserData)
      }

      setIsFollowing(initialFollowStatus)
    },
    onSuccess: () => {
      const followedIdStr = String(followedId)
      queryClient.invalidateQueries({ queryKey: ["user-followers", followedIdStr] })
      queryClient.invalidateQueries({ queryKey: ["infinite-posts"] })
      queryClient.invalidateQueries({ queryKey: ["user", followedIdStr] })
      setIsFollowing(false)
    },
  })

  const handleToggleFollow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!getAuth()) {
      router.push("/auth?tab=signin")
      return
    }

    if (isFollowing) {
      unfollowMutation.mutate()
    } else {
      followMutation.mutate()
    }
  }

  return (
    <div
      className={cn(
        "relative bg-white border-white border-2 rounded-full flex flex-col items-center justify-center",
        isMyPost ? "mb-0" : "mb-4",
      )}
    >
      <Link href={`/socials/profile/${followedId}`}>
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar} alt="User avatar" className="object-cover" />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
      </Link>
      {!isMyPost && (
        <button
          onClick={handleToggleFollow}
          aria-label={isFollowing ? "Unfollow this user" : "Follow this user"}
          disabled={followMutation.isPending || unfollowMutation.isPending}
          className="bg-primary-700 absolute -bottom-3 left-3 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 hover:bg-primary-800 disabled:opacity-50"
        >
          {isFollowing ? (
            <Check className="text-sm text-white w-5 h-5" />
          ) : (
            <Plus className="text-sm text-white w-5 h-5" />
          )}
        </button>
      )}
    </div>
  )
}

export default FollowButton