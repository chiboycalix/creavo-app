/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import PermissionModal from "@/components/meeting/PermissionModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import VideoInterface from "@/components/meeting/VideoInterface";
import { useEffect, useState } from "react";
import { useVideoConferencing } from "@/context/VideoConferencingContext";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function WaitingRoom() {
  const { initializeLocalMediaTracks } = useVideoConferencing();
  const [showPermissionPopup, setShowPermissionPopup] = useState(true);
  const [hasPermissions, setHasPermissions] = useState(false);
  const params = useParams();
  const { getCurrentUser } = useAuth();
  const username = getCurrentUser()?.username;

  const handleAllowPermissions = async () => {
    try {
      await Promise.all([
        navigator.mediaDevices.getUserMedia({ video: true }),
        navigator.mediaDevices.getUserMedia({ audio: true })
      ]);
      setHasPermissions(true);
      setShowPermissionPopup(false);
    } catch (error) {
      console.log('Error getting permissions:', error);
    }
  };

  const handleDismissPermissions = () => {
    setShowPermissionPopup(false);
  };

  useEffect(() => {
    if (hasPermissions) {
      initializeLocalMediaTracks();
    }
  }, [hasPermissions]);

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className="p-8 bg-white">
        {
          showPermissionPopup && <PermissionModal
            onDismiss={handleDismissPermissions}
            onAllow={handleAllowPermissions}
          />
        }

        <VideoInterface
          allowMicrophoneAndCamera={hasPermissions}
          channelName={params.channelName! as string}
          username={username!}
        />
        <div className="h-[18vh]">

        </div>
      </div>
    </ProtectedRoute>
  );
}