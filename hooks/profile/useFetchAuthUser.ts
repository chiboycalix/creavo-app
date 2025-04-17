import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export function useFetchAuthUser() {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      return response.json();
    },
  });
}
