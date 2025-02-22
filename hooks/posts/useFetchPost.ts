import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export function useFetchPost(postId: string | undefined) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      if (!postId) throw new Error("Post ID is required");
      const response = await fetch(`${baseUrl}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      return response.json();
    },
    enabled: !!postId,
  });
}
