import Cookies from "js-cookie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export function useFetchCourses(userId: string | undefined) {
  return useQuery({
    queryKey: ["userCourses", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const response = await fetch(
        `${baseUrl}/users/${userId}/courses?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      return response.json();
    },
    enabled: !!userId,
    placeholderData: keepPreviousData,
  });
}
