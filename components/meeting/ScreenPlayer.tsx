import React, { useEffect, useRef } from "react";
import {
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import { useVideoConferencing } from "@/context/VideoConferencingContext";
import VideoMutedDisplay from "./VideoMutedDisplay";

type ScreenPlayerProps = {
  audioTrack: (ILocalAudioTrack & IMicrophoneAudioTrack) | null;
  videoTrack: (ICameraVideoTrack & ILocalVideoTrack) | IRemoteVideoTrack | null;
  uid?: string | number;
  options?: object;
  isScreenShare?: boolean;
};

export const ScreenPlayer: React.FC<ScreenPlayerProps> = ({
  audioTrack,
  videoTrack,
  uid = "",
  options = {},
  isScreenShare = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Clean up previous video track
  useEffect(() => {
    return () => {
      if (videoTrack) {
        try {
          videoTrack.stop();
        } catch (error) {
        }
      }
    };
  }, [videoTrack, uid]);

  // Initialize or update video track
  useEffect(() => {
    const initVideo = async () => {
      if (!videoTrack || !containerRef.current) {
        return;
      }

      const shouldPlay = isScreenShare;
      if (!shouldPlay) {
        return;
      }

      try {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
        // Play new track
        videoTrack.play(containerRef.current, {
          fit: isScreenShare ? 'contain' : 'cover',
          ...options
        });
        videoTrack.play(containerRef.current)
      } catch (error) {
        console.error('[STREAM-PLAYER] Error playing video:', error);
      }
    };

    initVideo();
  }, [videoTrack, isScreenShare, options]);

  return (
    <div className="relative w-full h-full">
      {isScreenShare ? (
        <>
          <div
            ref={containerRef}
            className={`w-[40rem] h-[40rem] }`}
          />
        </>
      ) : (
        <VideoMutedDisplay participant={{ uid, name: '', }} />
      )}
    </div>
  );
};
