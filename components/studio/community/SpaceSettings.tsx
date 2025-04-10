"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { SearchInput } from "@/components/Input/SearchInput";
import { useFetchFollowers } from "@/hooks/profile/useFetchFollowers";
import FollowerSkeleton from "@/components/sketetons/FollowerSkeleton";
import { Button } from "@/components/ui/button";
import { Collapsible } from "@radix-ui/react-collapsible";
import { CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";

type SpaceSettingsProps = {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
  userId: string;
  currentSpace?: any;
  members?: any;
  isFetchingSpaceMembers: boolean;
};

const SpaceSettings = ({
  isOpen,
  onClose,
  anchorRect,
  userId,
  currentSpace,
  members,
  isFetchingSpaceMembers
}: SpaceSettingsProps) => {
  const menuPosition = {
    top: 2,
    right: 0,
  };
  const {
    data,
    isLoading,
    error,
  } = useFetchFollowers(userId);

  const defaultAvatar = "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png";
  const avatarUrl = currentSpace?.logo || defaultAvatar;
  const [isOpenMembers, setIsOpenMembers] = useState(true)
  const [isOpenAccessControl, setIsOpenAccessControl] = useState(false)
  if (error) return <div>Error: {(error as Error).message}</div>;

  if (!anchorRect) return null;

  console.log({ currentSpace, isFetchingSpaceMembers, members })
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

                <div className="mt-3">
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
                      <span>Members(502)</span>

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
                  <div className="mt-4">
                    {isLoading ? (
                      <FollowerSkeleton count={10} />
                    ) : (
                      <div>calix</div>
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
        </>
      )}
    </AnimatePresence>
  );
};

export default SpaceSettings;
