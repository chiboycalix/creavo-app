import Cookies from "js-cookie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { baseUrl } from "@/utils/constant";

export function useFetchCourseModules(
  courseId: string | undefined,
  moduleId: string | undefined
) {
  return useQuery({
    queryKey: ["useFetchCourseModules", courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("User ID is required");
      const response = await fetch(
        `${baseUrl}/courses/${courseId}/modules${moduleId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      const result = await response.json();
      return result;
    },
    enabled: !!courseId,
    placeholderData: keepPreviousData,
  });
}
