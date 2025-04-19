"use client";
import Reply from "@/components/socials/community/replies/Reply";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSpaceDetailsService } from "@/services/community.service";
import { DEFAULT_AVATAR } from "@/constants";

const RepliesPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const spaceId = params?.spaceId as string;
  const messageId = params.messageId as string;
  const communityId = params.communityId as string;
  const mId = searchParams.get("mId") as string;
  const messageText = searchParams.get("text") as string;

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
  })


  const avatarUrl = spaceDetails?.space?.logo || DEFAULT_AVATAR

  return (
    <div className="w-full h-[87vh] relative">
      <div className="border-b p-4 shadow-md shadow-primary-50 flex items-center">
        <ChevronLeft onClick={() => router.back()} className="w-10 h-10 font-extralight cursor-pointer" />
        <img src={avatarUrl} alt="avatarUrl" className="w-10 h-10 rounded-full" />
        <div className="flex flex-col ml-2">
          <h2 className="text-sm font-semibold">Replies</h2>
          <p className="text-xs">{messageText}</p>
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