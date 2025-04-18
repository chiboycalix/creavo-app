"use client";
import AgoraRTM, { RtmChannel, RtmClient } from "agora-rtm-sdk";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { ILocalTrack, Options } from "@/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  SetStateAction,
} from "react";
import { agoraGetAppData } from "@/lib";
import { IRemoteAudioTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { rateLimiter } from "@/utils/MessageRateLimiter";
import VirtualBackgroundExtension from "agora-extension-virtual-background";
import { useAuth } from "./AuthContext";
import { baseUrl } from "@/utils/constant";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useWebSocket } from "./WebSocket";

interface RemoteParticipant {
  name: string;
  rtcUid: string;
  videoTrack?: IRemoteVideoTrack | null;
  audioTrack?: IRemoteAudioTrack;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  isScreenShare?: boolean;
}

type JoinRequest = {
  id: string;
  name: string;
};

interface ChatMessage {
  id: string;
  sender: {
    uid: string;
    name: string;
  };
  content: string;
  timestamp: number;
  type: "text" | "emoji";
  isLocal: boolean;
}

interface VideoConferencingContextContextType {
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
  meetingRoomId: string;
  setMeetingRoomId: (id: string) => void;
  isMicrophoneEnabled: boolean;
  isCameraEnabled: boolean;
  toggleMicrophone: () => void;
  toggleCamera: () => void;
  localUserTrack: ILocalTrack | undefined;
  meetingConfig: Options;
  rtcScreenShareOptions: Options;
  videoRef: any;
  initializeLocalMediaTracks: () => void;
  setLocalUserTrack: any;
  releaseMediaResources: () => void;
  joinMeetingRoom: () => Promise<void>;
  setMeetingConfig: (config: SetStateAction<Options>) => void;
  setRtcScreenShareOptions: (config: SetStateAction<Options>) => void;
  setMeetingStage: (meetingStage: string) => void;
  setChannelName: (meetingStage: string) => void;
  channelName: string;
  meetingStage: string;
  remoteParticipants: Record<string, any>;
  hasJoinedMeeting: boolean;
  remoteUsersRef: any;
  setUsername: (username: string) => void;
  setHasJoinedMeeting: (join: boolean) => void;
  username: string;
  speakingParticipants: any;
  isWaiting: boolean;
  setIsWaiting: (isWaiting: boolean) => void;
  handleShareScreen: any;
  handleEndScreenShare: any;
  isSharingScreen: any;
  userIsHost: boolean;
  userIsCoHost: boolean;
  setUserIsCoHost: (isCoHost: boolean) => void;
  meetingRoomData: any;
  screenTrack: any;
  screenSharingUser: any;
  leaveCall: () => Promise<void>;
  setBackgroundColor: any;
  setBackgroundBlurring: any;
  setBackgroundImage: any;
  raisedHands: any;
  toggleRaiseHand: () => void;
  chatMessages: ChatMessage[];
  handleMeetingHostAndCohost: () => void;
  sendCoHostPermission: (uid: any) => Promise<void>;
  sendChatMessage: (content: string, type: "text" | "emoji") => Promise<void>;
  muteRemoteUser: (uid: any) => void;
  fetchMeetingRoomData: (channelName: string) => void;
  removeRemoteUser: (uid: string | number) => Promise<void>;
  setMeetingRoomData: (data: any) => void;
  setJoinRequests: (jRequest: SetStateAction<JoinRequest[]>) => void;
  joinRequests: JoinRequest[] | [];
  setDeviceStream: (data: SetStateAction<MediaStream[]>) => void;
  deviceStream: MediaStream[];
}

let rtcClient: IAgoraRTCClient;
let rtmClient: RtmClient;
let rtmChannel: RtmChannel;
let rtcScreenShareClient: IAgoraRTCClient;
let processor = null as any;

const VideoConferencingContext = createContext<
  VideoConferencingContextContextType | undefined
>(undefined);

