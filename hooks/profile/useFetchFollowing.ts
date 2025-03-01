import Cookies from "js-cookie";
import { baseUrl } from "@/utils/constant";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

export function useFetchFollowing(userId: string | undefined) {
  return useInfiniteQuery({
    queryKey: ["user-followings", userId],
    queryFn: async ({ pageParam = 1 }) => {
      if (!userId) throw new Error("User ID is required");
      const response = await fetch(
        `${baseUrl}/users/${userId}/followings?page=${pageParam}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch followers");
      }
      const result = await response.json();
      const { data } = result;

      return {
        followers: data.followers,
        nextPage: data.meta.page + 1,
        hasMore: data.meta.page < data.meta.totalPages,
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    enabled: !!userId,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });
}
