import MediaWrapper from "../../post/MediaWrapper"
import LikeButton from "./LikeButton"
import FollowButton from "./FollowButton"
import type React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { ChatBubbleOvalLeftEllipsisIcon, BookmarkIcon } from "@heroicons/react/24/solid"
import { RiShareForwardFill } from "react-icons/ri";
import { VscEye } from "react-icons/vsc";
import { useAuth } from "@/context/AuthContext"
import { useComments } from "@/context/CommentsContext"

interface SocialMetric {
  icon: React.ReactNode
  count?: string
}

export default function SocialPost({ post, ref }: { post: any; ref: any }) {
  const [showAllTags, setShowAllTags] = useState(false)
  const { getCurrentUser } = useAuth();
  const { toggleComments } = useComments()
  const currId = getCurrentUser()?.id;

  const tags = [
    "fyp",
    "biker", "bikergirlsof", "bikerboys",
    "bikerboysof", "bikersof", "bikerchick", "fyp", "biker",
    "bikergirlsof", "bikerboys", "bikerboysof",
    "bikersof", "bikerchick"
  ]

  const metrics: SocialMetric[] = [
    {
      icon: <LikeButton
        postId={post.id}
        likedId={post.userId}
        initialLikesCount={post.likesCount}
        initialIsLiked={post.liked}
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
      icon: <BookmarkIcon className="w-8 h-8 text-white sm:text-[#BFBFBF]" />, count: post?.bookmarkCount
    },
    { icon: <VscEye className="w-8 h-8 text-white sm:text-[#BFBFBF]" />, count: post?.viewsCount },
    { icon: <RiShareForwardFill className="w-8 h-8 text-white sm:text-[#BFBFBF]" />, count: post?.sharesCount },
  ]

  return (
    <div data-post-id={post.id} ref={ref} className="flex items-end gap-4 w-full md:max-w-xl mx-auto h-full sm:mb-10 mb-0">
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
            {
              Number(post.userId) !== currId &&
              <FollowButton
                followedId={post?.userId}
                avatar={post?.user_profile_avatar || "/assets/display.jpg"}
                initialFollowStatus={post?.followed}
              />
            }
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
      <div className="hidden lg:flex flex-col gap-4 h-full justify-between">
        <div className="flex-1 relative z-50">
          {
            Number(post.userId) !== currId &&
            <FollowButton
              followedId={post?.userId}
              avatar={post?.user_profile_avatar || "/assets/display.jpg"}
              initialFollowStatus={post?.followed}
            />
          }

          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center mb-4">
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