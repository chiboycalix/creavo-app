"use client";
import Reply from "@/components/socials/community/replies/Reply";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "@tanstack/react-query";
import { getSpaceDetailsService } from "@/services/community.service";

const RepliesPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const spaceId = params?.spaceId as string;
  const messageId = params.messageId as string;
  const communityId = params.communityId as string;
  const mId = searchParams.get("mId") as string;
  const { currentUser } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser?.id);

  const { data: spaceDetails, isLoading: isFetchingSpaceDetails } = useQuery({
    queryKey: ["getSpaceDetails", communityId, spaceId, messageId],
    queryFn: async () => {
      const data = await getSpaceDetailsService({
        communityId: communityId!,
        spaceId: spaceId!,
      });
      return data;
    },
    enabled: !!communityId && !!spaceId && !!messageId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: 0,
    refetchIntervalInBackground: false,
    retry: 0,
    retryDelay: 0,
  })
  console.log({ spaceDetails });

  const defaultAvatar = "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png";

  // Determine the avatar URL to use
  const avatarUrl = profileLoading
    ? defaultAvatar // Show default while loading
    : spaceDetails?.space?.logo || defaultAvatar;

  return (
    <div className="w-full h-[87vh] relative">
      <div className="border-b p-4 shadow-md shadow-primary-50 flex items-center">
        <ChevronLeft onClick={() => router.back()} className="w-10 h-10 font-extralight cursor-pointer" />
        <img src={avatarUrl} alt="avatarUrl" className="w-10 h-10 rounded-full" />
        <div className="flex flex-col ml-2">
          <h2 className="text-sm font-semibold">Replies</h2>
          <p className="text-xs">nonoossusushsh</p>
        </div>

      </div>

      <div className='max-h-[87vh] flex flex-col justify-between'>
        <div>
          <Reply
            spaceId={spaceId}
            communityId={communityId}
            messageId={messageId}
            mId={mId}
          />
        </div>
      </div>
    </div>
  );
}

export default RepliesPage