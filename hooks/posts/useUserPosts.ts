import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";
import Cookies from "js-cookie";

export function useUserPosts(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-posts", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const response = await fetch(`${baseUrl}/users/${userId}/posts`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      return response.json();
    },
    refetchInterval: 500,
    enabled: !!userId,
  });
}
