import type React from "react";
import MediaWrapper from "../../post/MediaWrapper";
import ShareButton from "./ShareButton";
import dynamic from "next/dynamic";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { VscEye } from "react-icons/vsc";
import { useAuth } from "@/context/AuthContext";
import { useComments } from "@/context/CommentsContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatCommentDate } from "@/utils";

const BookmarkButton = dynamic(() => import("./BookmarkButton"), { ssr: false });
const LikeButton = dynamic(() => import("./LikeButton"), { ssr: false });
const FollowButton = dynamic(() => import("./FollowButton"), { ssr: false });

interface SocialMetric {
  icon: React.ReactNode;
  count?: string;
}

export default function SocialPost({ post, ref }: { post: any; ref: any }) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { getCurrentUser } = useAuth();
  const { toggleComments } = useComments();
  const currentUserId = getCurrentUser()?.id;
  const router = useRouter();
  const hashtagFromCourse = post?.hashtag.match(/##(\w+)/g)?.map((tag: string) => tag.replace("##", "")) || [];
  const hashtagFromPost = post?.hashtag.match(/#(\w+)/g)?.map((tag: string) => tag.replace("##", "")) || [];
  const tags = hashtagFromCourse.length > 0 ? hashtagFromCourse : hashtagFromPost;
  const [isLandscape, setIsLandscape] = useState(false);

  const handleDownloadStatusChange = (downloading: boolean, progress: number) => {
    setIsDownloading(downloading);
    setDownloadProgress(progress);
    if (!downloading && progress === 100) {
      setIsDownloaded(true);
    }
  };

  useEffect(() => {
    if (isDownloaded) {
      const timer = setTimeout(() => {
        setIsDownloaded(false);
        setIsDownloading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isDownloaded]);

  const metrics: SocialMetric[] = [
    {
      icon: (
        <LikeButton
          postId={post.id}
          likedId={post.userId}
          initialLikesCount={post.likesCount}
          initialIsLiked={post.liked || false}
        />
      ),
    },
    {
      icon: (
        <ChatBubbleOvalLeftEllipsisIcon
          className="w-8 h-8 text-white sm:text-[#BFBFBF]"
          onClick={() => toggleComments(post?.id)}
        />
      ),
      count: post?.commentsCount,
    },
    {
      icon: (
        <BookmarkButton
          postId={post.id}
          bookmarkId={post.userId}
          initialBookmarkCount={post?.bookmarkCount}
          initialIsBookmarked={post.bookmarked}
        />
      ),
    },
    { icon: <VscEye className="w-8 h-8 text-white sm:text-[#BFBFBF]" />, count: post?.viewsCount },
    {
      icon: (
        <ShareButton
          postId={post.id}
          initialShareCount={post?.sharesCount}
          post={post}
          onDownloadStatusChange={handleDownloadStatusChange}
        />
      ),
    },
  ];

  const handleNavigateToCourse = (id: any) => {
    router.push(`/market/product/${id}`);
  };

  return (
    <div data-post-id={post.id} ref={ref} className="flex items-end gap-4 w-full md:max-w-xl mx-auto h-full mb-0 relative  overflow-x-hidden">
      {/* Main Post Container */}
      <div className=" text-white sm:rounded-xl rounded-none overflow-hidden flex-grow bg-black border-none md:border">
        <div className="relative">
          {/* Main Image */}
          <div className="w-full h-full relative overflow-x-hidden">
            <MediaWrapper
              postId={post?.id}
              title={post?.title}
              postMedia={post?.media}
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
                <div className="text-sm rounded-full cursor-pointer">{metric.icon}</div>
                <span className="text-xs font-semibold">{metric.count}</span>
              </div>
            ))}
          </div>

          {/* Profile Section */}
          <div className="absolute w-full bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 pt-4">
                  <h3 className="font-semibold inline-flex gap-1 items-center">
                    <span> {post?.user_username}</span>
                    <span className="text-xs text-gray-300 mt-0.5">
                      {formatCommentDate(post.createdAt)}
                    </span>
                  </h3>
                  {post?.metadata !== null && (
                    <Button className="cursor-pointer" onClick={() => handleNavigateToCourse(post?.metadata?.courseId)}>
                      Learn more
                    </Button>
                  )}
                </div>
                <div className="relative w-full">
                  <div className={`flex flex-wrap gap-2 mt-1 ${!showAllTags && "max-h-[1.6rem]"} overflow-hidden transition-all duration-300`}>
                    <div>
                      <p className="text-xs leading-6">{post.body}</p>
                    </div>
                    {tags.map((tag: any, index: number) => (
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
              <div className="text-sm rounded-full cursor-pointer transition-colors">{metric.icon}</div>
              <span className="text-xs text-gray-800 font-semibold">{metric.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar with Percentage or Downloaded Message */}
      {(isDownloading || isDownloaded) && (
        <div className="absolute bottom-0 left-0 w-[87%] flex flex-col items-center justify-between py-1 rounded-b-xl">
          <span className="text-white text-xs font-semibold ml-2 whitespace-nowrap">
            {isDownloaded ? "Downloaded" : `${downloadProgress}% Saving...`}
          </span>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300 ease-in-out"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}