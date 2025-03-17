import React, { useState } from "react";
import Cookies from "js-cookie";
import { X, Copy, Facebook, Instagram, Twitter, Linkedin, Video, MessageCircle, Send, DownloadIcon } from "lucide-react"; // Added MessageCircle for WhatsApp, Send for Telegram
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { RiShareForwardFill } from "react-icons/ri";

interface ShareButtonProps {
  postId: number;
  initialShareCount: number;
  post: any
}

const ShareButton: React.FC<ShareButtonProps> = ({
  postId,
  initialShareCount,
  post
}) => {
  const queryClient = useQueryClient();
  const { getAuth } = useAuth();
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const shareUrl = `${window.location.origin}/socials/posts/${postId}`;


  const handleDownload = async () => {
    const media = post.media[0];
    if (!media) return;

    const token = Cookies.get("accessToken");

    if (!token) {
      console.error("No access token found");
      return;
    }

    const response = await fetch("/api/watermark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        postId: post.id,
        mediaUrl: media.url,
        mediaType: media.mimeType.startsWith("image") ? "image" : "video",
        username: post.user_username,
      }),
    });

    if (!response.ok) {
      console.error("Download failed:", await response.text());
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `post-${post.id}.${media.mimeType.startsWith("image") ? "jpg" : "mp4"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const sharePostMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${baseUrl}/posts/${postId}/share`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to share post");
      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;
        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId
            ? { ...post, shareCount: (post.shareCount || initialShareCount) + 1 }
            : post
        );
        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });
      return { previousShareCount: initialShareCount };
    },
    onError: (_, __, context) => {
      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData?.data?.posts) return oldData;
        const updatedPosts = oldData.data.posts.map((post: any) =>
          post.id === postId
            ? { ...post, shareCount: context?.previousShareCount }
            : post
        );
        return { ...oldData, data: { ...oldData.data, posts: updatedPosts } };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleShareClick = () => {
    if (!getAuth()) {
      router.push("/auth?tab=signin");
      return;
    }
    setIsPopoverOpen(true);
    sharePostMutation.mutate();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch((err) => {
      console.error("Failed to copy link:", err);
    });
  };

  const socialMediaShareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20this%20out!`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`,
    instagram: `https://www.instagram.com/`,
    tiktok: `https://www.tiktok.com/`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=Check%20this%20out!`
  };

  const handleSocialShare = (platform: keyof typeof socialMediaShareLinks) => {
    window.open(socialMediaShareLinks[platform], "_blank", "noopener,noreferrer");
  };

  const currentShareCount =
    queryClient
      .getQueryData<{ data: { posts: { id: number; shareCount: number }[] } }>(["posts"])
      ?.data.posts.find((post) => post.id === postId)?.shareCount ?? initialShareCount;

  return (
    <div className="flex flex-col items-center gap-2">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={handleShareClick}
            disabled={sharePostMutation.isPending}
            className="flex items-center focus:outline-none transition-opacity disabled:opacity-50"
            aria-label="Share post"
          >
            <RiShareForwardFill
              className={`w-8 h-8 transition-colors duration-200 
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
            <h3 className="text-lg font-semibold mb-2">Share this post</h3>

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
              <button
                className="flex flex-col items-center hover:text-primary-500"
                aria-label="download video"
              >
                <DownloadIcon onClick={handleDownload} />
                <span className="text-xs mt-1">Download</span>
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <span className="text-xs font-semibold">{currentShareCount}</span>
    </div>
  );
};

export default ShareButton;