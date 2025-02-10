import React, { useEffect, useRef, useState } from "react";
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
  const [zoom, setZoom] = useState(1);  // Zoom level state
  const [isMobile, setIsMobile] = useState(false);

  // Detect if it's a mobile device
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Zoom in/out via mouse wheel or touch gestures
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || isMobile) {
      // Zoom in or out based on wheel direction
      const newZoom = Math.max(0.5, Math.min(3, zoom - e.deltaY * 0.01));  // Limit zoom level between 0.5 and 3
      setZoom(newZoom);
      e.preventDefault();
    }
  };

  // Pinch-to-zoom for mobile (two-finger zoom)
  const handlePinchZoom = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 100) {
        const newZoom = Math.max(0.5, Math.min(3, zoom + distance * 0.005));
        setZoom(newZoom);
      }
      e.preventDefault();
    }
  };

  // Callback ref to ensure the video element is available before playing
  const setVideoRef = (node: HTMLVideoElement | null) => {
    if (node) {
      videoRef.current = node;
      if (videoTrack) {
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
    <div
      className="relative w-full h-full"
      onWheel={handleWheel}  // Zoom with mouse wheel on desktop
      onTouchMove={handlePinchZoom}  // Handle pinch zoom on mobile
    >
      <video
        key={videoTrack?.getTrackId()}
        playsInline
        autoPlay
        muted
        ref={setVideoRef}
        className={`w-full h-full transition-opacity duration-300 ${!isScreenShare ? "bg-black" : ""}`}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center",  // Zoom centered on the screen
        }}
      />
    </div>
  );
};
