/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import PermissionModal from "@/components/meeting/PermissionModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import VideoInterface from "@/components/meeting/VideoInterface";
import { useEffect, useRef, useState } from "react";
import { useVideoConferencing } from "@/context/VideoConferencingContext";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/context/WebSocket";

export default function WaitingRoom() {
  const {
    initializeLocalMediaTracks,
    isWaiting,
    setIsWaiting,
    setDeviceStream,
    deviceStream,
  } = useVideoConferencing();
  const [hasPermissions, setHasPermissions] = useState(true);
  const [showPermissionPopup, setShowPermissionPopup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const { getCurrentUser, currentUser } = useAuth();
  const username = getCurrentUser()?.username;
  const ws = useWebSocket();
  const wsRef = useRef(ws);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `Creveo - ${params?.channelName}`;
    }
  }, []);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const camPerm = await navigator.permissions.query({ name: "camera" as PermissionName });
        const micPerm = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });

        const isDenied =
          camPerm.state === "denied" || micPerm.state === "denied";
        const isGranted =
          camPerm.state === "granted" && micPerm.state === "granted";

        if (isDenied) {
          console.log("Camera or microphone permission has been denied");
          setShowPermissionPopup(true);
          setHasPermissions(false);
        } else if (isGranted) {
          console.log("Camera and microphone permissions are granted");
          setShowPermissionPopup(false);
          setHasPermissions(true);
        } else {
          console.log("Permission will prompt or is mixed");
        }
      } catch (err) {
        console.error("Permissions API error:", err);
      }
    };

    checkPermissions();
  }, []);

  const handleAllowPermissions = async () => {
    try {
      const deviceMedia = await Promise.all([
        navigator.mediaDevices.getUserMedia({ video: true }),
        navigator.mediaDevices.getUserMedia({ audio: true }),
      ]);
      setDeviceStream(deviceMedia);
      setHasPermissions(true);
      setShowPermissionPopup(false);
    } catch (error) {
      console.log("Error getting permissions:", error);
    }
  };

  const handleDismissPermissions = () => {
    setShowPermissionPopup(false);
  };

  useEffect(() => {
    if (hasPermissions) {
      initializeLocalMediaTracks();
    }

    return () => {
      deviceStream[0].getTracks().forEach((track) => track.stop());
      deviceStream[1].getTracks().forEach((track) => track.stop());
    };
  }, [hasPermissions]);

  useEffect(() => {
    if (!ws || !isWaiting) return;

    const channelName = params?.channelName;
    if (!channelName) return;

    const interval = setInterval(() => {
      if (ws && currentUser?.id) {
        if (!ws.connected) {
          ws.connect();
        }

        if (!hasPermissions) {
          setIsWaiting(false);
          return;
        }
        const request = { userId: currentUser?.id, meetingCode: channelName };
        ws.emit("lobby", request, () => {
          setIsWaiting(false);
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isWaiting, params?.channelName, ws, currentUser?.id]);

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className="p-8 bg-white">
        {showPermissionPopup && (
          <PermissionModal
            onDismiss={handleDismissPermissions}
            onAllow={handleAllowPermissions}
          />
        )}

        <VideoInterface
          allowMicrophoneAndCamera={hasPermissions}
          channelName={params.channelName! as string}
          username={username!}
        />

        <div className="h-[18vh]"></div>
      </div>
    </ProtectedRoute>
  );
}
