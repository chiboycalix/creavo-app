import type React from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, PlusCircle } from "lucide-react"
import MediaWrapper from "./post/MediaWrapper"
import { useState } from "react"
import { HeartIcon, ChatBubbleOvalLeftEllipsisIcon, BookmarkIcon, PlusIcon } from "@heroicons/react/24/solid"
import { FaCirclePlus } from "react-icons/fa6";
import { RiShareForwardFill, RiUserFollowFill } from "react-icons/ri";
import { VscEye } from "react-icons/vsc";
import { useAuth } from "@/context/AuthContext"
interface SocialMetric {
  icon: React.ReactNode
  count?: string
}

export default function SocialPost({ post }: { post: any }) {
  const [showAllTags, setShowAllTags] = useState(false)
  const { getCurrentUser } = useAuth();

  const metrics: SocialMetric[] = [
    { icon: <HeartIcon className="w-6 h-6" />, count: "243.7K" },
    { icon: <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />, count: "2156k" },
    { icon: <BookmarkIcon className="w-6 h-6" />, count: "188.9K" },
    { icon: <VscEye className="w-6 h-6" />, count: "200.9k" },
    { icon: <RiShareForwardFill className="w-6 h-6" />, count: "202.2K" },
  ]
  console.log({ post })
  const tags = ["fyp", "biker", "bikergirlsof", "bikerboys",
    "bikerboysof", "bikersof", "bikerchick", "fyp", "biker",
    "bikergirlsof", "bikerboys", "bikerboysof",
    "bikersof", "bikerchick"]
  console.log(getCurrentUser(), "getCurrentUser")
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
          <div className="absolute right-4 bottom-10 flex flex-col gap-4 lg:hidden">
            <div className="mb-4 relative bg-white border-white border-2 rounded-full flex flex-col items-center justify-center">
              <img
                src={post?.avatar}
                alt="Post author"
                className="w-10 h-10 rounded-full"
              />
              <FaCirclePlus className="text-primary-700 w-6 h-6 absolute -bottom-3 z-40 left-2" />
            </div>
            {metrics.map((metric, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div className=" p-2 rounded-full">{metric.icon}</div>
                <span className="text-sm font-medium">{metric.count}</span>
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
          <div className="mb-4 relative bg-white border-white border-2 rounded-full flex flex-col items-center justify-center">
            <img
              src={post?.avatar}
              alt="Post author"
              className="w-10 h-10 rounded-full"
            />
            <div className="bg-primary-700 absolute -bottom-3 left-2 rounded-full w-6 h-6 flex items-center justify-center">
              <PlusIcon className="text-sm text-white w-5 h-5" />
            </div>
          </div>
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className="text-sm text-[#BFBFBF] p-2 rounded-full cursor-pointer transition-colors">
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