
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";
import Cookies from "js-cookie";

export const useFetchPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(
        `${baseUrl}/posts?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      const result = await response.json();
      return result
    }
  });
}