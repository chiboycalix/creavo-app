'use client';

import React, { useState, useEffect } from "react";
import EditUserInputModal from "./EditUserInputModal";
import FollowButton from "@/components/FollowButton";
import FollowLink from "./FollowLink";
import Image from "next/image";
import { BsPencil } from "react-icons/bs";
import { BiShare } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface Profile {
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
}

interface UserProfile {
  id: number;
  username: string;
  profile?: Profile;
  followers: number;
  following: number;
}

interface ProfileHeaderProps {
  userProfile: UserProfile;
  isCurrentUser: boolean;
  onFollow: () => void;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  isCurrentUser,
  onProfileUpdate
  // onFollow,
}: any) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(false);
  
    setTimeout(() => {
      setShowModal(true);
      console.log("Modal state:", true); 
    }, 500); 
  };
  
  return (
    <div className="flex flex-col items-center w-full p-4">
       <Image
        width={96}
        height={96}
        className="w-24 h-24 rounded-full bg-gray-400 object-cover"
        src={
          userProfile?.profile?.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            userProfile?.username
          )}&background=random`
        }
        alt={`${userProfile?.username || "User"}'s profile avatar`}
      />
      <div className="mt-2">
        <div className="flex itcms-center gap-3">
          <h1 className="text-sm font-semibold">
            {userProfile?.profile?.firstName &&
              userProfile?.profile?.lastName === "None"
              ? userProfile?.username
              : `${userProfile?.profile?.firstName || ""} ${userProfile?.profile?.lastName || ""
                }`.trim()}
          </h1>
          <p className="text-sm">@{userProfile?.username}</p>
        </div>
        <div className="flex gap-2 mt-2">
          {isCurrentUser ? (
            <Button
              onClick={toggleModal}
              aria-label="Edit your profile"
              className="flex text-sm items-center rounded-md w-8/12 font-medium border hover:bg-primary-600"
            >
              <BsPencil className="mr-1" />
              <span className="text-xs">Edit Profile</span>
            </Button>
          ) : (
            <FollowButton followedId={Number(userProfile?.id)} />
          )}
          <span
            className="flex items-center rounded-md px-3 py-1 bg-gray-300 cursor-pointer"
            aria-label="Share this profile"
          >
            <BiShare />
          </span>
          <span
            className="flex items-center rounded-md px-3 py-1 bg-gray-300 cursor-pointer"
            aria-label="Share this profile"
          >
            <Settings />
          </span>
        </div>
      </div>
      <div className="flex space-x-4 mt-3">
        <div>
          <span className="font-bold">{userProfile?.following}</span>
          <FollowLink
            id={userProfile?.id}
            type="followings"
            className="text-gray-500 text-sm"
            aria-label={`${userProfile?.following} people this user is following`}
          >
            {" "}
            Following
          </FollowLink>
        </div>
        <div>
          <span className="font-bold">{userProfile?.followers}</span>
          <FollowLink
            id={userProfile?.id}
            type="followers"
            className="text-gray-500 text-sm"
            aria-label={`${userProfile?.followers} followers`}
          >
            {" "}
            Followers
          </FollowLink>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 mt-2">
          {userProfile?.profile?.bio || "No bio available"}
        </p>
      </div>
      {/* Modal for editing user information */}
      {showModal && (
        <EditUserInputModal
          userProfile={userProfile}
          onClose={()=>setShowModal(false)}
          aria-label="Edit user profile modal"
          onProfileUpdate={onProfileUpdate}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
