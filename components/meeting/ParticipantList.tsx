import React, { useEffect } from "react";
import {
  MoreVertical,
  Crown,
  UserRoundX,
  UserRoundPlus,
  Hand,
  MicOff,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { useVideoConferencing } from "@/context/VideoConferencingContext";

const ParticipantList = ({ allParticipants }: any) => {
  const {
    isMicrophoneEnabled,
    isCameraEnabled,
    speakingParticipants,
    raisedHands,
    sendCoHostPermission,
    userIsCoHost,
    userIsHost,
    handleMeetingHostAndCohost,
    muteRemoteUser
  } = useVideoConferencing();
  const { getCurrentUser } = useAuth();

  console.log("participants", allParticipants);

  console.log("host", userIsHost);
  console.log("cohost", userIsCoHost);

  useEffect(() => {
    handleMeetingHostAndCohost();
  }, [allParticipants, handleMeetingHostAndCohost]);

  return (
    <div className="space-y-4">
      {[...allParticipants]?.map((applicant, index) => {
        const hasRaisedHand = raisedHands[applicant.uid];

        return (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  P{index + 1}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  {applicant.isLocal
                    ? "You"
                    : `${applicant.name || `User ${index + 1}`}`}
                </p>
                <p className="text-gray-400 text-xs">Viewer</p>
              </div>
            </div>

            <div className="flex gap-1 items-center">
              {hasRaisedHand && <Hand className="text-white w-4 h-4" />}

              {applicant.uid !== getCurrentUser()?.id &&
                (userIsCoHost || userIsHost) && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-44 p-0 bg-gray-800 border-gray-700 z-[200]"
                      align="end"
                      side="bottom"
                      sideOffset={5}
                    >
                      <div className="py-1">
                        {userIsHost && (
                          <button
                            className="w-full px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2"
                            onClick={() => {
                              console.log("Remove clicked");
                            }}
                          >
                            <UserRoundPlus className="w-4 h-4" />
                            <span>Make Co-host</span>
                          </button>
                        )}

                        {(userIsHost || userIsCoHost) && (
                          <button
                            className="w-full px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2"
                            onClick={() => muteRemoteUser(applicant?.uid)}
                          >
                            <MicOff className="w-4 h-4" />
                            <span>Mute</span>
                          </button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ParticipantList;
