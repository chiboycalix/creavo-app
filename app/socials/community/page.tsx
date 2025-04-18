"use client";
import React, { useEffect } from "react";
import CommunityPageSkeleton from "@/components/sketetons/CommunityPageSkeleton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useListMemberCommunities } from "@/hooks/communities/useListMemberCommunities";

const Community = () => {
  const router = useRouter()
  const { currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser && currentUser?.id);
  const { data: communities, isLoading: isFetchingCommunity } = useListMemberCommunities(profileData && profileData?.data?.id)

  const firstCommunity = communities?.data?.communities[0];

  useEffect(() => {
    if (!isFetchingCommunity) {
      router.push(`/socials/community/${firstCommunity?.id}`);
    }
  }, [isFetchingCommunity, router, firstCommunity]);

  if (isFetchingCommunity) {
    return <CommunityPageSkeleton />;
  }

  return <CommunityPageSkeleton />;
};

export default Community;