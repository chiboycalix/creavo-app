import Cookies from "js-cookie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export function useListCommunities() {
  return useQuery({
    queryKey: ["listCommunities"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/communities/list-community`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      return response.json();
    },
    placeholderData: keepPreviousData,
  });
}
