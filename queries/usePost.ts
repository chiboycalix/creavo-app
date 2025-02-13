
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";
import Cookies from "js-cookie";

export const useFetchPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const token = Cookies.get("accessToken")
      const header = {
        Authorization: `${token ? `Bearer ${token}` : ""}`
      }
      const response = await fetch(
        // `${baseUrl}/posts?page=1&limit=10`,
        `${baseUrl}/users/563/posts?page=1&limit=10`,
        {
          headers: { ...header }
        }
      );
      const result = await response.json();
      return result
    }
  });
}