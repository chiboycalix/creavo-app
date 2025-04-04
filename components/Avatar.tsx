import React from 'react';

interface AvatarProps {
  profileLoading: boolean;
  profileData: any; // Replace 'any' with the actual type of your profile data
  className?: string; // Optional class names for styling
}

const Avatar: React.FC<AvatarProps> = ({ profileLoading, profileData, className }) => {
  const defaultAvatar = "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png";
  const avatarUrl = profileLoading
    ? defaultAvatar
    : profileData?.data?.profile?.avatar || defaultAvatar;

  return (
    <img
      src={avatarUrl}
      alt="User Avatar"
      className={`rounded-full object-cover w-12 ${className || ''}`}
    />
  );
};

export default Avatar;