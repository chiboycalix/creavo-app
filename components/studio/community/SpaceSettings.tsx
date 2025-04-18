"use client";
import React, { useState } from "react";
import FollowerSkeleton from "@/components/sketetons/FollowerSkeleton";
import EditSpace from "./EditSpace";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Edit, Trash2, X } from "lucide-react";
import { SearchInput } from "@/components/Input/SearchInput";
import { Button } from "@/components/ui/button";
import { Collapsible } from "@radix-ui/react-collapsible";
import { CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RemoveMemberFromSpacePayload, removeMemberFromSpaceService } from "@/services/community.service";
import { toast } from "sonner";
import { DEFAULT_AVATAR } from "@/constants";

type SpaceSettingsProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
  currentSpace?: any;
  communityId?: string;
  members?: any;
  isFetchingSpaceMembers: boolean;
};

const SpaceSettings = ({
  isOpen,
  onClose,
  anchorRect,
  currentSpace,
  members,
  isFetchingSpaceMembers
}: SpaceSettingsProps) => {
  const queryClient = useQueryClient();
  const [showEditSpaceCard, setShowEditSpaceCard] = useState(false);
  const [editSpaceAnchorRect, setEditSpaceAnchorRect] = useState<DOMRect | null>(null);

  const menuPosition = {
    top: 2,
    right: 0,
  };

  const avatarUrl = currentSpace?.logo || DEFAULT_AVATAR;
  const [isOpenMembers, setIsOpenMembers] = useState(true)
  const [isOpenAccessControl, setIsOpenAccessControl] = useState(true)

  const handleEditSpaceClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setEditSpaceAnchorRect(buttonRect);
    setShowEditSpaceCard(true);
  };

  const { mutate: handleRemoveMemberFomSpace, isPending: isRemovingMemberFromSpace } = useMutation({
    mutationFn: (payload: RemoveMemberFromSpacePayload) => removeMemberFromSpaceService(payload),
    onSuccess: async (data) => {
      toast.success("Member removed successfully");
      queryClient.invalidateQueries({ queryKey: ["useListSpaces"] })
      queryClient.invalidateQueries({ queryKey: ["spaceId-communityId", currentSpace?.communityId, currentSpace?.id] })
      queryClient.invalidateQueries({ queryKey: ["useListSpaceMembers"] })
    },
    onError: (error: any) => {
      toast.error(`Something went wrong`);
    },
  });

  const handleRemoveMember = async (member: any) => {
    await handleRemoveMemberFomSpace({
      communityId: currentSpace?.communityId,
      spaceId: currentSpace?.id,
      members: [member?.username],
    });
  };

  if (!anchorRect) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "fixed",
              top: menuPosition.top,
              right: menuPosition.right,
              transformOrigin: "bottom right",
            }}
            className="z-50 w-96 bg-white border rounded-lg shadow-lg h-[99.5vh] p-3"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold">Space settings</p>
              <X size={18} onClick={onClose} className="cursor-pointer" />
            </div>
            <div className="flex items-start gap-4 mt-6">
              <div className="p-2 rounded-md bg-[#F0F0F0] mt-1">
                <img src={avatarUrl} alt="avatarUrl" className="w-6 h-6 rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-md">{currentSpace?.displayName}</span>
                <span className="text-sm">{currentSpace?.description}</span>

                <div className="mt-3" onClick={handleEditSpaceClick}>
                  <Button className="py-4 rounded-lg" size={"sm"}>
                    Edit Space
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Collapsible open={isOpenMembers} onOpenChange={setIsOpenMembers}>
                <div className='inline-flex justify-between items-center gap-4 w-full mt-8'>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between text-sm font-semibold cursor-pointer">
                      <span>Members({`${members?.length}`})</span>

                      {isOpenMembers ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>

                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="p-3 border rounded-md mt-2">
                  <div className="">
                    <SearchInput placeholder="Search" className="rounded-lg" />
                  </div>
                  <div className="mt-4 max-h-[40vh] overflow-y-auto">
                    {isFetchingSpaceMembers ? (
                      <FollowerSkeleton count={10} />
                    ) : (
                      <div>
                        {members?.map((member: any) => (
                          <div key={member.id} className="flex group items-start justify-between">
                            <div className="flex items-center gap-2 mb-4 cursor-pointer">
                              <img
                                src={member.avatar || DEFAULT_AVATAR}
                                alt={`${member.username}'s avatar`}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                }}
                              />
                              <div className="flex flex-col">
                                <span className="text-sm inline-block">
                                  {member?.name}
                                </span>
                                <span className="text-xs inline-block">
                                  @{member?.username}
                                </span>
                              </div>
                            </div>
                            <div className="group-hover:block hidden cursor-pointer" onClick={() => handleRemoveMember(member)}>
                              <Trash2 />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div>
              <Collapsible open={isOpenAccessControl} onOpenChange={setIsOpenAccessControl}>
                <div className='inline-flex justify-between items-center gap-4 w-full mt-8'>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between text-sm font-semibold cursor-pointer">
                      <span>Access Control</span>

                      {isOpenAccessControl ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>

                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-2 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Switch />
                    <span>Comments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch />
                    <span>Emojis</span>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.div>

          {showEditSpaceCard && currentSpace && (
            <EditSpace
              isOpen={showEditSpaceCard}
              onClose={() => setShowEditSpaceCard(false)}
              anchorRect={editSpaceAnchorRect}
              currentSpace={currentSpace}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default SpaceSettings;
