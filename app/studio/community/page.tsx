"use client";
import PageTitle from "@/components/PageTitle";
import React, { useEffect } from "react";
import CommunityPageSkeleton from "@/components/sketetons/CommunityPageSkeleton";
import CreateCommunityDialog from "@/components/studio/community/CreateCommunityDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListCommunities } from "@/hooks/communities/useListCommunities";
import { useRouter } from "next/navigation";

const Community = () => {
  const { data: communityData, isFetching } = useListCommunities();
  const router = useRouter();

  const community = communityData?.data?.communities[0];

  useEffect(() => {
    if (!isFetching && community) {
      router.push(`/studio/community/${community?.id}`);
    }
  }, [isFetching, community, router]);

  if (isFetching) {
    return <CommunityPageSkeleton />;
  }

  if (!community) {
    return (
      <div className="h-[70vh]">
        <PageTitle>Community</PageTitle>

        <Card className="mt-40 w-[70%] mx-auto border-none">
          <CardHeader>
            <CardTitle className="text-center flex flex-col items-center justify-center">
              <img src="/assets/community.svg" alt="Community illustration" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <p className="w-[40%] text-center text-lg">
              Oops, looks like you don’t have a community yet!
            </p>

            <div className="flex justify-between items-center gap-4 mt-8 bg-primary-50 p-4 rounded-xl">
              <div className="basis-8/12">
                <p className="text-sm">
                  No worries—now’s your chance to start something amazing! Build your own space,
                  spark great conversations, and connect with like-minded learners. 🚀✨
                </p>
              </div>
              <div className="flex-1">
                <CreateCommunityDialog />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return <CommunityPageSkeleton />;
};

export default Community;