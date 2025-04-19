import Cookies from "js-cookie";
import { useInfiniteQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export const useFetchInfinitePosts = (options = {}) => {
  return useInfiniteQuery({
    queryKey: ["infinite-posts"],
    queryFn: async ({ pageParam = 1 }) => {
      const token = Cookies.get("accessToken");
      const header = {
        Authorization: token ? `Bearer ${token}` : "",
      };

      const response = await fetch(
        `${baseUrl}/posts?page=${pageParam}&limit=10`,
        {
          headers: { ...header },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch posts");
      }

      const result = await response.json();
      const { data } = result;

      return {
        posts: data.posts,
        likedStatuses: data.likedStatuses,
        followStatuses: data?.followStatuses,
        bookmarkStatuses: data?.bookmarkStatuses,
        nextPage: data.meta.page + 1,
        hasMore: data.meta.page < data.meta.totalPage,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
    ...options,
    staleTime: 5 * 60 * 1000,
  });
};
