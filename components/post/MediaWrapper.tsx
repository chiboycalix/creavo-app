import React, { useState, useRef, useEffect } from 'react';
import GallerySlider from './GallerySlider';
import Cookies from "js-cookie";
import { FaPlay, FaPause } from 'react-icons/fa';
import { PostMediaType, usePost } from '@/context/PostContext';
import { useVideoPlayback } from '@/context/VideoPlaybackContext';
import { baseUrl } from '@/utils/constant';
import { getMimeTypeFromCloudinaryUrl } from '@/utils';
import { cn } from '@/lib/utils';
import { useMediaDimensions } from '@/hooks/useDimensions';

type MediaWrapperProps = {
  title: string;
  size?: string;
  postMedia?: PostMediaType[];
  postId?: number;
  media?: string;
  mediaClass?: string;
  isRenderedInComment?: boolean;
};

const MediaWrapper: React.FC<MediaWrapperProps> = ({
  postMedia,
  postId,
  isRenderedInComment,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false); // New state for buffering
  const { updateViewsCount } = usePost();
  const { isGloballyPaused, setIsGloballyPaused } = useVideoPlayback();
  const mimeType = getMimeTypeFromCloudinaryUrl(postMedia && postMedia[0]?.url || '');

  const isImage = mimeType === "image/*" || (postMedia && (postMedia[0]?.mimeType === 'image/jpeg' || postMedia[0]?.mimeType === 'image/*'));

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const updateProgress = () => {
      if (videoRef.current) {
        const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(progress);
      }
    };

    const handleWaiting = () => {
      if (isPlaying) {
        setIsBuffering(true);
      }
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('playing', handlePlaying);
    }

    return () => {
      if (video) {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (isImage) return;

    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isGloballyPaused) {
            if (!hasBeenViewed && postId) {
              updateViewsCount(postId, (count: number) => count + 1);
              setHasBeenViewed(true);

              if (postMedia) {
                fetch(`${baseUrl}/media/${postMedia[0].id}/view`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                  },
                  body: JSON.stringify({ mediaTimestamp: 1 }),
                }).catch((error) =>
                  console.log('Error updating view count:', error)
                );
              }
            }

            video.play().catch((error) => console.log('Autoplay prevented:', error));
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        setIsPlaying(false);
        setIsGloballyPaused(true);
      } else {
        setIsGloballyPaused(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (video) observer.unobserve(video);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    isImage,
    hasBeenViewed,
    postId,
    updateViewsCount,
    postMedia,
    isGloballyPaused,
    setIsGloballyPaused,
  ]);

  useEffect(() => {
    if (isGloballyPaused && isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isGloballyPaused, isPlaying]);

  const { width, height, type } = useMediaDimensions(postMedia?.[0]?.url);
  const isLandscape = width >= height;

  return (
    <div className={`relative overflow-hidden flex items-center`}>
      {isImage ? (
        <GallerySlider
          galleryImgs={postMedia!}
          className="w-full h-full object-contain"
          isRenderedInComment={isRenderedInComment}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            src={postMedia?.[0]?.url}
            className={cn("w-full h-[87vh]", isLandscape ? "object-contain" : "object-cover")}
            loop
            playsInline
          />
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
            style={{ opacity: isPlaying && !isBuffering ? 0 : 1, background: isBuffering ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)' }}
            onClick={togglePlay}
          >
            {isBuffering ? (
              <div className="flex items-center justify-center">
                <span className="loader"></span>
              </div>
            ) : (
              <button
                onClick={togglePlay}
                className="text-white text-6xl transform transition-transform duration-300 hover:scale-110"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
            )}
          </div>
          <div className={cn("absolute left-[0.3rem] bottom-[0.07rem] w-[98.5%] ml-[0.5%] z-50 h-1 bg-gray-400 rounded-b-full")}>
            <div
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MediaWrapper;