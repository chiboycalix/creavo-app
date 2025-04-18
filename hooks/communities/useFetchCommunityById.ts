import Cookies from "js-cookie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export function useFetchCommunityById(communityId: string) {
  return useQuery({
    queryKey: ["useFetchCommunityById"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/communities/${communityId}`, {
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
