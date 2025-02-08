import type React from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, PlusCircle } from "lucide-react"
import MediaWrapper from "../post/MediaWrapper"
import { useState } from "react"
import { HeartIcon, ChatBubbleOvalLeftEllipsisIcon, BookmarkIcon, PlusIcon } from "@heroicons/react/24/solid"
import { FaCirclePlus } from "react-icons/fa6";
import { RiShareForwardFill, RiUserFollowFill } from "react-icons/ri";
import { VscEye } from "react-icons/vsc";
import { useAuth } from "@/context/AuthContext"
import { usePost } from "@/context/PostContext"
import { useRouter } from "next/navigation"
import LikeButton from "./LikeButton"
import FollowButton from "./FollowButton"
interface SocialMetric {
  icon: React.ReactNode
  count?: string
}

export default function SocialPost({ post }: { post: any }) {
  const [showAllTags, setShowAllTags] = useState(false)
  const { getCurrentUser } = useAuth();
  const currId = getCurrentUser()?.id;

  console.log({ post })
  const tags = ["fyp", "biker", "bikergirlsof", "bikerboys",
    "bikerboysof", "bikersof", "bikerchick", "fyp", "biker",
    "bikergirlsof", "bikerboys", "bikerboysof",
    "bikersof", "bikerchick"]

  const metrics: SocialMetric[] = [
    {
      icon: <LikeButton
        postId={post.id}
        initialLikes={post?.metadata?.likesCount || 0}
        initiallyLiked={false}
      />,
    },
    { icon: <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-white sm:text-[#BFBFBF]" />, count: "2156k" },
    { icon: <BookmarkIcon className="w-6 h-6 text-white sm:text-[#BFBFBF]" />, count: "188.9K" },
    { icon: <VscEye className="w-6 h-6 text-white sm:text-[#BFBFBF]" />, count: post?.mediaResource?.[0]?.metadata?.viewsCount || 0 },
    { icon: <RiShareForwardFill className="w-6 h-6 text-white sm:text-[#BFBFBF]" />, count: "202.2K" },
  ]

  return (
    <div className="flex items-start gap-2 w-full md:max-w-xl mx-auto ">
      {/* Main Post Container */}
      <div className="bg-black text-white rounded-xl overflow-hidden flex-grow">
        <div className="relative">
          {/* Main Image */}
          <div className="aspect-[12.5/16] relative">
            <MediaWrapper
              postId={post.id}
              title={post.title}
              size="object-cover"
              postMedia={post.mediaResource}
            />
          </div>

          {/* Metrics - Mobile & Tablet */}
          <div className="absolute right-4 bottom-10 flex flex-col gap-1 lg:hidden">
            {
              post.userId !== currId && <FollowButton
                followedId={post.userId}
                avatar={post?.avatar}
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
                  <h3 className="font-semibold">{post?.username}</h3>
                </div>
                <div className="relative">

                  <div className={`flex flex-wrap gap-2 mt-1 ${!showAllTags && 'max-h-[1.6rem]'} overflow-hidden transition-all duration-300`}>
                    <div>
                      <p className="text-xs leading-6">{post.body}</p>
                      {/* <p className="text-xs leading-6">It looks like the click handler on the dots might not be properly attached due to incomplete or misplaced JSX. Here’s how you can fix it:</p> */}
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
      <div className="hidden lg:flex flex-col gap-4 h-full justify-between pb-4">
        <div className="basis-11/12">

        </div>
        <div className="flex-1 relative z-50">
          {
            post.userId !== currId && <FollowButton
              followedId={post.userId}
              avatar={post?.avatar}
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