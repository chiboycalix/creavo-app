"use client";
import React, { useState, useEffect } from "react";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileTabs from "./_components/ProfileTabs";
import Loading from "@/components/Loading";
import ProtectedRoute from "@/components/ProtectedRoute";
import Error from "@/components/Error";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserCourses } from "@/hooks/useUserCourses";
import { useUserPosts } from "@/hooks/posts/useUserPosts";
import { useUserLearning } from "@/hooks/useUserLearning";
import { generalHelpers } from "@/helpers";

const Profile = () => {
  const router = useRouter();
  const { getAuth, getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();

  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError
  } = useUserProfile(currentUser?.id);

  const { data: coursesData } = useUserCourses(currentUser?.id);
  const { data: postsData } = useUserPosts(currentUser?.id);
  const isCurrentUser = currentUser?.id === profileData?.data?.id;
  const { data: learningData } = useUserLearning(currentUser?.id, isCurrentUser);

  const [userProfile, setUserProfile] = useState(profileData?.data);

  useEffect(() => {
    if (profileData?.data && profileData.data !== userProfile) {
      setUserProfile(profileData.data);
    }
  }, [profileData]);


  const handleFollow = () => {
    if (!getAuth()) {
      router.push('/auth');
      return;
    }
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
  };

  if (profileError) {
    return (
      <div className="bg-white rounded">
        <Error
          errorCode={500}
          errorMessage="Something went wrong while loading this profile. Please refresh."
        />
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="bg-white rounded">
        <Loading />
      </div>
    );
  }

  const result = generalHelpers.processPostsData({
    posts: postsData?.data.posts,
    likedStatuses: postsData?.data.likedStatuses,
    followStatuses: postsData?.data?.followStatuses,
    bookmarkStatuses: postsData?.data?.bookmarkStatuses,
  });

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className="w-full flex-col min-h-[83vh] flex my-px p-3">
        <ProfileHeader
          key={userProfile?.id}
          userProfile={userProfile}
          isCurrentUser={isCurrentUser}
          onFollow={handleFollow}
          onProfileUpdate={handleProfileUpdate} // Pass update function
        />
        <ProfileTabs
          isCurrentUser={isCurrentUser}
          courses={coursesData?.data?.courses}
          posts={result}
          myLearning={learningData?.data}
          user={currentUser}
          loadingCourses={false}
          loadingPosts={false}
        />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
