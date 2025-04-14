"use client";
import SettingsModal from "./SettingsModal";
import LiveStreamInterface from "./LiveStreamInterface";
import MicSelect from "./MicSelect";
import Spinner from "../Spinner";
import { Input } from "@/components/Input";
import { useVideoConferencing } from "@/context/VideoConferencingContext";
import {
  Mic,
  Video,
  Settings,
  MoreVertical,
  MicOff,
  VideoOff,
  Loader2,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { StreamPlayer } from "./StreamPlayer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/context/WebSocket";
import { LoadingSpinner } from "../Loaders/LoadingSpinner";
import VideoMutedDisplay from "./VideoMutedDisplay";

export default function VideoInterface({
  allowMicrophoneAndCamera,
  channelName,
  username,
}: {
  allowMicrophoneAndCamera: boolean;
  channelName: string;
  username: string;
}) {
  const { currentUser } = useAuth();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [handleSelectMicrophone, setHandleSelectMicrophone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeOutWarning, setTimeOutWarning] = useState(false);

  const {
    isMicrophoneEnabled,
    hasJoinedMeeting,
    isCameraEnabled,
    toggleMicrophone,
    toggleCamera,
    setUsername,
    setChannelName,
    localUserTrack,
    meetingConfig,
    joinMeetingRoom,
    isWaiting,
    setIsWaiting,
    userIsHost,
    meetingRoomData,
    remoteParticipants,
  } = useVideoConferencing();
  const ws = useWebSocket();
  const wsRef = useRef(ws);

  const handleJoinMeeting = async () => {
    setIsLoading(true);
    try {
      await joinMeetingRoom();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setChannelName(channelName);
    setUsername(currentUser.username);
  }, [
    channelName,
    setChannelName,
    username,
    setUsername,
    currentUser.username,
  ]);

  return (
    <div>
      {hasJoinedMeeting ? (
        <LiveStreamInterface />
      ) : (
        <>
          {isLoading ? (
            <div className="w-full h-full fixed inset-0 flex items-center justify-center z-[150] bg-[#1A1C1D]">
              <div className="w-full h-full flex flex-col max-w-[1440px] mx-auto p-2 md:p-4 lg:p-6">
                <div className="w-full h-full flex items-center gap-4 justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-white" />
                  <p className="text-white text-xl font-semibold">Joining</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md mx-auto px-0 sm:px-6 pt-2">
              <div className="flex flex-col items-center w-full">
                <h1 className="text-xl sm:text-2xl font-semibold text-center">
                  Get Started
                </h1>
                <p className="text-gray-600 mt-1 text-center text-sm sm:text-base">
                  Setup your audio and video before joining
                </p>

                <div className="bg-red-500 text-white px-3 py-2 rounded-full mt-4 text-sm flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-white"></span>
                  <p>
                    LIVE {allowMicrophoneAndCamera ? "Conferencing" : "Stream"}
                  </p>
                </div>

                {/* Video Preview Container */}
                <div className="w-full aspect-video bg-gray-900 rounded-lg mt-4 sm:mt-6 relative">
                  <button className="absolute top-2 right-2 p-1 bg-black rounded-full z-10">
                    {isMicrophoneEnabled ? (
                      <Mic size={16} className="text-white" />
                    ) : (
                      <MicOff size={16} className="text-white" />
                    )}
                  </button>
                  {isCameraEnabled ? (
                    <StreamPlayer
                      videoTrack={localUserTrack?.videoTrack || null}
                      audioTrack={localUserTrack?.audioTrack || null}
                      uid={meetingConfig?.uid || ""}
                    />
                  ) : (
                    <VideoMutedDisplay
                      participant={{ uid: "", name: "", isLocal: true }}
                    />
                  )}
                </div>

                {/* Controls Section */}
                <div className="w-full mt-4 sm:mt-6">
                  <div className="flex items-center justify-between relative">
                    Audio/Video Controls
                    <div className="flex space-x-2 sm:space-x-3">
                      <div className="flex items-center h-10 bg-gray-100 rounded px-2 sm:px-3">
                        <div
                          onClick={toggleMicrophone}
                          className="cursor-pointer p-1"
                        >
                          {isMicrophoneEnabled ? (
                            <Mic size={18} />
                          ) : (
                            <MicOff size={18} />
                          )}
                        </div>
                        <div className="relative">
                          <MoreVertical
                            size={18}
                            onClick={() =>
                              setHandleSelectMicrophone(!handleSelectMicrophone)
                            }
                            className="cursor-pointer ml-1"
                          />
                          <AnimatePresence>
                            {handleSelectMicrophone &&
                              localUserTrack?.audioTrack && (
                                <MicSelect
                                  audioTrack={localUserTrack?.audioTrack}
                                  setHandleSelectMicrophone={
                                    setHandleSelectMicrophone
                                  }
                                />
                              )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="flex items-center h-10 bg-gray-100 rounded px-2 sm:px-3">
                        <div
                          onClick={toggleCamera}
                          className="cursor-pointer p-1"
                        >
                          {isCameraEnabled ? (
                            <Video size={18} />
                          ) : (
                            <VideoOff size={18} />
                          )}
                        </div>
                        <MoreVertical
                          size={18}
                          className="cursor-pointer ml-1"
                        />
                      </div>
                    </div>
                    {/* Settings Button */}
                    <div>
                      <button
                        className="w-10 h-10 bg-white border flex items-center justify-center rounded cursor-pointer"
                        onClick={() => setShowSettingsModal(!showSettingsModal)}
                      >
                        <Settings size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Username Input and Go Live Button */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between w-full mt-4">
                    <div className="sm:basis-10/12 w-full">
                      <Input
                        placeholder={username || "Enter your username"}
                        className="w-full py-2"
                        value={username}
                        onChange={(e) => {}}
                      />
                    </div>

                    <div className="sm:flex-1 w-full">
                      {isWaiting && <LoadingSpinner />}

                      {!isWaiting && (
                        <Button
                          onClick={handleJoinMeeting}
                          className="bg-primary hover:bg-primary-700 w-full py-2"
                          disabled={isLoading}
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </div>

                  {isWaiting && !userIsHost && (
                    <div className=" w-full flex justify-center mt-3">
                      <p className="text-sm ">
                        Please hold on, someone will let you in the call
                      </p>
                    </div>
                  )}

                  {!isWaiting && !userIsHost && (
                    <div className=" w-full flex justify-center mt-3">
                      <p className="text-sm ">You can now join this call</p>
                    </div>
                  )}

                  {!meetingRoomData?.hasStarted  && (
                    <div className=" w-full flex justify-center mt-3">
                      <p className="text-sm ">Meeting has not started ...</p>
                    </div>
                  )}
                </div>

                <SettingsModal
                  onClose={() => setShowSettingsModal(false)}
                  isOpen={showSettingsModal}
                />
              </div>
            </div>
          )}
        </>
      )}
      {timeOutWarning && (
        <div className="w-full h-64 bg-blue-300 text-black">
          There is no other perosn here, Do you want to leave the call?
        </div>
      )}
    </div>
  );
}
