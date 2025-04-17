import Cookies from "js-cookie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export function useListMemberCommunities(userId: string) {
  return useQuery({
    queryKey: ["useListMemberCommunities", userId],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/users/${userId}/spaces`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      return response.json();
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}
