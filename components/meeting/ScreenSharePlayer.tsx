import React, { useEffect, useRef } from "react";
import {
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import { useVideoConferencing } from "@/context/VideoConferencingContext";

type ScreenSharePlayerProps = {
  audioTrack: (ILocalAudioTrack & IMicrophoneAudioTrack) | null;
  videoTrack: (ICameraVideoTrack & ILocalVideoTrack) | IRemoteVideoTrack | null;
  uid?: string | number;
  options?: object;
  isScreenShare?: boolean;
};

export const ScreenSharePlayer: React.FC<ScreenSharePlayerProps> = ({
  audioTrack,
  videoTrack,
  uid = "",
  options = {},
  isScreenShare = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { rtcScreenShareOptions } = useVideoConferencing();
  const isLocalUser = uid === rtcScreenShareOptions?.uid;

  // Callback ref to ensure the video element is available before playing
  const setVideoRef = (node: HTMLVideoElement | null) => {
    if (node) {
      videoRef.current = node;
      if (videoTrack) {
        console.log("Playing video track after setting ref...");
        videoTrack.play(node);
      }
    }
  };

  useEffect(() => {
    if (videoTrack && videoRef.current) {
      setTimeout(() => {
        videoTrack.play(videoRef.current as HTMLVideoElement);
      }, 100);
    } else {
      console.log("videoTrack or videoRef.current is missing.");
    }
  }, [videoTrack]);

  return (
    <div className="relative w-full h-full">
      <video
        key={videoTrack?.getTrackId()}
        playsInline
        autoPlay
        muted
        ref={setVideoRef}
        className={`w-full h-full transition-opacity duration-300 ${!isScreenShare ? "bg-black" : ""}`}
      />
    </div>
  );
};
