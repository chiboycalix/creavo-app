"use client";
import React, { useEffect } from "react";
import CommunityPageSkeleton from "@/components/sketetons/CommunityPageSkeleton";
import { useRouter } from "next/navigation";
import { useListMemberCommunities } from "@/hooks/communities/useListMemberCommunities";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/context/AuthContext";

const Community = () => {
  const router = useRouter();
  const { loading, currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser && currentUser?.id);
  const { data: communities, isLoading: isFetchingCommunity } = useListMemberCommunities(profileData && profileData?.data?.id)

  useEffect(() => {
    if (!isFetchingCommunity && communities?.data?.communities?.length > 0) {
      router.push(`/socials/community/${communities?.data?.communities[0]?.id}/${communities?.data?.communities[0]?.spaces[0]?.id}`);
    }
  }, [communities?.data?.communities, isFetchingCommunity, router]);

  if (isFetchingCommunity || profileLoading || loading) {
    return <CommunityPageSkeleton />;
  }

  return <CommunityPageSkeleton />
};

export default Community;