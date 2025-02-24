import Cookies from "js-cookie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export function useFetchCommentReplies(
  postId: number | undefined,
  commentId: string | undefined
) {
  return useQuery({
    queryKey: ["commentsReply", postId, commentId],
    queryFn: async () => {
      if (!postId) throw new Error("postId and commentId is required");
      const response = await fetch(
        `${baseUrl}/posts/${postId}/comments/${commentId}?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return response.json();
    },
    refetchInterval: 500,
    placeholderData: keepPreviousData,
    enabled: !!postId,
  });
}
