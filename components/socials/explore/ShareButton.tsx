"use client"

import type React from "react"
import { useState } from "react"
import Cookies from "js-cookie"
import { X, Copy, Facebook, Instagram, Twitter, Linkedin, Video, MessageCircle, Send, DownloadIcon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { baseUrl } from "@/utils/constant"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input"
import { RiShareForwardFill } from "react-icons/ri"

interface ShareButtonProps {
  postId: number
  initialShareCount?: number
  type: "post" | "profile"
  post?: any // Post or profile data
  onDownloadStatusChange?: (isDownloading: boolean, progress: number) => void
}

const ShareButton: React.FC<ShareButtonProps> = ({ postId, initialShareCount, type, post, onDownloadStatusChange }) => {
  const queryClient = useQueryClient()
  const { getAuth } = useAuth()
  const router = useRouter()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  // Generate appropriate share URL based on type
  const shareUrl =
    type === "post"
      ? `${window.location.origin}/socials/posts/${postId}`
      : `${window.location.origin}/socials/profile/${postId}`

  const handleDownload = async () => {
    if (type !== "post" || !post || !post.media || !post.media[0]) return

    const media = post.media[0]
    const token = Cookies.get("accessToken")
    if (!token) {
      console.error("No access token found")
      return
    }

    setIsDownloading(true)
    setIsPopoverOpen(false)
    setDownloadProgress(0)
    onDownloadStatusChange?.(true, 0)

    try {
      const response = await fetch(`${baseUrl}/watermark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: post.id,
          mediaUrl: media.url,
          mediaType: media.mimeType.startsWith("image") ? "image" : "video",
          username: post.username,
        }),
      })

      if (!response.ok) {
        throw new Error("Download failed")
      }

      const totalSize = response.headers.get("content-length")
      const reader = response.body?.getReader()
      if (!reader) throw new Error("Failed to read response body")

      const chunks = []
      let receivedLength = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        chunks.push(value)
        receivedLength += value.length

        if (totalSize) {
          const progress = Math.round((receivedLength / Number.parseInt(totalSize)) * 100)
          setDownloadProgress(progress)
          onDownloadStatusChange?.(true, progress)
        } else {
          const progress = Math.min(90, downloadProgress + 10)
          setDownloadProgress(progress)
          onDownloadStatusChange?.(true, progress)
        }
      }

      const blob = new Blob(chunks)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `post-${post.id}.${media.mimeType.startsWith("image") ? "jpg" : "mp4"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setDownloadProgress(100)
      onDownloadStatusChange?.(true, 100)
      setTimeout(() => {
        setIsDownloading(false)
        onDownloadStatusChange?.(false, 100)
      }, 500)
    } catch (error) {
      console.error("Download failed:", error)
      setIsDownloading(false)
      onDownloadStatusChange?.(false, 0)
    }
  }

  const shareMutation = useMutation({
    mutationFn: async () => {
      const endpoint = type === "post" ? `${baseUrl}/posts/${postId}/share` : `${baseUrl}/profiles/${postId}/share`

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      })

      if (!response.ok) throw new Error(`Failed to share ${type}`)
      return response.json()
    },
    onMutate: async () => {
      const queryKey = type === "post" ? ["posts"] : ["profiles"]
      await queryClient.cancelQueries({ queryKey })

      if (type === "post") {
        queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
          if (!oldData?.data?.posts) return oldData
          const updatedPosts = oldData.data.posts.map((p: any) =>
            p.id === postId ? { ...p, shareCount: (p.shareCount || initialShareCount) + 1 } : p,
          )
          return { ...oldData, data: { ...oldData.data, posts: updatedPosts } }
        })
      }

      return { previousShareCount: initialShareCount }
    },
    onError: (_, __, context) => {
      if (type === "post") {
        queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
          if (!oldData?.data?.posts) return oldData
          const updatedPosts = oldData.data.posts.map((p: any) =>
            p.id === postId ? { ...p, shareCount: context?.previousShareCount } : p,
          )
          return { ...oldData, data: { ...oldData.data, posts: updatedPosts } }
        })
      } else {
        // Handle profile share count error rollback if needed
      }
    },
    onSettled: () => {
      const queryKey = type === "post" ? ["posts"] : ["profiles"]
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const handleShareClick = () => {
    if (!getAuth()) {
      router.push("/auth?tab=signin")
      return
    }
    setIsPopoverOpen(true)
    shareMutation.mutate()
  }

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy link:", err)
      })
  }

  const socialMediaShareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20this%20out!`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`,
    instagram: `https://www.instagram.com/`,
    tiktok: `https://www.tiktok.com/`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=Check%20this%20out!`,
  }

  const handleSocialShare = (platform: keyof typeof socialMediaShareLinks) => {
    window.open(socialMediaShareLinks[platform], "_blank", "noopener,noreferrer")
  }

  // Get current share count based on type
  const currentShareCount =
    type === "post"
      ? (queryClient
        .getQueryData<{ data: { posts: { id: number; shareCount: number }[] } }>(["posts"])
        ?.data.posts.find((p) => p.id === postId)?.shareCount ?? initialShareCount)
      : initialShareCount // For profiles, you might need to adjust this based on your data structure

  return (
    <div className="relative flex flex-col items-center gap-2">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={handleShareClick}
            disabled={shareMutation.isPending}
            className="flex items-center justify-center focus:outline-none transition-opacity disabled:opacity-50"
            aria-label={`Share ${type}`}
          >
            <RiShareForwardFill
              className={`w-7 h-6 mt-1.5 transition-colors duration-200 
                md:hover:stroke-primary-500 stroke-white fill-white md:fill-gray-400 md:hover:fill-primary-500`}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[620px] relative">
          <button
            onClick={() => setIsPopoverOpen(false)}
            className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full"
            aria-label="Close popover"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Share this {type}</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="basis-10/12">
                <Input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100 truncate"
                />
              </div>
              <div className="flex-1">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size={"lg"}
                  className="flex items-center gap-1 w-full py-0"
                >
                  <Copy className="w-4 h-4" />
                  {copySuccess ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-8 gap-4">
              <button
                onClick={() => handleSocialShare("facebook")}
                className="flex flex-col items-center hover:text-blue-600"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-6 h-6" />
                <span className="text-xs mt-1">Facebook</span>
              </button>
              <button
                onClick={() => handleSocialShare("twitter")}
                className="flex flex-col items-center hover:text-blue-400"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-6 h-6" />
                <span className="text-xs mt-1">Twitter</span>
              </button>
              <button
                onClick={() => handleSocialShare("linkedin")}
                className="flex flex-col items-center hover:text-blue-700"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
                <span className="text-xs mt-1">LinkedIn</span>
              </button>
              <button
                onClick={() => handleSocialShare("instagram")}
                className="flex flex-col items-center hover:text-pink-500"
                aria-label="Share on Instagram"
              >
                <Instagram className="w-6 h-6" />
                <span className="text-xs mt-1">Instagram</span>
              </button>
              <button
                onClick={() => handleSocialShare("tiktok")}
                className="flex flex-col items-center hover:text-black"
                aria-label="Share on TikTok"
              >
                <Video className="w-6 h-6" />
                <span className="text-xs mt-1">TikTok</span>
              </button>
              <button
                onClick={() => handleSocialShare("whatsapp")}
                className="flex flex-col items-center hover:text-green-500"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs mt-1">WhatsApp</span>
              </button>
              <button
                onClick={() => handleSocialShare("telegram")}
                className="flex flex-col items-center hover:text-blue-500"
                aria-label="Share on Telegram"
              >
                <Send className="w-6 h-6" />
                <span className="text-xs mt-1">Telegram</span>
              </button>
              {/* Only show download button for posts, not profiles */}
              {type === "post" && (
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex flex-col items-center hover:text-primary-500 disabled:opacity-50"
                  aria-label="Download media"
                >
                  <DownloadIcon className="w-6 h-6" />
                  <span className="text-xs mt-1">Download</span>
                </button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <span className="text-xs font-semibold">{currentShareCount}</span>
    </div>
  )
}

export default ShareButton

