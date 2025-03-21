import React, { useState, useEffect } from 'react'
import GallerySlider from './GallerySlider'
import Cookies from "js-cookie";
import { FaPlay, FaPause } from 'react-icons/fa'
import { PostMediaType, usePost } from '@/context/PostContext'
import { useVideoPlayback } from '@/context/VideoPlaybackContext'
import { baseUrl } from '@/utils/constant'
import { getMimeTypeFromCloudinaryUrl } from '@/utils';
import { cn } from '@/lib/utils';

type MediaWrapperProps = {
  postMedia?: PostMediaType[]
  postId?: number
  media?: string
  mediaClass?: string
  isRenderedInComment?: boolean;
  imageRef: any;
  videoRef: any;
  handleImageLoad: any;
  handleVideoLoad: any;
  isLandscape: boolean;
}

const MediaWrapper: React.FC<MediaWrapperProps> = ({
  postMedia,
  postId,
  isRenderedInComment,
  imageRef,
  videoRef,
  handleImageLoad,
  handleVideoLoad,
  isLandscape
}) => {

  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hasBeenViewed, setHasBeenViewed] = useState(false)
  const { updateViewsCount } = usePost()
  const { isGloballyPaused, setIsGloballyPaused } = useVideoPlayback()
  const mimeType = getMimeTypeFromCloudinaryUrl(postMedia && postMedia[0]?.url || '');

  const isImage = mimeType === "image/*" || (postMedia && (postMedia && postMedia[0]?.mimeType === 'image/jpeg') || postMedia && postMedia[0]?.mimeType === 'image/*')

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current) {
        const progress =
          (videoRef.current.currentTime / videoRef.current.duration) * 100
        setProgress(progress)
      }
    }

    const video = videoRef.current
    if (video) {
      video.addEventListener('timeupdate', updateProgress)
    }

    return () => {
      if (video) {
        video.removeEventListener('timeupdate', updateProgress)
      }
    }
  }, [videoRef])

  useEffect(() => {
    if (isImage) return

    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isGloballyPaused) {
            if (!hasBeenViewed && postId) {
              updateViewsCount(postId, (count: number) => count + 1)
              setHasBeenViewed(true)

              if (postMedia) {
                fetch(
                  `${baseUrl}/media/${postMedia[0].id}/view`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${Cookies.get(
                        'accessToken'
                      )}`,
                    },
                    body: JSON.stringify({ mediaTimestamp: 1 }),
                  }
                ).catch(error =>
                  console.log('Error updating view count:', error)
                )
              }
            }

            video
              .play()
              .catch((error: any) => console.log('Autoplay prevented:', error))
            setIsPlaying(true)
          } else {
            video.pause()
            setIsPlaying(false)
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(video)

    // Page Visibility API
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause()
        setIsPlaying(false)
        setIsGloballyPaused(true)
      } else {
        setIsGloballyPaused(false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (video) observer.unobserve(video)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isImage, hasBeenViewed, postId, updateViewsCount, postMedia, isGloballyPaused, setIsGloballyPaused, videoRef])

  // Effect to handle global pause state
  useEffect(() => {
    if (isGloballyPaused && isPlaying) {
      videoRef.current?.pause()
      setIsPlaying(false)
    }
  }, [isGloballyPaused, isPlaying, videoRef])

  return (
    <div className={`flex flex-1 gap-4 items-center justify-center w-full h-full`}>
      {isImage ? (
        <GallerySlider
          galleryImgs={postMedia!}
          className={cn(
            "object-contain rounded-xl",
            isLandscape ? "w-full h-auto max-h-full" : "w-auto max-h-[87vh]"
          )}
          isRenderedInComment={isRenderedInComment}
          handleImageLoad={handleImageLoad}
          handleVideoLoad={handleVideoLoad}
          imageRef={imageRef}
          videoRef={videoRef}
          isLandscape={isLandscape}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            src={postMedia?.[0]?.url || ''}
            className={cn(
              "object-contain rounded-xl",
              isLandscape ? "w-full h-auto max-h-screen" : "h-full w-auto max-h-[85vh]"
            )}
            loop
            playsInline
          />
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
            style={{ opacity: isPlaying ? 0 : 1 }}
            onClick={togglePlay}
          >
            <button
              onClick={togglePlay}
              className="text-white text-6xl transform transition-transform duration-300 hover:scale-110"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>
          <div className="absolute left-[0.3rem] bottom-[0.07rem] w-[99%] z-50 h-1 bg-gray-200 rounded-b-full">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default MediaWrapper
