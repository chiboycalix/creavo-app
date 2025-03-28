"use client"

import type React from "react"
import { useState } from "react"
import FollowButton from "@/components/FollowButton"
import Image from "next/image"
import FollowingCard from "@/components/socials/profile/FollowingCard"
import FollowersCard from "@/components/socials/profile/FollowersCard"
import EditUserProfileModal from "./EditUserInputModal"
import { BsPencil } from "react-icons/bs"
import ShareButton from "@/components/socials/explore/ShareButton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ProfileSettings from "./SettingsPage"
import { useSettings } from "@/context/SettingsContext"

interface Profile {
  firstName: string
  lastName: string
  avatar: string
  bio: string
}

interface UserProfile {
  id: number
  username: string
  profile?: Profile
  followers: number
  following: number
}

interface ProfileHeaderProps {
  userProfile: UserProfile
  isCurrentUser: boolean
  onFollow: () => void
  onProfileUpdate: (updatedProfile: UserProfile) => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userProfile, isCurrentUser, onProfileUpdate }: any) => {
  const [showFollowersCard, setShowFollowersCard] = useState(false)
  const [showFollowingCard, setShowFollowingCard] = useState(false)

  const [profileSettingsModal, setProfileSettingsModal] = useState(false)
  const { openSettingsModal, setOpenSettingsModal } = useSettings()

  const [followingAnchorRect, setfollowingAnchorRect] = useState<DOMRect | null>(null)
  const [followersAnchorRect, setfollowersAnchorRect] = useState<DOMRect | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const handleFollowersClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect()
    setfollowersAnchorRect(buttonRect)
    setShowFollowersCard(true)
  }

  const handleFollowingClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect()
    setfollowingAnchorRect(buttonRect)
    setShowFollowingCard(true)
  }

  const handleSettingsModal = () => {
    setOpenSettingsModal?.(true)
  }

  const handleClose = () => {
    setOpenSettingsModal?.(false)
  }

  const handleCloseEditUserProfileModal = () => {
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col items-center w-full p-4 relative">
      <Image
        width={96}
        height={96}
        className="w-24 h-24 rounded-full bg-gray-400 object-cover"
        src={
          userProfile?.profile?.avatar ||
          `https://ui-avatars.com/api/?name=${
            encodeURIComponent(userProfile?.username) || "/placeholder.svg"
          }&background=random`
        }
        alt={`${userProfile?.username || "User"}'s profile avatar`}
      />
      <div className="mt-2">
        <div className="flex justify-center items-center gap-3">
          <h1 className="text-sm font-semibold">
            {userProfile?.profile?.firstName && userProfile?.profile?.lastName === "None"
              ? userProfile?.username
              : `${userProfile?.profile?.firstName || ""} ${userProfile?.profile?.lastName || ""}`.trim()}
          </h1>
          <p className="text-sm">@{userProfile?.username}</p>
        </div>
        <div className="flex items-center justify-center gap-2 mt-2 mx-auto">
          {isCurrentUser ? (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger className="bg-primary-700 px-6 py-2.5 text-white flex text-sm items-center rounded-md max-w-8/12 font-medium border hover:bg-primary-600">
                <BsPencil className="mr-1" />
                <span className="text-xs">Edit Profile</span>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <EditUserProfileModal
                    userProfile={userProfile}
                    aria-label="Edit user profile modal"
                    onProfileUpdate={onProfileUpdate}
                    onClose={handleCloseEditUserProfileModal}
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ) : (
            <FollowButton followedId={Number(userProfile?.id)} />
          )}
          <div className="inline-flex items-center rounded-md px-1.5 -py-2  bg-gray-300">
            <ShareButton postId={userProfile?.id} type="profile" post={userProfile} />
          </div>
          <span
            className="inline-flex items-center rounded-md px-3 py-1.5 bg-gray-300 cursor-pointer"
            aria-label="Share this profile"
            onClick={handleSettingsModal}
          >
            <img src="/assets/profile/settings.svg" alt="image" />
          </span>
        </div>
      </div>
      <div className="flex space-x-4 mt-3">
        <div className="cursor-pointer flex items-center gap-1" onClick={handleFollowersClick}>
          <span className="font-bold">{userProfile?.followers}</span>
          <span>Followers</span>
        </div>
        <div className="cursor-pointer flex items-center gap-1" onClick={handleFollowingClick}>
          <span className="font-bold inline-block">{userProfile?.following}</span>
          <span className="inline-block">Following</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 mt-2 max-w-md text-center">
          {userProfile?.profile?.bio || "No bio available"}
        </p>
      </div>

      {showFollowingCard && (
        <FollowingCard
          isOpen={showFollowingCard}
          onClose={() => setShowFollowingCard(false)}
          anchorRect={followingAnchorRect}
          userId={userProfile?.id}
        />
      )}
      {showFollowersCard && (
        <FollowersCard
          isOpen={showFollowersCard}
          onClose={() => setShowFollowersCard(false)}
          anchorRect={followersAnchorRect}
          userId={userProfile?.id}
        />
      )}

      {openSettingsModal && <ProfileSettings isModalOpen={openSettingsModal} handleClose={handleClose} />}
    </div>
  )
}

export default ProfileHeader

