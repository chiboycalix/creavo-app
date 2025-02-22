import Cookies from "js-cookie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";
// {{baseUrl}}/api/v1/comments/nested-comments/?postId=33&&commentId=5&&page=1&&limit=5
export function useFetchCommentReplies(
  postId: number | undefined,
  commentId: string | undefined
) {
  return useQuery({
    queryKey: ["commentsReply", postId, commentId],
    queryFn: async () => {
      if (!postId) throw new Error("postId and commentId is required");
      const response = await fetch(
        `${baseUrl}/comments/nested-comments/?postId=${postId}&&commentId=${commentId}&&page=1&&limit=10`,
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
