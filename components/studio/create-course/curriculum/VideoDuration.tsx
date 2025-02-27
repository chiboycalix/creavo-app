import { useState, useRef } from "react";

const VideoPlayer = ({ src, setDuration, duration }: { src: string; setDuration: any, duration: any }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  return (
    <div className="hidden">
      <video
        ref={videoRef}
        width="600"
        controls
        onLoadedMetadata={handleLoadedMetadata}
      >

      </video>
    </div>
  );
};

export default VideoPlayer;
