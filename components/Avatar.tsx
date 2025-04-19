import { DEFAULT_AVATAR } from '@/constants';
import React from 'react';

interface AvatarProps {
  profileLoading: boolean;
  profileData: any; // Replace 'any' with the actual type of your profile data
  className?: string; // Optional class names for styling
}

const Avatar: React.FC<AvatarProps> = ({ profileLoading, profileData, className }) => {
  const avatarUrl = profileLoading
    ? DEFAULT_AVATAR
    : profileData?.data?.profile?.avatar || DEFAULT_AVATAR;

  return (
    <img
      src={avatarUrl}
      alt="User Avatar"
      className={`rounded-full object-cover w-12 ${className || ''}`}
    />
  );
};

export default Avatar;