import Cookies from "js-cookie";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export const useFetchPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const token = Cookies.get("accessToken");
      const header = {
        Authorization: `${token ? `Bearer ${token}` : ""}`,
      };
      const response = await fetch(
        `${baseUrl}/posts?page=1&limit=10`,
        // `${baseUrl}/users/20002/posts?page=1&limit=10`,
        {
          headers: { ...header },
        }
      );
      const result = await response.json();
      return result;
    },
  });
};

export const useFetchInfinitePosts = (options = {}) => {
  return useInfiniteQuery({
    queryKey: ["infinite-posts"],
    queryFn: async ({ pageParam = 1 }) => {
      const token = Cookies.get("accessToken");
      const header = {
        Authorization: `${token ? `Bearer ${token}` : ""}`,
      };

      const response = await fetch(
        // `${baseUrl}/posts?page=${pageParam}&limit=10`,
        `${baseUrl}/users/2952/posts?page=1&limit=10`,
        {
          headers: { ...header },
        }
      );

      const result = await response.json();
      return result;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.posts?.length < 10) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    ...options,
  });
};