export function VideoConferencingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [meetingRoomId, setMeetingRoomId] = useState("");
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [hasJoinedMeeting, setHasJoinedMeeting] = useState(false);
  const [meetingStage, setMeetingStage] = useState("prepRoom");
  const [remoteParticipants, setRemoteParticipants] = useState<
    Record<string, any>
  >({});
  const [remoteScreenShareParticipants, setRemoteScreenShareParticipants] =
    useState<Record<string, any> | null>({});
  const [username, setUsername] = useState("");
  const [channelName, setChannelName] = useState("");
  const [localUserTrack, setLocalUserTrack] = useState<
    ILocalTrack | undefined | any
  >(undefined);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteUsersRef = useRef(remoteParticipants);
  const [speakingParticipants, setSpeakingParticipants] = useState<
    Record<string, boolean>
  >({});
  const remoteScreenShareParticipantsRef = useRef(
    remoteScreenShareParticipants
  );
  const [meetingRoomData, setMeetingRoomData] = useState<any | null>(null);
  const [userIsHost, setUserIsHost] = useState(false);
  const [userIsCoHost, setUserIsCoHost] = useState(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [isSharingScreen, setIsSharingScreen] = useState<string | null>(null);
  const [screenSharingUser, setScreenSharingUser] = useState<{
    uid: string;
    name: string;
    isLocal: boolean;
  } | null>(null);
  const [raisedHands, setRaisedHands] = useState<Record<string, boolean>>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [deviceStream, setDeviceStream] = useState<MediaStream[]>([]);

  const { currentUser } = useAuth();
  const router = useRouter();
  const ws = useWebSocket();
  const wsRef = useRef(ws);

  const [microphoneDevices, setMicrophoneDevices] = useState<
    MediaDeviceInfo[] | []
  >([]);
  const [speakerDevices, setSpeakerDevices] = useState<MediaDeviceInfo[] | []>(
    []
  );
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[] | []>([]);

  useEffect(() => {
    AgoraRTC.setLogLevel(4);
    AgoraRTC.disableLogUpload();
  }, []);

  const sendRateLimitedMessage = async (message: any) => {
    if (!rtmChannel) return;

    try {
      await rateLimiter.sendMessage(rtmChannel, message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const [screenTrack, setScreenTrack] = useState<{
    screenVideoTrack: ILocalVideoTrack | null;
    screenAudioTrack: ILocalAudioTrack | null;
  } | null>(null);

  const [meetingConfig, setMeetingConfig] = useState<Options>({
    channel: "",
    appid: "d9b1d4e54b9e4a01aac1de9833d83752",
    rtcToken: "",
    rtmToken: "",
    proxyMode: "",
    audienceLatency: 1,
    uid: null,
    role: "host",
    certificate: "",
  });

  const [rtcScreenShareOptions, setRtcScreenShareOptions] = useState<Options>({
    channel: "",
    appid: "d9b1d4e54b9e4a01aac1de9833d83752",
    rtcToken: "",
    rtmToken: "",
    proxyMode: "",
    audienceLatency: 1,
    uid: null,
    role: "host",
    certificate: "",
  });

  const setScreenShare = useCallback(
    (uid: string | null, name: string, isLocal: boolean) => {
      setIsSharingScreen(uid);
      if (uid) {
        setScreenSharingUser({
          uid,
          name,
          isLocal,
        });
      } else {
        setScreenSharingUser(null);
      }
    },
    []
  );

  const updateRemoteParticipant = useCallback(
    (uid: string, updates: Partial<any>) => {
      setRemoteParticipants((prev) => {
        const participant = prev[uid];
        if (!participant) return prev; // Don't update if participant doesn't exist

        // Only update if values actually changed
        const hasChanges = Object.entries(updates).some(
          ([key, value]) => participant[key] !== value
        );

        if (!hasChanges) return prev;

        return {
          ...prev,
          [uid]: {
            ...participant,
            ...updates,
          },
        };
      });
    },
    []
  );

  const handleMeetingHostAndCohost = useCallback(() => {
    if (meetingRoomData && currentUser) {
      const isHost = meetingRoomData?.room?.roomSubscribers?.some(
        (user: { isOwner: boolean; userId: string }) =>
          user.isOwner && user?.userId === currentUser?.id
      );

      const isCoHost = meetingRoomData?.room?.roomSubscribers?.some(
        (user: { isCoHost: boolean; userId: string }) =>
          user.isCoHost && user?.userId === currentUser?.id
      );

      setUserIsHost(isHost);
      setUserIsCoHost(isCoHost);
    }
  }, [meetingRoomData, currentUser]);

  const handleRTMMessage = useCallback(
    async ({ text, peerId }: any) => {
      if (!text) return;

      try {
        const message = JSON.parse(text);
        const uid = String(message.uid).replace(/[^a-zA-Z0-9]/g, "");

        switch (message.type) {
          case "video-state":
            updateRemoteParticipant(uid, {
              videoEnabled: message.enabled,
            });
            break;

          case "audio-state":
            updateRemoteParticipant(uid, {
              audioEnabled: message.enabled,
            });
            break;

          case "screen-share-state":
            if (message.isSharing) {
              setScreenShare(String(message.uid), message.name, false);
            } else {
              setScreenShare(null, "", false);
            }
            break;

          case "user-info":
            if (uid === String(meetingConfig.uid)) return;

            updateRemoteParticipant(uid, {
              name: message.name,
              rtcUid: uid,
            });
            break;
          case "hand-state":
            setRaisedHands((prev: any) => ({
              ...prev,
              [uid]: message.isRaised,
            }));
            break;
          case "chat":
            setChatMessages((prev) => {
              const messageId = `${message.timestamp}-${uid}`;
              const messageExists = prev.some((msg) => msg.id === messageId);

              if (messageExists) {
                return prev;
              }
              return [
                ...prev,
                {
                  id: messageId,
                  sender: {
                    uid: uid,
                    name: message.senderName,
                  },
                  content: message.content,
                  timestamp: message.timestamp,
                  type: message.messageType,
                  isLocal: String(uid) === String(meetingConfig.uid),
                },
              ];
            });
            break;

          case "give-cohost":
            if (uid === String(meetingConfig.uid)) {
              try {
                console.log("Before state update:", userIsCoHost);

                // Update local participant state
                if (meetingConfig.channel) {
                  fetchMeetingRoomData(meetingConfig.channel);
                }
                handleMeetingHostAndCohost();

                updateRemoteParticipant(uid, {
                  userIsCoHost: true,
                });

                setUserIsCoHost(true);

                console.log("Co-host granted to user:", uid);
                console.log("After state update:", userIsCoHost);
              } catch (error) {
                console.error("Error handling co-host promotion:", error);
              }
            }
            break;

          case "mute-audio":
            if (uid === String(meetingConfig.uid)) {
              try {
                if (localUserTrack?.audioTrack) {
                  await localUserTrack.audioTrack.setEnabled(false);
                  // Update the state to reflect the muted status
                  setIsMicrophoneEnabled(false);
                  // Send a confirmation back to all participants
                  const confirmMessage = {
                    type: "audio-state",
                    enabled: false,
                    uid: meetingConfig.uid,
                  };

                  await sendRateLimitedMessage({
                    text: JSON.stringify(confirmMessage),
                  });
                  // Update local participant state
                  updateRemoteParticipant(uid, {
                    audioEnabled: false,
                  });
                }
              } catch (error) {
                console.error("Error handling forced mute:", error);
              }
            }
            break;

          case "remove-user":
            if (uid === String(meetingConfig?.uid)) {
              try {
                console.log("Before removal");

                await leaveCall();
                console.log("After removal");
                router?.push(ROUTES?.HOME);
                alert("You were removed by the Host");
              } catch (error) {
                console.error("Error removing User", error);
              }
            }
            break;
        }
      } catch (error) {
        console.error("Error processing RTM message:", error);
      }
    },
    [
      updateRemoteParticipant,
      setScreenShare,
      handleMeetingHostAndCohost,
      localUserTrack?.audioTrack,
      meetingConfig,
    ]
  );

  const muteRemoteUser = async (uid: string) => {
    if (!rtmClient) return;

    try {
      const muteMessage = JSON.stringify({
        type: "mute-audio",
        enabled: false,
        uid,
        forceMute: true, // Add this flag to indicate it's a forced mute
      });

      // Update local state immediately
      updateRemoteParticipant(uid, {
        audioEnabled: false,
      });

      await rtmClient.sendMessageToPeer({ text: muteMessage }, uid);
    } catch (error) {
      console.error("Error processing RTM message:", error);
      console.error("Error sending mute request:", error);
    }
  };

  useEffect(() => {
    if (!rtmChannel) return;

    rtmChannel.on("ChannelMessage", handleRTMMessage);
    rtmClient.on("MessageFromPeer", handleRTMMessage);
    return () => {
      rtmChannel?.off("ChannelMessage", handleRTMMessage);
      rtmClient?.off("MessageFromPeer", handleRTMMessage);
    };
  }, [handleRTMMessage]);

  const extension = new VirtualBackgroundExtension();
  AgoraRTC.registerExtensions([extension]);

  const setupVolumeIndicator = useCallback(() => {
    if (!rtcClient) return;

    // Simple flag to track if we're currently processing
    let isProcessing = false;
    const VOLUME_THRESHOLD = 50;

    rtcClient.enableAudioVolumeIndicator();

    rtcClient.on("volume-indicator", (volumes) => {
      // Skip if we're still processing the previous update
      if (isProcessing) return;
      isProcessing = true;

      try {
        const newSpeakers: Record<string, boolean> = {};

        volumes.forEach((volume) => {
          const uid = volume.uid === 0 ? meetingConfig.uid : volume.uid;
          newSpeakers[String(uid)] = volume.level > VOLUME_THRESHOLD;
        });

        setSpeakingParticipants((prevSpeakers) => {
          // Only update if there are actual changes
          const hasChanges = Object.entries(newSpeakers).some(
            ([uid, isSpeaking]) => prevSpeakers[uid] !== isSpeaking
          );

          return hasChanges
            ? { ...prevSpeakers, ...newSpeakers }
            : prevSpeakers;
        });
      } finally {
        // Reset processing flag after a short delay
        setTimeout(() => {
          isProcessing = false;
        }, 200);
      }
    });
  }, [meetingConfig.uid]);

  useEffect(() => {
    remoteScreenShareParticipantsRef.current = remoteScreenShareParticipants;
  }, [remoteScreenShareParticipants]);

  const fetchMeetingRoomData = useCallback(
    async (channelName: string) => {
      try {
        const data = await agoraGetAppData(channelName);
        setMeetingRoomData(data?.meeting);
      } catch (error) {
        console.log("Error fetching meeting room data:", error);
      }
    },
    [channelName]
  );

  const fetchAgoraData = async (channelName: string) => {
    try {
      const rtcData = await agoraGetAppData(channelName);
      const { client, meeting } = rtcData;

      setMeetingConfig((prev) => ({
        ...prev,
        appid: client[0].appId,
        rtcToken: client[0].rtcToken,
        rtmToken: client[0].rtmToken,
        certificate: client[0].appCertificate,
        uid: client[0].uid,
        channel: client[0].channelName,
      }));

      setRtcScreenShareOptions((prev) => ({
        ...prev,
        appid: client[1].appId,
        rtcToken: client[1].rtcToken,
        rtmToken: client[1].rtmToken,
        certificate: client[1].appCertificate,
        uid: client[1].uid,
        channel: client[1].channelName,
      }));

      await setMeetingRoomData(meeting);
      await setUsername(currentUser?.username);
      await setIsWaiting(false);
    } catch (error) {
      console.log("lobby, Error fetching Agora data:", error);
    }
  };

  useEffect(() => {
    wsRef.current = ws;

    if (ws && currentUser?.id) {
      if (!ws.connected) {
        ws.connect();
      }

      ws.on(`lobby`, async (data) => {
        const { type, user } = data;
        switch (type) {
          case "meeting-request-granted":
            await fetchAgoraData(user.meetingCode as string);
            await initializeLocalMediaTracks();
            break;
          case "join-meeting-request":
            console.log("lobby, join-meeting-request, before", { data });
            setJoinRequests((requests: any) => [
              ...requests,
              { id: user?.userId, name: user?.username || "Anonymous" },
            ]);
            console.log("lobby, after: In meeting-request--");
            break;
          case "meeting-not-started":
            // setIsLoading(false);
            break;
          case "meeting-not-found":
            // setIsLoading(false);
            break;
          case "meeting-ended":
            // setIsLoading(false);
            break;
        }
        console.log("Real-time profile update received:", { lobby: data });
      });
    }
  }, [ws, currentUser?.id]);

  // useEffect(() => {
  //   if (!ws || !isWaiting) return;

  //   const interval = setInterval(() => {
  //     console.log("lobby, Pinging backend to inform admin again 1", {
  //       channelName,
  //     });

  //     if (channelName) {
  //       console.log("lobby, Pinging backend to inform admin again 2");

  //       // if()
  //       ws.emit(
  //         "lobby",
  //         { userId: currentUser?.id, meetingCode: channelName },
  //         () => {
  //           setIsWaiting(false);
  //         }
  //       );
  //     }
  //   }, 6000);

  //   return () => clearInterval(interval);
  // }, [isWaiting, channelName, ws, currentUser?.id]);

  useEffect(() => {
    handleMeetingHostAndCohost();
  }, [handleMeetingHostAndCohost, meetingRoomData]);

  const handleScreenShareUserLeft = async (user: any) => {
    const uid = String(user.uid);
    const updatedScreenShareUsers = {
      ...remoteScreenShareParticipantsRef.current,
    };
    delete updatedScreenShareUsers[uid];
    remoteScreenShareParticipantsRef.current = updatedScreenShareUsers;
    setRemoteScreenShareParticipants(updatedScreenShareUsers);
  };

  const handleShareScreen = async () => {
    try {
      await joinRtcScreenShare();
      if (rtcScreenShareClient) {
        const screenTracks = await AgoraRTC.createScreenVideoTrack(
          {
            encoderConfig: "1080p_1",
            optimizationMode: "detail",
          },
          "auto"
        );

        // Separate video and audio tracks
        const screenVideoTrack =
          screenTracks instanceof Array ? screenTracks[0] : screenTracks;
        const screenAudioTrack =
          screenTracks instanceof Array ? screenTracks[1] : null;

        if (!screenVideoTrack) {
          return;
        }

        // Bind the "track-ended" event to handle stop sharing
        screenVideoTrack.on("track-ended", handleScreenTrackEnd);

        // Update screenTrack state
        setScreenTrack({
          screenVideoTrack,
          screenAudioTrack,
        });

        setIsSharingScreen(String(meetingConfig.uid));
        setScreenSharingUser({
          uid: String(meetingConfig.uid),
          name: username,
          isLocal: true,
        });

        if (screenVideoTrack) {
          await rtcScreenShareClient.publish([screenVideoTrack]);
        }

        if (screenAudioTrack) {
          await rtcScreenShareClient.publish([screenAudioTrack]);
        }
        if (rtmChannel) {
          await rtmChannel.sendMessage({
            text: JSON.stringify({
              type: "screen-share-state",
              uid: rtcScreenShareOptions.uid,
              name: username,
              isSharing: true,
            }),
          });
        }
      }
    } catch (error) {
      console.log("Error during screen sharing:", error);
    }
  };

  const handleScreenTrackEnd = useCallback(async () => {
    setIsSharingScreen(null);
    setScreenSharingUser(null);
    if (screenTrack?.screenVideoTrack) {
      screenTrack.screenVideoTrack.close();
      screenTrack.screenVideoTrack.stop();
    }
    if (screenTrack?.screenAudioTrack) {
      screenTrack.screenAudioTrack.close();
      screenTrack.screenAudioTrack.stop();
    }
    setScreenTrack(null);
    await rtcScreenShareClient.unpublish();
    await rtcScreenShareClient.leave();
    rtcScreenShareClient = null as any;

    if (rtmChannel) {
      await rtmChannel.sendMessage({
        text: JSON.stringify({
          type: "screen-share-state",
          uid: rtcScreenShareOptions.uid,
          name: "",
          isSharing: false,
        }),
      });
    }
  }, [
    rtcScreenShareOptions.uid,
    screenTrack?.screenAudioTrack,
    screenTrack?.screenVideoTrack,
  ]);

  const handleEndScreenShare = useCallback(
    async (action: string, uid: number) => {
      await handleScreenTrackEnd();
      if (rtmChannel) {
        await rtmChannel.sendMessage({
          text: JSON.stringify({
            command: action,
            uid,
            type: "screen-share-state",
            isSharing: false,
          }),
        });
      }
    },
    [handleScreenTrackEnd]
  );

  const joinRtcScreenShare = async () => {
    if (!rtcScreenShareClient) {
      rtcScreenShareClient = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8",
      });

      rtcScreenShareClient.on("user-left", handleScreenShareUserLeft);
      rtcScreenShareClient.on("user-published", handleUserPublishedScreen);
      rtcScreenShareClient.on("user-unpublished", handleUserUnpublishedScreen);
      rtcScreenShareClient.on(
        "connection-state-change",
        (curState, prevState) => {}
      );

      const mode = rtcScreenShareOptions?.proxyMode ?? 0;
      if (mode !== 0 && !isNaN(parseInt(mode))) {
        rtcScreenShareClient.startProxyServer(parseInt(mode));
      }

      if (rtcScreenShareOptions.role === "audience") {
        rtcScreenShareClient.setClientRole(rtcScreenShareOptions.role, {
          level: rtcScreenShareOptions.audienceLatency,
        });
      } else if (rtcScreenShareOptions.role === "host") {
        rtcScreenShareClient.setClientRole(rtcScreenShareOptions.role);
      }

      try {
        if (rtcScreenShareOptions) {
          const sanitizedUid = String(rtcScreenShareOptions.uid).replace(
            /[^a-zA-Z0-9]/g,
            ""
          ) as any;
          await rtcScreenShareClient.join(
            rtcScreenShareOptions.appid || "",
            rtcScreenShareOptions.channel || "",
            rtcScreenShareOptions.rtcToken || null,
            sanitizedUid
          );
        }
      } catch (error) {
        console.error("Error joining screen share client:", error);
        throw error;
      }
    }
  };

  const handleUserPublishedScreen = async (
    user: any,
    mediaType: "audio" | "video"
  ) => {
    try {
      if (
        (mediaType === "video" && !user.hasVideo) ||
        (mediaType === "audio" && !user.hasAudio)
      ) {
        return;
      }

      if (
        mediaType === "video" &&
        user.videoTrack &&
        !user.videoTrack.isScreenTrack
      ) {
        return;
      }

      await rtcSubscribeScreen(user, mediaType);
    } catch (error) {
      console.error("Error in handleUserPublishedScreen:", error);
    }
  };

  const rtcSubscribeScreen = async (
    user: any,
    mediaType: "audio" | "video"
  ) => {
    try {
      if (
        (mediaType === "video" && !user.hasVideo) ||
        (mediaType === "audio" && !user.hasAudio)
      ) {
        return;
      }

      if (!rtcScreenShareClient) {
        return;
      }

      // Attempt to subscribe with error handling
      await rtcScreenShareClient.subscribe(user, mediaType);

      const uid = String(user.uid);
      if (
        mediaType === "video" &&
        user.videoTrack &&
        user.videoTrack.isScreenTrack
      ) {
        const videoTrack = user.videoTrack;

        setRemoteScreenShareParticipants((prevUsers) => ({
          ...prevUsers,
          [uid]: {
            ...prevUsers![uid],
            videoTrack,
          },
        }));

        // Update the screen sharing state
        setIsSharingScreen(uid);
        setScreenSharingUser({
          uid: uid,
          name: username,
          isLocal: false,
        });
      }

      if (mediaType === "audio" && user.audioTrack) {
        const audioTrack = user.audioTrack;
        try {
          await audioTrack.play();
        } catch (error) {
          console.log("Error playing audio track:", error);
        }
      }
    } catch (error: any) {
      if (
        error.code === "UNEXPECTED_RESPONSE" ||
        error.code === "ERR_SUBSCRIBE_REQUEST_INVALID"
      ) {
        console.log(
          `Stream not available for user ${user.uid} ${mediaType}. Skipping subscription.`
        );
        return;
      }
      console.error(`Error subscribing to ${mediaType}:`, error);
    }
  };

  const handleUserUnpublishedScreen = (
    user: any,
    mediaType: "audio" | "video"
  ) => {
    const uid = String(user.uid);
    setRemoteScreenShareParticipants((prevUsers) => ({
      ...prevUsers,
      [uid]: {
        ...prevUsers![uid],
        [mediaType]: null,
      },
    }));
  };

  const initializeLocalMediaTracks = async () => {
    try {
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: "high_quality_stereo",
          AEC: true,
          ANS: true,
          AGC: true,
        }),
        AgoraRTC.createCameraVideoTrack(),
      ]);
      await audioTrack.setPlaybackDevice("default");

      await Promise.all([
        audioTrack.setEnabled(isMicrophoneEnabled),
        videoTrack.setEnabled(isCameraEnabled),
      ]);

      setLocalUserTrack({
        audioTrack,
        videoTrack,
        screenTrack: null,
      });
    } catch (error) {
      console.log("Error configuring waiting area:", error);
    }
  };

  const getProcessorInstance = async () => {
    if (!processor && localUserTrack.videoTrack) {
      processor = extension.createProcessor();
      try {
        await processor.init();
      } catch (error) {
        console.log("Fail to load WASM resource!");
        return null;
      }
      localUserTrack.videoTrack
        .pipe(processor)
        .pipe(localUserTrack.videoTrack.processorDestination);
    }
    return processor;
  };

  const setBackgroundColor = async (color: string) => {
    if (localUserTrack?.videoTrack) {
      const processor = await getProcessorInstance();
      try {
        if (color === "transparent") {
          await processor.disable();
          return;
        }
        processor.setOptions({ type: "color", color: color });
        await processor.enable();
      } finally {
      }
    }
  };

  const setBackgroundBlurring = async (blurDegree: number) => {
    if (localUserTrack?.videoTrack) {
      const processor = await getProcessorInstance();
      try {
        if (blurDegree === 0) {
          await processor.disable();
          return;
        }
        processor.setOptions({ type: "blur", blurDegree: blurDegree });
        await processor.enable();
      } finally {
      }
    }
  };

  const setBackgroundImage = async (imgSrc: any) => {
    const imgElement = document.createElement("img");
    imgElement.onload = async () => {
      const processor = await getProcessorInstance();
      try {
        processor?.setOptions({ type: "img", source: imgElement });
        await processor?.enable();
      } finally {
      }
    };
    if (imgSrc === undefined) {
      await processor?.disable();
      return;
    }
    imgElement.src = imgSrc;
  };

  const releaseMediaResources = useCallback(async () => {
    try {
      if (localUserTrack?.videoTrack) {
        localUserTrack.videoTrack.stop();
        await localUserTrack.videoTrack.close();
      }
      if (localUserTrack?.audioTrack) {
        localUserTrack.audioTrack.stop();
        await localUserTrack.audioTrack.close();
      }
      if (localUserTrack?.screenTrack) {
        localUserTrack.screenTrack.stop();
        await localUserTrack.screenTrack.close();
      }

      setIsSharingScreen(null);
      const streams = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streams.getTracks().forEach((track) => {
        track.stop();
      });

      // Also get all active media tracks and stop them
      const allTracks = document.querySelectorAll("video, audio");
      allTracks.forEach((element) => {
        const mediaElement = element as HTMLMediaElement;
        if (mediaElement.srcObject instanceof MediaStream) {
          const stream = mediaElement.srcObject;
          stream.getTracks().forEach((track) => {
            track.stop();
          });
          mediaElement.srcObject = null;
        }
      });

      setLocalUserTrack(undefined);
      setIsCameraEnabled(true);
      setIsMicrophoneEnabled(true);
    } catch (error) {
      console.log("Error cleaning up tracks:", error);
    }
  }, [
    localUserTrack?.audioTrack,
    localUserTrack?.screenTrack,
    localUserTrack?.videoTrack,
  ]);

  const toggleMicrophone = useCallback(async () => {
    if (localUserTrack && localUserTrack.audioTrack) {
      try {
        const newState = !isMicrophoneEnabled;
        await localUserTrack.audioTrack.setEnabled(newState);

        // if (rtmChannel) {
        //   await sendRateLimitedMessage({
        //     text: JSON.stringify({
        //       type: 'audio-state',
        //       uid: meetingConfig.uid,
        //       enabled: newState
        //     })
        //   });
        // }

        setIsMicrophoneEnabled(newState);
      } catch (error) {
        console.error("Error toggling audio:", error);
      }
    }
  }, [isMicrophoneEnabled, localUserTrack]);

  const toggleCamera = useCallback(async () => {
    try {
      if (!localUserTrack?.videoTrack) return;
      const newState = !isCameraEnabled;
      await localUserTrack?.videoTrack?.setEnabled(newState);

      if (rtcClient) {
        if (newState) {
          const isPublished = rtcClient.localTracks.includes(
            localUserTrack.videoTrack
          );
          if (!isPublished) {
            await rtcClient.publish([localUserTrack.videoTrack]);
          }
        } else {
          await rtcClient.unpublish([localUserTrack.videoTrack]);
        }
      }

      // if (rtmChannel) {
      //   await sendRateLimitedMessage({
      //     text: JSON.stringify({
      //       type: 'video-state',
      //       uid: meetingConfig.uid,
      //       enabled: newState,
      //       hasTrack: true,
      //       timestamp: Date.now()
      //     })
      //   });
      // }

      setIsCameraEnabled(newState);
    } catch (error) {
      console.log("Error toggling video:", error);
    }
  }, [isCameraEnabled, localUserTrack?.videoTrack, rtcClient]);

  useEffect(() => {
    rateLimiter.startResetTimer();
    return () => rateLimiter.stopResetTimer();
  }, []);

  const broadcastCurrentMediaStates = useCallback(async () => {
    if (!rtmChannel) return;

    await sendRateLimitedMessage({
      text: JSON.stringify({
        type: "video-state",
        uid: meetingConfig.uid,
        enabled: isCameraEnabled,
        hasTrack: !!localUserTrack?.videoTrack,
        timestamp: Date.now(),
      }),
    });

    // Queue audio state message
    await sendRateLimitedMessage({
      text: JSON.stringify({
        type: "audio-state",
        uid: meetingConfig.uid,
        enabled: isMicrophoneEnabled,
        timestamp: Date.now(),
      }),
    });
  }, [
    isCameraEnabled,
    isMicrophoneEnabled,
    localUserTrack?.videoTrack,
    meetingConfig.uid,
  ]);

  const onParticipantJoined = useCallback(
    async (memberId: string) => {
      try {
        if (memberId === String(meetingConfig.uid)) {
          return;
        }

        if (remoteParticipants[memberId]) {
          return;
        }

        const attributes = await rtmClient.getUserAttributesByKeys(memberId, [
          "name",
          "userRtcUid",
        ]);

        const participantData = {
          name: attributes.name || "Anonymous",
          rtcUid: attributes.userRtcUid,
          audioEnabled: true,
          videoEnabled: true,
        };

        setRemoteParticipants((prevParticipants) => ({
          ...prevParticipants,
          [memberId]: participantData,
        }));

        remoteUsersRef.current = {
          ...remoteUsersRef.current,
          [memberId]: participantData,
        };

        if (rtmChannel) {
          await rtmChannel.sendMessage({
            text: JSON.stringify({
              type: "user-info",
              uid: meetingConfig.uid,
              name: username,
            }),
          });
          await broadcastCurrentMediaStates();
        }
        if (channelName) {
          fetchMeetingRoomData(channelName);
        }
      } catch (error) {
        console.log("Error handling participant join:", error);
      }
    },
    [
      username,
      meetingConfig.uid,
      remoteParticipants,
      broadcastCurrentMediaStates,
      fetchMeetingRoomData,
      channelName,
    ]
  );

  const onMemberDisconnected = useCallback(
    async (memberId: string) => {
      try {
        // If it's the local user, ignore
        if (memberId === String(meetingConfig.uid)) {
          return;
        }

        // Clean up speaking state
        setSpeakingParticipants((prev) => {
          const updated = { ...prev };
          delete updated[memberId];
          return updated;
        });

        // Clean up screen sharing if the leaving member was sharing
        if (isSharingScreen === memberId) {
          setIsSharingScreen(null);
          setScreenSharingUser(null);
        }

        // Remove from remote participants
        setRemoteParticipants((prev) => {
          const updated = { ...prev };

          // If the participant had any tracks, close them
          const participant = updated[memberId];
          if (participant) {
            if (participant.audioTrack) {
              participant.audioTrack.stop();
            }
            if (participant.videoTrack) {
              participant.videoTrack.stop();
            }
          }

          delete updated[memberId];
          return updated;
        });

        // Update the reference
        remoteUsersRef.current = {
          ...remoteUsersRef.current,
        };
        delete remoteUsersRef.current[memberId];

        // Fetch updated meeting room data to reflect new participant list
        if (channelName) {
          await fetchMeetingRoomData(channelName);
        }
      } catch (error) {
        console.error("Error handling member disconnection:", error);
      }
    },
    [meetingConfig.uid, isSharingScreen, fetchMeetingRoomData, channelName]
  );

  const fetchActiveMeetingParticipants = useCallback(async () => {
    try {
      const members = await rtmChannel.getMembers();
      const participantsData: Record<string, RemoteParticipant> = {};

      for (const memberId of members) {
        if (memberId === String(meetingConfig.uid)) {
          continue;
        }

        if (remoteParticipants[memberId]) {
          continue;
        }

        const attributes = await rtmClient.getUserAttributesByKeys(memberId, [
          "name",
          "userRtcUid",
        ]);

        participantsData[memberId] = {
          name: attributes.name || "Anonymous",
          rtcUid: attributes.userRtcUid,
          audioEnabled: false,
          videoEnabled: false,
        };
      }

      setRemoteParticipants((prevParticipants) => {
        const newParticipants = { ...prevParticipants };
        Object.entries(participantsData).forEach(([id, data]) => {
          if (!newParticipants[id]) {
            newParticipants[id] = data;
          }
        });
        return newParticipants;
      });

      remoteUsersRef.current = {
        ...remoteUsersRef.current,
        ...participantsData,
      };
    } catch (error) {
      console.log("Error fetching active participants:", error);
    }
  }, [meetingConfig?.uid, remoteParticipants]);

  const onMediaStreamPublished = useCallback(
    async (user: any, mediaType: "audio" | "video") => {
      try {
        await rtcClient.subscribe(user, mediaType);
        const uid = String(user.uid);

        if (mediaType === "video") {
          const videoTrack = user.videoTrack;
          setRemoteParticipants((prevUsers) => {
            const existingUser = prevUsers[uid] || {
              name: "",
              rtcUid: uid,
              audioEnabled: false,
              videoEnabled: true,
            };

            return {
              ...prevUsers,
              [uid]: {
                ...existingUser,
                videoTrack,
                videoEnabled: true,
                hasTrack: true,
              },
            };
          });
        }

        if (mediaType === "audio") {
          const audioTrack = user.audioTrack;
          setRemoteParticipants((prevUsers) => ({
            ...prevUsers,
            [uid]: {
              ...prevUsers[uid],
              audioTrack,
              audioEnabled: true,
            },
          }));
          audioTrack.play();
        }
      } catch (error) {
        console.error("[STREAM-ERROR] Error in onMediaStreamPublished:", error);
      }
    },
    []
  );

  const onMediaStreamUnpublished = useCallback(
    async (user: any, mediaType: "audio" | "video") => {
      const uid = String(user.uid);

      if (mediaType === "video" && user.videoTrack?.isScreenTrack) {
        if (isSharingScreen === uid) {
          setIsSharingScreen(null);
          setScreenSharingUser(null);
        }
      } else {
        updateRemoteParticipant(uid, {
          [`${mediaType}Track`]: null,
          [`${mediaType}Enabled`]: false,
        });
      }

      await rtcClient?.unsubscribe(user, mediaType);
    },
    [isSharingScreen, updateRemoteParticipant]
  );

  const onParticipantLeft = useCallback((user: any) => {
    const uid = String(user.uid);

    setSpeakingParticipants((prev) => {
      const updated = { ...prev };
      delete updated[uid];
      return updated;
    });

    setRemoteParticipants((prev) => {
      const updated = { ...prev };
      delete updated[uid];
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!hasJoinedMeeting || !rtcClient) return;

    const cleanup = () => {
      if (rtcClient) {
        rtcClient.removeAllListeners();
      }
    };

    rtcClient.on("user-published", onMediaStreamPublished);
    rtcClient.on("user-unpublished", onMediaStreamUnpublished);
    rtcClient.on("user-left", onParticipantLeft);

    return cleanup;
  }, [
    hasJoinedMeeting,
    onMediaStreamPublished,
    onMediaStreamUnpublished,
    onParticipantLeft,
  ]);

  useEffect(() => {
    remoteUsersRef.current = remoteParticipants;
  }, [remoteParticipants]);

  const checkAndRecoverSubscriptions = useCallback(async () => {
    if (!rtcClient) return;

    const remoteUsers = rtcClient.remoteUsers;
    const currentParticipants = { ...remoteParticipants };

    for (const user of remoteUsers) {
      const uid = String(user.uid);

      if (
        user.hasVideo &&
        (!currentParticipants[uid]?.videoTrack ||
          !currentParticipants[uid]?.hasVideo)
      ) {
        try {
          await rtcClient.subscribe(user, "video");
          setRemoteParticipants((prev) => ({
            ...prev,
            [uid]: {
              ...prev[uid],
              videoTrack: user.videoTrack,
              videoEnabled: true,
              hasVideo: true,
            },
          }));
        } catch (error) {
          console.error("Error recovering video subscription:", error);
        }
      }

      if (
        user.hasAudio &&
        (!currentParticipants[uid]?.audioTrack ||
          !currentParticipants[uid]?.hasAudio)
      ) {
        try {
          await rtcClient.subscribe(user, "audio");
          const audioTrack = user.audioTrack;
          if (audioTrack) {
            audioTrack.setVolume(100);
            audioTrack.play();
            setRemoteParticipants((prev) => ({
              ...prev,
              [uid]: {
                ...prev[uid],
                audioTrack,
                audioEnabled: true,
                hasAudio: true,
              },
            }));
          }
        } catch (error) {
          console.error("Error recovering audio subscription:", error);
        }
      }
    }
  }, [remoteParticipants]);

  const sendChatMessage = async (
    content: string,
    type: "text" | "emoji" = "text"
  ) => {
    if (!rtmChannel || !content.trim()) return;

    try {
      const messageData = {
        type: "chat",
        uid: meetingConfig.uid,
        senderName: username,
        content: content,
        timestamp: Date.now(),
        messageType: type,
      };

      setChatMessages((prev) => [
        ...prev,
        {
          id: `${messageData.timestamp}-${messageData.uid}`,
          sender: {
            uid: messageData.uid,
            name: messageData.senderName,
          },
          content: messageData.content,
          timestamp: messageData.timestamp,
          type: messageData.messageType,
          isLocal: true,
        },
      ]);

      // Send the message
      await sendRateLimitedMessage({
        text: JSON.stringify(messageData),
      });
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  const leaveCall = useCallback(async () => {
    try {
      if (isSharingScreen === String(meetingConfig.uid)) {
        await handleEndScreenShare(
          "end-screen-share",
          meetingConfig.uid as number
        );
      }

      await releaseMediaResources();

      if (rtmChannel) {
        await rtmChannel.leave();
        await rtmClient.logout();
      }

      if (rtcClient) {
        await rtcClient.leave();
        rtcClient.removeAllListeners();
      }

      if (rtcScreenShareClient) {
        await rtcScreenShareClient.leave();
        rtcScreenShareClient.removeAllListeners();
      }

      setChatMessages([]);
      // setHasJoinedMeeting(false);
      setIsSharingScreen(null);
      setScreenSharingUser(null);
      setRemoteParticipants({});
      setSpeakingParticipants({});
      setMeetingStage("prepRoom");
      setRaisedHands({});
      localUserTrack?.videoTrack.unpipe();
      rtmChannel = null as any;
      rtmClient = null as any;
      rtcClient = null as any;
      rtcScreenShareClient = null as any;
    } catch (error) {
      console.error("Error leaving call:", error);
    }
  }, [
    isSharingScreen,
    handleEndScreenShare,
    releaseMediaResources,
    localUserTrack?.videoTrack,
    meetingConfig?.uid,
  ]);

  const disconnectFromMessaging = useCallback(async () => {
    await leaveCall();
  }, [leaveCall]);

  const initializeRealtimeMessaging = useCallback(
    async (name: string) => {
      try {
        if (
          !meetingConfig.appid ||
          !meetingConfig.rtmToken ||
          !meetingConfig.channel
        ) {
          console.error("Missing required RTM configuration");
          return;
        }

        rtmClient = AgoraRTM.createInstance(meetingConfig.appid);
        const sanitizedUid = String(meetingConfig.uid).replace(
          /[^a-zA-Z0-9]/g,
          ""
        );

        await rtmClient.login({
          uid: sanitizedUid,
          token: meetingConfig.rtmToken,
        });
        rtmClient.on("MessageFromPeer", handleRTMMessage);
        const channel = rtmClient.createChannel(meetingConfig.channel);
        rtmChannel = channel;
        await channel.join();

        await rtmClient.addOrUpdateLocalUserAttributes({
          name: name.slice(0, 64),
          userRtcUid: sanitizedUid,
        });

        // Initial user info broadcast
        await channel.sendMessage({
          text: JSON.stringify({
            type: "user-info",
            uid: sanitizedUid,
            name: name,
          }),
        });

        // Set up member join/leave handlers
        channel.on("MemberJoined", onParticipantJoined);
        channel.on("MemberLeft", onMemberDisconnected);
        channel.on("ChannelMessage", handleRTMMessage);
        window.addEventListener("beforeunload", disconnectFromMessaging);

        await fetchActiveMeetingParticipants();
      } catch (error) {
        console.error("Error in initializeRealtimeMessaging:", error);
        throw error;
      }
    },
    [
      meetingConfig.appid,
      meetingConfig.rtmToken,
      meetingConfig.channel,
      meetingConfig.uid,
      onMemberDisconnected,
      handleRTMMessage,
      onParticipantJoined,
      fetchActiveMeetingParticipants,
      disconnectFromMessaging,
    ]
  );

  const connectToMeetingRoom = async () => {
    try {
      rtcClient = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8",
      });

      rtcClient.on("user-published", onMediaStreamPublished);
      rtcClient.on("user-unpublished", onMediaStreamUnpublished);
      rtcClient.on("user-left", onParticipantLeft);
      rtcClient.on("user-joined", (user) => {});

      await rtcClient.setClientRole("host");
      setupVolumeIndicator();

      const mode = meetingConfig?.proxyMode ?? 0;
      if (mode !== 0 && !isNaN(parseInt(mode))) {
        rtcClient.startProxyServer(parseInt(mode));
      }

      if (meetingConfig.role === "audience") {
        rtcClient.setClientRole(meetingConfig.role, {
          level: meetingConfig.audienceLatency,
        });
      } else if (meetingConfig.role === "host") {
        rtcClient.setClientRole(meetingConfig.role);
      }

      if (
        !meetingConfig ||
        meetingConfig.uid === "" ||
        meetingConfig.uid == null
      ) {
        alert("Meeting config not populated");
        router.push(`/studio/event/meeting/${channelName}`);
        return;
      }

      await localUserTrack.audioTrack.setEnabled(true);
      await localUserTrack.videoTrack.setEnabled(true);

      meetingConfig.uid = await rtcClient.join(
        meetingConfig.appid || "",
        meetingConfig.channel || "",
        meetingConfig.rtcToken || null,
        String(meetingConfig.uid) || null
      );

      await initializeRealtimeMessaging(username!);
    } catch (error) {
      console.error("Error in connectToMeetingRoom:", error);
      throw error;
    }
  };

  // const joinMeetingRoom = async () => {
  //   try {
  //     if (!meetingConfig) {
  //       console.log("lobby, Returning cos there is nio meeting config");
  //       return;
  //     }
  //     await connectToMeetingRoom();

  //     if (rtmChannel) {
  //       await rtmChannel.sendMessage({
  //         text: JSON.stringify({
  //           type: "user-info",
  //           uid: meetingConfig.uid,
  //           name: username,
  //         }),
  //       });
  //     }

  //     if (localUserTrack) {
  //       const tracksToPublish = [];

  //       // Only publish audio track if microphone is enabled
  //       if (localUserTrack.audioTrack && isMicrophoneEnabled) {
  //         await localUserTrack.audioTrack.setEnabled(true);
  //         tracksToPublish.push(localUserTrack.audioTrack);
  //       }
  //       if (localUserTrack.videoTrack && isCameraEnabled) {
  //         await localUserTrack.videoTrack.setEnabled(true);
  //         tracksToPublish.push(localUserTrack.videoTrack);
  //       }

  //       if (tracksToPublish.length > 0) {
  //         await rtcClient.publish(tracksToPublish);
  //       }

  //       await broadcastCurrentMediaStates();
  //     }

  //     setHasJoinedMeeting(true);
  //     setMeetingStage("hasJoinedMeeting");
  //     setMeetingConfig(meetingConfig);
  //   } catch (error) {
  //     console.log("Error joining meeting:", error);
  //   }
  // };

  const joinMeetingRoom = async () => {
    try {
      if (!meetingConfig) {
        console.log("lobby, Returning cos there is nio meeting config");
        return;
      }

      if (!localUserTrack.audioTrack && !localUserTrack.videotrack) {
        await initializeLocalMediaTracks();
      }

      await connectToMeetingRoom();

      if (localUserTrack && localUserTrack.audioTrack) {
        await localUserTrack.audioTrack?.setEnabled(isMicrophoneEnabled);
      }
      if (localUserTrack && localUserTrack.videotrack) {
        await localUserTrack.videoTrack?.setEnabled(isCameraEnabled);
      }

      if (localUserTrack) {
        const tracksToPublish = [];

        // Only publish audio track if microphone is enabled
        // if (localUserTrack.audioTrack) {
        //   tracksToPublish.push(localUserTrack.audioTrack);
        // }
        // if (localUserTrack.videoTrack) {
        //   tracksToPublish.push(localUserTrack.videoTrack);
        // }

        if (isMicrophoneEnabled) {
          tracksToPublish.push(localUserTrack.audioTrack);
        }
        if (isCameraEnabled) {
          tracksToPublish.push(localUserTrack.videoTrack);
        }

        if (tracksToPublish.length > 0) {
          await rtcClient.publish(tracksToPublish);
        }

        if (rtmChannel) {
          await rtmChannel.sendMessage({
            text: JSON.stringify({
              type: "user-info",
              uid: meetingConfig.uid,
              name: username,
            }),
          });
        }
        await broadcastCurrentMediaStates();
      }

      setHasJoinedMeeting(true);
      setMeetingStage("hasJoinedMeeting");
      setMeetingConfig(meetingConfig);
    } catch (error) {
      console.log("Error joining meeting:", error);
    }
  };

  const toggleRaiseHand = useCallback(async () => {
    if (!rtmChannel || !meetingConfig.uid) return;

    const isCurrentlyRaised = raisedHands[String(meetingConfig.uid)];
    const newState = !isCurrentlyRaised;

    try {
      await rtmChannel.sendMessage({
        text: JSON.stringify({
          type: "hand-state",
          uid: meetingConfig.uid,
          isRaised: newState,
        }),
      });

      setRaisedHands((prev) => ({
        ...prev,
        [String(meetingConfig.uid)]: newState,
      }));
    } catch (error) {
      console.error("Error toggling raise hand:", error);
    }
  }, [meetingConfig.uid, raisedHands]);

  const sendCoHostPermission = async (uid: string | number) => {
    try {
      const response = await fetch(`${baseUrl}/rooms/add-cohost`, {
        method: "POST",
        headers: {
          "Agora-Signature": "stridez@123456789",
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify({
          roomCode: channelName,
          userId: uid,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send cohost permission");
      }
      const data = await response.json();
      console.log("Cohost permission sent successfully:", data);
      await rtmChannel.sendMessage({
        text: JSON.stringify({
          type: "give-cohost",
          uid,
        }),
      });
      if (meetingConfig?.channel) {
        fetchMeetingRoomData(meetingConfig?.channel);
      }
    } catch (error) {
      console.error("Error sending cohost permission:", error);
    }
  };

  const removeRemoteUser = async (uid: string | number): Promise<void> => {
    console.log("removed", uid);
    await rtmChannel.sendMessage({
      text: JSON.stringify({
        type: "remove-user",
        uid,
      }),
    });
  };

  useEffect(() => {
    window.addEventListener("beforeunload", disconnectFromMessaging);
    return () => {
      window.removeEventListener("beforeunload", disconnectFromMessaging);
    };
  }, [disconnectFromMessaging]);

  useEffect(() => {
    if (hasJoinedMeeting) {
      const recoveryInterval = setInterval(checkAndRecoverSubscriptions, 5000);
      return () => clearInterval(recoveryInterval);
    }
  }, [hasJoinedMeeting, checkAndRecoverSubscriptions]);

  useLayoutEffect(() => {
    if (
      videoRef.current !== null &&
      localUserTrack &&
      localUserTrack.videoTrack
    ) {
      localUserTrack.videoTrack.play(videoRef.current, meetingConfig);
    }

    return () => {
      if (localUserTrack && localUserTrack.videoTrack) {
        localUserTrack.videoTrack.close();
      }
    };
  }, [localUserTrack, meetingConfig]);

  useLayoutEffect(() => {
    return () => {
      if (localUserTrack && localUserTrack.audioTrack) {
        localUserTrack.audioTrack.stop();
      }
    };
  }, [localUserTrack]);

  useEffect(() => {
    return () => {
      if (rtmChannel) {
        rtmChannel.off("MemberLeft", onMemberDisconnected);
        rtmChannel.off("MemberJoined", onParticipantJoined);
      }
    };
  }, [onMemberDisconnected, onParticipantJoined]);

  return (
    <VideoConferencingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        setMeetingConfig,
        setRtcScreenShareOptions,
        meetingRoomId,
        setMeetingRoomId,
        isMicrophoneEnabled,
        isCameraEnabled,
        toggleMicrophone,
        toggleCamera,
        localUserTrack,
        meetingConfig,
        isWaiting,
        setIsWaiting,
        videoRef,
        initializeLocalMediaTracks,
        setLocalUserTrack,
        releaseMediaResources,
        joinMeetingRoom,
        setMeetingStage,
        meetingStage,
        setChannelName,
        channelName,
        remoteParticipants,
        hasJoinedMeeting,
        remoteUsersRef,
        setUsername,
        username,
        setHasJoinedMeeting,
        speakingParticipants,
        handleShareScreen,
        handleEndScreenShare,
        userIsHost,
        userIsCoHost,
        setUserIsCoHost,
        meetingRoomData,
        screenTrack,
        isSharingScreen,
        screenSharingUser,
        leaveCall,
        setBackgroundColor,
        setBackgroundBlurring,
        setBackgroundImage,
        raisedHands,
        toggleRaiseHand,
        chatMessages,
        sendChatMessage,
        rtcScreenShareOptions,
        handleMeetingHostAndCohost,
        sendCoHostPermission,
        muteRemoteUser,
        fetchMeetingRoomData,
        setMeetingRoomData,
        removeRemoteUser,
        setJoinRequests,
        joinRequests,
        setDeviceStream,
        deviceStream,
      }}
    >
      {children}
    </VideoConferencingContext.Provider>
  );
}

export function useVideoConferencing() {
  const context = useContext(VideoConferencingContext);
  if (context === undefined) {
    throw new Error("useVideoConferencing must be used within a VideoProvider");
  }
  return context;
}
