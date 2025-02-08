import type React from "react"
import { Button } from "@/components/ui/button"
import { Heart, Share, Share2, Eye, ChevronDown, ChevronUp } from "lucide-react"
import MediaWrapper from "./post/MediaWrapper"
import { useState } from "react"
import { HeartIcon, ChatBubbleOvalLeftEllipsisIcon, BookmarkIcon, EyeIcon } from "@heroicons/react/24/solid"
import { RiShareForwardFill } from "react-icons/ri";
import { VscEye } from "react-icons/vsc";
interface SocialMetric {
  icon: React.ReactNode
  count: string
}

export default function SocialPost({ post }: { post: any }) {
  const [showAllTags, setShowAllTags] = useState(false)

  const metrics: SocialMetric[] = [
    { icon: <HeartIcon className="w-6 h-6" />, count: "243.7K" },
    { icon: <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />, count: "2156k" },
    { icon: <BookmarkIcon className="w-6 h-6" />, count: "188.9K" },
    { icon: <VscEye className="w-6 h-6" />, count: "200.9k" },
    { icon: <RiShareForwardFill className="w-6 h-6" />, count: "202.2K" },
  ]

  const tags = ["fyp", "biker", "bikergirlsof", "bikerboys",
    "bikerboysof", "bikersof", "bikerchick", "fyp", "biker",
    "bikergirlsof", "bikerboys", "bikerboysof",
    "bikersof", "bikerchick"]

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
                  <h3 className="font-semibold">kambeani</h3>
                  <span className="text-gray-400">Kimberly</span>
                </div>
                <div className="relative">
                  <div className={`flex flex-wrap gap-2 mt-1 ${!showAllTags && 'max-h-[1rem]'} overflow-hidden transition-all duration-300`}>
                    <p className="text-xs">As a user, I want to receive notifications about likes, comments, and shares so that I can track engagement on my content.</p>
                    {tags.map((tag, index) => (
                      <span key={index} className="text-gray-400 text-xs">
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
          <Button>Follow</Button>
        </div>
        <div className="flex-1">
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