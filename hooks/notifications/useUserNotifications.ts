import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";
import Cookies from "js-cookie";

export function useUserNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: ["user-notifications", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const response = await fetch(
        `${baseUrl}/users/${userId}/notifications?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return response.json();
    },
    enabled: !!userId,
  });
}
