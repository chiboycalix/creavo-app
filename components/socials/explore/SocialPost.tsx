import type React from "react"
import MediaWrapper from "../../post/MediaWrapper"
import ShareButton from "./ShareButton"
import dynamic from "next/dynamic"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid"
import { VscEye } from "react-icons/vsc";
import { useAuth } from "@/context/AuthContext"
import { useComments } from "@/context/CommentsContext"
import Cookies from "js-cookie"

const BookmarkButton = dynamic(() => import("./BookmarkButton"), { ssr: false });
const LikeButton = dynamic(() => import("./LikeButton"), { ssr: false });
const FollowButton = dynamic(() => import("./FollowButton"), { ssr: false });
interface SocialMetric {
  icon: React.ReactNode
  count?: string
}

export default function SocialPost({ post, ref }: { post: any; ref: any }) {
  const [showAllTags, setShowAllTags] = useState(false)
  const { getCurrentUser } = useAuth();
  const { toggleComments } = useComments()
  const currentUserId = getCurrentUser()?.id;

  const tags = [
    "fyp",
    "biker", "bikergirlsof", "bikerboys",
    "bikerboysof", "bikersof", "bikerchick", "fyp", "biker",
    "bikergirlsof", "bikerboys", "bikerboysof",
    "bikersof", "bikerchick"
  ]

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
        Authorization: `Bearer ${token}`, // Send token in headers
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
  const metrics: SocialMetric[] = [
    {
      icon: <LikeButton
        postId={post.id}
        likedId={post.userId}
        initialLikesCount={post.likesCount}
        initialIsLiked={post.liked || false}
      />,
    },
    {
      icon: <ChatBubbleOvalLeftEllipsisIcon
        className="w-8 h-8 text-white sm:text-[#BFBFBF]"
        onClick={() => toggleComments(post?.id)}
      />,
      count: post?.commentsCount
    },
    {
      icon: <BookmarkButton
        postId={post.id}
        bookmarkId={post.userId}
        initialBookmarkCount={post?.bookmarkCount}
        initialIsBookmarked={post.bookmarked}
      />,
    },
    { icon: <VscEye className="w-8 h-8 text-white sm:text-[#BFBFBF]" />, count: post?.viewsCount },
    {
      icon: <ShareButton
        postId={post.id}
        initialShareCount={post?.sharesCount}
      />
    },
    // {
    //   icon: <Download onClick={handleDownload} />
    // },
  ]


  return (
    <div data-post-id={post.id} ref={ref} className="flex items-end gap-4 w-full md:max-w-xl mx-auto h-full mb-0">
      {/* Main Post Container */}
      <div className="bg-black text-white sm:rounded-xl rounded-none overflow-hidden flex-grow">
        <div className="relative">
          {/* Main Image */}
          <div className="aspect-[12.5/16] relative">
            <MediaWrapper
              postId={post.id}
              title={post.title}
              size="object-cover"
              postMedia={post.media}
            />
          </div>

          {/* Metrics - Mobile & Tablet */}
          <div className="absolute right-4 bottom-10 flex flex-col gap-1 lg:hidden">
            <FollowButton
              followedId={post?.userId}
              avatar={post?.user_profile_avatar || "/assets/display.jpg"}
              initialFollowStatus={post?.followed}
              isMyPost={Number(post.userId) === currentUserId}
            />
            {metrics.map((metric, index) => (
              <div key={index} className="flex flex-col items-center mb-4">
                <div className="text-sm rounded-full cursor-pointer">
                  {metric.icon}
                </div>
                <span className="text-xs font-semibold">{metric.count}</span>
              </div>
            ))}
          </div>

          {/* Profile Section */}
          <div className="absolute w-[80%] md:w-full bottom-2 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 pt-4">
                  <h3 className="font-semibold">{post?.user_username}</h3>
                </div>
                <div className="relative w-full">

                  <div className={`flex flex-wrap gap-2 mt-1 ${!showAllTags && 'max-h-[1.6rem]'} overflow-hidden transition-all duration-300`}>
                    <div>
                      <p className="text-xs leading-6">{post.body}</p>
                    </div>
                    {tags.map((tag, index) => (
                      <span key={index} className="text-gray-400 text-xs leading-6">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  {tags.length > 6 && (
                    <button
                      onClick={() => setShowAllTags(!showAllTags)}
                      className="text-gray-400 text-sm mt-1 flex items-center gap-1 hover:text-gray-300 transition-colors"
                    >
                      {showAllTags ? (
                        <>
                          Show less <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          More <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics - Desktop */}
      <div className="hidden lg:flex flex-col h-full justify-center mb-10">
        <div className="flex flex-col gap-4 mt-auto">
          <FollowButton
            followedId={post?.userId}
            avatar={post?.user_profile_avatar || "/assets/display.jpg"}
            initialFollowStatus={post?.followed}
            isMyPost={Number(post.userId) === currentUserId}
          />

          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center mb-0">
              <div className="text-sm rounded-full cursor-pointer transition-colors">
                {metric.icon}
              </div>
              <span className="text-xs text-gray-800 font-semibold">{metric.count}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}