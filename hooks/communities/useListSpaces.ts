import Cookies from "js-cookie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export function useListSpaces(communityId: string) {
  return useQuery({
    queryKey: ["useListSpaces", communityId],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/users/${4}/spaces`, {
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
