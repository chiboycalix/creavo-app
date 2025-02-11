import React, { useEffect } from 'react';
import { useVideoConferencing } from "@/context/VideoConferencingContext";

const VideoDebugOverlay = () => {
  const {
    remoteParticipants,
    localUserTrack,
    isCameraEnabled,
    isMicrophoneEnabled,
    meetingConfig,
    hasJoinedMeeting
  } = useVideoConferencing();

  return null;
};

export default VideoDebugOverlay;