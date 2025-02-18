import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";
import Cookies from "js-cookie";

export function useFetchComments(postId: string | undefined) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      if (!postId) throw new Error("Post ID is required");
      const response = await fetch(
        `${baseUrl}/posts/${postId}/comments?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return response.json();
    },
    refetchInterval: 3000,
    placeholderData: keepPreviousData,
    enabled: !!postId,
  });
}
