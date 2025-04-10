"use client";

import { useState, useEffect, useRef } from "react";
import ProfileHeader from "../_components/ProfileHeader";
import ProfileTabs from "../_components/ProfileTabs";
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomError from "@/components/Error";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserCourses } from "@/hooks/useUserCourses";
import { useUserPosts } from "@/hooks/posts/useUserPosts";
import { useUserLearning } from "@/hooks/useUserLearning";
import { generalHelpers } from "@/helpers";
import { useWebSocket } from "@/context/WebSocket";
import { RouterSpinner } from "@/components/Loaders/RouterSpinner";
import { fetchUsersProfileService } from "@/services/user.service";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { baseUrl } from "@/utils/constant";

const Profile = () => {
  const router = useRouter();
  const { getAuth, getCurrentUser } = useAuth();
  const { id } = useParams();
  const currentUser = getCurrentUser();
  const currentUserId = id ? id : getCurrentUser().id;
  const ws = useWebSocket();
  const wsRef = useRef(ws);
  const queryClient = useQueryClient();

  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfile(currentUserId);

  const { data: coursesData } = useUserCourses(currentUserId);
  const { data: postsData } = useUserPosts(currentUserId);
  const isCurrentUser = currentUser.id === id;
  const { data: learningData } = useUserLearning(currentUserId, isCurrentUser);

  const [userProfile, setUserProfile] = useState(profileData?.data);
  const [isFollowing, setIsFollowing] = useState(profileData?.data?.followed || false);

  // Update local state when profile data changes
  useEffect(() => {
    if (profileData?.data) {
      setUserProfile(profileData.data);
      setIsFollowing(profileData.data.followed || false);
    }
  }, [profileData]);

  const handleFetchProfile = async (id: number) => {
    try {
      const user = await fetchUsersProfileService(Number(id));
      setUserProfile(user);
      setIsFollowing(user.followed || false);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    if (!id) {
      router.push("/");
      return;
    }

    handleFetchProfile(Number(id));

    wsRef.current = ws;

    if (ws && currentUserId) {
      if (!ws.connected) {
        ws.connect();
      }

      // Listen for profile updates
      ws.on(`profile_updated_${currentUser.id}`, (updatedProfile) => {
        console.log("Real-time profile update received:", updatedProfile);
        setUserProfile(updatedProfile);
        setIsFollowing(updatedProfile.followed || false);
        refetchProfile();
      });

      // Listen for follow status updates
      ws.on(`follow_status_changed_${currentUserId}`, (data) => {
        console.log("Follow status changed:", data);
        setIsFollowing(data.isFollowing);

        // Update the profile data with new follower count
        setUserProfile((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            followed: data.isFollowing,
            followersCount: data.isFollowing
              ? (prev.followersCount || 0) + 1
              : Math.max((prev.followersCount || 0) - 1, 0),
          };
        });

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["user-profile", currentUserId] });
        queryClient.invalidateQueries({ queryKey: ["user-followers", currentUserId] });
        queryClient.invalidateQueries({ queryKey: ["infinite-posts"] });
      });

      return () => {
        ws.off(`profile_updated_${currentUser.id}`);
        ws.off(`follow_status_changed_${currentUserId}`);
      };
    }
  }, [ws, currentUserId, refetchProfile, id, router, currentUser.id, queryClient]);

  const handleFollow = async () => {
    if (!getAuth()) {
      router.push("/auth?tab=signin");
      return;
    }

    try {
      // Optimistically update UI
      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);

      // Update the profile data with new follower count
      setUserProfile((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          followed: newFollowState,
          followersCount: newFollowState ? (prev.followersCount || 0) + 1 : Math.max((prev.followersCount || 0) - 1, 0),
        };
      });

      if (newFollowState) {
        // Follow user
        const response = await fetch(`${baseUrl}/users/follows`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify({ userId: currentUserId }),
        });

        if (!response.ok) throw new Error("Failed to follow user");

        const result = await response.json();

        // Emit WebSocket event if available
        if (ws && ws.connected) {
          const request = {
            userId: currentUserId,
            notificationId: result?.data?.id,
          };
          ws.emit("follow", request);

          // Emit follow status change event
          ws.emit("follow_status_change", {
            userId: currentUserId,
            isFollowing: true,
          });
        }
      } else {
        // Unfollow user
        const response = await fetch(`${baseUrl}/users/${currentUserId}/unfollow`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to unfollow user");

        // Emit WebSocket event if available
        if (ws && ws.connected) {
          ws.emit("follow_status_change", {
            userId: currentUserId,
            isFollowing: false,
          });
        }
      }

      // Invalidate relevant queries to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["user-profile", currentUserId] });
      queryClient.invalidateQueries({ queryKey: ["user-followers", currentUserId] });
      queryClient.invalidateQueries({ queryKey: ["infinite-posts"] });
    } catch (error) {
      console.error("Follow/unfollow error:", error);

      // Revert optimistic update on error
      setIsFollowing(!isFollowing);

      // Revert profile data changes
      setUserProfile((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          followed: !isFollowing,
          followersCount: !isFollowing ? (prev.followersCount || 0) + 1 : Math.max((prev.followersCount || 0) - 1, 0),
        };
      });
    }
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    setUserProfile(updatedProfile);

    if (wsRef.current) {
      wsRef.current.emit(
        "profile_update",
        {
          userId: currentUserId,
          updatedProfile,
        },
        () => {
          console.log("Profile update emitted to WebSocket server");
        },
      );
    }

    refetchProfile();
  };

  if (profileError) {
    return (
      <div className="bg-white rounded">
        <CustomError errorCode={500} errorMessage="Something went wrong while loading this profile. Please refresh." />
      </div>
    );
  }

  if (profileLoading) {
    return <RouterSpinner />;
  }

  const result = generalHelpers.processPostsData({
    posts: postsData?.data.posts,
    likedStatuses: postsData?.data.likedStatuses,
    followStatuses: postsData?.data?.followStatuses,
    bookmarkStatuses: postsData?.data?.bookmarkStatuses,
  });

  return (
    <ProtectedRoute requireAuth={true} requireVerification={true} requireProfileSetup={false}>
      <div className="w-full flex-col min-h-[83vh] flex my-px p-3">
        <ProfileHeader
          key={`${userProfile?.id}-${isFollowing}`}
          userProfile={{ ...userProfile, followed: isFollowing }}
          isCurrentUser={isCurrentUser}
          onFollow={handleFollow}
          onProfileUpdate={handleProfileUpdate}
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