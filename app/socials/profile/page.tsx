"use client";
import React from "react";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileTabs from "./_components/ProfileTabs";
import Loading from "@/components/Loading";
import ProtectedRoute from "@/components/ProtectedRoute";
import Error from "@/components/Error";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserCourses } from "@/hooks/useUserCourses";
import { useUserPosts } from "@/hooks/useUserPosts";
import { useUserLearning } from "@/hooks/useUserLearning";

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

  const handleFollow = () => {
    if (!getAuth()) {
      router.push('/auth');
      return;
    }
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

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className="w-full flex flex-col bg-white my-px min-h-[83vh] p-3">
        <ProfileHeader
          userProfile={profileData?.data}
          isCurrentUser={isCurrentUser}
          onFollow={handleFollow}
        />
        <ProfileTabs
          isCurrentUser={isCurrentUser}
          courses={coursesData?.data?.courses}
          posts={postsData?.data?.posts}
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