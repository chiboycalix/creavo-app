import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export function useFetchUserByUsername(searchTerm: string | undefined) {
  return useQuery({
    queryKey: ["user-search-term", searchTerm],
    queryFn: async () => {
      if (!searchTerm) throw new Error("User name or email is required");
      const response = await fetch(`${baseUrl}/users/?username=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      return response.json();
    },
    enabled: !!searchTerm,
  });
}
