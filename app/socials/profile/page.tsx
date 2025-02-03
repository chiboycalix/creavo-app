"use client";

import React, { useCallback, useEffect, useState } from "react";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileTabs from "./_components/ProfileTabs";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import ProtectedRoute from "@/components/ProtectedRoute";
import Error from "@/components/Error";
import { useRouter } from "next/navigation";
import { baseUrl } from "@/utils/constant";
import { useAuth } from "@/context/AuthContext";
import { Course, MyLearning, Post, UserProfile } from "@/types/courses";

const Profile = () => {
  const router = useRouter();
  const { getAuth, getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();

  const [state, setState] = useState({
    userProfile: { id: 0, username: "", followers: 0, following: 0 } as UserProfile,
    courses: null as Course[] | null,
    posts: null as Post[] | null,
    myLearning: null as MyLearning[] | null,
    loading: true,
    error: false
  });

  const isCurrentUser = currentUser?.id === state.userProfile.id;

  const handleApiError = (error: unknown, context: string) => {
    setState(prev => ({ ...prev, error: true }));
  };

  const fetchUserProfile = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      const response = await fetch(`${baseUrl}/profiles/${currentUser.id}`);
      const { data } = await response.json();
      if (response.status === 404) {
        router.push("/404");
        return;
      }

      setState(prev => ({ ...prev, userProfile: data, loading: false }));
    } catch (error) {
      handleApiError(error, "fetchUserProfile");
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [currentUser.id, router]);

  const fetchResourceData = useCallback(async (endpoint: string) => {
    if (!currentUser?.id) return null;

    try {
      const response = await fetch(
        `${baseUrl}/users/${currentUser.id}/${endpoint}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` }
        }
      );
      const { data } = await response.json();
      return endpoint === "courses" ? data?.courses : data?.posts;
    } catch (error) {
      handleApiError(error, `fetch${endpoint}`);
      return null;
    }
  }, [currentUser.id]);

  useEffect(() => {
    const loadData = async () => {
      await fetchUserProfile();

      const [coursesData, postsData] = await Promise.all([
        fetchResourceData("courses"),
        fetchResourceData("posts")
      ]);

      setState(prev => ({
        ...prev,
        courses: coursesData,
        posts: postsData
      }));

      if (isCurrentUser) {
        const learningData = await fetchResourceData("learnings?page=1&limit=10");
        setState(prev => ({ ...prev, myLearning: learningData }));
      }
    };

    loadData();
  }, [currentUser?.id, fetchResourceData, isCurrentUser, fetchUserProfile]);

  const handleFollow = () => {
    if (!getAuth()) {
      router.push("/auth");
      return;
    }
    // Implement follow logic
  };

  if (state.error) {
    return (
      <div className="bg-white rounded">
        <Error
          errorCode={500}
          errorMessage="Something went wrong while loading this profile. Please refresh."
        />
      </div>
    );
  }

  if (state.loading) {
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
          userProfile={state.userProfile}
          isCurrentUser={isCurrentUser}
          onFollow={handleFollow}
        />
        <ProfileTabs
          isCurrentUser={isCurrentUser}
          courses={state.courses}
          posts={state.posts}
          myLearning={state.myLearning}
          user={currentUser}
          loadingCourses={false}
          loadingPosts={false}
        />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;