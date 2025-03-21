import type React from "react";
import MediaWrapper from "../../post/MediaWrapper";
import ShareButton from "./ShareButton";
import dynamic from "next/dynamic";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { VscEye } from "react-icons/vsc";
import { useAuth } from "@/context/AuthContext";
import { useComments } from "@/context/CommentsContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getMediaDimensionsClientSide } from "@/utils";

const BookmarkButton = dynamic(() => import("./BookmarkButton"), { ssr: false });
const LikeButton = dynamic(() => import("./LikeButton"), { ssr: false });
const FollowButton = dynamic(() => import("./FollowButton"), { ssr: false });

interface SocialMetric {
  icon: React.ReactNode;
  count?: string;
}

export default function SocialPost({ post, socialPostRef, setOptionsAnchorRect, setShowOptionsMenu }: {
  post: any; socialPostRef: any, setOptionsAnchorRect: any;
  setShowOptionsMenu: any
}) {
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
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const detectOrientation = (width: number, height: number) => {
    setIsLandscape(width > height);
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      detectOrientation(naturalWidth, naturalHeight);
    }
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      detectOrientation(videoWidth, videoHeight);
    }
  };

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

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setOptionsAnchorRect(buttonRect);
    setShowOptionsMenu(true);
    toggleComments(post?.id)
  };

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
          className="w-8 h-8 text-[#BFBFBF]"
          onClick={(e: any) => handleOptionsClick(e)}
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
    { icon: <VscEye className="w-8 h-8 text-[#BFBFBF]" />, count: post?.viewsCount },
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

  // useEffect(() => {
  //   getMediaDimensionsClientSide("https://res.cloudinary.com/dlujwccdb/video/upload/v1742387359/Download_2_nisph3.mp4").then((dimen) => {
  //     console.log({ dimen })
  //   }).catch((error) => {
  //     console.log({ error })
  //   })

  // }, [])
  return (
    <div data-post-id={post.id} ref={socialPostRef}
      className={cn("mb-6 flex flex-row items-center justify-center h-[88vh] gap-4",
        isLandscape ? "w-full" : "w-full",
      )}
    >
      {/* Main Post Container */}
      <div className={cn("flex gap-4 items-center justify-center w-full relative flex-1 bg-black rounded-xl overflow-hidden h-full", isLandscape ? "max-w-3xl" : "max-w-md")}>
        <div
          className={cn(
            "flex items-center justify-center h-full",
            isLandscape ? "py-8" : ""
          )}
        >
          <MediaWrapper
            postId={post?.id}
            postMedia={post?.media}
            imageRef={imageRef}
            videoRef={videoRef}
            handleImageLoad={handleImageLoad}
            handleVideoLoad={handleVideoLoad}
            isLandscape={isLandscape}
            className={cn(
              "object-contain",
              isLandscape ? "w-full" : "h-[85vh] max-w-full"
            )}
          />

          {/* Profile Section */}
          <div className="absolute left-0 right-0 bottom-0 p-4 w-[80%] md:w-full bg-gradient-to-t from-black/90 to-transparent rounded-b-xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 pt-4">
                  <h3 className="font-semibold text-white">{post?.user_username}</h3>
                  {post?.metadata !== null && (
                    <Button className="cursor-pointer" onClick={() => handleNavigateToCourse(post?.metadata?.courseId)}>
                      Learn more
                    </Button>
                  )}
                </div>
                <div className="relative w-full">
                  <div className={`flex flex-wrap gap-2 mt-1 ${!showAllTags && "max-h-[1.6rem]"} overflow-hidden transition-all duration-300`}>
                    <div>
                      <p className="text-xs leading-6 text-white">{post.body}</p>
                    </div>
                    {tags.map((tag: any, index: number) => (
                      <span key={index} className="text-gray-300 text-xs leading-6">
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
      <div className="flex flex-col justify-center items-center">
        <FollowButton
          followedId={post?.userId}
          avatar={post?.user_profile_avatar || "/assets/display.jpg"}
          initialFollowStatus={post?.followed}
          isMyPost={Number(post.userId) === currentUserId}
        />
        {metrics.map((metric, index) => (
          <div key={index} className="flex flex-col items-center my-2">
            <div className="text-sm rounded-full cursor-pointer transition-colors">{metric.icon}</div>
            <span className="text-xs text-gray-800 font-semibold">{metric.count}</span>
          </div>
        ))}
      </div>

      {(isDownloading || isDownloaded) && (
        <div className="absolute bottom-0 left-0 w-[88%] flex flex-col items-center justify-between px-2 py-1 bg-gray-800 bg-opacity-75 rounded-b-xl">
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