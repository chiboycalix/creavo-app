import Cookies from "js-cookie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export function useFetchComments(postId: number | undefined) {
  return useQuery({
    queryKey: ["useFetchComments", postId],
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
    placeholderData: keepPreviousData,
    enabled: !!postId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
